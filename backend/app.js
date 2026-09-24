var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
const mongoose = require('mongoose')
var dotenv = require('dotenv')

var indexRouter = require('./routes/index')
var uploadRouter = require('./routes/upload')
var usersRouter = require('./routes/users')
var categoryRouter = require('./routes/category')
var subcategoryRouter = require('./routes/subcategory')
var brandRouter = require('./routes/brand')

var productRouter = require('./routes/product')
var cartRouter = require('./routes/cart')
var addressRouter = require('./routes/address')
var paymentRouter = require('./routes/payment')
var orderRouter = require('./routes/order')
const adminOrderRoutes = require('./routes/adminOrderRoutes')
const adminDashboard = require('./routes/adminDashboard')

dotenv.config()
var app = express()



console.log('EMAIL_USER:', process.env.EMAIL_USER)
console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS)
console.log('EMAIL_BCC:', process.env.EMAIL_BCC)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  }),
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

app.use('/admin/orders', adminOrderRoutes)
app.use('/admin/dashboard', adminDashboard)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('is db connected'))
  .catch((err) => console.log(err))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
