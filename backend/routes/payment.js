const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Payment = require('../model/payment')
const Order = require('../model/order')

// Create Payment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { orderId, paymentMethod, amount, transactionId = '' } = req.body

    // Required fields
    if (!orderId || !paymentMethod || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, payment method and amount are required',
      })
    }

    // Validate payment method
    if (!['COD', 'ONLINE'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      })
    }

    // Validate amount
    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be greater than 0',
      })
    }

    // Check order
    const order = await Order.findOne({
      _id: orderId,
      userId,
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({
      orderId,
      userId,
    })

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this order',
        data: existingPayment,
      })
    }

    // Create payment
    const payment = await Payment.create({
      userId,
      orderId,
      paymentMethod,
      paymentStatus: 'Pending',
      transactionId,
      amount: Number(amount),
      paidAt: null,
    })

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment,
    })
  } catch (error) {
    console.log('Create Payment Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

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

// Confirm Payment
router.put('admin/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const payment = await Payment.findById(id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      })
    }

    // Already paid
    if (payment.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already confirmed',
      })
    }

    // Update payment
    payment.paymentStatus = 'Paid'
    payment.paidAt = new Date()

    await payment.save()

    // Update order
    const order = await Order.findById(payment.orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    order.paymentStatus = 'Paid'

    if (order.orderStatus === 'Pending') {
      order.orderStatus = 'Confirmed'
    }

    await order.save()

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        payment,
        order,
      },
    })
  } catch (error) {
    console.log('Confirm Payment Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
