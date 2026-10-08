import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { Search, Users, UserCheck, UserX, Ellipsis, Mail, Phone, X, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'
import toast from 'react-hot-toast'
import AdminTrashBox from './AdminTrashBox'

export default function AdminUsers() {
  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminUsersSearch') || ''
  })

  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem('adminUsersSort') || 'newest'
  })

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const [openMenu, setOpenMenu] = useState(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleteProcessing, setDeleteProcessing] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-user-menu]')) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
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

      setOpenMenu(null)
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
                      {user.role !== 'Admin' && (
                        <div data-user-menu className="relative flex justify-end">
                          <button
                            type="button"
                            onClick={() => setOpenMenu(openMenu === user._id ? null : user._id)}
                            className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                            title="More"
                          >
                            <Ellipsis size={17} />
                          </button>

                          {openMenu === user._id && (
                            <div className="absolute bottom-10 right-0 z-50 w-44 overflow-hidden rounded-xl border border-[#E3DED6] bg-white py-1 shadow-lg">
                              <button type="button" onClick={() => updateUserStatus(user._id, user.status === 'Active' ? 'Inactive' : 'Active')} className="w-full px-4 py-2.5 text-left text-sm text-[#6F6A64] transition hover:bg-[#F8F6F2]">
                                {user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  handleModalOpen(user)
                                  setOpenMenu(null)
                                }}
                                className="w-full px-4 py-2.5 text-left text-sm font-medium text-[#A44A3F] transition hover:bg-[#F8F6F2]"
                              >
                                Delete User
                              </button>
                            </div>
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
    </div>
  )
}
