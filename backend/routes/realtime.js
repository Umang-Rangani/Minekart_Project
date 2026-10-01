const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')
const { ADMIN_CHANNEL, getUserChannel, getPusher, isRealtimeEnabled } = require('../utils/realtime')

const router = express.Router()

// ! public realtime config for the frontend
router.get('/config', (req, res) => {
  if (!isRealtimeEnabled()) {
    return res.status(200).json({
      success: true,
      enabled: false,
    })
  }

  return res.status(200).json({
    success: true,
    enabled: true,
    key: process.env.PUSHER_KEY,
    cluster: process.env.PUSHER_CLUSTER,
  })
})

// ! authorize private channel subscription
router.post('/auth', authMiddleware, (req, res) => {
  const pusher = getPusher()

  if (!pusher) {
    return res.status(503).json({
      success: false,
      message: 'Realtime is not configured',
    })
  }

  const { socket_id: socketId, channel_name: channelName } = req.body

  if (!socketId || !channelName) {
    return res.status(400).json({
      success: false,
      message: 'socket_id and channel_name are required',
    })
  }

  const isOwnChannel = channelName === getUserChannel(req.user.userId)
  const isAdminChannel = channelName === ADMIN_CHANNEL && req.user.role === 'Admin'

  if (!isOwnChannel && !isAdminChannel) {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    })
  }

  return res.status(200).json(pusher.authorizeChannel(socketId, channelName))
})

module.exports = router
