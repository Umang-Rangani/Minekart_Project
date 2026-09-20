const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Order = require('../model/order')
const Address = require('../model/address')
const Payment = require('../model/payment')

// Create Order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { items, addressId, subtotal, deliveryCharge, tax, totalAmount, paymentMethod } = req.body

    // Required fields
    if (!items || items.length === 0 || !addressId || subtotal === undefined || deliveryCharge === undefined || tax === undefined || totalAmount === undefined || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Required order information is missing',
      })
    }

    // Validate payment method
    if (!['COD', 'ONLINE_ON_DELIVERY'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      })
    }

    // Get user's address
    const address = await Address.findOne({
      _id: addressId,
      userId,
    })

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Delivery address not found',
      })
    }

    // Create Order
    const order = await Order.create({
      userId,

      items,

      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark,
        addressType: address.addressType,
      },

      subtotal: Number(subtotal),
      deliveryCharge: Number(deliveryCharge),
      tax: Number(tax),
      totalAmount: Number(totalAmount),

      paymentMethod,

      paymentStatus: 'Pending',

      orderStatus: 'Pending',
    })

    // Create Payment
    const payment = await Payment.create({
      userId,
      orderId: order._id,
      paymentMethod,
      paymentStatus: 'Pending',
      transactionId: '',
      amount: Number(totalAmount),
      paidAt: null,
    })

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order,
        payment,
      },
    })
  } catch (error) {
    console.log('Create Order Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// Get My Orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const orders = await Order.find({ userId })
      .populate({
        path: 'items.productId',
        select: 'productName images price discountPrice',
      })
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders,
    })
  } catch (error) {
    console.log('Get Orders Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! orders path => view detail => UI OrderDetails
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params

    const order = await Order.findOne({
      _id: id,
      userId,
    }).populate({
      path: 'items.productId',
      select: 'productName images price discountPrice',
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
    })
  } catch (error) {
    console.log('Get Order Details Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! Update Order Status => Admin mate
router.put('/:id/status', async (req, res) => {
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

    const order = await Order.findByIdAndUpdate(
      id,
      {
        $set: {
          orderStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    })
  } catch (error) {
    console.log('Update Order Status Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! RETURN ORDER
router.put('/:id/return', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params
    const { returnReason = '' } = req.body

    const order = await Order.findOne({
      _id: id,
      userId,
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (order.orderStatus !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Only delivered orders can be returned',
      })
    }

    if (!returnReason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Return reason is required',
      })
    }

    order.orderStatus = 'Returned'
    order.cancellationReason = returnReason.trim()

    await order.save()

    res.status(200).json({
      success: true,
      message: 'Return request submitted successfully',
      data: order,
    })
  } catch (error) {
    console.log('Return Order Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
