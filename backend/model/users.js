const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: '',
    },

    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  },
)
const User = mongoose.model('UserMineKart', userSchema)

module.exports = User
