const mongoose = require('mongoose')

// Serverless instances are reused between requests, so the connection is cached on the global object
let cached = global.mongooseConnection

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null }
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((connection) => {
        console.log('MongoDB connected successfully')
        return connection
      })
      .catch((error) => {
        cached.promise = null
        throw error
      })
  }

  cached.conn = await cached.promise

  return cached.conn
}

module.exports = connectDB
