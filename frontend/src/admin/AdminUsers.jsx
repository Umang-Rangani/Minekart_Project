import React, { useEffect, useState } from 'react'
import { Search, Users, UserCheck, UserX, Eye, MoreVertical } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

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

  // ! users dashboard
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

  // ! filter searchbar
  const filteredUsers = users.filter((user) => `${user.name} ${user.email} ${user.phone} ${user.address} ${user.city}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#F4F2EE] p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#292725]">Users</h1>

        <p className="mt-1 text-sm text-[#6F6A64]">Manage registered customers</p>
      </div>

      {/* SEARCH */}
      <div className="mb-6 rounded-2xl border border-[#E3DED6] bg-white p-4">
        <div className="relative max-w-md">
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

      {/* USERS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">#</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">User</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">Email</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">Phone</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">Address</th>

                <th className="px-5 py-4 text-left text-xs font-semibold text-[#6F6A64]">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className="border-b border-[#E3DED6] last:border-b-0 hover:bg-[#F8F6F2]">
                  {/* INDEX */}
                  <td className="px-5 py-4 text-sm text-[#6F6A64]">{index + 1}</td>

                  {/* USER */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={getImageUrl(user.avatar)} alt={user.name} className="size-10 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#F1EEE8] text-sm font-semibold text-[#6B6258]">{user.name?.charAt(0).toUpperCase()}</div>
                      )}

                      <div>
                        <p className="text-sm font-semibold text-[#292725]">{user.name}</p>

                        <p className="text-xs text-[#99938B]">Customer</p>
                      </div>
                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-5 py-4 text-sm text-[#6F6A64]">{user.email}</td>

                  {/* PHONE */}
                  <td className="px-5 py-4 text-sm text-[#6F6A64]">{user.phone}</td>

                  <td className="px-5 py-4 text-sm text-[#6F6A64]">
                    {user.address}, {user.city}, {user.pincode}
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${user.status === 'Active' ? 'bg-[#E8F0E8] text-[#536653]' : 'bg-[#F1EEE8] text-[#817970]'}`}>{user.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center px-5 py-16">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#F1EEE8] text-[#6B6258]">
              <Users size={24} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-[#292725]">No users found</h3>

            <p className="mt-1 text-xs text-[#99938B]">Registered users will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
