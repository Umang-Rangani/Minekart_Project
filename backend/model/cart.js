const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductMineKart',
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },

    size: {
      type: String,
      enum: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'],
      default: null,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

const Cart = mongoose.model('CartMineKart', cartSchema)

module.exports = Cart

// Step 1 → Cart Model
// Step 2 → Cart POST API
// Step 3 → AddToCart API call
// Step 4 → GET /cart
// Step 5 → Cart.jsx UI
// Step 6 → + / - quantity API
// Step 7 → Remove Cart API
// Step 8 → Checkout
