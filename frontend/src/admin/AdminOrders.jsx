import React, { useEffect, useState } from 'react'
import { ChevronDown, Eye, Package, Search, ShoppingBag } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  // ! payment online
  const [confirmingPaymentId, setConfirmingPaymentId] = useState(null)

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

  const handleStatusChange = async (orderId, orderStatus) => {
    try {
      setUpdatingOrderId(orderId)

      const res = await axiosInstance.put(`/admin/orders/${orderId}/status`, {
        orderStatus,
      })

      if (res.data.success) {
        setOrders((prev) => prev.map((order) => (order._id === orderId ? res.data.data : order)))
      }
    } catch (error) {
      console.log('Update Order Status Error:', error.response?.data || error.message)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  // ! payment online
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
                paymentStatus: 'Paid',
                payment: res.data.data.payment,
                orderStatus: res.data.data.order.orderStatus,
              }
            }

            return order
          }),
        )
      }
    } catch (error) {
      console.log('Confirm Payment Error:', error.response?.data || error.message)
    } finally {
      setConfirmingPaymentId(null)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase()

    const matchesSearch = order._id?.toLowerCase().includes(searchValue) || order.shippingAddress?.fullName?.toLowerCase().includes(searchValue) || order.shippingAddress?.phone?.toLowerCase().includes(searchValue)

    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#292725]">Orders</h1>

            <p className="mt-1 text-sm text-[#6F6A64]">Manage customer orders and update order status.</p>
          </div>

          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E3DED6] bg-white px-4">
            <ShoppingBag size={18} className="text-[#6B6258]" />

            <span className="text-sm font-bold text-[#292725]">{orders.length} Orders</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-2xl border border-[#E3DED6] bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
          {/* Search */}
          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3">
            <Search size={18} className="text-[#99938B]" />

            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order, customer or phone..." className="h-full w-full bg-transparent text-sm text-[#292725] outline-none placeholder:text-[#99938B]" />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3 pr-10 text-sm font-medium text-[#292725] outline-none focus:border-[#6B6258]"
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

            <ChevronDown size={17} className="pointer-events-none absolute right-3 top-3 text-[#6F6A64]" />
          </div>
        </div>
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* Loading */}
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-xl bg-[#F1EEE8]" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F1EEE8] text-[#6B6258]">
              <Package size={27} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-[#292725]">No Orders Found</h2>

            <p className="mt-1 text-sm text-[#99938B]">No orders match your current search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-250 text-left">
              <thead>
                <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#99938B]">Order</th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#99938B]">Customer</th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#99938B]">Items</th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#99938B]">Amount</th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#99938B]">Payment</th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#99938B]">Status</th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#99938B]">Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-[#E3DED6] last:border-b-0 hover:bg-[#FBFAF7]">
                    {/* Order */}
                    <td className="px-5 py-4">
                      <p className="max-w-37 truncate text-sm font-bold text-[#292725]">#{order._id}</p>

                      <p className="mt-1 text-xs text-[#99938B]">
                        {order.items?.length || 0} item
                        {order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#292725]">{order.shippingAddress?.fullName || 'N/A'}</p>

                      <p className="mt-1 text-xs text-[#99938B]">{order.shippingAddress?.phone || 'N/A'}</p>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <div className="flex -space-x-2">
                        {order.items?.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border-2 border-white bg-[#F8F6F2]">
                            {item.image ? <img src={`http://localhost:3000${item.image}`} alt={item.productName} className="h-full w-full object-contain" /> : <Package size={15} className="text-[#99938B]" />}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-extrabold text-[#292725]">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-[#292725]">{order.paymentMethod === 'COD' ? 'COD' : 'Online'}</p>

                      <p className={`mt-1 text-xs font-bold ${order.payment?.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>{order.payment?.paymentStatus || order.paymentStatus}</p>

                      {order.paymentMethod === 'ONLINE' && order.payment?.paymentStatus === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handlePaymentConfirm(order.payment._id)}
                          disabled={confirmingPaymentId === order.payment._id}
                          className="mt-2 rounded-lg bg-[#6B6258] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {confirmingPaymentId === order.payment._id ? 'Confirming...' : 'Confirm Payment'}
                        </button>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <select
                        value={order.orderStatus}
                        disabled={updatingOrderId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="rounded-lg border border-[#E3DED6] bg-[#F8F6F2] px-2.5 py-2 text-xs font-bold text-[#292725] outline-none transition focus:border-[#6B6258] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="Pending">Pending</option>

                        <option value="Confirmed">Confirmed</option>

                        <option value="Processing">Processing</option>

                        <option value="Shipped">Shipped</option>

                        <option value="Out for Delivery">Out for Delivery</option>

                        <option value="Delivered">Delivered</option>

                        <option value="Cancelled">Cancelled</option>

                        <option value="Returned">Returned</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-[#6F6A64]">{formatDate(order.createdAt)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
