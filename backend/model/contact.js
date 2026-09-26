const mongoose = require('mongoose')

const supportMessageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ['User', 'Admin'],
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      default: null,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      default: null,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    subject: {
      type: String,
      default: 'Customer Support',
      trim: true,
    },

    messages: {
      type: [supportMessageSchema],
      default: [],
    },

    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  },
)

const Contact = mongoose.model('ContactMineKart', contactSchema)

module.exports = Contact
