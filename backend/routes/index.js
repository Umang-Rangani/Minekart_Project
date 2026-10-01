var express = require('express')

var router = express.Router()

router.get('/', function(req, res) {
  res.json({
    success: true,
    message: 'MineKart API is running',
  })
})

module.exports = router