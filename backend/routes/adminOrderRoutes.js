const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Order = require('../model/order')
const Payment = require('../model/payment')
const User = require('../model/users')

const { sendEmail } = require('../utils/sendEmail')
const { orderCancelledEmail } = require('../utils/emailTemplates/orderCancelledEmail')

// Notification
const createNotification = require('../utils/createNotification')
const NOTIFICATION_TYPES = require('../constants/notificationTypes')
const { orderConfirmationEmail } = require('../utils/emailTemplates/orderConfirmationEmail')
const roleMiddleware = require('../middleware/roleMiddleware')

// GET ALL ORDERS
router.get('/', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
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

// GET CANCELLATION STATISTICS
router.get('/cancellation-stats', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const [userCancelled, adminCancelled, totalCancelled] = await Promise.all([
      Order.countDocuments({
        orderStatus: 'Cancelled',
        cancelledBy: 'User',
      }),

      Order.countDocuments({
        orderStatus: 'Cancelled',
        cancelledBy: 'Admin',
      }),

      Order.countDocuments({
        orderStatus: 'Cancelled',
      }),
    ])

    res.status(200).json({
      success: true,
      message: 'Cancellation statistics fetched successfully',
      data: {
        userCancelled,
        adminCancelled,
        totalCancelled,
      },
    })
  } catch (error) {
    console.log('Get Cancellation Statistics Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// GET SINGLE ORDER
router.get('/:id', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const { id } = req.params

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
router.put('/:id/status', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const { id } = req.params
    const { orderStatus, cancellationReason = '' } = req.body

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

    // Previous status
    const previousStatus = order.orderStatus

    // Update order status
    order.orderStatus = orderStatus

    // ADMIN CANCEL ORDER
    if (orderStatus === 'Cancelled') {
      order.cancelledBy = 'Admin'
      order.cancelledAt = new Date()

      if (cancellationReason.trim()) {
        order.cancellationReason = cancellationReason.trim()
      }
    }

    await order.save()

    // CREATE USER NOTIFICATION
    const notificationMap = {
      Confirmed: {
        type: NOTIFICATION_TYPES.ORDER_CONFIRMED,
        title: 'Order confirmed',
        message: `Your order ${order.orderId} has been confirmed successfully.`,
      },

      Processing: {
        type: NOTIFICATION_TYPES.ORDER_PACKED,
        title: 'Order is being processed',
        message: `Your order ${order.orderId} is now being processed.`,
      },

      Shipped: {
        type: NOTIFICATION_TYPES.ORDER_SHIPPED,
        title: 'Order shipped',
        message: `Your order ${order.orderId} has been shipped.`,
      },

      'Out for Delivery': {
        type: NOTIFICATION_TYPES.OUT_FOR_DELIVERY,
        title: 'Out for delivery',
        message: `Your order ${order.orderId} is out for delivery.`,
      },

      Delivered: {
        type: NOTIFICATION_TYPES.ORDER_DELIVERED,
        title: 'Order delivered',
        message: `Your order ${order.orderId} has been delivered successfully.`,
      },

      Cancelled: {
        type: NOTIFICATION_TYPES.ORDER_CANCELLED,
        title: 'Order cancelled',
        message: `Your order ${order.orderId} has been cancelled.`,
      },
    }

    const notificationData = notificationMap[orderStatus]

    if (notificationData && previousStatus !== orderStatus) {
      try {
        await createNotification({
          userId: order.userId,

          type: notificationData.type,

          title: notificationData.title,

          message: notificationData.message,

          // IMPORTANT:
          // Schema માં orderId ObjectId છે
          orderId: order._id,
        })

        console.log(`✅ Notification created: ${order.orderId} → ${orderStatus}`)
      } catch (notificationError) {
        console.error('⚠️ Order notification failed:', notificationError)
      }
    }

    // ORDER CONFIRMATION EMAIL
    if (orderStatus === 'Confirmed' && previousStatus !== 'Confirmed') {
      try {
        const user = await User.findById(order.userId).select('name email')

        if (user?.email) {
          const populatedOrder = await Order.findById(order._id).populate({
            path: 'items.productId',
            select: 'productName images price discountPrice',
          })

          const html = orderConfirmationEmail({
            name: user.name,
            orderId: populatedOrder.orderId,
            items: populatedOrder.items,
            subtotal: populatedOrder.subtotal,
            deliveryCharge: populatedOrder.deliveryCharge,
            tax: populatedOrder.tax,
            totalAmount: populatedOrder.totalAmount,
            paymentMethod: populatedOrder.paymentMethod,
            shippingAddress: populatedOrder.shippingAddress,
          })

          await sendEmail({
            to: user.email,
            subject: `Order Confirmed - ${populatedOrder.orderId} 🛍️`,
            html,
          })

          console.log(`✅ Order confirmation email sent to ${user.email}`)
        } else {
          console.log('⚠️ User email not found. Confirmation email skipped.')
        }
      } catch (emailError) {
        console.error('⚠️ Order confirmation email failed:', emailError.message)
      }
    }

    // ADMIN CANCELLED EMAIL
    if (orderStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
      try {
        const user = await User.findById(order.userId).select('name email')

        if (user?.email) {
          const populatedOrder = await Order.findById(order._id).populate({
            path: 'items.productId',
            select: 'productName images price discountPrice',
          })

          const emailItems = populatedOrder.items.map((item) => ({
            productName: item.productId?.productName || 'Product',

            quantity: item.quantity || 0,

            totalPrice: Number(item.price || item.productId?.discountPrice || item.productId?.price || 0) * Number(item.quantity || 0),
          }))

          const html = orderCancelledEmail({
            name: user.name,
            orderId: populatedOrder.orderId,
            items: emailItems,
            subtotal: populatedOrder.subtotal,
            deliveryCharge: populatedOrder.deliveryCharge,
            tax: populatedOrder.tax,
            totalAmount: populatedOrder.totalAmount,
            paymentMethod: populatedOrder.paymentMethod,
            shippingAddress: populatedOrder.shippingAddress,
            cancellationReason: populatedOrder.cancellationReason,
            cancelledBy: 'Admin',
          })

          await sendEmail({
            to: user.email,
            subject: `Order Cancelled - ${populatedOrder.orderId} ❌`,
            html,
          })

          console.log(`✅ Order cancellation email sent to ${user.email}`)
        } else {
          console.log('⚠️ User email not found. Cancellation email skipped.')
        }
      } catch (emailError) {
        console.error('⚠️ Order cancellation email failed:', emailError.message)
      }
    }

    // GET UPDATED ORDER
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

// DELETE CANCELLED ORDER
router.delete('/:id', authMiddleware, roleMiddleware('Admin'), async (req, res) => {
  try {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    // Only cancelled orders can be permanently deleted
    if (order.orderStatus !== 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Only cancelled orders can be deleted',
      })
    }

    // Delete related payment record
    await Payment.deleteMany({
      orderId: order._id,
    })

    // Delete order
    await Order.findByIdAndDelete(order._id)

    res.status(200).json({
      success: true,
      message: 'Cancelled order deleted successfully',
    })
  } catch (error) {
    console.log('Delete Admin Order Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
