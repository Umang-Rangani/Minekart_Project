import { ROLES, ADMIN_ROLES, ROLE_DEFAULT_PERMISSIONS, ROLE_HIERARCHY } from '../constants/permission'

export function isSuperAdmin(userOrRole) {
  const role = typeof userOrRole === 'string' ? userOrRole : userOrRole?.role
  return role === ROLES.SUPER_ADMIN
}

export function isAdminRole(userOrRole) {
  const role = typeof userOrRole === 'string' ? userOrRole : userOrRole?.role
  return ADMIN_ROLES.includes(role)
}

function clonePermissions(map) {
  if (!map || typeof map !== 'object' || Array.isArray(map)) return {}
  const out = {}
  for (const [section, actions] of Object.entries(map)) {
    out[section] = Array.isArray(actions) ? [...actions] : []
  }
  return out
}

export function getRoleDefaultPermissions(role) {
  if (!role || role === ROLES.SUPER_ADMIN || role === ROLES.USER) return {}
  return clonePermissions(ROLE_DEFAULT_PERMISSIONS[role] || {})
}

/**
 * Prefer server `effective_permissions` (computed from admin_permissions / role defaults).
 * SuperAdmin → null (bypass).
 * Else: effective_permissions → admin_permissions → role defaults.
 */
export function getEffectivePermissions(user) {
  if (!user) return {}
  if (isSuperAdmin(user)) return null

  // API already computed this from admin_permissions
  if (user.effective_permissions && typeof user.effective_permissions === 'object' && !Array.isArray(user.effective_permissions)) {
    return clonePermissions(user.effective_permissions)
  }

  const stored = user.admin_permissions
  const hasCustom = stored && typeof stored === 'object' && !Array.isArray(stored) && Object.keys(stored).length > 0

  if (hasCustom) {
    return clonePermissions(stored)
  }

  return getRoleDefaultPermissions(user.role)
}

export function hasPermission(user, section, action) {
  if (!user) return false
  if (isSuperAdmin(user)) return true

  const perms = getEffectivePermissions(user)
  // null only for SuperAdmin (handled above). Missing map → deny.
  if (!perms || typeof perms !== 'object') return false

  const list = perms[section] || []
  return list.includes(action)
}

export function hasAnySectionPermission(user, section) {
  if (!user) return false
  if (isSuperAdmin(user)) return true

  const perms = getEffectivePermissions(user)
  if (!perms || typeof perms !== 'object') return false

  return (perms[section] || []).length > 0
}

export function roleRank(role) {
  const idx = ROLE_HIERARCHY.indexOf(role)
  return idx === -1 ? -1 : idx
}

export function canGrantPermission(actor, section, action) {
  if (isSuperAdmin(actor)) return true
  return hasPermission(actor, section, action)
}
