const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')
const Address = require('../model/address')

// Add New Address
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user

    const { fullName, phone, addressLine, city, state, pincode, landmark, addressType } = req.body

    const existingAddressCount = await Address.countDocuments({
      userId,
    })

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
      isDefault: existingAddressCount === 0,
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

// Select Default Address
router.put('/:id/default', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params

    // 1. User ના બધા addresses false કરો
    await Address.updateMany(
      { userId },
      {
        $set: {
          isDefault: false,
        },
      },
    )

    // 2. Selected address true કરો
    const selectedAddress = await Address.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        $set: {
          isDefault: true,
        },
      },
      {
        new: true,
      },
    )

    if (!selectedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Default address selected successfully',
      data: selectedAddress,
    })
  } catch (error) {
    console.log('Select Default Address Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! Update Address
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params

    const { fullName, phone, addressLine, city, state, pincode, landmark, addressType } = req.body

    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        $set: {
          fullName,
          phone,
          addressLine,
          city,
          state,
          pincode,
          landmark,
          addressType,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress,
    })
  } catch (error) {
    console.log('Update Address Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

// ! Delete Address
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user
    const { id } = req.params

    const deletedAddress = await Address.findOneAndDelete({
      _id: id,
      userId,
    })

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      })
    }

    // જો delete થયેલ address default હતો,
    // તો બીજા address ને default બનાવો
    if (deletedAddress.isDefault) {
      const nextAddress = await Address.findOne({
        userId,
      }).sort({
        createdAt: -1,
      })

      if (nextAddress) {
        await Address.findByIdAndUpdate(nextAddress._id, {
          $set: {
            isDefault: true,
          },
        })
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: deletedAddress,
    })
  } catch (error) {
    console.log('Delete Address Error:', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    })
  }
})

module.exports = router
