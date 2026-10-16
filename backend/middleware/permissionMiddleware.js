const User = require('../model/users')
const { hasPermission, isAdminRole } = require('../utils/permission')

/**
 * Requires authMiddleware first.
 * Loads user from DB and checks section + action permission.
 * SuperAdmin always passes.
 */
const requirePermission = (section, action) => {
  return async (req, res, next) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        })
      }

      const user = await User.findById(req.user.userId).select('-password')

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        })
      }

      if (user.status === 'Inactive') {
        return res.status(403).json({
          success: false,
          message: 'Your account is inactive',
        })
      }

      if (!isAdminRole(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        })
      }

      if (!hasPermission(user, section, action)) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied',
        })
      }

      req.userDoc = user
      next()
    } catch (error) {
      console.error('requirePermission error:', error)
      return res.status(500).json({
        success: false,
        message: 'Authorization failed',
      })
    }
  }
}

/** Any admin-panel role (including SuperAdmin) */
const requireAdminPanel = async (req, res, next) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    const user = await User.findById(req.user.userId).select('-password')

    if (!user || user.status === 'Inactive' || !isAdminRole(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    req.userDoc = user
    next()
  } catch (error) {
    console.error('requireAdminPanel error:', error)
    return res.status(500).json({
      success: false,
      message: 'Authorization failed',
    })
  }
}

module.exports = {
  requirePermission,
  requireAdminPanel,
}
