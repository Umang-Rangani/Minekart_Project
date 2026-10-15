const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      required: true,
    },

    // Razorpay verification પહેલાં null રહી શકે
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderMineKart',
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'RAZORPAY', 'ONLINE_ON_DELIVERY'],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },

    transactionId: {
      type: String,
      default: '',
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // Refund tracking
    refundId: {
      type: String,
      default: '',
      trim: true,
    },

    refundAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    refundStatus: {
      type: String,
      enum: ['Not Requested', 'Pending', 'Processed', 'Failed'],
      default: 'Not Requested',
    },

    // Razorpay order reference
    razorpayOrderId: {
      type: String,
      default: '',
    },

    // Checkout snapshot; hidden by default
    checkoutSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
)

// Prevent duplicate non-empty Razorpay order IDs.
paymentSchema.index(
  { razorpayOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      razorpayOrderId: { $type: 'string', $gt: '' },
    },
  },
)

const Payment = mongoose.models.PaymentMineKart || mongoose.model('PaymentMineKart', paymentSchema)

module.exports = Payment
