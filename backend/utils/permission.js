const { ROLES, ADMIN_ROLES, ROLE_DEFAULT_PERMISSIONS, ROLE_HIERARCHY } = require('../constants/permission')

function isSuperAdmin(userOrRole) {
  const role = typeof userOrRole === 'string' ? userOrRole : userOrRole?.role
  return role === ROLES.SUPER_ADMIN
}

function isAdminRole(userOrRole) {
  const role = typeof userOrRole === 'string' ? userOrRole : userOrRole?.role
  return ADMIN_ROLES.includes(role)
}

function clonePermissions(map) {
  if (!map || typeof map !== 'object') return {}
  const out = {}
  for (const [section, actions] of Object.entries(map)) {
    out[section] = Array.isArray(actions) ? [...actions] : []
  }
  return out
}

/** Defaults for a role, or empty for SuperAdmin / unknown */
function getRoleDefaultPermissions(role) {
  if (!role || role === ROLES.SUPER_ADMIN || role === ROLES.USER) return {}
  return clonePermissions(ROLE_DEFAULT_PERMISSIONS[role] || {})
}

/**
 * Effective permissions for gating.
 * SuperAdmin → null (bypass).
 * If admin_permissions has any keys → use that map (customized).
 * Else → role defaults.
 */
function getEffectivePermissions(user) {
  if (!user) return {}
  if (isSuperAdmin(user)) return null

  const stored = user.admin_permissions
  const hasCustom = stored && typeof stored === 'object' && Object.keys(stored).length > 0

  if (hasCustom) {
    return clonePermissions(stored instanceof Map ? Object.fromEntries(stored) : stored)
  }

  return getRoleDefaultPermissions(user.role)
}

function hasPermission(user, section, action) {
  if (!user) return false
  if (isSuperAdmin(user)) return true

  const perms = getEffectivePermissions(user)
  // null only for SuperAdmin (handled above). Missing map → deny.
  if (!perms || typeof perms !== 'object') return false

  const list = perms[section] || []
  return list.includes(action)
}

function hasAnySectionPermission(user, section) {
  if (!user) return false
  if (isSuperAdmin(user)) return true

  const perms = getEffectivePermissions(user)
  if (!perms || typeof perms !== 'object') return false

  return (perms[section] || []).length > 0
}

function roleRank(role) {
  const idx = ROLE_HIERARCHY.indexOf(role)
  return idx === -1 ? -1 : idx
}

/** Actor can only assign permissions they themselves have (SuperAdmin: any). */
function canGrantPermission(actor, section, action) {
  if (isSuperAdmin(actor)) return true
  return hasPermission(actor, section, action)
}

module.exports = {
  isSuperAdmin,
  isAdminRole,
  getRoleDefaultPermissions,
  getEffectivePermissions,
  hasPermission,
  hasAnySectionPermission,
  roleRank,
  canGrantPermission,
  clonePermissions,
}
