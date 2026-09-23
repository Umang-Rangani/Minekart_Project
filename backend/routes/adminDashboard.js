

const express = require('express')
const User = require('../model/users')
const Product = require('../model/product')
const Order = require('../model/order')

const router = express.Router()


router.get('/',  async (req, res) => {
  try {
    // BASIC COUNTS
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ status: 'Active' })
    const inactiveUsers = await User.countDocuments({ status: 'Inactive' })

    const totalProducts = await Product.countDocuments()
    const activeProducts = await Product.countDocuments({ status: 'Active' })
    const inactiveProducts = await Product.countDocuments({ status: 'Inactive' })

    const totalOrders = await Order.countDocuments()

    // REVENUE
    const revenueResult = await Order.aggregate([
      {
        $match: {
          orderStatus: { $nin: ['Cancelled', 'Returned'] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
        },
      },
    ])

    const totalRevenue = revenueResult[0]?.totalRevenue || 0

    // ORDER STATUS
    const orderStatusResult = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ])

    const orderOverview = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      outForDelivery: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    }

    orderStatusResult.forEach((item) => {
      if (item._id === 'Pending') orderOverview.pending = item.count
      if (item._id === 'Confirmed') orderOverview.confirmed = item.count
      if (item._id === 'Processing') orderOverview.processing = item.count
      if (item._id === 'Shipped') orderOverview.shipped = item.count
      if (item._id === 'Out for Delivery') orderOverview.outForDelivery = item.count
      if (item._id === 'Delivered') orderOverview.delivered = item.count
      if (item._id === 'Cancelled') orderOverview.cancelled = item.count
      if (item._id === 'Returned') orderOverview.returned = item.count
    })

    // PRODUCT STOCK
    const outOfStock = await Product.countDocuments({
      stock: 0,
    })

    const lowStock = await Product.countDocuments({
      stock: { $gt: 0, $lte: 5 },
    })

    // NEW CUSTOMERS
    const startOfMonth = new Date()

    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const newCustomers = await User.countDocuments({
      createdAt: {
        $gte: startOfMonth,
      },
    })

    // PAYMENT METHOD
    const paymentMethodResult = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
        },
      },
    ])

    const paymentMethods = {
      cod: 0,
      onlineOnDelivery: 0,
    }

    paymentMethodResult.forEach((item) => {
      if (item._id === 'COD') {
        paymentMethods.cod = item.count
      }

      if (item._id === 'ONLINE_ON_DELIVERY') {
        paymentMethods.onlineOnDelivery = item.count
      }
    })

    // PAYMENT STATUS
    const paymentStatusResult = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
        },
      },
    ])

    const paymentStatus = {
      pending: 0,
      paid: 0,
      failed: 0,
      refunded: 0,
    }

    paymentStatusResult.forEach((item) => {
      if (item._id === 'Pending') paymentStatus.pending = item.count
      if (item._id === 'Paid') paymentStatus.paid = item.count
      if (item._id === 'Failed') paymentStatus.failed = item.count
      if (item._id === 'Refunded') paymentStatus.refunded = item.count
    })

    // RECENT ORDERS
    const recentOrders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(6).select('userId items totalAmount paymentMethod paymentStatus orderStatus createdAt')

    // TOP SELLING PRODUCTS
    const topSellingProducts = await Product.find().sort({ soldCount: -1 }).limit(5).select('productName images price discountPrice stock soldCount rating status')

    // LOW STOCK PRODUCTS
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 },
    })
      .sort({ stock: 1 })
      .limit(5)
      .select('productName images stock price discountPrice status')

    // SALES OVERVIEW
    // Last 7 Days
    const sevenDaysAgo = new Date()

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const salesChartResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          orderStatus: {
            $nin: ['Cancelled', 'Returned'],
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ])

    const salesChart = salesChartResult.map((item) => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
      sales: item.sales,
      orders: item.orders,
    }))

    // RESPONSE
    res.status(200).json({
      success: true,

      data: {
        overview: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalUsers: totalUsers,
          pendingOrders: orderOverview.pending,
          deliveredOrders: orderOverview.delivered,
        },

        salesOverview: {
          totalRevenue,
          totalOrders,
          salesChart,
        },

        orderOverview,

        productOverview: {
          total: totalProducts,
          active: activeProducts,
          inactive: inactiveProducts,
          outOfStock,
          lowStock,
        },

        customerOverview: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          newCustomers,
        },

        paymentOverview: {
          methods: paymentMethods,
          status: paymentStatus,
        },

        recentOrders,

        topSellingProducts,

        lowStockProducts,
      },
    })
  } catch (error) {
    console.error('Admin Dashboard Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to load admin dashboard',
      error: error.message,
    })
  }
})

module.exports = router
