import React, { useEffect, useState } from 'react'
import { Search, Eye, Package, ShoppingBag, CircleDollarSign, AlertTriangle, Clock3, CheckCircle2, XCircle, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'

export default function AdminOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminOrdersSearch') || ''
  })

  const [statusFilter, setStatusFilter] = useState('All')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [confirmingPaymentId, setConfirmingPaymentId] = useState(null)

  // Get all orders
  const getOrders = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/admin/orders')

      if (res.data.success) {
        setOrders(res.data.data || [])
      }
    } catch (error) {
      console.log('Get Admin Orders Error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  // Update order status
  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      setUpdatingOrderId(orderId)

      const res = await axiosInstance.put(`/admin/orders/${orderId}/status`, {
        orderStatus,
      })

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) => {
            if (order._id === orderId) {
              return {
                ...order,
                ...res.data.data,
                payment: order.payment,
              }
            }

            return order
          }),
        )
      }
    } catch (error) {
      console.log('Update Order Status Error:', error.response?.data || error.message)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // Confirm payment
  const handlePaymentConfirm = async (paymentId) => {
    try {
      setConfirmingPaymentId(paymentId)

      const res = await axiosInstance.put(`/payment/admin/${paymentId}/confirm`)

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) => {
            if (order._id === res.data.data.order._id) {
              return {
                ...order,
                ...res.data.data.order,
                payment: res.data.data.payment,
                paymentStatus: res.data.data.order.paymentStatus || 'Paid',
              }
            }

            return order
          }),
        )
      }
    } catch (error) {
      console.log('Confirm Payment Error:', error.response?.data || error.message)

      alert(error.response?.data?.message || 'Payment confirmation failed')
    } finally {
      setConfirmingPaymentId(null)
    }
  }

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  // Status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-[#F1EEE8]',
          text: 'text-[#8A6A3D]',
        }

      case 'Confirmed':
        return {
          bg: 'bg-[#EAE7E1]',
          text: 'text-[#5D554C]',
        }

      case 'Processing':
        return {
          bg: 'bg-[#EEEAE4]',
          text: 'text-[#6B6258]',
        }

      case 'Shipped':
        return {
          bg: 'bg-[#ECE9E4]',
          text: 'text-[#625A51]',
        }

      case 'Out for Delivery':
        return {
          bg: 'bg-[#F1EEE8]',
          text: 'text-[#806B4F]',
        }

      case 'Delivered':
        return {
          bg: 'bg-[#EAEDE7]',
          text: 'text-[#5E6C55]',
        }

      case 'Cancelled':
        return {
          bg: 'bg-[#F1E7E5]',
          text: 'text-[#A44A3F]',
        }

      case 'Returned':
        return {
          bg: 'bg-[#F1EEE8]',
          text: 'text-[#8A6A3D]',
        }

      default:
        return {
          bg: 'bg-[#F8F6F2]',
          text: 'text-[#6F6A64]',
        }
    }
  }

  // Search
  const handleSearch = (value) => {
    setSearch(value)

    localStorage.setItem('adminOrdersSearch', value)

    setCurrentPage(1)
  }

  // Clear search
  const clearSearch = () => {
    setSearch('')

    localStorage.removeItem('adminOrdersSearch')

    setCurrentPage(1)
  }

  // Status filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value)

    setCurrentPage(1)
  }

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase().trim()

    const matchesSearch =
      order._id?.toLowerCase().includes(searchValue) || order.orderId?.toLowerCase().includes(searchValue) || order.shippingAddress?.fullName?.toLowerCase().includes(searchValue) || order.shippingAddress?.phone?.toLowerCase().includes(searchValue)

    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredOrders.length / itemsPerPage)

  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage

  const endIndex = itemsPerPage === 'all' ? filteredOrders.length : startIndex + itemsPerPage

  const currentOrders = itemsPerPage === 'all' ? filteredOrders : filteredOrders.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)

    setCurrentPage(1)
  }

  // Statistics
  const totalOrders = orders.length

  const pendingOrders = orders.filter((order) => order.orderStatus === 'Pending').length

  const deliveredOrders = orders.filter((order) => order.orderStatus === 'Delivered').length

  const cancelledOrders = orders.filter((order) => order.orderStatus === 'Cancelled').length

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: Clock3,
    },
    {
      title: 'Delivered Orders',
      value: deliveredOrders,
      icon: CheckCircle2,
    },
    {
      title: 'Cancelled Orders',
      value: cancelledOrders,
      icon: XCircle,
    },
  ]

  const items = [{ title: 'Orders', link: null }]

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
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search orders..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-10 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />

            {search && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#292725]" title="Clear Search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="h-10 min-w-45 appearance-none rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4 pr-10 text-sm font-semibold text-[#6F6A64] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Returned">Returned</option>
              </select>

              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A64]" />
            </div>

            <div className="flex h-10 items-center gap-2 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4">
              <Package size={17} className="text-[#6B6258]" />

              <span className="text-sm font-semibold text-[#292725]">{filteredOrders.length} Orders</span>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-300">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Order</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Customer</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Items</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Amount</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Payment</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Date</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading orders...
                  </td>
                </tr>
              ) : currentOrders.length > 0 ? (
                currentOrders.map((order, index) => {
                  const isReturned = order.orderStatus === 'Returned'

                  const isCancelled = order.orderStatus === 'Cancelled'

                  const isLocked = isReturned || isCancelled

                  const statusStyle = getStatusStyle(order.orderStatus)

                  const paymentStatus = order.payment?.paymentStatus || order.paymentStatus || 'Pending'

                  const canConfirmPayment = ['Out for Delivery', 'Delivered'].includes(order.orderStatus) && paymentStatus === 'Pending' && order.payment?._id && !isLocked

                  return (
                    <tr key={order._id} className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#6F6A64]">{startIndex + index + 1}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="max-w-45 truncate text-sm font-semibold text-[#292725]">#{order.orderId}</p>

                          <p className="mt-1 text-xs text-[#99938B]">
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-35">
                          <p className="max-w-45 truncate text-sm font-semibold text-[#292725]">{order.shippingAddress?.fullName || 'N/A'}</p>

                          <p className="mt-1 text-xs text-[#99938B]">{order.shippingAddress?.phone || 'N/A'}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex -space-x-2">
                          {order.items?.slice(0, 3).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex size-9 items-center justify-center overflow-hidden rounded-lg border-2 border-white bg-[#F8F6F2]">
                              {item.image ? <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain" /> : <Package size={15} className="text-[#99938B]" />}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#292725]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-[#292725]">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online on Delivery'}</p>

                        <p className={`mt-1 text-[11px] font-semibold ${paymentStatus === 'Paid' ? 'text-[#5E6C55]' : paymentStatus === 'Failed' ? 'text-[#A44A3F]' : 'text-[#8A6A3D]'}`}>{paymentStatus}</p>

                        {canConfirmPayment && (
                          <button
                            type="button"
                            onClick={() => handlePaymentConfirm(order.payment._id)}
                            disabled={confirmingPaymentId === order.payment._id}
                            className="mt-2 rounded-lg bg-[#6B6258] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#5D554C] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {confirmingPaymentId === order.payment._id ? 'Confirming...' : 'Confirm Payment'}
                          </button>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {isLocked ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                            <span className={`size-1.5 rounded-full ${isReturned ? 'bg-[#8A6A3D]' : 'bg-[#A44A3F]'}`} />

                            {order.orderStatus}
                          </span>
                        ) : (
                          <div className="relative inline-block">
                            <select
                              value={order.orderStatus}
                              disabled={updatingOrderId === order._id}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${statusStyle.bg} ${statusStyle.text} border-[#E3DED6]`}
                            >
                              <option value="Pending">Pending</option>

                              <option value="Confirmed">Confirmed</option>

                              <option value="Processing">Processing</option>

                              <option value="Shipped">Shipped</option>

                              <option value="Out for Delivery">Out for Delivery</option>

                              <option value="Delivered" disabled={paymentStatus !== 'Paid'}>
                                Delivered
                              </option>

                              <option value="Cancelled">Cancelled</option>

                              <option value="Returned">Returned</option>
                            </select>

                            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-[#6F6A64]" />
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-[#6F6A64]">{formatDate(order.createdAt)}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                            className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                            title="View Order"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F1EEE8] text-[#6B6258]">
                        <Package size={27} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-[#292725]">No orders found</p>

                      <p className="mt-1 text-xs text-[#99938B]">Try changing your search or status filter.</p>
                    </div>
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
              onChange={(e) => {
                const value = e.target.value

                handleItemsPerPageChange(value === 'all' ? 'all' : Number(value))
              }}
              className="h-8 rounded-lg border border-[#E3DED6] bg-white px-2.5 pr-7 text-xs font-semibold text-[#6F6A64] outline-none transition focus:border-[#6B6258]"
            >
              <option value={5}>5 Documents</option>

              <option value={10}>10 Documents</option>

              <option value={20}>20 Documents</option>

              <option value="all">All Documents</option>
            </select>

            <span className="text-xs text-[#99938B]">of {filteredOrders.length}</span>
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
    </div>
  )
}
