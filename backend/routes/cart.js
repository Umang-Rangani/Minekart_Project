const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Cart = require('../model/cart')
const Product = require('../model/Product')

// ! Add Product To Cart
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id

    const { productId, size = null, quantity = 1 } = req.body

    // ! Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      })
    }

    // ! Get Product
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // ! Check Stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity is not available',
      })
    }

    // ! Product Price
    const price = product.price

    const discountPrice = product.discountPrice || product.price

    // ! Find User Cart
    let cart = await Cart.findOne({
      userId,
    })

    // ! If Cart doesn't exist
    if (!cart) {
      const totalPrice = discountPrice * quantity

      cart = await Cart.create({
        userId,

        items: [
          {
            productId,
            size,
            price,
            discountPrice,
            quantity,
            totalPrice,
          },
        ],

        totalQuantity: quantity,
        subtotal: totalPrice,
        tax: 0,
        totalAmount: totalPrice,
      })

      return res.status(201).json({
        success: true,
        message: 'Product added to cart',
        data: cart,
      })
    }

    // ! Check Existing Product + Size
    const existingItem = cart.items.find((item) => item.productId.toString() === productId.toString() && item.size === size)

    // ! Existing Item
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

      // ! Check Stock
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: 'Product stock limit reached',
        })
      }

      existingItem.quantity = newQuantity

      existingItem.price = price
      existingItem.discountPrice = discountPrice

      existingItem.totalPrice = discountPrice * newQuantity
    }

    // ! New Item
    else {
      const totalPrice = discountPrice * quantity

      cart.items.push({
        productId,
        size,
        price,
        discountPrice,
        quantity,
        totalPrice,
      })
    }

    // ! Calculate Cart Summary
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0)

    cart.subtotal = cart.items.reduce((total, item) => total + item.totalPrice, 0)

    cart.tax = 0

    cart.totalAmount = cart.subtotal + cart.tax

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: cart,
    })
  } catch (error) {
    console.log('Add To Cart Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
