const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Order = require('../model/order')

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

    res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      data: orders,
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

    const order = await Order.findById(id)
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

    res.status(200).json({
      success: true,
      message: 'Order fetched successfully',
      data: order,
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

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
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
