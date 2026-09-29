const AdminNotification = require("../model/AdminNotification")

const createAdminNotification = async ({ type, title, message, orderId = null, userId = null, metadata = {}, io = null }) => {
  const notification = await AdminNotification.create({
    type,
    title,
    message,
    orderId,
    userId,
    metadata,
  })

  if (io) {
    const populatedNotification = await AdminNotification.findById(notification._id).populate('orderId', '_id orderId orderStatus totalAmount').populate('userId', '_id name email')

    io.emit('admin-notification:new', populatedNotification)

    return populatedNotification
  }

  return notification
}

module.exports = createAdminNotification
