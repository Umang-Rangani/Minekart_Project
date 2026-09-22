const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Order = require('../model/order')
const Payment = require('../model/payment')

// GET ALL ORDERS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'userId',
        select: 'name email phone',
      })
      .populate({
        path: 'items.productId',
        select: 'productName images price discountPrice',
      })
      .sort({ createdAt: -1 })

    const ordersWithPayment = await Promise.all(
      orders.map(async (order) => {
        const payment = await Payment.findOne({
          orderId: order._id,
        }).select('_id paymentMethod paymentStatus transactionId amount paidAt')

        return {
          ...order.toObject(),
          payment: payment || null,
        }
      }),
    )

    res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      data: ordersWithPayment,
    })
  } catch (error) {
    console.log('Get Admin Orders Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})
// GET SINGLE ORDER
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    // console.log('Order ID:', id)

    const order = await Order.findOne({
      orderId: id,
    })
      .populate({
        path: 'userId',
        select: 'name email phone',
      })
      .populate({
        path: 'items.productId',
        select: 'productName images price discountPrice',
      })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    const payment = await Payment.findOne({
      orderId: order._id,
    }).select('_id paymentMethod paymentStatus transactionId amount paidAt')

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: {
        ...order.toObject(),
        payment: payment || null,
      },
    })
  } catch (error) {
    console.log('Get Admin Order Details Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// UPDATE ORDER STATUS
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { orderStatus } = req.body

    const allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned']

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      })
    }

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Cancelled / Returned order cannot be changed
    if (order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned') {
      return res.status(400).json({
        success: false,
        message: `Order is already ${order.orderStatus} and cannot be changed`,
      })
    }

    // Payment must be confirmed before Delivered
    if (orderStatus === 'Delivered' && ['COD', 'ONLINE_ON_DELIVERY'].includes(order.paymentMethod) && order.paymentStatus !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be confirmed before delivering the order',
      })
    }

    // Update order status
    order.orderStatus = orderStatus

    // Cancellation details
    if (orderStatus === 'Cancelled') {
      order.cancelledAt = new Date()
    }

    await order.save()

    const updatedOrder = await Order.findById(order._id)
      .populate({
        path: 'userId',
        select: 'name email phone',
      })
      .populate({
        path: 'items.productId',
        select: 'productName images price discountPrice',
      })

    const payment = await Payment.findOne({
      orderId: updatedOrder._id,
    }).select('_id paymentMethod paymentStatus transactionId amount paidAt')

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        ...updatedOrder.toObject(),
        payment: payment || null,
      },
    })
  } catch (error) {
    console.log('Update Admin Order Status Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
