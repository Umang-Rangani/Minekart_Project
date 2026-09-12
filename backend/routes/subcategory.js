const express = require('express')
const SubCategory = require('../model/subcategory')
const router = express.Router()



router.get('/', async (req, res) => {
  try {
    const data = await SubCategory.find().populate('category', 'categoryName').sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.log('Get subcategories error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get subcategories',
      error: error.message,
    })
  }
})



router.get('/:id', async (req, res) => {
  try {
    const data = await SubCategory.findById(req.params.id).populate('category', 'categoryName')

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'SubCategory not found',
      })
    }

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.log('Get subcategory error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get subcategory',
      error: error.message,
    })
  }
})



router.post('/', async (req, res) => {
  try {
    const { subCategoryName, category, description, status } = req.body

    // ! Required validation

    if (!subCategoryName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'SubCategory name is required',
      })
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      })
    }

    // ! Duplicate check

    const existingSubCategory = await SubCategory.findOne({
      subCategoryName: subCategoryName.trim(),
      category,
    })

    if (existingSubCategory) {
      return res.status(409).json({
        success: false,
        message: 'SubCategory already exists in this category',
      })
    }

    // ! Create

    const data = await SubCategory.create({
      subCategoryName: subCategoryName.trim(),
      category,
      description: description?.trim() || '',
      status: status || 'Active',
    })

    // ! Populate category

    await data.populate('category', 'categoryName')

    res.status(201).json({
      success: true,
      message: 'SubCategory created successfully',
      data,
    })
  } catch (error) {
    console.log('Create subcategory error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create subcategory',
      error: error.message,
    })
  }
})



router.put('/:id', async (req, res) => {
  try {
    const { subCategoryName, category, description, status } = req.body

    // ! Required validation

    if (!subCategoryName?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'SubCategory name is required',
      })
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      })
    }

    // ! Check existing

    const existingSubCategory = await SubCategory.findById(req.params.id)

    if (!existingSubCategory) {
      return res.status(404).json({
        success: false,
        message: 'SubCategory not found',
      })
    }

    // ! Duplicate check
    // Current ID ne ignore karse

    const duplicate = await SubCategory.findOne({
      _id: { $ne: req.params.id },
      subCategoryName: subCategoryName.trim(),
      category,
    })

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'SubCategory already exists in this category',
      })
    }

    // ! Update

    const data = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        subCategoryName: subCategoryName.trim(),
        category,
        description: description?.trim() || '',
        status: status || 'Active',
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate('category', 'categoryName')

    res.status(200).json({
      success: true,
      message: 'SubCategory updated successfully',
      data,
    })
  } catch (error) {
    console.log('Update subcategory error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update subcategory',
      error: error.message,
    })
  }
})



router.delete('/:id', async (req, res) => {
  try {
    const data = await SubCategory.findByIdAndDelete(req.params.id)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'SubCategory not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'SubCategory deleted successfully',
      data,
    })
  } catch (error) {
    console.log('Delete subcategory error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to delete subcategory',
      error: error.message,
    })
  }
})

module.exports = router
