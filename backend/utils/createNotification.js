const Notification = require('../model/notification')

const createNotification = async ({ userId, type, title, message, orderId = null, metadata = {}, io = null }) => {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    orderId,
    metadata,
  })

  if (io) {
    const populatedNotification = await Notification.findById(notification._id).populate('orderId', '_id orderId orderStatus totalAmount')

    io.to(`user:${userId.toString()}`).emit('notification:new', populatedNotification)

    return populatedNotification
  }

  return notification
}

module.exports = createNotification
