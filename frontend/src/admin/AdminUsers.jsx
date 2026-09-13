import React, { useEffect, useState } from 'react'
import { Search, Users, UserCheck, UserX, Eye, MoreVertical, MapPin, Mail, Phone, Ellipsis } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // ! 1. Activate / Deactivate
  const [openMenu, setOpenMenu] = useState(null)

  // ! Get users
  const getUsers = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/users')

      setUsers(res.data.data)
    } catch (error) {
      console.error('Get users error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ! Image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''

    if (imagePath.startsWith('http')) {
      return imagePath
    }

    return `http://localhost:3000${imagePath}`
  }

  useEffect(() => {
    getUsers()
  }, [])

  // ! 2. Activate / Deactivate
  const updateUserStatus = async (userId, status) => {
    try {
      const res = await axiosInstance.put(`/users/${userId}`, {
        status,
      })

      console.log(res.data)

      setOpenMenu(null)

      getUsers()
    } catch (error) {
      console.error('Update user status error:', error.response?.data || error.message)
    }
  }

  // ! Users dashboard
  const totalUsers = users.length

  const activeUsers = users.filter((user) => user.status === 'Active').length

  const inactiveUsers = users.filter((user) => user.status === 'Inactive').length

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
  ]

  // ! Search filter
  const filteredUsers = users.filter((user) => `${user.name} ${user.email} ${user.phone} ${user.address} ${user.city} ${user.pincode}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#F4F2EE] p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#292725]">Users</h1>

          <p className="mt-1 text-sm text-[#6F6A64]">Manage registered customers</p>
        </div>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      {/* USERS TABLE CARD */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* TABLE HEADER */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#292725]">All Users</h2>

            <p className="mt-1 text-xs text-[#99938B]">{filteredUsers.length} users found</p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] py-2.5 pl-10 pr-4 text-sm text-[#292725] outline-none placeholder:text-[#99938B] focus:border-[#6B6258]"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-237">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">#</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">User</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">Contact</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">Address</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">Status</th>

                <th className="px-5 py-4 text-right text-xs font-semibold text-[#6F6A64]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-5 py-16 text-center text-sm text-[#99938B]">
                    Loading users...
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="border-b border-[#E3DED6] last:border-b-0 hover:bg-[#FBFAF7]">
                    {/* INDEX */}
                    <td className="px-5 py-4 text-sm text-[#99938B]">{index + 1}</td>

                    {/* USER */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={getImageUrl(user.avatar)} alt={user.name} className="size-10 shrink-0 rounded-full object-cover" />
                        ) : (
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#EDE8E0] text-sm font-semibold text-[#6B6258]">{user.name?.charAt(0).toUpperCase()}</div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#292725]">{user.name}</p>

                          <p className="mt-0.5 text-xs text-[#99938B]">Customer</p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-[#99938B]" />

                          <span className="text-sm text-[#6F6A64]">{user.email}</span>
                        </div>

                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={13} className="text-[#99938B]" />

                            <span className="text-xs text-[#99938B]">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* ADDRESS */}
                    <td className="px-5 py-4">
                      <div className="flex max-w-60 items-start gap-2">
                        <MapPin size={14} className="mt-0.5 shrink-0 text-[#99938B]" />

                        <div>
                          <p className="text-sm text-[#6F6A64]">{user.address || '-'}</p>

                          {(user.city || user.pincode) && (
                            <p className="mt-1 text-xs text-[#99938B]">
                              {user.city}
                              {user.city && user.pincode ? ', ' : ''}
                              {user.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${user.status === 'Active' ? 'bg-[#E8F0E8] text-[#536653]' : 'bg-[#F1EEE8] text-[#817970]'}`}>
                        <span className={`size-1.5 rounded-full ${user.status === 'Active' ? 'bg-[#536653]' : 'bg-[#817970]'}`} />

                        {user.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-5 py-4">
                      <div className="relative flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="More"
                          onClick={() => setOpenMenu(openMenu === user._id ? null : user._id)}
                          className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1EEE8] hover:text-[#6B6258]"
                        >
                          <Ellipsis  size={17} />
                        </button>

                        {/* MORE MENU */}
                        {openMenu === user._id && (
                          <div className="absolute right-5 top-14 z-20 w-44 overflow-hidden rounded-xl border border-[#E3DED6] bg-white py-1 shadow-lg">
                            {user.status === 'Active' ? (
                              <button type="button" onClick={() => updateUserStatus(user._id, 'Inactive')} className="w-full px-4 py-2.5 text-left text-sm text-[#6F6A64] transition hover:bg-[#F8F6F2]">
                                Deactivate User
                              </button>
                            ) : (
                              <button type="button" onClick={() => updateUserStatus(user._id, 'Active')} className="w-full px-4 py-2.5 text-left text-sm text-[#6F6A64] transition hover:bg-[#F8F6F2]">
                                Activate User
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {!loading && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center px-5 py-16">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#F1EEE8] text-[#6B6258]">
              <Users size={24} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#292725]">No users found</h3>

            <p className="mt-1 text-xs text-[#99938B]">Try searching with a different keyword.</p>
          </div>
        )}
      </div>
    </div>
  )
}
