var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var dotenv = require('dotenv')

dotenv.config()

var connectDB = require('./utils/db')

var indexRouter = require('./routes/index')
var uploadRouter = require('./routes/upload')
var usersRouter = require('./routes/users')
var categoryRouter = require('./routes/category')
var subcategoryRouter = require('./routes/subcategory')
var brandRouter = require('./routes/brand')
var contactRouter = require('./routes/contact')
var productRouter = require('./routes/product')
var cartRouter = require('./routes/cart')
var addressRouter = require('./routes/address')
var paymentRouter = require('./routes/payment')
var orderRouter = require('./routes/order')
var realtimeRouter = require('./routes/realtime')

const adminOrderRoutes = require('./routes/adminOrderRoutes')
const adminDashboard = require('./routes/adminDashboard')
const adminNotification = require('./routes/adminNotification')
const notification = require('./routes/notification')

var app = express()

// Vercel terminates TLS in front of the function, needed for secure cookies
app.set('trust proxy', 1)

app.use(logger(process.env.NODE_ENV === 'production' ? 'tiny' : 'dev'))

app.use(
  express.json({
    limit: '10mb',
  }),
)

app.use(
  express.urlencoded({
    extended: false,
    limit: '10mb',
  }),
)

app.use(cookieParser())

const defaultOrigins = ['http://localhost:5173', 'https://minekart.vercel.app']

const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((origin) => origin.trim().replace(/\/$/, ''))
  : defaultOrigins

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(createError(403, `Origin ${origin} is not allowed by CORS`))
    },
    credentials: true,
  }),
)

// Locally serves /uploads/*; on Vercel the public/ folder is served by the CDN instead
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error('MongoDB connection error:', error)

    res.status(503).json({
      success: false,
      message: 'Database connection failed',
    })
  }
})

app.use('/', indexRouter)

app.use('/users', usersRouter)

app.use('/category', categoryRouter)

app.use('/subcategory', subcategoryRouter)

app.use('/brand', brandRouter)

app.use('/product', productRouter)

app.use('/cart', cartRouter)

app.use('/address', addressRouter)

app.use('/payment', paymentRouter)

app.use('/order', orderRouter)

app.use('/uploads', uploadRouter)

app.use('/contact', contactRouter)

app.use('/admin/orders', adminOrderRoutes)

app.use('/admin/dashboard', adminDashboard)

app.use('/admin-notification', adminNotification)

app.use('/notification', notification)

app.use('/realtime', realtimeRouter)

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  if (!err.status || err.status >= 500) {
    console.error(err)
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

module.exports = app
