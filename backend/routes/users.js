const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const User = require('../model/users')
const { sendEmail } = require('../utils/sendEmail')

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

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Welcome to MineKart</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #f4f2ee;
      font-family: Arial, Helvetica, sans-serif;
      color: #292725;
    }

    .email-wrapper {
      width: 100%;
      padding: 40px 15px;
      background-color: #f4f2ee;
    }

    .email-container {
      max-width: 620px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e3ded6;
      border-radius: 16px;
      overflow: hidden;
    }

    .header {
      background-color: #6b6258;
      padding: 28px 30px;
      text-align: center;
    }

    .logo {
      color: #ffffff;
      font-size: 30px;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .tagline {
      color: #eeeae4;
      font-size: 14px;
    }

    .content {
      padding: 40px 35px;
    }

    .welcome-title {
      font-size: 28px;
      line-height: 1.3;
      color: #3f3a35;
      margin-bottom: 18px;
    }

    .text {
      font-size: 16px;
      line-height: 1.7;
      color: #5f5a55;
      margin-bottom: 18px;
    }

    .highlight-box {
      margin: 28px 0;
      padding: 20px;
      background-color: #f8f6f2;
      border: 1px solid #e3ded6;
      border-radius: 12px;
    }

    .highlight-title {
      font-size: 17px;
      font-weight: 700;
      color: #3f3a35;
      margin-bottom: 8px;
    }

    .highlight-text {
      font-size: 14px;
      line-height: 1.6;
      color: #6b6258;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .button {
      display: inline-block;
      padding: 14px 30px;
      background-color: #6b6258;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
    }

    .footer {
      padding: 24px 30px;
      background-color: #fbfaf7;
      border-top: 1px solid #e3ded6;
      text-align: center;
    }

    .footer-text {
      font-size: 13px;
      line-height: 1.6;
      color: #8a847d;
    }

    .footer-brand {
      margin-top: 8px;
      color: #6b6258;
      font-size: 14px;
      font-weight: 700;
    }

    @media only screen and (max-width: 600px) {
      .email-wrapper {
        padding: 20px 10px;
      }

      .content {
        padding: 30px 22px;
      }

      .header {
        padding: 24px 20px;
      }

      .welcome-title {
        font-size: 24px;
      }

      .text {
        font-size: 15px;
      }
    }
  </style>
</head>

<body>
  <div class="email-wrapper">

    <div class="email-container">

      <!-- Header -->
      <div class="header">
        <div class="logo">
          MineKart
        </div>

        <div class="tagline">
          Your trusted shopping destination
        </div>
      </div>

      <!-- Content -->
      <div class="content">

        <h1 class="welcome-title">
          Welcome to MineKart! 👋
        </h1>

        <p class="text">
          Thank you for creating your account with us.
          We're excited to have you as a part of the MineKart family.
        </p>

        <p class="text">
          Your account has been successfully created.
          You can now explore products, discover great deals,
          add your favorite items to your cart, and enjoy a simple
          shopping experience.
        </p>

        <!-- Highlight -->
        <div class="highlight-box">

          <div class="highlight-title">
            Your account is ready 🎉
          </div>

          <div class="highlight-text">
            Start exploring MineKart and find something you love.
            We're happy to have you shopping with us.
          </div>

        </div>

        <!-- Button -->
        <div class="button-wrapper">

          <a
            href="http://localhost:5173"
            class="button"
          >
            Start Shopping
          </a>

        </div>

        <p class="text">
          If you did not create this account, you can safely ignore
          this email or contact our support team.
        </p>

        <p class="text">
          Happy Shopping! 🛍️
        </p>

      </div>

      <!-- Footer -->
      <div class="footer">

        <div class="footer-text">
          This is an automated email. Please do not reply directly
          to this message.
        </div>

        <div class="footer-brand">
          © ${new Date().getFullYear()} MineKart
        </div>

      </div>

    </div>

  </div>
</body>
</html>
`

    await sendEmail({
      to: email.toLowerCase(),
      subject: 'Welcome to MineKart 🎉',
      html,
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
