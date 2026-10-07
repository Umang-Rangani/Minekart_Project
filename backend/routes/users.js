const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const crypto = require('crypto')
const PasswordReset = require('../model/passwordReset')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../model/users')

const { sendEmail } = require('../utils/sendEmail')
const { welcomeEmail } = require('../utils/emailTemplates/welcomeEmail')
const { passwordResetOtpEmail } = require('../utils/emailTemplates/passwordResetOtpEmail')
const { passwordResetSuccessEmail } = require('../utils/emailTemplates/passwordResetSuccessEmail')

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
      console.error('⚠️ Welcome email failed:', emailError)
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
      message: `Server error ${error}`,
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
    const { name, email, phone, avatar } = req.body

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      })
    }

    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

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

    user.name = name.trim()
    user.email = email.toLowerCase().trim()
    user.phone = phone?.trim() || ''
    user.avatar = avatar || ''

    await user.save()

    const updatedUser = await User.findById(user._id).select('-password')

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Profile Update Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to update profile',
    })
  }
})

// ! Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim()

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      })
    }

    const user = await User.findOne({
      email,
    })

    // Same response whether account exists or not
    // to prevent email/account enumeration.
    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'No account found with this email. Please create an account first.',
      })
    }

    // Remove previous reset requests
    await PasswordReset.deleteMany({
      email,
    })

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString()

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10)

    // OTP valid for 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await PasswordReset.create({
      userId: user._id,
      email,
      otpHash,
      expiresAt,
    })

    const html = passwordResetOtpEmail(user.name, otp)

    try {
      await sendEmail({
        to: email,
        subject: 'MineKart Password Reset OTP',
        html,
      })
    } catch (emailError) {
      console.error('⚠️ Password reset OTP email failed:', emailError)

      // Remove reset record if email could not be sent.
      await PasswordReset.deleteMany({
        email,
      })

      return res.status(500).json({
        success: false,
        message: 'Unable to send OTP. Please try again.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    })
  } catch (error) {
    console.error('Forgot Password Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to process password reset request',
    })
  }
})

// ! Forgot Password - Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim()
    const otp = req.body.otp?.trim()

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      })
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be 6 digits',
      })
    }

    const resetRequest = await PasswordReset.findOne({
      email,
    })

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or invalid. Please request a new OTP.',
      })
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      })

      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new OTP.',
      })
    }

    if (resetRequest.attempts >= 5) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      })

      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.',
      })
    }

    const isOtpValid = await bcrypt.compare(otp, resetRequest.otpHash)

    if (!isOtpValid) {
      resetRequest.attempts += 1

      await resetRequest.save()

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${5 - resetRequest.attempts} attempts remaining.`,
      })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex')

    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    resetRequest.resetTokenHash = resetTokenHash
    resetRequest.verifiedAt = new Date()

    await resetRequest.save()

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,
    })
  } catch (error) {
    console.error('Verify OTP Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to verify OTP',
    })
  }
})

// ! Forgot Password - Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim()
    const { resetToken, password, confirmPassword } = req.body

    if (!email || !resetToken || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      })
    }

    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex')

    const resetRequest = await PasswordReset.findOne({
      email,
      resetTokenHash,
    })

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset request',
      })
    }

    if (!resetRequest.verifiedAt) {
      return res.status(400).json({
        success: false,
        message: 'Please verify OTP first',
      })
    }

    if (resetRequest.expiresAt < new Date()) {
      await PasswordReset.deleteOne({
        _id: resetRequest._id,
      })

      return res.status(400).json({
        success: false,
        message: 'Reset request expired. Please start again.',
      })
    }

    const user = await User.findById(resetRequest.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user.password = hashedPassword

    await user.save()

    // Delete reset request after successful reset
    await PasswordReset.deleteOne({
      _id: resetRequest._id,
    })

    // Password reset confirmation email
    const html = passwordResetSuccessEmail(user.name)
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'MineKart Password Reset Successful',
        html,
      })
    } catch (emailError) {
      console.error('⚠️ Password reset success email failed:', emailError)
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    })
  } catch (error) {
    console.error('Reset Password Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to reset password',
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
