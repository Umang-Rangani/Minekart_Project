const express = require('express')
const crypto = require('crypto')
const { waitUntil } = require('@vercel/functions')
const Razorpay = require('razorpay')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const Payment = require('../model/payment')
const Order = require('../model/order')
const Cart = require('../model/cart')
const Product = require('../model/product')
const Address = require('../model/address')
const User = require('../model/users')

const { sendEmail } = require('../utils/sendEmail')
const { orderPlacedEmail } = require('../utils/emailTemplates/orderPlacedEmail')

const createAdminNotification = require('../utils/createAdminNotification')
const ADMIN_NOTIFICATION_TYPES = require('../constants/adminNotificationTypes')
const { generateInvoicePdf } = require('../utils/generateInvoicePdf')
const adminMiddleware = require('../middleware/adminMiddleware')
const { requirePermission } = require('../middleware/permissionMiddleware')
const { SECTION_KEYS, ACTIONS } = require('../constants/permission')

// RAZORPAY CLIENT
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay API keys are missing in backend .env')
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

// HELPERS
const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100

const isValidSignature = (orderId, paymentId, signature) => {
  if (typeof orderId !== 'string' || typeof paymentId !== 'string' || typeof signature !== 'string') {
    return false
  }

  const secret = process.env.RAZORPAY_KEY_SECRET

  if (!secret) return false

  const expectedSignature = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')

  const expected = Buffer.from(expectedSignature, 'hex')
  const received = Buffer.from(signature, 'hex')

  return expected.length === received.length && expected.length > 0 && crypto.timingSafeEqual(expected, received)
}

