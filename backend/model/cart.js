const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductMineKart',
      required: true,
    },

    size: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  },
)

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      required: true,
    },

    items: [cartItemSchema],

    totalQuantity: {
      type: Number,
      default: 0,
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Cart = mongoose.model('CartMineKart', cartSchema)

module.exports = Cart
