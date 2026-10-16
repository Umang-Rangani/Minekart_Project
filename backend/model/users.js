const mongoose = require('mongoose')
const { ROLES, ADMIN_ROLES } = require('../constants/permission')

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
      enum: [ROLES.USER, ...ADMIN_ROLES],
      default: ROLES.USER,
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },

    /**
     * Custom permission map { [SECTION_KEYS]: string[] }.
     * Empty / missing → use ROLE_DEFAULT_PERMISSIONS[role].
     * SuperAdmin ignores this (full bypass).
     */
    admin_permissions: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model('UserMineKart', userSchema)

module.exports = User
