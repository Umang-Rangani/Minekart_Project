const mongoose = require('mongoose')

// Order Item
const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductMineKart',
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    size: {
      type: String,
      default: null,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
)

// Order
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: 'String',
      unique: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserMineKart',
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must contain at least one item',
      },
    },

    // Delivery Address Snapshot
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      pincode: {
        type: String,
        required: true,
        trim: true,
      },

      landmark: {
        type: String,
        default: '',
        trim: true,
      },

      addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home',
      },
    },

    // Price Details
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Payment
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

    // Order Status
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Pending',
    },

    // Order cancellation
    cancellationReason: {
      type: String,
      default: '',
      trim: true,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

orderSchema.pre('save', async function () {
  if (!this.isNew || this.orderId) {
    return
  }

  const currentYear = new Date().getFullYear().toString().slice(-2)

  const lastOrder = await this.constructor
    .findOne({
      orderId: new RegExp(`^MNK-${currentYear}-`),
    })
    .sort({ createdAt: -1 })

  let sequence = 1

  if (lastOrder) {
    const lastSequence = parseInt(lastOrder.orderId.split('-')[2], 10)

    sequence = lastSequence + 1
  }

  const sequenceNumber = sequence.toString().padStart(3, '0')

  this.orderId = `MNK-${currentYear}-${sequenceNumber}`
})

const Order = mongoose.model('OrderMineKart', orderSchema)

module.exports = Order
