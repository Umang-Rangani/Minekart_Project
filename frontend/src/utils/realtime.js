import Pusher from 'pusher-js'
import { axiosInstance } from '../config/axiosConfig'

export const POLL_INTERVAL = 20000

export const getUserChannel = (userId) => `private-user-${userId}`

export const ADMIN_CHANNEL = 'private-admin'

let clientPromise = null

const createClient = async () => {
  try {
    const { data } = await axiosInstance.get('/realtime/config')

    if (!data?.enabled) {
      return null
    }

    return new Pusher(data.key, {
      cluster: data.cluster,
      channelAuthorization: {
        // Goes through axios so the auth cookie is sent the same way as every other API call
        customHandler: async ({ socketId, channelName }, callback) => {
          try {
            const response = await axiosInstance.post('/realtime/auth', {
              socket_id: socketId,
              channel_name: channelName,
            })

            callback(null, response.data)
          } catch (error) {
            callback(error, null)
          }
        },
      },
    })
  } catch (error) {
    console.error('Realtime config error:', error.response?.data || error.message)

    clientPromise = null

    return null
  }
}

const getClient = () => {
  if (!clientPromise) {
    clientPromise = createClient()
  }

  return clientPromise
}

// Resolves to an unsubscribe function, or null when realtime is unavailable and the caller should poll instead
export const subscribeToChannel = async (channelName, eventName, handler) => {
  const client = await getClient()

  if (!client) {
    return null
  }

  const channel = client.subscribe(channelName)

  channel.bind(eventName, handler)

  return () => {
    channel.unbind(eventName, handler)
    client.unsubscribe(channelName)
  }
}
