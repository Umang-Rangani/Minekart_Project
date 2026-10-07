const express = require('express')
const { waitUntil } = require('@vercel/functions')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Order = require('../model/order')
const Address = require('../model/address')
const Payment = require('../model/payment')
const User = require('../model/users')
const { sendEmail } = require('../utils/sendEmail')
const { orderPlacedEmail } = require('../utils/emailTemplates/orderPlacedEmail')
const { orderCancelledEmail } = require('../utils/emailTemplates/orderCancelledEmail')

// Admin notification
const createAdminNotification = require('../utils/createAdminNotification')
const ADMIN_NOTIFICATION_TYPES = require('../constants/adminNotificationTypes')

// ! <order className="js"></order>

// Create Order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

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

    // Send response immediately
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order,
        payment,
      },
    })

    // --------------------------------
    // Background tasks
    // --------------------------------

    const runBackgroundTasks = async () => {
      // Admin notification
      try {
        await createAdminNotification({
          type: ADMIN_NOTIFICATION_TYPES.NEW_ORDER,
          title: 'New order received',
          message: `New order ${order.orderId} has been placed by ${user.name}.`,
          orderId: order._id,
          userId: user._id,
          metadata: {
            orderNumber: order.orderId,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
          },
        })

        console.log(`✅ Admin notification created for new order ${order.orderId}`)
      } catch (notificationError) {
        console.error('⚠️ Admin notification failed:', notificationError.message)
      }

      // Order email
      try {
        const populatedOrder = await Order.findById(order._id).populate({
          path: 'items.productId',
          select: 'productName images price discountPrice',
        })

        const html = orderPlacedEmail({
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
          subject: `Order Placed - ${populatedOrder.orderId} 🛍️`,
          html,
        })

        console.log('✅ Order placed email sent')
      } catch (emailError) {
        console.error('⚠️ Order placed email failed:', emailError.message)
      }
    }

    // Keeps the Vercel function alive until background work finishes
    waitUntil(runBackgroundTasks())
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

// ! PUBLIC TRACK ORDER => Login vagar order track
router.get('/track/:id', async (req, res) => {
  try {
    const { id } = req.params

    const order = await Order.findOne({
      orderId: id.trim(),
    }).select('orderId items shippingAddress subtotal deliveryCharge tax totalAmount paymentMethod paymentStatus orderStatus cancellationReason cancelledAt cancelledBy createdAt updatedAt')

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
    console.log('Track Order Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// ! orders path => view detail => UI OrderDetails
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params

    const order = await Order.findOne({
      orderId: id,
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

// ! users ne order delete mate
// ! CANCEL ORDER => User mate
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params
    const { cancellationReason = '' } = req.body

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

    // User can cancel only before shipping
    const cancellableStatuses = ['Pending', 'Confirmed', 'Processing']

    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'This order can no longer be cancelled',
      })
    }

    // Prevent duplicate cancellation
    const previousStatus = order.orderStatus

    order.orderStatus = 'Cancelled'
    order.cancellationReason = cancellationReason.trim()
    order.cancelledAt = new Date()
    order.cancelledBy = 'User'

    await order.save()

    // ! Send cancellation email
    if (previousStatus !== 'Cancelled') {
      try {
        const user = await User.findById(userId).select('name email')

        const populatedOrder = await Order.findById(order._id).populate({
          path: 'items.productId',
          select: 'productName images price discountPrice',
        })

        if (user?.email && populatedOrder) {
          const emailItems = populatedOrder.items.map((item) => ({
            productName: item.productId?.productName || 'Product',
            quantity: item.quantity || 0,
            totalPrice: Number( item.productId?.discountPrice ||  0) * Number(item.quantity || 0),
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
            cancelledBy: 'User',
          })

          await sendEmail({
            to: user.email,
            subject: `Order Cancelled - ${populatedOrder.orderId} ❌`,
            html,
          })

          console.log('✅ User cancellation email sent')
        }
      } catch (emailError) {
        console.error('⚠️ User cancellation email failed:', emailError.message)
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    })
  } catch (error) {
    console.log('Cancel Order Error:', error)

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
