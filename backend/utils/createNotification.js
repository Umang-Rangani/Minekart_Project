const Notification = require('../model/notification')
const { getUserChannel, isRealtimeEnabled, publish } = require('./realtime')

const createNotification = async ({ userId, type, title, message, orderId = null, metadata = {} }) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    orderId,
    metadata,
  })

  if (isRealtimeEnabled()) {
    const populatedNotification = await Notification.findById(notification._id).populate('orderId', '_id orderId orderStatus totalAmount')

    await publish(getUserChannel(userId), 'notification-new', populatedNotification)

    return populatedNotification
  }

  return notification
}

module.exports = createNotification
