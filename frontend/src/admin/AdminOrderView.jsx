import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, MapPin, Package, Phone, ReceiptText, RefreshCw, RotateCcw, Truck, User } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'
import toast from 'react-hot-toast'

const AdminOrderView = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmingPayment, setConfirmingPayment] = useState(false)

  console.log(id)

  const getOrderDetails = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/admin/orders/${id}`)

      if (res.data.success) {
        setOrder(res.data.data)
      }
    } catch (error) {
      console.log('Get Admin Order Details Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Unable to fetch order details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getOrderDetails()
  }, [id])

  // CONFIRM PAYMENT
  const handlePaymentConfirm = async () => {
    if (!order?.payment?._id) return

    try {
      setConfirmingPayment(true)

      const res = await axiosInstance.put(`/payment/admin/${order.payment._id}/confirm`)

      if (res.data.success) {
        setOrder((prev) => ({
          ...prev,
          paymentStatus: res.data.data.order.paymentStatus || 'Paid',
          payment: res.data.data.payment,
          orderStatus: res.data.data.order.orderStatus,
        }))

        toast.success('Payment confirmed successfully')
      }
    } catch (error) {
      console.log('Confirm Payment Error:', error)

      toast.error(error.response?.data?.message || 'Unable to confirm payment')
    } finally {
      setConfirmingPayment(false)
    }
  }

  // STATUS STYLE
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-mk-bg text-mk-danger border-mk-border'

      case 'Confirmed':
        return 'bg-mk-bg-admin text-mk-info border-mk-info-soft'

      case 'Processing':
        return 'bg-mk-surface text-mk-admin border-mk-border-admin'

      case 'Shipped':
        return 'bg-mk-bg-admin text-mk-info border-mk-info-soft'

      case 'Out for Delivery':
        return 'bg-mk-bg text-mk-primary border-mk-border'

      case 'Delivered':
        return 'bg-mk-bg-admin text-mk-success border-mk-border-admin'

      case 'Cancelled':
        return 'bg-mk-bg text-mk-primary border-mk-border'

      case 'Returned':
        return 'bg-mk-bg text-mk-primary border-mk-border'

      default:
        return 'bg-mk-bg-admin text-mk-muted-admin border-mk-border-admin'
    }
  }

  // PAYMENT STATUS STYLE
  const getPaymentStatusStyle = (status) => {
    switch (
      String(status || 'Pending')
        .trim()
        .toLowerCase()
    ) {
      case 'paid':
        return 'bg-mk-bg-admin text-mk-success border-mk-border-admin'

      case 'pending':
      case 'initiated':
      case 'processing':
        return 'bg-mk-bg text-mk-danger border-mk-border'

      case 'failed':
        return 'bg-mk-bg text-mk-primary border-mk-border'

      case 'refunded':
      case 'partially refunded':
        return 'bg-mk-bg-admin text-mk-info border-mk-info-soft'

      default:
        return 'bg-mk-bg-admin text-mk-muted-admin border-mk-border-admin'
    }
  }

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-mk-bg-admin">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-mk-border-admin border-t-mk-admin" />

          <p className="text-sm font-medium text-mk-muted-admin">Loading order details...</p>
        </div>
      </div>
    )
  }

  // ORDER NOT FOUND
  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-mk-bg-admin px-5">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-mk-admin shadow-sm">
          <Package size={28} />
        </div>

        <h2 className="text-xl font-semibold text-mk-ink-admin">Order not found</h2>

        <button type="button" onClick={() => navigate('/admin/orders')} className="mt-5 rounded-lg bg-mk-admin px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-mk-ink-admin">
          Back to Orders
        </button>
      </div>
    )
  }

  const paymentStatus = order.payment?.paymentStatus || order.paymentStatus || 'Pending'

  const paymentMethod = order.payment?.paymentMethod || order.paymentMethod || 'COD'

  const isPaymentPending = paymentStatus === 'Pending'

  const isPaymentMethodValid = ['COD', 'ONLINE_ON_DELIVERY'].includes(paymentMethod)

  const items = [
    {
      title: 'Orders',
      link: '/admin/orders',
    },
    {
      title: `${order.orderId}`,
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-mk-bg-admin space-y-6">
      <AdminBreadCrumb items={items} />
      <div className="mx-auto max-w-375 ">
        {/* TOP INFORMATION */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* CUSTOMER */}
          <div className="rounded-xl border border-mk-border-admin bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-mk-border-admin px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
                <User size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-mk-ink-admin">Customer Information</h2>

                <p className="text-xs text-mk-subtle">Customer details</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="mb-1 text-xs font-medium text-mk-subtle">Name</p>

                <p className="text-sm font-semibold text-mk-ink-admin">{order.userId?.name || '-'}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-mk-subtle">Email</p>

                <p className="break-all text-sm font-medium text-mk-ink-admin">{order.userId?.email || '-'}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-mk-muted-admin" />

                <p className="text-sm font-medium text-mk-ink-admin">{order.userId?.phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div className="rounded-xl border border-mk-border-admin bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-mk-border-admin px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-mk-ink-admin">Delivery Address</h2>

                <p className="text-xs text-mk-subtle">Shipping information</p>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-mk-ink-admin">{order.shippingAddress?.fullName || '-'}</p>

                <span className="rounded-md bg-mk-surface px-2.5 py-1 text-xs font-semibold text-mk-admin">{order.shippingAddress?.addressType || 'Home'}</span>
              </div>

              <p className="text-sm leading-6 text-mk-muted-admin">
                {order.shippingAddress?.addressLine || '-'}
                <br />
                {order.shippingAddress?.city || '-'}, {order.shippingAddress?.state || '-'}
                {' - '}
                {order.shippingAddress?.pincode || '-'}
              </p>

              {order.shippingAddress?.landmark && <p className="mt-2 text-xs text-mk-subtle">Landmark: {order.shippingAddress.landmark}</p>}

              <div className="mt-4 flex items-center gap-2 border-t border-mk-border-admin pt-4">
                <Phone size={15} className="text-mk-muted-admin" />

                <span className="text-sm font-medium text-mk-ink-admin">{order.shippingAddress?.phone || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT + SUMMARY */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* PAYMENT */}
          <div className="rounded-xl border border-mk-border-admin bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-mk-border-admin px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
                <CreditCard size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-mk-ink-admin">Payment Information</h2>

                <p className="text-xs text-mk-subtle">Payment and transaction details</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-mk-muted-admin">Payment Method</span>

                <span className="text-sm font-semibold text-mk-ink-admin">{paymentMethod === 'RAZORPAY' ? 'Razorpay' : paymentMethod === 'ONLINE_ON_DELIVERY' ? 'Online on Delivery' : paymentMethod === 'COD' ? 'Cash on Delivery' : paymentMethod}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-mk-muted-admin">Payment Status</span>

                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusStyle(paymentStatus)}`}>{paymentStatus}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-mk-muted-admin">Amount</span>

                <span className="text-base font-bold text-mk-ink-admin">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>

              {order.payment?.transactionId && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-mk-muted-admin">Transaction ID</span>

                  <span className="max-w-55 break-all text-right text-xs font-medium text-mk-ink-admin">{order.payment.transactionId}</span>
                </div>
              )}

              {order.payment?.paidAt && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-mk-muted-admin">Paid At</span>

                  <span className="text-xs font-medium text-mk-ink-admin">{formatDate(order.payment.paidAt)}</span>
                </div>
              )}

              {isPaymentPending && isPaymentMethodValid && order.payment?._id && (
                <button
                  type="button"
                  onClick={handlePaymentConfirm}
                  disabled={confirmingPayment}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-mk-admin px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-mk-ink-admin disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />

                  {confirmingPayment ? 'Confirming...' : 'Confirm Payment'}
                </button>
              )}
            </div>
          </div>

          {/* RETURN & REFUND DETAILS */}
          {order.returnStatus && order.returnStatus !== 'Not Requested' && (
            <div className="mt-5 rounded-xl border border-mk-border-admin bg-white shadow-sm">
              <div className="flex items-center gap-3 border-b border-mk-border-admin px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
                  <RotateCcw size={19} />
                </div>

                <div>
                  <h2 className="text-base font-bold text-mk-ink-admin">Return & Refund Details</h2>
                  <p className="text-xs text-mk-subtle">Return request and refund information</p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-mk-muted-admin">Return Status</span>
                  <span className="rounded-full border border-mk-border-admin bg-mk-bg-admin px-3 py-1 text-xs font-semibold text-mk-admin">{order.returnStatus}</span>
                </div>

                {order.returnReason && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-mk-subtle">Return Reason</p>
                    <p className="text-sm text-mk-ink-admin">{order.returnReason}</p>
                  </div>
                )}

                {order.returnRejectionReason && (
                  <div className="rounded-lg border border-mk-border bg-mk-bg p-3">
                    <p className="text-xs font-semibold text-mk-primary">Rejection Reason</p>
                    <p className="mt-1 text-sm text-mk-primary-deep">{order.returnRejectionReason}</p>
                  </div>
                )}

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-mk-muted-admin">Refund Amount</span>
                  <span className="text-base font-bold text-mk-ink-admin">₹{Number(order.refundAmount || 0).toLocaleString('en-IN')}</span>
                </div>

                {order.refundId && (
                  <div className="flex items-start justify-between gap-3">
                    <span className="shrink-0 text-sm text-mk-muted-admin">Refund ID</span>
                    <span className="break-all text-right text-xs font-medium text-mk-ink-admin">{order.refundId}</span>
                  </div>
                )}

                {order.refundedAt && (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-mk-muted-admin">Refunded At</span>
                    <span className="text-right text-xs text-mk-ink-admin">{formatDate(order.refundedAt)}</span>
                  </div>
                )}

                {order.returnStatus === 'Refund Processing' && (
                  <div className="flex items-center gap-2 rounded-lg border border-mk-border bg-mk-bg p-3 text-xs font-medium text-mk-primary-hover">
                    <RefreshCw size={15} />
                    Refund is being processed. Verify the status before marking it complete.
                  </div>
                )}

                {order.returnStatus === 'Refunded' && (
                  <div className="flex items-center gap-2 rounded-lg border border-mk-border-admin bg-mk-bg-admin p-3 text-xs font-medium text-mk-success">
                    <CheckCircle2 size={15} />
                    Refund completed successfully.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORDER SUMMARY */}
          <div className="rounded-xl border border-mk-border-admin bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-mk-border-admin px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
                <ReceiptText size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-mk-ink-admin">Order Summary</h2>

                <p className="text-xs text-mk-subtle">Price breakdown</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-mk-muted-admin">Subtotal</span>

                <span className="text-sm font-medium text-mk-ink-admin">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-mk-muted-admin">Delivery Charge</span>

                <span className="text-sm font-medium text-mk-ink-admin">₹{order.deliveryCharge?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-mk-muted-admin">Tax</span>

                <span className="text-sm font-medium text-mk-ink-admin">₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>

              <div className="border-t border-mk-border-admin pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-mk-ink-admin">Total Amount</span>

                  <span className="text-xl font-bold text-mk-admin">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERED PRODUCTS */}
        <div className="mt-5 rounded-xl border border-mk-border-admin bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-mk-border-admin px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
              <ShoppingBagIcon />
            </div>

            <div>
              <h2 className="text-base font-bold text-mk-ink-admin">Ordered Products</h2>

              <p className="text-xs text-mk-subtle">{order.items?.length || 0} product(s) in this order</p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-200">
              <thead>
                <tr className="border-b border-mk-border-admin bg-mk-bg">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-mk-subtle">Product</th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-mk-subtle">Size</th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-mk-subtle">Qty</th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-mk-subtle">Price</th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-mk-subtle">Total</th>
                </tr>
              </thead>

              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={`${item.productId?._id || item.productId}-${index}`} className="border-b border-mk-border-admin last:border-b-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-mk-border-admin bg-mk-bg-admin">
                          {/* src={item.image || item.productId?.images?.[0]} */}
                          {item.image || item.productId?.images?.[0] ? (
                            <img src={getImageUrl(item.image || item.productId?.images?.[0])} alt={item.productName} className="h-full w-full object-contain" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-mk-subtle">
                              <Package size={22} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold text-mk-ink-admin">{item.productName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-mk-muted-admin">{item.size || '-'}</td>

                    <td className="px-5 py-4 text-center text-sm font-semibold text-mk-ink-admin">{item.quantity}</td>

                    <td className="px-5 py-4 text-right text-sm text-mk-muted-admin">₹{item.discountPrice?.toLocaleString('en-IN')}</td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-mk-ink-admin">₹{item.totalPrice?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-mk-border-admin md:hidden">
            {order.items?.map((item, index) => (
              <div key={`${item.productId?._id || item.productId}-${index}`} className="p-4">
                <div className="flex gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-mk-border-admin bg-mk-bg-admin">
                    {item.image || item.productId?.images?.[0] ? (
                      <img src={item.image || item.productId?.images?.[0]} alt={item.productName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-mk-subtle">
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-mk-ink-admin">{item.productName}</p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-mk-surface px-2 py-1 text-mk-muted-admin">Size: {item.size || '-'}</span>

                      <span className="rounded-md bg-mk-surface px-2 py-1 text-mk-muted-admin">Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-mk-subtle">Price</p>

                    <p className="text-sm font-semibold text-mk-ink-admin">₹{item.discountPrice?.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-mk-subtle">Total</p>

                    <p className="text-base font-bold text-mk-admin">₹{item.totalPrice?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="mt-5 rounded-xl border border-mk-border-admin bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-mk-border-admin px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
              <Truck size={19} />
            </div>

            <div>
              <h2 className="text-base font-bold text-mk-ink-admin">Order Status</h2>

              <p className="text-xs text-mk-subtle">Current order progress</p>
            </div>
          </div>

          <div className="overflow-x-auto p-5">
            <div className="flex min-w-212 items-start">
              {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'].map((status, index, statuses) => {
                const currentIndex = statuses.indexOf(order.orderStatus)

                const isCompleted = currentIndex >= index && currentIndex !== -1

                const isCurrent = order.orderStatus === status

                return (
                  <React.Fragment key={status}>
                    <div className="flex flex-1 flex-col items-center">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${isCompleted ? 'border-mk-admin bg-mk-admin text-white' : 'border-mk-border-admin bg-white text-mk-subtle'}`}>
                        {isCompleted ? <CheckCircle2 size={18} /> : <Clock3 size={17} />}
                      </div>

                      <p className={`mt-2 text-center text-xs font-semibold ${isCurrent ? 'text-mk-admin' : 'text-mk-subtle'}`}>{status}</p>
                    </div>

                    {index < statuses.length - 1 && <div className={`mt-5 h-0.5 flex-1 ${currentIndex > index ? 'bg-mk-admin' : 'bg-mk-border-admin'}`} />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>

        {/*   CANCEL / RETURN INFO */}
        {(order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned') && (
          <div className="mt-5 rounded-xl border border-mk-border bg-mk-bg p-5">
            <h3 className="text-sm font-bold text-mk-primary">{order.orderStatus} Order</h3>

            {order.cancellationReason && <p className="mt-2 text-sm text-mk-primary-deep">Reason: {order.cancellationReason}</p>}

            {order.cancelledAt && <p className="mt-1 text-xs text-mk-primary-hover">Date: {formatDate(order.cancelledAt)}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

// Small icon wrapper
const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

export default AdminOrderView
