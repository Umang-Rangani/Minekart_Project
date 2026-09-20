const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      required: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderMineKart',
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ['COD', 'ONLINE_ON_DELIVERY'],
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
  },
  { timestamps: true },
)

const Payment = mongoose.models.PaymentMineKart || mongoose.model('PaymentMineKart', paymentSchema)

module.exports = Payment
