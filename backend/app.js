var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var mongoose = require('mongoose')
var dotenv = require('dotenv')

dotenv.config()

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

const adminOrderRoutes = require('./routes/adminOrderRoutes')
const adminDashboard = require('./routes/adminDashboard')
const adminNotification = require('./routes/adminNotification')
const notification = require('./routes/notification')

var app = express()

console.log('EMAIL_USER:', process.env.EMAIL_USER)
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS)
console.log('EMAIL_BCC:', process.env.EMAIL_BCC)
console.log('ALLOWED_ORIGIN:', process.env.ALLOWED_ORIGIN)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))

app.use(
  express.json({
    limit: '10mb',
  }),
)



// ${import.meta.env.VITE_API_URL}

app.use(
  express.urlencoded({
    extended: false,
    limit: '10mb',
  }),
)

app.use(cookieParser())

const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((origin) => origin.trim())
  : []

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true)
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads')),
)

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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })

app.use(function (req, res, next) {
  next(createError(404))
})

app.use(function (err, req, res, next) {
  console.error(err)

  res.locals.message = err.message

  res.locals.error =
    req.app.get('env') === 'development'
      ? err
      : {}

  res.status(err.status || 500)

  res.render('error')
})

module.exports = app



// ${import.meta.env.VITE_API_URL}
// http://localhost:3000