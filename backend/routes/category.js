var express = require('express')
const mongoose = require('mongoose')
const Category = require('../model/category')
var router = express.Router()

/* GET home page. */
// router.get('/', async (req, res, next) => {
//   try {
//     const data = await Category.find()
//     res.status(200).json(data)
//   } catch (error) {
//     console.log(error)
//   }
// })


router.get('/', async (req, res) => {
  try {
    const data = await Category.find().sort({
      createdAt: 1,
    })

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.log('GET Category Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get Category',
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // ! Check ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      })
    }

    const data = await Category.findById(id)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.log('GET Single Category Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get category',
    })
  }
})


router.post('/', async (req, res) => {
  try {
    const { categoryName, categoryLucideIcons, description, status } = req.body

    // ! Validation
    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      })
    }

    // ! Check duplicate
    const existingCategory = await Category.findOne({
      categoryName: categoryName.trim(),
    })

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists',
      })
    }

    // ! Create
    const data = await Category.create({
      categoryName: categoryName.trim(),
      categoryLucideIcons: categoryLucideIcons || '',
      description: description || '',
      status: status || 'Active',
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data,
    })
  } catch (error) {
    console.log('POST Category Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create category',
    })
  }
})

// UPDATE CATEGORY
// PUT /Category/:id

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { categoryName, categoryLucideIcons, description, status } = req.body

    // ! Check ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      })
    }

    // ! Validation
    if (!categoryName || !categoryName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      })
    }

    // ! Check duplicate category name , Nu match id
    const existingCategory = await Category.findOne({
      categoryName: categoryName.trim(),
      _id: { $ne: id },
    })

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists',
      })
    }

    // ! Update
    const data = await Category.findByIdAndUpdate(
      id,
      {
        categoryName: categoryName.trim(),
        categoryLucideIcons: categoryLucideIcons || '',
        description: description || '',
        status: status || 'Active',
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data,
    })
  } catch (error) {
    console.log('PUT Category Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update category',
    })
  }
})


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    // ! Check ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      })
    }

    const data = await Category.findByIdAndDelete(id)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data,
    })
  } catch (error) {
    console.log('DELETE Category Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to delete category',
    })
  }
})

module.exports = router
