const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required',
    })
  }

  if (!['Admin', 'SuperAdmin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    })
  }

  next()
}

module.exports = adminMiddleware
