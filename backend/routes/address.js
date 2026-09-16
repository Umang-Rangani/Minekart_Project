const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Address = require('../model/address')

// Add New Address
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { fullName, phone, addressLine, city, state, pincode, landmark, addressType } = req.body

    const address = await Address.create({
      userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
      landmark,
      addressType,
      isDefault: false,
    })

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: address,
    })
  } catch (error) {
    console.log('Add Address Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// Get All Addresses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const addresses = await Address.find({ userId }).sort({
      isDefault: -1,
      createdAt: -1,
    })

    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: addresses,
    })
  } catch (error) {
    console.log('Get Addresses Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// Get Default Address
router.get('/default', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const address = await Address.findOne({
      userId,
      isDefault: true,
    })

    res.status(200).json({
      success: true,
      message: address ? 'Default address fetched successfully' : 'Default address not found',
      data: address,
    })
  } catch (error) {
    console.log('Get Default Address Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
