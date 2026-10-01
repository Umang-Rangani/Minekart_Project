const Pusher = require('pusher')

const ADMIN_CHANNEL = 'private-admin'

const getUserChannel = (userId) => `private-user-${userId.toString()}`

let pusherClient = null

const isRealtimeEnabled = () => Boolean(process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET && process.env.PUSHER_CLUSTER)

const getPusher = () => {
  if (!isRealtimeEnabled()) {
    return null
  }

  if (!pusherClient) {
    pusherClient = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    })
  }

  return pusherClient
}

// Must be awaited before the response is sent, serverless functions may freeze right after
const publish = async (channel, event, data) => {
  const pusher = getPusher()

  if (!pusher) {
    return
  }

  try {
    await pusher.trigger(channel, event, JSON.parse(JSON.stringify(data)))
  } catch (error) {
    console.error(`Realtime publish failed (${channel} / ${event}):`, error.message)
  }
}

module.exports = {
  ADMIN_CHANNEL,
  getUserChannel,
  getPusher,
  isRealtimeEnabled,
  publish,
}
