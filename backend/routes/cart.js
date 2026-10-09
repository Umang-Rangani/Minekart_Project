const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Cart = require('../model/cart')
const Product = require('../model/product')

// ! Get User Cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const cart = await Cart.findOne({
      userId,
    }).populate({
      path: 'items.productId',
      select: 'productName images price discountPrice brand stock',
      populate: {
        path: 'brand',
        select: 'brandName',
      },
    })

    //  Cart doesn't exist
    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        data: {
          items: [],
          totalQuantity: 0,
          subtotal: 0,
          tax: 0,
          totalAmount: 0,
        },
      })
    }

    res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: cart,
    })
  } catch (error) {
    console.log('Get Cart Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! Add Product To Cart

const populateCart = async (cart) => {
  await cart.populate({
    path: 'items.productId',
    select: 'productName images price discountPrice brand stock',
    populate: {
      path: 'brand',
      select: 'brandName',
    },
  })

  return cart
}

const calculateCartTotals = (cart) => {
  cart.totalQuantity = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  )

  cart.subtotal = cart.items.reduce(
    (total, item) => total + item.totalPrice,
    0,
  )

  cart.tax = 0
  cart.totalAmount = cart.subtotal + cart.tax
}

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    
    const { productId, size = null } = req.body

    const quantity = Number(req.body.quantity ?? 1)

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    if (
      typeof productId !== 'string' ||
      !/^[a-f\d]{24}$/i.test(productId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      })
    }

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
      })
    }

    const product = await Product.findById(productId)
      .select('productName price discountPrice stock brand images')

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    if (
      !Number.isFinite(product.stock) ||
      product.stock < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Product stock is unavailable',
      })
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Requested quantity is not available',
      })
    }

    const price = product.price
    const discountPrice = product.discountPrice ?? product.price

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(discountPrice) ||
      price < 0 ||
      discountPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product price',
      })
    }

    let cart = await Cart.findOne({ userId })

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        totalQuantity: 0,
        subtotal: 0,
        tax: 0,
        totalAmount: 0,
      })
    }

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId &&
        (item.size ?? null) === size,
    )

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

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
    } else {
      cart.items.push({
        productId,
        size,
        price,
        discountPrice,
        quantity,
        totalPrice: discountPrice * quantity,
      })
    }

    calculateCartTotals(cart)

    await cart.save()
    await populateCart(cart)

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      data: cart,
    })
  } catch (error) {
    console.error('Add To Cart Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// ! Increase Cart Item Quantity
router.patch('/item/increase', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { productId, size = null } = req.body

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    // Find Cart
    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    // Find Product
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Find Cart Item
    const cartItem = cart.items.find((item) => item.productId.toString() === productId.toString() && item.size === size)

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      })
    }

    // Check Stock
    if (cartItem.quantity >= product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Product stock limit reached',
      })
    }

    // Increase Quantity
    cartItem.quantity += 1

    // Update Latest Price
    cartItem.price = product.price
    cartItem.discountPrice = product.discountPrice || product.price

    // Update Item Total
    cartItem.totalPrice = cartItem.discountPrice * cartItem.quantity

    // Calculate Cart Summary
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0)

    cart.subtotal = cart.items.reduce((total, item) => total + item.totalPrice, 0)

    cart.tax = 0
    cart.totalAmount = cart.subtotal + cart.tax

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Cart item quantity increased',
      data: cart,
    })
  } catch (error) {
    console.log('Increase Cart Item Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! Decrease Cart Item Quantity
router.patch('/item/decrease', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { productId, size = null } = req.body

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    // Find Cart
    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    // Find Cart Item Index
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString() && item.size === size)

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      })
    }

    const cartItem = cart.items[itemIndex]

    // Quantity 1 hoy to item remove
    if (cartItem.quantity === 1) {
      cart.items.splice(itemIndex, 1)
    } else {
      // Decrease Quantity
      cartItem.quantity -= 1

      // Update Item Total
      cartItem.totalPrice = cartItem.discountPrice * cartItem.quantity
    }

    // Calculate Cart Summary
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0)

    cart.subtotal = cart.items.reduce((total, item) => total + item.totalPrice, 0)

    cart.tax = 0
    cart.totalAmount = cart.subtotal + cart.tax

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Cart item quantity decreased',
      data: cart,
    })
  } catch (error) {
    console.log('Decrease Cart Item Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! Remove Cart Item
router.delete('/item', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { productId, size = null } = req.body

    // Validation
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      })
    }

    // Find Cart
    const cart = await Cart.findOne({
      userId,
    })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    // Find Item Index
    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId.toString() && item.size === size)

    // Item Not Found
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      })
    }

    // Remove Item
    cart.items.splice(itemIndex, 1)

    // Calculate Cart Summary
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0)

    cart.subtotal = cart.items.reduce((total, item) => total + item.totalPrice, 0)

    cart.tax = 0

    cart.totalAmount = cart.subtotal + cart.tax

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      data: cart,
    })
  } catch (error) {
    console.log('Remove Cart Item Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// !  localstorage guest_cart - products - logged-in user's - merge
router.post('/merge', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { items } = req.body

    // Validation
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Guest cart is empty',
      })
    }

    // Find User Cart
    let cart = await Cart.findOne({
      userId,
    })

    // Create Cart if doesn't exist
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalQuantity: 0,
        subtotal: 0,
        tax: 0,
        totalAmount: 0,
      })
    }

    // Merge Every Guest Item
    for (const guestItem of items) {
      const { productId, size = null, quantity = 1 } = guestItem

      // Basic Validation
      if (!productId || quantity < 1) {
        continue
      }

      // Get Product
      const product = await Product.findById(productId)

      if (!product) {
        continue
      }

      // Check Stock
      if (product.stock < 1) {
        continue
      }

      // Product Price
      const price = product.price

      const discountPrice = product.discountPrice || product.price

      // Check Existing Product + Size
      const existingItem = cart.items.find((item) => item.productId.toString() === productId.toString() && item.size === size)

      // Existing Item
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity

        // Stock Limit
        if (newQuantity > product.stock) {
          existingItem.quantity = product.stock
        } else {
          existingItem.quantity = newQuantity
        }

        existingItem.price = price
        existingItem.discountPrice = discountPrice

        existingItem.totalPrice = existingItem.discountPrice * existingItem.quantity
      }

      // New Item
      else {
        const finalQuantity = Math.min(quantity, product.stock)

        const totalPrice = discountPrice * finalQuantity

        cart.items.push({
          productId,
          size,
          price,
          discountPrice,
          quantity: finalQuantity,
          totalPrice,
        })
      }
    }

    // Calculate Cart Summary
    cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0)

    cart.subtotal = cart.items.reduce((total, item) => total + item.totalPrice, 0)

    cart.tax = 0

    cart.totalAmount = cart.subtotal + cart.tax

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Guest cart merged successfully',
      data: cart,
    })
  } catch (error) {
    console.log('Merge Cart Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! Clear Complete Cart
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    // Find User Cart
    const cart = await Cart.findOne({
      userId,
    })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    // Clear Items
    cart.items = []

    // Reset Cart Summary
    cart.totalQuantity = 0
    cart.subtotal = 0
    cart.tax = 0
    cart.totalAmount = 0

    await cart.save()

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    })
  } catch (error) {
    console.log('Clear Cart Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
