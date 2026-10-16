import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { Search, Eye, Package, ShoppingBag, RotateCcw, Wallet, PackageCheck, Clock3, CheckCircle2, XCircle, UserRound, ShieldCheck, ChevronDown, ChevronLeft, ChevronRight, X, ArrowUpDown, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'
import AdminTrashBox from './AdminTrashBox'
import toast from 'react-hot-toast'

export default function AdminOrders() {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  const [cancellationStats, setCancellationStats] = useState({
    userCancelled: 0,
    adminCancelled: 0,
    totalCancelled: 0,
  })

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminOrdersSearch') || ''
  })

  const [sortOrder, setSortOrder] = useState(() => {
    return localStorage.getItem('adminOrdersSort') || 'newest'
  })

  const [statusFilter, setStatusFilter] = useState('All')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [confirmingPaymentId, setConfirmingPaymentId] = useState(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deletingOrderId, setDeletingOrderId] = useState(null)

  const [reviewingReturnId, setReviewingReturnId] = useState(null)
  const [rejectionModalOrder, setRejectionModalOrder] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [returnActionId, setReturnActionId] = useState(null)

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

      toast.error(error.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // Get cancellation statistics
  const getCancellationStats = async () => {
    try {
      const res = await axiosInstance.get('/admin/orders/cancellation-stats')

      if (res.data.success) {
        setCancellationStats({
          userCancelled: res.data.data?.userCancelled || 0,
          adminCancelled: res.data.data?.adminCancelled || 0,
          totalCancelled: res.data.data?.totalCancelled || 0,
        })
      }
    } catch (error) {
      console.log('Get Cancellation Stats Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to load cancellation statistics')
    }
  }

  useEffect(() => {
    getOrders()
    getCancellationStats()
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

        if (orderStatus === 'Cancelled') {
          await getCancellationStats()
        }

        toast.success(`Order status updated to ${orderStatus}`)
      }
    } catch (error) {
      console.log('Update Order Status Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to update order status')
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

        toast.success('Payment confirmed successfully')
      }
    } catch (error) {
      console.log('Confirm Payment Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Payment confirmation failed')
    } finally {
      setConfirmingPaymentId(null)
    }
  }

  // Approve or reject a return request
  const handleReturnReview = async (order, action, reason = '') => {
    if (action === 'Reject' && !reason.trim()) {
      toast.error('Please enter a rejection reason')
      return
    }

    try {
      setReviewingReturnId(order._id)

      const res = await axiosInstance.put(`/admin/orders/${order._id}/return-review`, {
        action,
        rejectionReason: reason.trim(),
      })

      if (res.data.success) {
        setOrders((prev) => prev.map((item) => (item._id === order._id ? { ...item, ...res.data.data, payment: item.payment } : item)))

        setRejectionModalOrder(null)
        setRejectionReason('')

        toast.success(action === 'Approve' ? 'Return request approved' : 'Return request rejected')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to review return request')
    } finally {
      setReviewingReturnId(null)
    }
  }

  // Return / Refund actions
  const handleReturnAction = async (order, action, refundReference = '') => {
    try {
      setReturnActionId(order._id)

      let res

      if (action === 'Item Received') {
        res = await axiosInstance.put(`/admin/orders/${order._id}/item-received`)
      } else if (action === 'Process Refund') {
        if (order.paymentMethod === 'RAZORPAY') {
          res = await axiosInstance.post(`/payment/admin/${order._id}/refund`)
        } else {
          if (!refundReference.trim()) {
            toast.error('Please enter the refund reference')
            return
          }

          res = await axiosInstance.put(`/payment/admin/${order._id}/manual-refund`, { refundReference: refundReference.trim() })
        }
      } else if (action === 'Verify Refund') {
        res = await axiosInstance.put(`/payment/admin/${order._id}/refund/verify`)
      }

      if (res?.data?.success) {
        toast.success(res.data.message || `${action} successful`)
        await getOrders()
      }
    } catch (error) {
      console.error(`${action} Error:`, error.response?.data || error.message)

      toast.error(error.response?.data?.message || `${action} failed`)
    } finally {
      setReturnActionId(null)
    }
  }

  // Open delete popup
  const handleDeleteOpen = (order) => {
    if (order.orderStatus !== 'Cancelled') {
      return
    }

    setDeleteItem(order)
    setDeleteModalOpen(true)
  }

  // Delete user-cancelled order
  const deleteHandle = async () => {
    if (!deleteItem) return

    const shouldGoPreviousPage = currentOrders.length === 1 && currentPage > 1

    try {
      setDeletingOrderId(deleteItem._id)

      const res = await axiosInstance.delete(`/admin/orders/${deleteItem._id}`)

      if (res.data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== deleteItem._id))

        toast.success('Order deleted successfully')

        setDeleteModalOpen(false)
        setDeleteItem(null)

        await getCancellationStats()

        if (shouldGoPreviousPage) {
          setCurrentPage((prev) => prev - 1)
        }
      }
    } catch (error) {
      console.log('Delete Admin Order Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to delete order')
    } finally {
      setDeletingOrderId(null)
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
          bg: 'bg-mk-surface',
          text: 'text-mk-warning',
        }

      case 'Confirmed':
        return {
          bg: 'bg-mk-surface',
          text: 'text-mk-admin-hover',
        }

      case 'Processing':
        return {
          bg: 'bg-mk-surface',
          text: 'text-mk-admin',
        }

      case 'Shipped':
        return {
          bg: 'bg-mk-surface',
          text: 'text-mk-admin-hover',
        }

      case 'Out for Delivery':
        return {
          bg: 'bg-mk-surface',
          text: 'text-mk-warning',
        }

      case 'Delivered':
        return {
          bg: 'bg-mk-success-soft',
          text: 'text-mk-success',
        }

      case 'Cancelled':
        return {
          bg: 'bg-mk-danger-soft',
          text: 'text-mk-danger',
        }

      case 'Returned':
        return {
          bg: 'bg-mk-surface',
          text: 'text-mk-warning',
        }

      default:
        return {
          bg: 'bg-mk-bg-admin',
          text: 'text-mk-muted-admin',
        }
    }
  }

  // Payment method label
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'COD':
        return 'Cash on Delivery'
      case 'ONLINE_ON_DELIVERY':
        return 'Online on Delivery'
      case 'RAZORPAY':
        return 'Razorpay'
      default:
        return method || 'Not specified'
    }
  }

  // Payment status style
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-mk-success-soft text-mk-success'

      case 'Pending':
        return 'bg-mk-surface text-mk-warning'

      case 'Failed':
        return 'bg-mk-danger-soft text-mk-danger'

      case 'Refunded':
        return 'bg-mk-info-soft text-mk-info'

      default:
        return 'bg-mk-bg-admin text-mk-muted-admin'
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
  const filteredOrders = orders
    .filter((order) => {
      const searchValue = search.toLowerCase().trim()

      const matchesSearch =
        order._id?.toLowerCase().includes(searchValue) || order.orderId?.toLowerCase().includes(searchValue) || order.shippingAddress?.fullName?.toLowerCase().includes(searchValue) || order.shippingAddress?.phone?.toLowerCase().includes(searchValue)

      const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()

      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
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
      title: 'Total Cancelled',
      value: cancellationStats.totalCancelled,
      icon: XCircle,
    },
    {
      title: 'User Cancelled',
      value: cancellationStats.userCancelled,
      icon: UserRound,
    },
    {
      title: 'Admin Cancelled',
      value: cancellationStats.adminCancelled,
      icon: ShieldCheck,
    },
  ]

  const items = [{ title: 'Orders', link: null }]

  return (
    <div className="space-y-6 transition-all duration-700">
      <AdminBreadCrumb items={items} />

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="rounded-2xl border border-mk-border-admin bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-mk-subtle">{item.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-mk-ink-admin">{item.value}</h2>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-mk-surface text-mk-admin">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Orders */}
      <div className="overflow-hidden rounded-2xl border border-mk-border-admin bg-white">
        {/* Search / Filter */}
        <div className="flex flex-col gap-4 border-b border-mk-border-admin p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mk-subtle" />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search orders..."
              className="h-10 w-full rounded-xl border border-mk-border-admin bg-mk-bg-admin pl-10 pr-10 text-sm text-mk-ink-admin outline-none transition placeholder:text-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin"
            />

            {search && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-mk-subtle transition hover:bg-mk-surface hover:text-mk-ink-admin" title="Clear Search">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            {/* Sort */}
            <div className="relative">
              <ArrowUpDown size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mk-admin" />

              <select
                value={sortOrder}
                onChange={(e) => {
                  const value = e.target.value

                  setSortOrder(value)
                  localStorage.setItem('adminOrdersSort', value)
                  setCurrentPage(1)
                }}
                className="h-10 w-full appearance-none rounded-xl border border-mk-border-admin bg-mk-bg-admin pl-9 pr-8 text-sm font-semibold text-mk-muted-admin outline-none transition focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin sm:w-44"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="h-10 w-full min-w-45 appearance-none rounded-xl border border-mk-border-admin bg-mk-bg-admin px-4 pr-10 text-sm font-semibold text-mk-muted-admin outline-none transition focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin sm:w-45"
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

              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-mk-muted-admin" />
            </div>

            {/* Count */}
            <div className="flex h-10 items-center justify-center gap-2 rounded-xl border border-mk-border-admin bg-mk-bg-admin px-4 sm:w-auto">
              <Package size={17} className="text-mk-admin" />

              <span className="whitespace-nowrap text-sm font-semibold text-mk-ink-admin">{filteredOrders.length} Orders</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-300">
            <thead>
              <tr className="border-b border-mk-border-admin bg-mk-bg-admin">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Order</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Customer</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Items</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Amount</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Payment</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Status</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Cancelled By</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-mk-subtle">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="px-5 py-12 text-center text-sm text-mk-subtle">
                    Loading orders...
                  </td>
                </tr>
              ) : currentOrders.length > 0 ? (
                currentOrders.map((order, index) => {
                  const isReturned = order.orderStatus === 'Returned'

                  const isCancelled = order.orderStatus === 'Cancelled'
                  const canDeleteOrder = isCancelled

                  const isLocked = isReturned || isCancelled

                  const statusStyle = getStatusStyle(order.orderStatus)

                  const paymentStatus = order.payment?.paymentStatus || order.paymentStatus || 'Pending'

                  const canConfirmPayment = ['Out for Delivery', 'Delivered'].includes(order.orderStatus) && paymentStatus === 'Pending' && order.payment?._id && !isLocked

                  return (
                    <tr key={order._id} className="border-b border-mk-border-admin transition hover:bg-mk-bg-admin">
                      <td className="px-5 py-4">
                        <span className="text-sm text-mk-muted-admin">{startIndex + index + 1}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="max-w-45 truncate text-sm font-semibold text-mk-ink-admin">#{order.orderId}</p>

                          <p className="mt-1 text-xs text-mk-subtle">
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? 's' : ''}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-mk-muted-admin">
                            <Clock3 size={12} />
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-35">
                          <p className="max-w-45 truncate text-sm font-semibold text-mk-ink-admin">{order.shippingAddress?.fullName || 'N/A'}</p>

                          <p className="mt-1 text-xs text-mk-subtle">{order.shippingAddress?.phone || 'N/A'}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex -space-x-2">
                          {order.items?.slice(0, 3).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex size-9 items-center justify-center overflow-hidden rounded-lg border-2 border-white bg-mk-bg-admin">
                              {item.image ? <img src={getImageUrl(item.image)} alt={item.productName} className="h-full w-full object-contain" /> : <Package size={15} className="text-mk-subtle" />}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-mk-ink-admin">₹{Number(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-mk-ink-admin">{getPaymentMethodLabel(order.paymentMethod || order.payment?.paymentMethod)}</p>

                        {order.returnStatus && order.returnStatus !== 'Not Requested' && (
                          <div className="mt-2 max-w-52 rounded-lg border border-mk-border-admin bg-mk-bg-admin p-2.5">
                            <p className="flex items-center gap-1.5 text-xs font-semibold text-mk-admin">
                              <RotateCcw size={13} />
                              Return: {order.returnStatus}
                            </p>

                            {/* {order.returnReason && (
                              <p className="mt-1 text-xs text-mk-muted-admin">
                                <span className="font-semibold">Reason:</span> {order.returnReason}
                              </p>
                            )} */}

                            {order.returnRejectionReason && (
                              <p className="mt-1 text-xs text-mk-danger">
                                <span className="font-semibold">Rejection:</span> {order.returnRejectionReason}
                              </p>
                            )}
                          </div>
                        )}
                        <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getPaymentStatusStyle(paymentStatus)}`}>{paymentStatus}</span>

                        {canConfirmPayment && (
                          <button
                            type="button"
                            onClick={() => handlePaymentConfirm(order.payment._id)}
                            disabled={confirmingPaymentId === order.payment._id}
                            className="mt-2 rounded-lg bg-mk-admin px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-mk-admin-hover disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {confirmingPaymentId === order.payment._id ? 'Confirming...' : 'Confirm Payment'}
                          </button>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {isLocked ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                            <span className={`size-1.5 rounded-full ${isReturned ? 'bg-mk-warning' : 'bg-mk-danger'}`} />

                            {order.orderStatus}
                          </span>
                        ) : (
                          <div className="relative inline-block">
                            <select
                              value={order.orderStatus}
                              disabled={updatingOrderId === order._id}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`appearance-none rounded-lg border py-2 pl-3 pr-8 text-xs font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${statusStyle.bg} ${statusStyle.text} border-mk-border-admin`}
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
                            </select>

                            <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-mk-muted-admin" />
                          </div>
                        )}
                      </td>

                      {/* Cancelled By */}
                      <td className="px-5 py-4">
                        {isCancelled ? (
                          order.cancelledBy === 'User' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-mk-surface px-2.5 py-1 text-[11px] font-semibold text-mk-admin">
                              <UserRound size={12} />
                              User
                            </span>
                          ) : order.cancelledBy === 'Admin' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-mk-surface px-2.5 py-1 text-[11px] font-semibold text-mk-admin-hover">
                              <ShieldCheck size={12} />
                              Admin
                            </span>
                          ) : (
                            <span className="text-xs text-mk-subtle">Unknown</span>
                          )
                        ) : (
                          <span className="text-xs text-mk-subtle">—</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {order.returnStatus === 'Requested' && (
                            <div className="flex flex-wrap justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleReturnReview(order, 'Approve')}
                                disabled={reviewingReturnId === order._id}
                                className="rounded-lg bg-mk-success-soft px-2.5 py-2 text-xs font-semibold text-mk-success hover:bg-mk-border-admin disabled:opacity-50"
                              >
                                {reviewingReturnId === order._id ? 'Please wait...' : 'Approve'}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRejectionModalOrder(order)
                                  setRejectionReason('')
                                }}
                                disabled={reviewingReturnId === order._id}
                                className="rounded-lg bg-mk-danger-soft px-2.5 py-2 text-xs font-semibold text-mk-danger hover:bg-mk-border disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {/* Return / Refund Workflow */}
                          <div className="flex flex-wrap justify-end gap-1.5">
                            {order.returnStatus === 'Approved' && (
                              <button
                                type="button"
                                onClick={() => handleReturnAction(order, 'Item Received')}
                                disabled={returnActionId === order._id}
                                className="rounded-lg bg-mk-surface px-2.5 py-2 text-xs font-semibold text-mk-admin-hover hover:bg-mk-border-admin disabled:opacity-50"
                              >
                                {returnActionId === order._id ? 'Please wait...' : 'Item Received'}
                              </button>
                            )}

                            {order.returnStatus === 'Pickup Scheduled' && (
                              <button
                                type="button"
                                onClick={() => handleReturnAction(order, 'Item Received')}
                                disabled={returnActionId === order._id}
                                className="rounded-lg bg-mk-surface px-2.5 py-2 text-xs font-semibold text-mk-admin-hover hover:bg-mk-border-admin disabled:opacity-50"
                              >
                                Confirm Received
                              </button>
                            )}

                            {order.returnStatus === 'Item Received' && order.paymentMethod === 'RAZORPAY' && (
                              <button
                                type="button"
                                onClick={() => handleReturnAction(order, 'Process Refund')}
                                disabled={returnActionId === order._id}
                                className="rounded-lg bg-mk-success-soft px-2.5 py-2 text-xs font-semibold text-mk-success hover:bg-mk-border-admin disabled:opacity-50"
                              >
                                Process Refund
                              </button>
                            )}

                            {order.returnStatus === 'Refund Processing' && (
                              <button
                                type="button"
                                onClick={() => handleReturnAction(order, 'Verify Refund')}
                                disabled={returnActionId === order._id}
                                className="rounded-lg bg-mk-surface px-2.5 py-2 text-xs font-semibold text-mk-warning hover:bg-mk-border disabled:opacity-50"
                              >
                                {returnActionId === order._id ? 'Checking...' : 'Verify Refund'}
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                            className="flex size-9 items-center justify-center rounded-lg text-mk-muted-admin transition hover:bg-mk-surface hover:text-mk-ink-admin"
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
                  <td colSpan="10" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-mk-surface text-mk-admin">
                        <Package size={27} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-mk-ink-admin">No orders found</p>

                      <p className="mt-1 text-xs text-mk-subtle">Try changing your search or status filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col gap-4 border-t border-mk-border-admin bg-mk-bg-admin px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Rows Per Page */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-mk-disabled">Show</span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                const value = e.target.value
                handleItemsPerPageChange(value === 'all' ? 'all' : Number(value))
              }}
              className="h-9 rounded-lg border border-mk-border-admin bg-white px-3 text-xs font-semibold text-mk-admin-hover outline-none transition hover:border-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-border-admin"
            >
              <option value={5}>5 Documents</option>
              <option value={10}>10 Documents</option>
              <option value={20}>20 Documents</option>
              <option value="all">All Documents</option>
            </select>

            <span className="text-xs text-mk-subtle">
              of <span className="font-semibold text-mk-admin-hover">{filteredOrders.length}</span>
            </span>
          </div>

          {/* Page Navigation */}
          {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
                className="flex size-9 items-center justify-center rounded-xl border border-mk-border-admin bg-white text-mk-admin transition hover:border-mk-border-admin hover:bg-mk-surface disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronLeft size={17} strokeWidth={2.5} />
              </button>

              <div className="flex h-9 items-center gap-2 rounded-xl border border-mk-border-admin bg-white px-3 shadow-sm">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={currentPage}
                  aria-label="Current page"
                  onChange={(e) => {
                    const value = e.target.value

                    if (value === '') return

                    const page = Number(value)

                    if (Number.isInteger(page) && page >= 1 && page <= totalPages) {
                      setCurrentPage(page)
                    }
                  }}
                  onBlur={(e) => {
                    const page = Number(e.target.value)

                    setCurrentPage(Math.min(totalPages, Math.max(1, page || 1)))
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                  }}
                  className="w-8 bg-transparent text-center text-sm font-semibold text-mk-ink-admin outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <span className="text-xs text-mk-subtle">of</span>

                <span className="min-w-4 text-sm font-medium text-mk-muted-admin">{totalPages}</span>
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
                className="flex size-9 items-center justify-center rounded-xl border border-mk-border-admin bg-white text-mk-admin transition hover:border-mk-border-admin hover:bg-mk-surface disabled:cursor-not-allowed disabled:opacity-35"
              >
                <ChevronRight size={17} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Return Request Modal */}
      {rejectionModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-mk-border-admin bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-mk-ink-admin">Reject Return Request</h2>

              <button
                type="button"
                onClick={() => {
                  setRejectionModalOrder(null)
                  setRejectionReason('')
                }}
                disabled={reviewingReturnId === rejectionModalOrder._id}
                className="rounded-lg p-2 text-mk-muted-admin hover:bg-mk-surface"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-2 text-sm text-mk-muted-admin">Order #{rejectionModalOrder.orderId} reject કરવાનું કારણ લખો.</p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder="Enter rejection reason..."
              className="mt-4 w-full resize-none rounded-xl border border-mk-border-admin bg-mk-bg-admin p-3 text-sm text-mk-ink-admin outline-none focus:border-mk-admin"
            />

            <p className="mt-1 text-right text-xs text-mk-subtle">{rejectionReason.length}/1000</p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectionModalOrder(null)
                  setRejectionReason('')
                }}
                disabled={reviewingReturnId === rejectionModalOrder._id}
                className="rounded-xl border border-mk-border-admin px-4 py-2 text-sm font-semibold text-mk-muted-admin hover:bg-mk-bg-admin"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleReturnReview(rejectionModalOrder, 'Reject', rejectionReason)}
                disabled={reviewingReturnId === rejectionModalOrder._id || !rejectionReason.trim()}
                className="rounded-xl bg-mk-danger px-4 py-2 text-sm font-semibold text-white hover:bg-mk-danger disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reviewingReturnId === rejectionModalOrder._id ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteModalOpen && (
        <AdminTrashBox
          isOpen={deleteModalOpen}
          onClose={() => {
            if (deletingOrderId) return

            setDeleteModalOpen(false)
            setDeleteItem(null)
          }}
          title="Delete Cancelled Order?"
          message={`Are you sure you want to permanently delete order #${deleteItem?.orderId}?`}
          actionButtonText="Delete Order"
          cancelButtonText="Cancel"
          onAction={deleteHandle}
          isProcessing={Boolean(deletingOrderId)}
        />
      )}
    </div>
  )
}
