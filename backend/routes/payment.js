const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Payment = require('../model/payment')
const Order = require('../model/order')

// GET ALL ORDERS WITH PAYMENT
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

// CONFIRM PAYMENT
router.put('/admin/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params

    const payment = await Payment.findById(id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      })
    }

    // Payment already paid
    if (payment.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already confirmed',
      })
    }

    // Only pay-on-delivery methods
    if (!['COD', 'ONLINE_ON_DELIVERY'].includes(payment.paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method for delivery payment',
      })
    }

    // Update payment
    payment.paymentStatus = 'Paid'
    payment.paidAt = new Date()

    await payment.save()

    // Find related order
    const order = await Order.findById(payment.orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Update order payment status
    order.paymentStatus = 'Paid'

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
