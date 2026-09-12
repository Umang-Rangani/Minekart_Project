const express = require('express')

const Brand = require('../model/brand')

const router = express.Router()


router.get('/', async (req, res) => {
  try {
    const data = await Brand.find().sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.log('Get brands error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get brands',
    })
  }
})


router.get('/:id', async (req, res) => {
  try {
    const data = await Brand.findById(req.params.id)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      })
    }

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.log('Get single brand error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get brand',
    })
  }
})


router.post('/', async (req, res) => {
  try {
    const { brandName, brandLogo, description, status } = req.body

    // ! Required validation
    if (!brandName) {
      return res.status(400).json({
        success: false,
        message: 'Brand name is required',
      })
    }

    // ! Duplicate check
    const existingBrand = await Brand.findOne({
      brandName: brandName.trim(),
    })

    if (existingBrand) {
      return res.status(409).json({
        success: false,
        message: 'Brand already exists',
      })
    }

    const data = await Brand.create({
      brandName,
      brandLogo: brandLogo || '',
      description: description || '',
      status: status || 'Active',
    })

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data,
    })
  } catch (error) {
    console.log('Create brand error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to create brand',
    })
  }
})


router.put('/:id', async (req, res) => {
  try {
    const { brandName, brandLogo, description, status } = req.body

    // ! Check brand
    const existingBrand = await Brand.findById(req.params.id)

    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      })
    }

    // ! Duplicate brand name check
    if (brandName) {
      const duplicateBrand = await Brand.findOne({
        brandName: brandName.trim(),
        _id: { $ne: req.params.id },
      })

      if (duplicateBrand) {
        return res.status(409).json({
          success: false,
          message: 'Brand already exists',
        })
      }
    }

    const data = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        brandName,
        brandLogo,
        description,
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    )

    res.status(200).json({
      success: true,
      message: 'Brand updated successfully',
      data,
    })
  } catch (error) {
    console.log('Update brand error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to update brand',
    })
  }
})


router.delete('/:id', async (req, res) => {
  try {
    const data = await Brand.findByIdAndDelete(req.params.id)

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Brand not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Brand deleted successfully',
      data,
    })
  } catch (error) {
    console.log('Delete brand error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to delete brand',
    })
  }
})

module.exports = router
