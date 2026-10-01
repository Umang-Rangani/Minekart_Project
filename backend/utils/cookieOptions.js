const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL)

// Same options must be used for set and clear, otherwise the browser keeps the old cookie
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
}

const AUTH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000

module.exports = { authCookieOptions, AUTH_COOKIE_MAX_AGE }
