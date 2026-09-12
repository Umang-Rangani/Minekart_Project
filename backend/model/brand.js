const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    brandLogo: {    
      type: String,
      default: '',
    },

    description: {
      type: String,
      default: '',
      trim: true,
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

const Brand = mongoose.model('BrandMineKart', brandSchema)

module.exports = Brand
