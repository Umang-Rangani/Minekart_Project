const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../model/users')

/* GET users listing. */

// ! check API
router.get('/', async (req, res) => {
  try {
    const data = await User.find().select('-password')

    res.status(200).json({
      success: true,
      data,
    })
  } catch (error) {
    console.error('Get Users Error:', error)

    res.status(500).json({
      success: false,
      message: 'Failed to get users',
    })
  }
})

// ! signup
router.post('/register', async (req, res) => {
  try {
    const { avatar, name, email, password, phone, address, city, pincode } = req.body

    // Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required',
      })
    }

    // Check existing email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser = await User.create({
      avatar,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      address,
      city,
      pincode,
    })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    })
  } catch (error) {
    console.error('Signup Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ! login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      })
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check account status
    if (user.status === 'Inactive') {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive',
      })
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    // Store token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
        status: user.status,
      },
    })
  } catch (error) {
    console.log('Login Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// ! logout
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    })

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    })
  } catch (error) {
    console.log('Logout Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Logout failed',
    })
  }
})

// ! profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // console.log("req.user.userId", req.user.userId);
    const user = await User.findById(req.user.userId).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    console.log('Profile Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
})

// admin users mte inActive krva mate
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Status validation
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      })
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      },
    ).select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: `User ${status.toLowerCase()} successfully`,
      user,
    })
  } catch (error) {
    console.error('Update user status error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to update user status',
    })
  }
})

router.delete('/', async (req, res) => {
  try {
    const data = await User.deleteMany()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router
