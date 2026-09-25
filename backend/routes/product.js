const express = require('express')
const Product = require('../model/product')
const SubCategory = require('../model/subcategory')
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

// ! Search Products => SearchProducts.jsx
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query

    const query = q?.trim()

    if (!query) {
      return res.status(200).json({
        success: true,
        data: [],
      })
    }

    const products = await Product.aggregate([
      // Brand
      {
        $lookup: {
          from: 'brandminekarts',
          localField: 'brand',
          foreignField: '_id',
          as: 'brand',
        },
      },

      // Category
      {
        $lookup: {
          from: 'categoryminekarts',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },

      // Sub Category
      {
        $lookup: {
          from: 'subcategoryminekarts',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategory',
        },
      },

      // Convert lookup arrays to objects
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $unwind: {
          path: '$category',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $unwind: {
          path: '$subCategory',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Search
      {
        $match: {
          status: 'Active',
          $or: [
            {
              productName: {
                $regex: query,
                $options: 'i',
              },
            },
            {
              description: {
                $regex: query,
                $options: 'i',
              },
            },
            {
              'brand.brandName': {
                $regex: query,
                $options: 'i',
              },
            },
            {
              'category.categoryName': {
                $regex: query,
                $options: 'i',
              },
            },
            {
              'subCategory.subCategoryName': {
                $regex: query,
                $options: 'i',
              },
            },
          ],
        },
      },

      // Latest products first
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])

    return res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    })
  } catch (error) {
    console.error('Search Products Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to search products',
    })
  }
})

// ! Get Products By Category => CategoryProducts.jsx
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params

    const products = await Product.find({
      category: categoryId,
      status: 'Active',
    })
      .populate('category', 'categoryName')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo')
      .sort({
        createdAt: -1,
      })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.log('GET Category Products Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get category products',
      error: error.message,
    })
  }
})

// ! Get Products By Category + SubCategory => CategoryProducts.jsx
router.get('/category/:categoryId/subcategory/:subCategoryName', async (req, res) => {
  try {
    const { categoryId, subCategoryName } = req.params

    const decodedName = decodeURIComponent(subCategoryName)

    const subCategory = await SubCategory.findOne({
      subCategoryName: {
        $regex: `^${decodedName}$`,
        $options: 'i',
      },
    })

    if (!subCategory) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      })
    }

    const products = await Product.find({
      category: categoryId,
      subCategory: subCategory._id,
      status: 'Active',
    })
      .populate('category', 'categoryName')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.log('GET SubCategory Products Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get subcategory products',
      error: error.message,
    })
  }
})

// ! => BrandProducts.jsx
router.get('/brand/:brandId', async (req, res) => {
  try {
    const { brandId } = req.params

    const products = await Product.find({
      brand: brandId,
      status: 'Active',
    })
      .populate('category', 'categoryName')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo description')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.log('GET Brand Products Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get brand products',
      error: error.message,
    })
  }
})

// ! Get Offer Products => ProductOfferList.jsx
router.get('/offers', async (req, res) => {
  try {
    const products = await Product.find({
      isOffer: true,
    })
      .populate('category', 'categoryName')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.log('GET Offer Products Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get offer products',
      error: error.message,
    })
  }
})

// ! Get Normal Products => ProductList.jsx
router.get('/normal', async (req, res) => {
  try {
    const products = await Product.find({
      isOffer: false,
    })
      .populate('category', 'categoryName')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.log('GET Normal Products Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get normal products',
      error: error.message,
    })
  }
})

// !Get related products => ProductDetail.jsx
router.get('/related/:subCategoryId/:productId', async (req, res) => {
  try {
    const { subCategoryId, productId } = req.params

    const products = await Product.find({
      subCategory: subCategoryId,
      _id: { $ne: productId },
    })
      .populate('category', 'categoryName')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.log('GET Related Products Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get related products',
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
    const { productName, description, category, subCategory, brand, images, offerImage, sizes, price, discount, discountPrice, status, isOffer, rating, stock, soldCount, warranty, warrantyDuration, warrantyType, returnPolicy, deliveryInfo } =
      req.body

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
