const mongoose = require('mongoose')

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderMineKart',
      default: null,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      default: null,
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

const AdminNotification = mongoose.model('AdminNotificationMineKart', adminNotificationSchema)

module.exports = AdminNotification
