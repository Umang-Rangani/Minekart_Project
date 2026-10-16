import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useMemo, useState } from 'react'
import { Search, Users, UserCheck, UserX, Mail, Phone, X, ChevronLeft, ChevronRight, ArrowUpDown, Plus, Shield, Trash2 } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'
import toast from 'react-hot-toast'
import AdminTrashBox from './AdminTrashBox'
import { useUser } from '../context/userProvider'
import { ACTIONS, EMPLOYEE_ROLES, ROLES, SECTION_KEYS } from '../constants/permission'
import { canGrantPermission, getEffectivePermissions, getRoleDefaultPermissions, hasPermission, isSuperAdmin } from '../lib/permission'

const ALL_ACTION_ENTRIES = Object.entries(ACTIONS).flatMap(([section, actions]) =>
  Object.entries(actions).map(([key, value]) => ({
    section,
    key,
    value,
  })),
)

export default function AdminUsers() {
  const { user: currentUser, getCurrentUser } = useUser()

  const canCreateEmployee = hasPermission(currentUser, SECTION_KEYS.User, ACTIONS.User.CREATE)
  const canManagePermissions = hasPermission(currentUser, SECTION_KEYS.User, ACTIONS.User.MANAGE_PERMISSIONS)
  const canUpdateStatus = hasPermission(currentUser, SECTION_KEYS.User, ACTIONS.User.UPDATE_STATUS)
  const canDeleteUser = hasPermission(currentUser, SECTION_KEYS.User, ACTIONS.User.DELETE)

  

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminUsersSearch') || ''
  })

  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem('adminUsersSort') || 'newest'
  })

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleteProcessing, setDeleteProcessing] = useState(false)

  const [createOpen, setCreateOpen] = useState(false)
  const [createSaving, setCreateSaving] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: ROLES.SUPPORT,
  })

  const [permOpen, setPermOpen] = useState(false)
  const [permSaving, setPermSaving] = useState(false)
  const [permTarget, setPermTarget] = useState(null)
  const [permMap, setPermMap] = useState({})

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const grantableActions = useMemo(() => {
    if (isSuperAdmin(currentUser)) return ALL_ACTION_ENTRIES
    return ALL_ACTION_ENTRIES.filter((entry) => canGrantPermission(currentUser, entry.section, entry.value))
  }, [currentUser])

  // Get all users
  const getUsers = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/users')

      setUsers(res.data.data || [])
    } catch (error) {
      console.error('Get users error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUsers()
  }, [])

  // Update user status
  const updateUserStatus = async (userId, status) => {
    try {
      const res = await axiosInstance.put(`/users/${userId}`, {
        status,
      })

      if (res.data.success) {
        setUsers((prev) =>
          prev.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  status,
                }
              : user,
          ),
        )

        toast.success(status === 'Active' ? 'User activated successfully' : 'User deactivated successfully')
      }
    } catch (error) {
      console.error('Update user status error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to update user status')
    }
  }

  // Search
  const handleSearch = (value) => {
    setSearch(value)

    localStorage.setItem('adminUsersSearch', value)

    setCurrentPage(1)
  }

  // Clear search
  const clearSearch = () => {
    setSearch('')

    localStorage.removeItem('adminUsersSearch')

    setCurrentPage(1)
  }

  // ! Filter users
  const filteredUsers = users
    .filter((user) => {
      const searchValue = search.toLowerCase().trim()

      return `${user.name || ''} ${user.email || ''} ${user.phone || ''} ${user.address || ''} ${user.city || ''} ${user.pincode || ''}`.toLowerCase().includes(searchValue)
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

  // Open delete popup
  const handleModalOpen = (user) => {
    setDeleteItem(user)
    setDeleteModalOpen(true)
  }

  const openCreateModal = () => {
    setCreateForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: ROLES.SUPPORT,
    })
    setCreateOpen(true)
  }

  const createEmployee = async (e) => {
    e.preventDefault()

    try {
      setCreateSaving(true)

      const res = await axiosInstance.post('/users/employees', createForm)

      if (res.data.success) {
        toast.success('Employee created successfully')
        setCreateOpen(false)
        await getUsers()

        if (canManagePermissions && res.data.user) {
          openPermissionsModal(res.data.user)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create employee')
    } finally {
      setCreateSaving(false)
    }
  }

  const openPermissionsModal = (targetUser) => {
    if (isSuperAdmin(targetUser) || targetUser.role === ROLES.USER) {
      toast.error('Permissions apply to employees only')
      return
    }

    const current = getEffectivePermissions(targetUser) || getRoleDefaultPermissions(targetUser.role)
    setPermTarget(targetUser)
    setPermMap(current)
    setPermOpen(true)
  }

  const togglePerm = (section, action) => {
    setPermMap((prev) => {
      const list = prev[section] || []
      const nextList = list.includes(action) ? list.filter((a) => a !== action) : [...list, action]
      return {
        ...prev,
        [section]: nextList,
      }
    })
  }

  const savePermissions = async () => {
    if (!permTarget?._id) return

    try {
      setPermSaving(true)

      const res = await axiosInstance.put(`/users/${permTarget._id}/permissions`, {
        admin_permissions: permMap,
      })

      if (res.data.success) {
        toast.success('Permissions updated')
        setPermOpen(false)
        setPermTarget(null)
        await getUsers()
        if (String(permTarget._id) === String(currentUser?._id || currentUser?.id)) {
          await getCurrentUser()
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update permissions')
    } finally {
      setPermSaving(false)
    }
  }

  const canActOnUser = (target) => {
    if (isSuperAdmin(target)) return false
    return canUpdateStatus || canDeleteUser || (canManagePermissions && target.role !== ROLES.USER && EMPLOYEE_ROLES.includes(target.role))
  }

  // Delete user
  const deleteHandle = async () => {
    if (!deleteItem?._id) {
      toast.error('User information not found')
      return
    }

    try {
      setDeleteProcessing(true)

      const res = await axiosInstance.delete(`/users/${deleteItem._id}`)

      if (res.data.success) {
        toast.success('User deleted successfully')

        setDeleteModalOpen(false)
        setDeleteItem(null)

        await getUsers()

        // Fix page if last item of current page was deleted
        setCurrentPage((prev) => {
          const remainingUsers = filteredUsers.length - 1

          if (itemsPerPage !== 'all' && remainingUsers > 0 && prev > Math.ceil(remainingUsers / itemsPerPage)) {
            return Math.ceil(remainingUsers / itemsPerPage)
          }

          return prev
        })
      }
    } catch (error) {
      console.error('Delete User error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to delete user')
    } finally {
      setDeleteProcessing(false)
    }
  }

  // Pagination
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredUsers.length / itemsPerPage)

  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage

  const endIndex = itemsPerPage === 'all' ? filteredUsers.length : startIndex + itemsPerPage

  const currentUsers = itemsPerPage === 'all' ? filteredUsers : filteredUsers.slice(startIndex, endIndex)

  // Pagination change
  const handleItemsPerPageChange = (value) => {
    const newValue = value === 'all' ? 'all' : Number(value)

    setItemsPerPage(newValue)
    setCurrentPage(1)
  }

  // Statistics
  const totalUsers = users.length

  const activeUsers = users.filter((user) => user.status === 'Active').length

  const inactiveUsers = users.filter((user) => user.status === 'Inactive').length

  const usersWithPhone = users.filter((user) => user.phone?.trim()).length

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
    },
    {
      title: 'Active Users',
      value: activeUsers,
      icon: UserCheck,
    },
    {
      title: 'Inactive Users',
      value: inactiveUsers,
      icon: UserX,
    },
    {
      title: 'Users With Phone',
      value: usersWithPhone,
      icon: Phone,
    },
  ]

  const items = [
    {
      title: 'Users',
      link: null,
    },
  ]

  return (
    <div className="space-y-6 transition-all duration-700">
      <AdminBreadCrumb items={items} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="rounded-2xl border border-[#E3DED6] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#99938B]">{item.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-[#292725]">{item.value}</h2>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-[#F1EEE8] text-[#6B6258]">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-10 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />

            {search && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#292725]" title="Clear Search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative">
              <ArrowUpDown size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6258]" />

              <select
                value={sortOrder}
                onChange={(e) => {
                  const value = e.target.value

                  setSortOrder(value)
                  localStorage.setItem('adminUsersSort', value)
                  setCurrentPage(1)
                }}
                className="h-10 w-full appearance-none rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-9 pr-8 text-sm font-semibold text-[#6F6A64] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6] sm:w-44"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4 sm:w-auto">
              <Users size={17} className="text-[#6B6258]" />

              <span className="whitespace-nowrap text-sm font-semibold text-[#292725]">{filteredUsers.length} Users</span>
            </div>

            {canCreateEmployee && (
              <button type="button" onClick={openCreateModal} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white transition hover:bg-[#5a534a]">
                <Plus size={17} />
                Add Employee
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-250">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">User</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Email</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Phone</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Registered</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading users...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user._id} className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#6F6A64]">{startIndex + index + 1}</span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={getImageUrl(user.avatar)} alt={user.name} className="size-10 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEE8] text-sm font-semibold text-[#6B6258]">{user.name?.charAt(0).toUpperCase() || 'U'}</div>
                        )}

                        <div className="min-w-0">
                          <p className="max-w-45 truncate text-sm font-semibold text-[#292725]">{user.name || '-'}</p>

                          <p className="mt-0.5 text-xs text-[#99938B]">{user.role || 'User'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="shrink-0 text-[#99938B]" />

                          <span className="max-w-55 truncate text-sm text-[#6F6A64]">{user.email || '-'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Phone size={13} className="shrink-0 text-[#99938B]" />

                          <span className="text-xs text-[#99938B]">{user.phone || '-'}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="min-w-32">
                        <p className="text-sm font-semibold text-[#6F6A64]">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </p>

                        <p className="mt-1 text-xs text-[#99938B]">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : '-'}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${user.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                        <span className={`size-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {canActOnUser(user) && (
                        <div className="flex items-center justify-end gap-1">
                          {canManagePermissions && EMPLOYEE_ROLES.includes(user.role) && (
                            <button
                              type="button"
                              onClick={() => openPermissionsModal(user)}
                              className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                              title="Permissions"
                            >
                              <Shield size={17} />
                            </button>
                          )}

                          {canUpdateStatus && (
                            <button
                              type="button"
                              onClick={() => updateUserStatus(user._id, user.status === 'Active' ? 'Inactive' : 'Active')}
                              className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                              title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                            >
                              {user.status === 'Active' ? <UserX size={17} /> : <UserCheck size={17} />}
                            </button>
                          )}

                          {canDeleteUser && (
                            <button
                              type="button"
                              onClick={() => handleModalOpen(user)}
                              className="flex size-9 items-center justify-center rounded-lg text-[#A44A3F] transition hover:bg-[#F8F6F2]"
                              title="Delete User"
                            >
                              <Trash2 size={17} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#E3DED6] bg-[#FCFBF9] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#99938B]">Show</span>

            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="h-8 rounded-lg border border-[#E3DED6] bg-white px-2.5 pr-7 text-xs font-semibold text-[#6F6A64] outline-none transition focus:border-[#6B6258]"
            >
              <option value={5}>5 Documents</option>
              <option value={10}>10 Documents</option>
              <option value={20}>20 Documents</option>
              <option value="all">All Documents</option>
            </select>
          </div>

          {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex size-8 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6F6A64] transition hover:bg-[#EEEAE4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex size-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${currentPage === page ? 'bg-[#6B6258] text-white' : 'border border-[#E3DED6] bg-white text-[#6F6A64] hover:bg-[#EEEAE4]'}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="flex size-8 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6F6A64] transition hover:bg-[#EEEAE4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <AdminTrashBox
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!deleteProcessing) {
            setDeleteModalOpen(false)
            setDeleteItem(null)
          }
        }}
        title="Delete User?"
        message={deleteItem ? `Are you sure you want to delete this ${deleteItem.name}?` : 'Are you sure you want to delete this user?'}
        actionButtonText="Delete"
        cancelButtonText="Cancel"
        onAction={deleteHandle}
        isProcessing={deleteProcessing}
      />

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={createEmployee} className="w-full max-w-md rounded-2xl border border-[#E3DED6] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#292725]">Add Employee</h3>
              <button type="button" onClick={() => setCreateOpen(false)} className="rounded-lg p-1 text-[#99938B] hover:bg-[#F1EEE8]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <input required value={createForm.name} onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name" className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3 text-sm outline-none focus:border-[#6B6258]" />
              <input required type="email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} placeholder="Email" className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3 text-sm outline-none focus:border-[#6B6258]" />
              <input required type="password" value={createForm.password} onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))} placeholder="Password" className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3 text-sm outline-none focus:border-[#6B6258]" />
              <input value={createForm.phone} onChange={(e) => setCreateForm((f) => ({ ...f, phone: e.target.value }))} placeholder="Phone (optional)" className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3 text-sm outline-none focus:border-[#6B6258]" />
              <select required value={createForm.role} onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))} className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3 text-sm outline-none focus:border-[#6B6258]">
                {EMPLOYEE_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="h-10 rounded-xl border border-[#E3DED6] px-4 text-sm font-semibold text-[#6F6A64]">
                Cancel
              </button>
              <button type="submit" disabled={createSaving} className="h-10 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white disabled:opacity-50">
                {createSaving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {permOpen && permTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl border border-[#E3DED6] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E3DED6] p-5">
              <div>
                <h3 className="text-lg font-semibold text-[#292725]">Permissions</h3>
                <p className="text-sm text-[#99938B]">
                  {permTarget.name} · {permTarget.role}
                </p>
              </div>
              <button type="button" onClick={() => setPermOpen(false)} className="rounded-lg p-1 text-[#99938B] hover:bg-[#F1EEE8]">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {Object.keys(ACTIONS).map((section) => {
                const sectionActions = grantableActions.filter((a) => a.section === section)
                if (sectionActions.length === 0) return null

                return (
                  <div key={section}>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#99938B]">{section}</p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {sectionActions.map((entry) => {
                        const checked = (permMap[section] || []).includes(entry.value)
                        return (
                          <label key={entry.value} className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E3DED6] bg-[#FCFBF9] px-3 py-2 text-sm text-[#6F6A64]">
                            <input type="checkbox" checked={checked} onChange={() => togglePerm(section, entry.value)} className="accent-[#6B6258]" />
                            <span>
                              {entry.key} <span className="text-[11px] text-[#99938B]">({entry.value})</span>
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-end gap-2 border-t border-[#E3DED6] p-5">
              <button type="button" onClick={() => setPermOpen(false)} className="h-10 rounded-xl border border-[#E3DED6] px-4 text-sm font-semibold text-[#6F6A64]">
                Cancel
              </button>
              <button type="button" disabled={permSaving} onClick={savePermissions} className="h-10 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white disabled:opacity-50">
                {permSaving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
