const AdminNotification = require('../model/adminNotification')
const { ADMIN_CHANNEL, isRealtimeEnabled, publish } = require('./realtime')

const createAdminNotification = async ({ type, title, message, orderId = null, userId = null, metadata = {} }) => {
  const notification = await AdminNotification.create({
    type,
    title,
    message,
    orderId,
    userId,
    metadata,
  })

  if (isRealtimeEnabled()) {
    const populatedNotification = await AdminNotification.findById(notification._id).populate('orderId', '_id orderId orderStatus totalAmount').populate('userId', '_id name email')

    await publish(ADMIN_CHANNEL, 'admin-notification-new', populatedNotification)

    return populatedNotification
  }

  return notification
}

module.exports = createAdminNotification
