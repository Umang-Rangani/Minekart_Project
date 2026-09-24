const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    // Product basic information
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    // Category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CategoryMineKart',
      required: true,
    },

    // SubCategory reference
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategoryMineKart',
      default: null,
    },

    // Brand reference
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BrandMineKart',
      default: null,
    },

    // Product images
    images: {
      type: [String],
      default: [],
    },

    offerImage: {
      type: String,
    },

    sizes: {
      type: [
        {
          type: String,
          enum: ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '28', '30', '32', '34', '36', '38', '40'],
        },
      ],
      default: [],
    },

    // Pricing
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Product status
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },

    // Offer
    isOffer: {
      type: Boolean,
      default: false,
    },
    // Product rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // Stock
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Number of products sold
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Warranty
    warranty: {
      type: String,
      default: '',
      trim: true,
    },

    warrantyDuration: {
      type: String,
      default: '',
      trim: true,
    },

    warrantyType: {
      type: String,
      enum: ['Brand Warranty', 'Seller Warranty', 'No Warranty'],
      default: 'No Warranty',
    },

    // Return & Delivery
    returnPolicy: {
      type: String,
      default: '',
      trim: true,
    },

    deliveryInfo: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const Product = mongoose.models.ProductMineKart || mongoose.model('ProductMineKart', productSchema)

module.exports = Product