// EXISTING ORDER EMAIL + ADMIN NOTIFICATION
const runOrderBackgroundTasks = async (orderId, userId) => {
  try {
    const [user, populatedOrder] = await Promise.all([
      User.findById(userId),
      Order.findById(orderId).populate({
        path: 'items.productId',
        select: 'productName images price discountPrice',
      }),
    ])

    if (!user || !populatedOrder) {
      throw new Error('Order or user not found for background tasks')
    }

    // Admin notification
    try {
      await createAdminNotification({
        type: ADMIN_NOTIFICATION_TYPES.NEW_ORDER,
        title: 'New order received',
        message: `New order ${populatedOrder.orderId} has been placed by ${user.name}.`,
        orderId: populatedOrder._id,
        userId: user._id,
        metadata: {
          orderNumber: populatedOrder.orderId,
          totalAmount: populatedOrder.totalAmount,
          paymentMethod: populatedOrder.paymentMethod,
        },
      })

      console.log(`Admin notification created for ${populatedOrder.orderId}`)
    } catch (error) {
      console.error('Admin notification failed:', error.message)
    }

    // Invoice PDF + order email
    try {
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

      let attachments = []

      try {
        const invoicePdf = await generateInvoicePdf(populatedOrder, user.name)

        attachments = [
          {
            filename: `MineKart-Invoice-${populatedOrder.orderId}.pdf`,
            content: invoicePdf,
            contentType: 'application/pdf',
          },
        ]
      } catch (pdfError) {
        console.error('Invoice PDF generation failed:', pdfError.message)
      }

      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Order Placed - ${populatedOrder.orderId} 🛍️`,
          html,
          attachments,
        })

        console.log(`Order email sent for ${populatedOrder.orderId}`)
      }
    } catch (emailError) {
      console.error('Order email failed:', emailError.message)
    }
  } catch (error) {
    console.error('Order background tasks failed:', error.message)
  }
}

// ! 1. CREATE RAZORPAY ORDER
// POST /payment/razorpay/create-order
router.post('/razorpay/create-order', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { addressId } = req.body

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required',
      })
    }

    const [user, address, cart] = await Promise.all([
      User.findById(userId),
      Address.findOne({ _id: addressId, userId }),
      Cart.findOne({ userId }).populate({
        path: 'items.productId',
        select: 'productName images price discountPrice status stock sizes',
      }),
    ])

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Delivery address not found',
      })
    }

    if (!cart || !cart.items?.length) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
      })
    }

    // Always calculate prices from database products.
    const items = []
    let subtotal = 0

    for (const cartItem of cart.items) {
      const product = cartItem.productId
      const quantity = Number(cartItem.quantity)

      if (!product) {
        return res.status(400).json({
          success: false,
          message: 'A product in your cart no longer exists',
        })
      }

      if (product.status !== 'Active') {
        return res.status(400).json({
          success: false,
          message: `${product.productName} is currently unavailable`,
        })
      }

      if (!Number.isInteger(quantity) || quantity < 1 || product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.productName}`,
        })
      }

      if (cartItem.size && product.sizes?.length && !product.sizes.includes(cartItem.size)) {
        return res.status(400).json({
          success: false,
          message: `Selected size is unavailable for ${product.productName}`,
        })
      }

      const originalPrice = Number(product.price)

      // Follow the selling-price rule used by MineKart.
      const sellingPrice = Number(product.discountPrice) > 0 ? Number(product.discountPrice) : originalPrice

      if (!Number.isFinite(originalPrice) || !Number.isFinite(sellingPrice) || originalPrice < 0 || sellingPrice < 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid price for ${product.productName}`,
        })
      }

      const itemTotal = roundMoney(sellingPrice * quantity)

      items.push({
        productId: product._id,
        productName: product.productName,
        image: product.images?.[0] || '',
        size: cartItem.size || null,
        price: originalPrice,
        discountPrice: sellingPrice,
        quantity,
        totalPrice: itemTotal,
      })

      subtotal += itemTotal
    }

    subtotal = roundMoney(subtotal)

    // Match the current MineKart Checkout rule.
    const deliveryCharge = subtotal >= 499 ? 0 : 40
    const tax = 0
    const totalAmount = roundMoney(subtotal + deliveryCharge + tax)

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      })
    }

    // Save a server-generated checkout snapshot.
    const checkoutSnapshot = {
      addressId: address._id.toString(),

      shippingAddress: {
        fullName: address.fullName,
        phone: address.phone,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        landmark: address.landmark || '',
        addressType: address.addressType || 'Home',
      },

      items,
      subtotal,
      deliveryCharge,
      tax,
      totalAmount,
    }

    const razorpay = getRazorpay()

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `MK-${Date.now()}-${String(userId).slice(-8)}`,
      notes: {
        userId: String(userId),
        checkoutType: 'MineKart',
      },
    })

    // Store the pending payment intent before returning checkout details.
    const payment = await Payment.create({
      userId,
      orderId: null,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'Pending',
      transactionId: '',
      amount: totalAmount,
      paidAt: null,
      razorpayOrderId: razorpayOrder.id,
      checkoutSnapshot,
    })

    return res.status(201).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        paymentRecordId: payment._id,
        razorpayOrderId: razorpayOrder.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'MineKart',
        description: 'MineKart Order Payment',
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || address.phone || '',
        },
      },
    })
  } catch (error) {
    console.error('Create Razorpay Order Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to create Razorpay order',
    })
  }
})

// ! 2. VERIFY RAZORPAY PAYMENT
router.post('/razorpay/verify', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay verification details are missing',
      })
    }

    // Verify the signature on the backend.
    if (!isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      })
    }

    const paymentIntent = await Payment.findOne({
      userId,
      razorpayOrderId: razorpay_order_id,
      paymentMethod: 'RAZORPAY',
    }).select('+checkoutSnapshot')

    if (!paymentIntent) {
      return res.status(404).json({
        success: false,
        message: 'Razorpay payment record not found',
      })
    }

    // Idempotency: return the existing order if already processed.
    if (paymentIntent.orderId) {
      const existingOrder = await Order.findById(paymentIntent.orderId)

      if (existingOrder) {
        return res.status(200).json({
          success: true,
          message: 'Payment was already verified',
          data: {
            order: existingOrder,
            alreadyProcessed: true,
          },
        })
      }
    }

    const razorpay = getRazorpay()

    // Check the payment directly with Razorpay as well.
    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id)

    if (razorpayPayment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: 'Payment does not match the Razorpay order',
      })
    }

    if (Number(razorpayPayment.amount) !== Math.round(Number(paymentIntent.amount) * 100)) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount does not match the order',
      })
    }

    if (razorpayPayment.currency !== 'INR') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment currency',
      })
    }

    // Capture an authorized payment if it has not yet been captured.
    let confirmedPayment = razorpayPayment

    if (razorpayPayment.status === 'authorized') {
      confirmedPayment = await razorpay.payments.capture(razorpay_payment_id, Math.round(Number(paymentIntent.amount) * 100), 'INR')
    }

    if (confirmedPayment.status !== 'captured') {
      return res.status(409).json({
        success: false,
        message: 'Payment has not been captured successfully',
      })
    }

    // Another request may have completed the order while we checked payment.
    const existingOrder = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    })

    if (existingOrder) {
      await Payment.findByIdAndUpdate(paymentIntent._id, {
        $set: {
          orderId: existingOrder._id,
          paymentStatus: 'Paid',
          transactionId: razorpay_payment_id,
          paidAt: new Date(),
        },
      })

      return res.status(200).json({
        success: true,
        message: 'Payment was already verified',
        data: {
          order: existingOrder,
          alreadyProcessed: true,
        },
      })
    }

    // Atomic claim prevents two requests from creating the same order.
    const claimedPayment = await Payment.findOneAndUpdate(
      {
        _id: paymentIntent._id,
        orderId: null,
        transactionId: { $in: ['', razorpay_payment_id] },
        paymentStatus: 'Pending',
      },
      {
        $set: {
          transactionId: razorpay_payment_id,
        },
      },
      {
        new: true,
      },
    ).select('+checkoutSnapshot')

    if (!claimedPayment) {
      const processedPayment = await Payment.findById(paymentIntent._id)

      if (processedPayment?.orderId) {
        const order = await Order.findById(processedPayment.orderId)

        if (order) {
          return res.status(200).json({
            success: true,
            message: 'Payment was already verified',
            data: {
              order,
              alreadyProcessed: true,
            },
          })
        }
      }

      return res.status(409).json({
        success: false,
        message: 'Payment verification is already being processed. Please check your orders.',
      })
    }

    const snapshot = claimedPayment.checkoutSnapshot

    if (!snapshot?.items?.length || !snapshot.shippingAddress) {
      await Payment.updateOne({ _id: claimedPayment._id, orderId: null }, { $set: { transactionId: '' } })

      return res.status(400).json({
        success: false,
        message: 'Checkout information is missing',
      })
    }

    // Recheck stock/status before finalizing the order.
    for (const item of snapshot.items) {
      const product = await Product.findById(item.productId)

      if (!product || product.status !== 'Active' || product.stock < item.quantity) {
        await Payment.updateOne({ _id: claimedPayment._id, orderId: null }, { $set: { transactionId: '' } })

        return res.status(409).json({
          success: false,
          message: `Stock changed for ${item.productName}. Payment was captured; contact MineKart support if a refund is required.`,
        })
      }
    }

    let order

    try {
      order = await Order.create({
        userId,

        items: snapshot.items,

        shippingAddress: snapshot.shippingAddress,

        subtotal: snapshot.subtotal,
        deliveryCharge: snapshot.deliveryCharge,
        tax: snapshot.tax,
        totalAmount: snapshot.totalAmount,

        paymentMethod: 'RAZORPAY',
        paymentStatus: 'Paid',
        orderStatus: 'Pending',

        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      })
    } catch (createError) {
      // Recover if a previous request created the order successfully.
      order = await Order.findOne({
        razorpayOrderId: razorpay_order_id,
      })

      if (!order) {
        await Payment.updateOne({ _id: claimedPayment._id, orderId: null }, { $set: { transactionId: '' } })

        throw createError
      }
    }

    // Link the payment to the final order.
    await Payment.findByIdAndUpdate(claimedPayment._id, {
      $set: {
        orderId: order._id,
        paymentStatus: 'Paid',
        transactionId: razorpay_payment_id,
        paidAt: new Date(),
      },
    })

    // Clear the user's cart after successful order creation.
    await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          tax: 0,
          totalAmount: 0,
        },
      },
    )

    // Run the same kind of background tasks as the existing order route.
    waitUntil(runOrderBackgroundTasks(order._id, userId))

    return res.status(200).json({
      success: true,
      message: 'Payment verified and order placed successfully',
      data: {
        order,
        alreadyProcessed: false,
      },
    })
  } catch (error) {
    console.error('Verify Razorpay Payment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to verify payment. If money was deducted, please check your MineKart orders before trying again.',
    })
  }
})

// START RAZORPAY REFUND
router.post('/admin/:id/refund', authMiddleware, requirePermission(SECTION_KEYS.Order, ACTIONS.Order.REFUND), async (req, res) => {
  let lockedOrderId = null

  try {
    const { id } = req.params

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (order.paymentMethod !== 'RAZORPAY' || order.paymentStatus !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid Razorpay orders can be refunded through this endpoint',
      })
    }

    if (order.orderStatus !== 'Delivered' || order.returnStatus !== 'Item Received') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered and the returned item must be received first',
      })
    }

    if (order.refundId || order.refundedAt) {
      return res.status(409).json({
        success: false,
        message: 'A refund already exists for this order',
      })
    }

    if (!order.razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: 'Razorpay payment ID is missing',
      })
    }

    const payment = await Payment.findOne({
      orderId: order._id,
      paymentMethod: 'RAZORPAY',
      paymentStatus: 'Paid',
      transactionId: order.razorpayPaymentId,
    })

    if (!payment) {
      return res.status(400).json({
        success: false,
        message: 'Matching paid payment record not found',
      })
    }

    if (!Number.isFinite(payment.amount) || payment.amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      })
    }

    // Lock the order before contacting Razorpay.
    // Never automatically retry if the provider call has an uncertain outcome.
    const lockedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        orderStatus: 'Delivered',
        paymentStatus: 'Paid',
        returnStatus: 'Item Received',
        refundId: '',
        refundedAt: null,
      },
      {
        $set: {
          returnStatus: 'Refund Processing',
          refundAmount: payment.amount,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!lockedOrder) {
      return res.status(409).json({
        success: false,
        message: 'Refund is already processing or the order state has changed',
      })
    }

    lockedOrderId = lockedOrder._id

    const razorpay = getRazorpay()

    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: Math.round(payment.amount * 100),
      speed: 'normal',
      notes: {
        orderId: String(order._id),
        orderNumber: order.orderId,
        reason: 'Customer return',
      },
    })

    // Save provider reference; do not mark Refunded yet.
    await Promise.all([
      Order.updateOne(
        { _id: lockedOrder._id },
        {
          $set: {
            refundId: refund.id,
            refundAmount: payment.amount,
            returnStatus: 'Refund Processing',
          },
        },
      ),
      Payment.updateOne(
        { _id: payment._id },
        {
          $set: {
            refundId: refund.id,
            refundAmount: payment.amount,
            refundStatus: 'Pending',
          },
        },
      ),
    ])

    return res.status(202).json({
      success: true,
      message: 'Refund request submitted. Check Razorpay status before marking it complete.',
      data: {
        orderId: order._id,
        refundId: refund.id,
        refundStatus: refund.status,
        refundAmount: payment.amount,
      },
    })
  } catch (error) {
    console.error('Start Razorpay Refund Error:', error)

    // Keep the order locked if the provider outcome is uncertain.
    // Verify the payment/refund in Razorpay before attempting any retry.
    return res.status(502).json({
      success: false,
      message: 'Refund outcome could not be confirmed. Check Razorpay Dashboard before retrying.',
    })
  }
})

// VERIFY RAZORPAY REFUND STATUS
router.put('/admin/:id/refund/verify', authMiddleware, requirePermission(SECTION_KEYS.Order, ACTIONS.Order.REFUND), async (req, res) => {
  try {
    const { id } = req.params

    const order = await Order.findById(id)

    console.log('Refund Verification Debug:', {
      orderId: order._id,
      paymentMethod: order.paymentMethod,
      refundId: order.refundId,
      returnStatus: order.returnStatus,
      paymentStatus: order.paymentStatus,
    })

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (order.paymentMethod !== 'RAZORPAY' || !order.refundId || order.returnStatus !== 'Refund Processing') {
      return res.status(400).json({
        success: false,
        message: 'No verifiable Razorpay refund was found for this order',
      })
    }

    const payment = await Payment.findOne({
      orderId: order._id,
      paymentMethod: 'RAZORPAY',
      refundId: order.refundId,
    })

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Matching refund payment record not found',
      })
    }

    const razorpay = getRazorpay()

    // Fetch the actual refund status from Razorpay.
    const refund = await razorpay.refunds.fetch(order.refundId)

    // Verify that the provider refund amount matches the recorded amount.
    const expectedAmountPaise = Math.round(Number(order.refundAmount) * 100)

    if (!Number.isFinite(expectedAmountPaise) || expectedAmountPaise <= 0 || Number(refund.amount) !== expectedAmountPaise || refund.payment_id !== order.razorpayPaymentId) {
      return res.status(409).json({
        success: false,
        message: 'Refund details do not match the order. Please investigate in Razorpay Dashboard.',
      })
    }

    // Refund is still in progress.
    if (refund.status === 'pending') {
      await Payment.updateOne({ _id: payment._id, refundId: refund.id }, { $set: { refundStatus: 'Pending' } })

      return res.status(200).json({
        success: true,
        message: 'Refund is still processing',
        data: {
          refundId: refund.id,
          refundStatus: refund.status,
          refundAmount: order.refundAmount,
        },
      })
    }

    // Provider confirmed the refund failed.
    if (refund.status === 'failed') {
      await Payment.updateOne({ _id: payment._id, refundId: refund.id }, { $set: { refundStatus: 'Failed' } })

      // Allow a later, manually reviewed retry only after failure is confirmed.
      await Order.updateOne(
        {
          _id: order._id,
          refundId: refund.id,
          returnStatus: 'Refund Processing',
          orderStatus: 'Delivered',
        },
        {
          $set: {
            returnStatus: 'Item Received',
            refundId: '',
          },
        },
      )

      return res.status(200).json({
        success: false,
        message: 'Razorpay reports that the refund failed. Verify the provider record before retrying.',
        data: {
          refundId: refund.id,
          refundStatus: refund.status,
        },
      })
    }

    // Do not assume unknown provider statuses mean success.
    if (refund.status !== 'processed') {
      return res.status(409).json({
        success: false,
        message: `Refund has an unrecognized status: ${refund.status}. Please review it in Razorpay Dashboard.`,
      })
    }

    // Finalize only when Razorpay confirms "processed".
    const finalizedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        refundId: refund.id,
        returnStatus: 'Refund Processing',
        orderStatus: 'Delivered',
        paymentStatus: 'Paid',
      },
      {
        $set: {
          returnStatus: 'Refunded',
          orderStatus: 'Returned',
          paymentStatus: 'Refunded',
          refundedAt: new Date(),
          refundAmount: Number(refund.amount) / 100,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!finalizedOrder) {
      // A previous verification request may have finalized it already.
      const latestOrder = await Order.findById(order._id)

      if (latestOrder?.refundId === refund.id && latestOrder?.returnStatus === 'Refunded' && latestOrder?.paymentStatus === 'Refunded') {
        return res.status(200).json({
          success: true,
          message: 'Refund was already finalized',
          data: latestOrder,
        })
      }

      return res.status(409).json({
        success: false,
        message: 'Order state changed. Check the order and refund records before taking further action.',
      })
    }

    await Payment.updateOne(
      {
        _id: payment._id,
        refundId: refund.id,
      },
      {
        $set: {
          paymentStatus: 'Refunded',
          refundStatus: 'Processed',
          refundAmount: Number(refund.amount) / 100,
          refundedAt: finalizedOrder.refundedAt,
        },
      },
    )

    return res.status(200).json({
      success: true,
      message: 'Razorpay refund confirmed and order marked as returned',
      data: {
        orderId: finalizedOrder._id,
        refundId: refund.id,
        refundStatus: refund.status,
        refundAmount: finalizedOrder.refundAmount,
        orderStatus: finalizedOrder.orderStatus,
        returnStatus: finalizedOrder.returnStatus,
      },
    })
  } catch (error) {
    console.error('Verify Razorpay Refund Error:', error)

    return res.status(502).json({
      success: false,
      message: 'Unable to verify refund status. Check Razorpay Dashboard and retry verification.',
    })
  }
})

// ! EXISTING: GET ALL ORDERS WITH PAYMENT
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
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

    return res.status(200).json({
      success: true,
      message: 'All orders fetched successfully',
      data: ordersWithPayment,
    })
  } catch (error) {
    console.error('Get Admin Orders Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// MANUAL REFUND CONFIRMATION FOR COD / ONLINE-ON-DELIVERY
router.put('/admin/:id/manual-refund', authMiddleware, requirePermission(SECTION_KEYS.Order, ACTIONS.Order.REFUND), async (req, res) => {
  try {
    const { id } = req.params
    const { refundReference } = req.body

    if (typeof refundReference !== 'string' || !refundReference.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Refund reference or transaction number is required',
      })
    }

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    if (!['COD', 'ONLINE_ON_DELIVERY'].includes(order.paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'This endpoint is only for COD or online-on-delivery orders',
      })
    }

    if (order.orderStatus !== 'Delivered' || order.returnStatus !== 'Item Received') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered and the returned item must be received first',
      })
    }

    if (order.paymentStatus !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid orders can be refunded',
      })
    }

    if (order.refundId || order.refundedAt) {
      return res.status(409).json({
        success: false,
        message: 'A refund is already recorded for this order',
      })
    }

    const payment = await Payment.findOne({
      orderId: order._id,
      paymentMethod: order.paymentMethod,
      paymentStatus: 'Paid',
    })

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Matching paid payment record not found',
      })
    }

    const refundAmount = Number(payment.amount)

    if (!Number.isFinite(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid refund amount',
      })
    }

    // Claim the order to prevent concurrent manual refund confirmations.
    const claimedOrder = await Order.findOneAndUpdate(
      {
        _id: order._id,
        orderStatus: 'Delivered',
        paymentStatus: 'Paid',
        returnStatus: 'Item Received',
        refundId: '',
        refundedAt: null,
      },
      {
        $set: {
          returnStatus: 'Refund Processing',
          refundAmount,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!claimedOrder) {
      return res.status(409).json({
        success: false,
        message: 'Refund is already processing or the order state has changed',
      })
    }

    // This endpoint records a refund already issued outside Razorpay.
    // Admin must verify the actual bank/cash refund before calling it.
    const refundedAt = new Date()

    const [updatedOrder, updatedPayment] = await Promise.all([
      Order.findOneAndUpdate(
        {
          _id: claimedOrder._id,
          returnStatus: 'Refund Processing',
          refundId: '',
        },
        {
          $set: {
            refundId: refundReference.trim(),
            refundAmount,
            refundedAt,
            returnStatus: 'Refunded',
            orderStatus: 'Returned',
            paymentStatus: 'Refunded',
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ),

      Payment.findOneAndUpdate(
        {
          _id: payment._id,
          paymentStatus: 'Paid',
        },
        {
          $set: {
            refundId: refundReference.trim(),
            refundAmount,
            refundedAt,
            refundStatus: 'Processed',
            paymentStatus: 'Refunded',
          },
        },
        {
          new: true,
          runValidators: true,
        },
      ),
    ])

    if (!updatedOrder || !updatedPayment) {
      console.error('Manual refund requires reconciliation:', {
        orderId: String(order._id),
        paymentId: String(payment._id),
        refundReference: refundReference.trim(),
      })

      return res.status(500).json({
        success: false,
        message: 'Refund records could not both be updated. Reconcile the order and payment before retrying.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Manual refund recorded successfully',
      data: {
        orderId: updatedOrder._id,
        refundReference: refundReference.trim(),
        refundAmount,
        orderStatus: updatedOrder.orderStatus,
        returnStatus: updatedOrder.returnStatus,
        paymentStatus: updatedPayment.paymentStatus,
      },
    })
  } catch (error) {
    console.error('Manual Refund Confirmation Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to record manual refund',
    })
  }
})

// EXISTING: CONFIRM COD / ONLINE-ON-DELIVERY PAYMENT
router.put('/admin/:id/confirm', authMiddleware, requirePermission(SECTION_KEYS.Order, ACTIONS.Order.CONFIRM_PAYMENT), async (req, res) => {
  try {
    const { id } = req.params

    const payment = await Payment.findById(id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      })
    }

    if (payment.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment is already confirmed',
      })
    }

    // Razorpay must never be manually marked paid by this endpoint.
    if (!['COD', 'ONLINE_ON_DELIVERY'].includes(payment.paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method for delivery payment',
      })
    }

    const order = await Order.findById(payment.orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    payment.paymentStatus = 'Paid'
    payment.paidAt = new Date()

    order.paymentStatus = 'Paid'

    await Promise.all([payment.save(), order.save()])

    return res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        payment,
        order,
      },
    })
  } catch (error) {
    console.error('Confirm Payment Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

module.exports = router
