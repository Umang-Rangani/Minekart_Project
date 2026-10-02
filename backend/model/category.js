const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    categoryImage: {
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

const Category = mongoose.model('CategoryMineKart', categorySchema)

module.exports = Category
