const express = require('express')
const Product = require('../model/product')
const SubCategory = require('../model/subcategory')
const { default: mongoose } = require('mongoose')
const Category = require('../model/category')
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

// ! Search Product, Category, Brand, Subcategory => SearchProducts.jsx
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

// ! Filter Products, Brands, Categorys, SubCategory, rating, stock, minprice, maxprice, sort => Products.jsx
router.get('/filter', async (req, res) => {
  try {
    const { search, category, brand, rating, stock, minPrice, maxPrice, sort } = req.query

    // Base Match
    const matchStage = {
      status: 'Active',
    }

    // Search: Product Name Only
    if (search?.trim()) {
      const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      matchStage.productName = {
        $regex: escapedSearch,
        $options: 'i',
      }
    }

    // Category Filter
    if (category && category !== 'All') {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category ID',
        })
      }

      matchStage.category = new mongoose.Types.ObjectId(category)
    }

    // Brand Filter
    if (brand && brand !== 'All') {
      if (!mongoose.Types.ObjectId.isValid(brand)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid brand ID',
        })
      }

      matchStage.brand = new mongoose.Types.ObjectId(brand)
    }

    // Rating Filter
    if (rating && rating !== 'All') {
      const ratingValue = Number(rating)

      if (Number.isFinite(ratingValue)) {
        matchStage.rating = {
          $gte: ratingValue,
        }
      }
    }

    // Stock Filter
    if (stock === 'true') {
      matchStage.stock = {
        $gt: 0,
      }
    }

    // Aggregation Pipeline
    const pipeline = [
      {
        $match: matchStage,
      },

      // Effective Selling Price
      {
        $addFields: {
          effectivePrice: {
            $cond: [
              {
                $gt: [{ $ifNull: ['$discountPrice', 0] }, 0],
              },
              '$discountPrice',
              '$price',
            ],
          },
        },
      },
    ]

    // Price Filter
    const priceMatch = {}

    if (minPrice !== undefined && minPrice !== '') {
      const min = Number(minPrice)

      if (Number.isFinite(min)) {
        priceMatch.$gte = min
      }
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const max = Number(maxPrice)

      if (Number.isFinite(max)) {
        priceMatch.$lte = max
      }
    }

    if (Object.keys(priceMatch).length > 0) {
      pipeline.push({
        $match: {
          effectivePrice: priceMatch,
        },
      })
    }

    // Sorting
    switch (sort) {
      case 'priceLow':
        pipeline.push({
          $sort: {
            effectivePrice: 1,
            _id: 1,
          },
        })
        break

      case 'priceHigh':
        pipeline.push({
          $sort: {
            effectivePrice: -1,
            _id: 1,
          },
        })
        break

      case 'rating':
        pipeline.push({
          $sort: {
            rating: -1,
            createdAt: -1,
          },
        })
        break

      case 'sold':
        pipeline.push({
          $sort: {
            soldCount: -1,
            createdAt: -1,
          },
        })
        break

      case 'latest':
      default:
        pipeline.push({
          $sort: {
            createdAt: -1,
          },
        })
        break
    }

    // Category Lookup
    pipeline.push({
      $lookup: {
        from: 'categoryminekarts',
        let: {
          categoryId: '$category',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$categoryId'],
              },
            },
          },
          {
            $project: {
              categoryName: 1,
              status: 1,
            },
          },
        ],
        as: 'category',
      },
    })

    // SubCategory Lookup
    pipeline.push({
      $lookup: {
        from: 'subcategoryminekarts',
        let: {
          subCategoryId: '$subCategory',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$subCategoryId'],
              },
            },
          },
          {
            $project: {
              subCategoryName: 1,
              status: 1,
            },
          },
        ],
        as: 'subCategory',
      },
    })

    // Brand Lookup
    pipeline.push({
      $lookup: {
        from: 'brandminekarts',
        let: {
          brandId: '$brand',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$brandId'],
              },
            },
          },
          {
            $project: {
              brandName: 1,
              brandLogo: 1,
              status: 1,
            },
          },
        ],
        as: 'brand',
      },
    })

    // Convert Lookup Arrays to Objects
    pipeline.push(
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
      {
        $unwind: {
          path: '$brand',
          preserveNullAndEmptyArrays: true,
        },
      },
    )

    // In Stock Only:
    // Active Product + Active Category + Stock > 0
    if (stock === 'true') {
      pipeline.push({
        $match: {
          status: 'Active',
          'category.status': 'Active',
          stock: {
            $gt: 0,
          },
        },
      })
    }

    // Remove effectivePrice from Response
    pipeline.push({
      $project: {
        productName: 1,
        slug: 1,
        description: 1,

        category: 1,
        subCategory: 1,
        brand: 1,

        images: 1,
        offerImage: 1,
        sizes: 1,

        price: 1,
        discount: 1,
        discountPrice: 1,

        status: 1,
        isOffer: 1,

        rating: 1,
        stock: 1,
        soldCount: 1,

        warranty: 1,
        warrantyDuration: 1,
        warrantyType: 1,
        returnPolicy: 1,
        deliveryInfo: 1,

        createdAt: 1,
        updatedAt: 1,
      },
    })

    // Execute Query
    const products = await Product.aggregate(pipeline)

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.error('Filter Products Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to filter products',
      error: error.message,
    })
  }
})

// ! Get Products By Category => CategoryProducts.jsx
router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      })
    }

    const category = await Category.findById(categoryId).select('categoryName categoryImage status')

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    // Inactive category na badha products batavva
    const products = await Product.find({
      category: categoryId,
    })
      .populate('category', 'categoryName categoryImage status')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      categoryStatus: category.status,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.error('GET Category Products Error:', error)

    return res.status(500).json({
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

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      })
    }

    const category = await Category.findById(categoryId).select('status')

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    const decodedName = decodeURIComponent(subCategoryName)
    const escapedName = decodedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

    const subCategory = await SubCategory.findOne({
      subCategoryName: {
        $regex: `^${escapedName}$`,
        $options: 'i',
      },
    })

    if (!subCategory) {
      return res.status(200).json({
        success: true,
        categoryStatus: category.status,
        count: 0,
        data: [],
      })
    }

    const products = await Product.find({
      category: categoryId,
      subCategory: subCategory._id,
    })
      .populate('category', 'categoryName categoryImage status')
      .populate('subCategory', 'subCategoryName')
      .populate('brand', 'brandName brandLogo')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      categoryStatus: category.status,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.error('GET SubCategory Products Error:', error)

    return res.status(500).json({
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

    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid brand ID',
      })
    }

    const products = await Product.find({
      brand: brandId,
    })
      .populate('category', 'categoryName status')
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
      stock: { $gt: 0 },
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
      .populate('category', 'categoryName status')
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
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID',
      })
    }

    const data = await Product.findById(id).populate('category', 'categoryName categoryImage status').populate('subCategory', 'subCategoryName').populate('brand', 'brandName')

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    return res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('GET Product Error:', error)

    return res.status(500).json({
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
