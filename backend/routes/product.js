const express = require('express')
const Product = require('../model/product')
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const data = await Product.find().populate('category', 'categoryName').populate('subCategory', 'subCategoryName').populate('brand', 'brandName brandLogo').sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get products',
      error: error.message,
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const data = await Product.findById(req.params.id).populate('category', 'categoryName').populate('subCategory', 'subCategoryName').populate('brand', 'brandName')

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get product',
      error: error.message,
    })
  }
})

router.post('/', async (req, res) => {
  try {
    const { productName, description, category, subCategory, brand, images, offerImage, sizes, price, discount, discountPrice, status, isOffer, rating, stock, soldCount, warranty, warrantyDuration, warrantyType, returnPolicy, deliveryInfo } =
      req.body

    // Product Name
    if (!productName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      })
    }

    // Category
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      })
    }

    // Price
    if (price === undefined || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Price is required',
      })
    }

    // Slug Generate
    const slug = productName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Slug Duplicate Check
    const existingSlug = await Product.findOne({ slug })

    if (existingSlug) {
      return res.status(409).json({
        success: false,
        message: 'Product with this name already exists',
      })
    }

    const data = await Product.create({
      productName: productName.trim(),

      slug,

      description: description?.trim() || '',

      category,

      subCategory: subCategory || null,

      brand: brand || null,

      images: Array.isArray(images) ? images : [],

      offerImage: offerImage || '',

      sizes: Array.isArray(sizes) ? sizes : [],

      price: Number(price),

      discount: Number(discount || 0),

      discountPrice: Number(discountPrice || 0),

      status: status || 'Active',

      isOffer: Boolean(isOffer),

      rating: Number(rating || 0),

      stock: Number(stock || 0),

      soldCount: Number(soldCount || 0),

      warranty: warranty?.trim() || '',

      warrantyDuration: warrantyDuration?.trim() || '',

      warrantyType: warrantyType || 'No Warranty',

      returnPolicy: returnPolicy?.trim() || '',

      deliveryInfo: deliveryInfo?.trim() || '',
    })

    await data.populate([
      {
        path: 'category',
        select: 'categoryName',
      },
      {
        path: 'subCategory',
        select: 'subCategoryName',
      },
      {
        path: 'brand',
        select: 'brandName',
      },
    ])

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const { productName, description, category, subCategory, brand, images,offerImage, sizes, price, discount, discountPrice, status, isOffer, rating, stock, soldCount, warranty, warrantyDuration, warrantyType, returnPolicy, deliveryInfo } = req.body

    // Check product
    const existingProduct = await Product.findById(req.params.id)

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    // Product Name
    if (!productName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required',
      })
    }

    // Category
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      })
    }

    // Price
    if (price === undefined || price === '') {
      return res.status(400).json({
        success: false,
        message: 'Price is required',
      })
    }

    const slug = productName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const data = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName: productName.trim(),

        slug,

        description: description?.trim() || '',

        category,

        subCategory: subCategory || null,

        brand: brand || null,

        images: Array.isArray(images) ? images : [],

        offerImage: offerImage || '',
        
        sizes: Array.isArray(sizes) ? sizes : [],

        price: Number(price),

        discount: Number(discount || 0),

        discountPrice: Number(discountPrice || 0),

        status: status || 'Active',

        isOffer: Boolean(isOffer),

        rating: Number(rating || 0),

        stock: Number(stock || 0),

        soldCount: Number(soldCount || 0),

        warranty: warranty?.trim() || '',

        warrantyDuration: warrantyDuration?.trim() || '',

        warrantyType: warrantyType || 'No Warranty',

        returnPolicy: returnPolicy?.trim() || '',

        deliveryInfo: deliveryInfo?.trim() || '',
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate('category', 'categoryName')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName')

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const data = await Product.findByIdAndDelete(req.params.id)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message,
    })
  }
})

module.exports = router
