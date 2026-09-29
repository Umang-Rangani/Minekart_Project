const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const AdminNotification = require('../model/AdminNotification')

const router = express.Router()

// GET ALL ADMIN NOTIFICATIONS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await AdminNotification.find().populate('orderId', '_id orderId orderStatus totalAmount').populate('userId', '_id name email').sort({ createdAt: -1 }).limit(50)

    const unreadCount = await AdminNotification.countDocuments({
      isRead: false,
    })

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    })
  } catch (error) {
    console.error('Get Admin Notifications Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to get admin notifications',
    })
  }
})

// GET UNREAD COUNT
router.get('/unread-count', authMiddleware, async (req, res) => {
  try {
    const unreadCount = await AdminNotification.countDocuments({
      isRead: false,
    })

    return res.status(200).json({
      success: true,
      unreadCount,
    })
  } catch (error) {
    console.error('Get Admin Unread Count Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to get unread notification count',
    })
  }
})

// MARK SINGLE NOTIFICATION AS READ
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const notification = await AdminNotification.findById(req.params.id)

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
    console.error('Mark Admin Notification Read Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to mark notification as read',
    })
  }
})

// MARK ALL AS READ
router.patch('/read-all', authMiddleware, async (req, res) => {
  try {
    await AdminNotification.updateMany(
      {
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
    console.error('Mark All Admin Notifications Read Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to mark all notifications as read',
    })
  }
})

// DELETE NOTIFICATION
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndDelete(req.params.id)

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
    console.error('Delete Admin Notification Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to delete notification',
    })
  }
})

module.exports = router
