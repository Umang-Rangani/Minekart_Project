const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const Notification = require('../model/notification')

const router = express.Router()

// GET ALL NOTIFICATIONS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
    })
      .populate('orderId', '_id orderId orderStatus totalAmount')
      .sort({ createdAt: -1 })
      .limit(50)

    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    })

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Get Notifications Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to get notifications',
    })
  }
})

// GET UNREAD COUNT
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    })

    return res.status(200).json({
      success: true,
      unreadCount,
    })
  } catch (error) {
    console.error('Get Unread Notification Count Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to get unread notification count',
    })
  }
})

// MARK SINGLE NOTIFICATION AS READ
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      })
    }

    if (!notification.isRead) {
      notification.isRead = true
      notification.readAt = new Date()

      await notification.save()
    }

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    })
  } catch (error) {
    console.error('Mark Notification Read Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to mark notification as read',
    })
  }
})

// MARK ALL NOTIFICATIONS AS READ
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
    )

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    })
  } catch (error) {
    console.error('Mark All Notifications Read Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to mark all notifications as read',
    })
  }
})

// DELETE NOTIFICATION
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    })
  } catch (error) {
    console.error('Delete Notification Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete notification',
    })
  }
})

module.exports = router
