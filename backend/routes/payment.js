const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Payment = require('../model/payment')

// Create Payment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { orderId, paymentMethod, amount, transactionId = '' } = req.body

    if (!orderId || !paymentMethod || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, payment method and amount are required',
      })
    }

    if (!['COD', 'ONLINE'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      })
    }

    const payment = await Payment.create({
      userId,
      orderId,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Pending',
      transactionId,
      amount,
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

// Get Logged-in User Payments
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const payments = await Payment.find({ userId }).populate('orderId').sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Payments fetched successfully',
      data: payments,
    })
  } catch (error) {
    console.log('Get Payments Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
