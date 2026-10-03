const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../model/users')
const { sendEmail } = require('../utils/sendEmail')
const { welcomeEmail } = require('../utils/emailTemplates/welcomeEmail')
const { authCookieOptions, AUTH_COOKIE_MAX_AGE } = require('../utils/cookieOptions')

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
    const { avatar, name, email, password, phone } = req.body

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
    })

    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie('token', token, {
      ...authCookieOptions,
      maxAge: AUTH_COOKIE_MAX_AGE,
    })

    const html = welcomeEmail(newUser.name)

    try {
      await sendEmail({
        to: email.toLowerCase(),
        subject: 'Welcome to MineKart 🎉',
        html,
      })
    } catch (emailError) {
      console.error('⚠️ Welcome email failed:', emailError.message)
    }

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

    // Account not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
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
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      },
    )

    // Store token in cookie
    res.cookie('token', token, {
      ...authCookieOptions,
      maxAge: AUTH_COOKIE_MAX_AGE,
    })

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
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
    res.clearCookie('token', authCookieOptions)

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

// ! Update Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, avatar, password } = req.body

    // Required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      })
    }

    // Find logged-in user
    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Check email already used by another user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: req.user.userId },
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    // Update basic profile details
    user.name = name.trim()
    user.email = email.toLowerCase().trim()
    user.phone = phone?.trim() || ''
    user.avatar = avatar || ''

    // Update password only if provided
    if (password && password.trim()) {
      user.password = await bcrypt.hash(password.trim(), 10)
    }

    await user.save()

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password')

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Update Profile Error:', error)

    // Duplicate email safety
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    })
  }
})

// ! Admin Activate / Deactivate
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

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

// ! Delete User - Admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    await User.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Delete User Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    })
  }
})

// router.delete('/', async (req, res) => {
//   try {
//     const data = await User.deleteMany()
//     res.status(200).json(data)
//   } catch (error) {
//     res.status(500).json(error)
//   }
// })

module.exports = router
