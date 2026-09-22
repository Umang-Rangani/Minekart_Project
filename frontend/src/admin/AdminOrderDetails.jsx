import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, MapPin, Package, Phone, ReceiptText, Truck, User } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'

const AdminOrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirmingPayment, setConfirmingPayment] = useState(false)

  console.log(id);
  

  // GET ORDER DETAILS
  const getOrderDetails = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/admin/orders/${id}`)

      if (res.data.success) {
        setOrder(res.data.data)
      }
    } catch (error) {
      console.log('Get Admin Order Details Error:', error)

      alert(error.response?.data?.message || 'Unable to fetch order details')
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
      }
    } catch (error) {
      console.log('Confirm Payment Error:', error)

      alert(error.response?.data?.message || 'Unable to confirm payment')
    } finally {
      setConfirmingPayment(false)
    }
  }

  // STATUS STYLE
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'

      case 'Confirmed':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]'

      case 'Processing':
        return 'bg-[#F1EEE8] text-[#6B6258] border-[#E3DED6]'

      case 'Shipped':
        return 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]'

      case 'Out for Delivery':
        return 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'

      case 'Delivered':
        return 'bg-[#ECFDF5] text-[#15803D] border-[#BBF7D0]'

      case 'Cancelled':
        return 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'

      case 'Returned':
        return 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'

      default:
        return 'bg-[#F7F7F5] text-[#6F6A64] border-[#E3DED6]'
    }
  }

  // PAYMENT STATUS STYLE
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#ECFDF5] text-[#15803D] border-[#BBF7D0]'

      case 'Pending':
        return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'

      case 'Failed':
        return 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]'

      case 'Refunded':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]'

      default:
        return 'bg-[#F7F7F5] text-[#6F6A64] border-[#E3DED6]'
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
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F4F2EE]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#E3DED6] border-t-[#6B6258]" />

          <p className="text-sm font-medium text-[#6F6A64]">Loading order details...</p>
        </div>
      </div>
    )
  }

  // ORDER NOT FOUND
  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F4F2EE] px-5">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#6B6258] shadow-sm">
          <Package size={28} />
        </div>

        <h2 className="text-xl font-semibold text-[#292725]">Order not found</h2>

        <button type="button" onClick={() => navigate('/admin/orders')} className="mt-5 rounded-lg bg-[#6B6258] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F3A35]">
          Back to Orders
        </button>
      </div>
    )
  }

  const paymentStatus = order.payment?.paymentStatus || order.paymentStatus || 'Pending'

  const paymentMethod = order.payment?.paymentMethod || order.paymentMethod || 'COD'

  const isPaymentPending = paymentStatus === 'Pending'

  const isPaymentMethodValid = ['COD', 'ONLINE_ON_DELIVERY'].includes(paymentMethod)

  return (
    <div className="min-h-screen bg-[#F4F2EE] ">
      <div className="mx-auto max-w-375">
        {/*    HEADER */}
        <div className="mb-5 rounded-xl border border-[#E3DED6] bg-[#FBFAF7] px-4 py-2.5 shadow-sm sm:px-5">
          <div className="flex items-center justify-between gap-4">
            {/* Left */}
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/admin/orders')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                title="Back to Orders"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-bold text-[#292725] sm:text-xl">Order Details</h1>

                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusStyle(order.orderStatus)}`}>{order.orderStatus}</span>
                </div>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                  <p className="text-xs text-[#6F6A64]">Order ID: #{order.orderId}</p>

                  <span className="hidden text-[#D6D0C8] sm:block">•</span>

                  <p className="text-xs text-[#99938B]">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={`hidden shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold sm:inline-flex ${getStatusStyle(order.orderStatus)}`}>
              <Package size={15} />
              {order.orderStatus}
            </div>
          </div>
        </div>

        {/* TOP INFORMATION */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* CUSTOMER */}
          <div className="rounded-xl border border-[#E3DED6] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E3DED6] px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1EEE8] text-[#6B6258]">
                <User size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#292725]">Customer Information</h2>

                <p className="text-xs text-[#99938B]">Customer details</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="mb-1 text-xs font-medium text-[#99938B]">Name</p>

                <p className="text-sm font-semibold text-[#292725]">{order.userId?.name || '-'}</p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-[#99938B]">Email</p>

                <p className="break-all text-sm font-medium text-[#292725]">{order.userId?.email || '-'}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#6F6A64]" />

                <p className="text-sm font-medium text-[#292725]">{order.userId?.phone || '-'}</p>
              </div>
            </div>
          </div>

          {/* SHIPPING ADDRESS */}
          <div className="rounded-xl border border-[#E3DED6] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E3DED6] px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1EEE8] text-[#6B6258]">
                <MapPin size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#292725]">Delivery Address</h2>

                <p className="text-xs text-[#99938B]">Shipping information</p>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-[#292725]">{order.shippingAddress?.fullName || '-'}</p>

                <span className="rounded-md bg-[#F1EEE8] px-2.5 py-1 text-xs font-semibold text-[#6B6258]">{order.shippingAddress?.addressType || 'Home'}</span>
              </div>

              <p className="text-sm leading-6 text-[#6F6A64]">
                {order.shippingAddress?.addressLine || '-'}
                <br />
                {order.shippingAddress?.city || '-'}, {order.shippingAddress?.state || '-'}
                {' - '}
                {order.shippingAddress?.pincode || '-'}
              </p>

              {order.shippingAddress?.landmark && <p className="mt-2 text-xs text-[#99938B]">Landmark: {order.shippingAddress.landmark}</p>}

              <div className="mt-4 flex items-center gap-2 border-t border-[#E3DED6] pt-4">
                <Phone size={15} className="text-[#6F6A64]" />

                <span className="text-sm font-medium text-[#292725]">{order.shippingAddress?.phone || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT + SUMMARY */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* PAYMENT */}
          <div className="rounded-xl border border-[#E3DED6] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E3DED6] px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1EEE8] text-[#6B6258]">
                <CreditCard size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#292725]">Payment Information</h2>

                <p className="text-xs text-[#99938B]">Payment and transaction details</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#6F6A64]">Payment Method</span>

                <span className="text-sm font-semibold text-[#292725]">{paymentMethod === 'ONLINE_ON_DELIVERY' ? 'Online on Delivery' : 'Cash on Delivery'}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#6F6A64]">Payment Status</span>

                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPaymentStatusStyle(paymentStatus)}`}>{paymentStatus}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-[#6F6A64]">Amount</span>

                <span className="text-base font-bold text-[#292725]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
              </div>

              {order.payment?.transactionId && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#6F6A64]">Transaction ID</span>

                  <span className="max-w-55 break-all text-right text-xs font-medium text-[#292725]">{order.payment.transactionId}</span>
                </div>
              )}

              {order.payment?.paidAt && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#6F6A64]">Paid At</span>

                  <span className="text-xs font-medium text-[#292725]">{formatDate(order.payment.paidAt)}</span>
                </div>
              )}

              {isPaymentPending && isPaymentMethodValid && order.payment?._id && (
                <button
                  type="button"
                  onClick={handlePaymentConfirm}
                  disabled={confirmingPayment}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#6B6258] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />

                  {confirmingPayment ? 'Confirming...' : 'Confirm Payment'}
                </button>
              )}
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="rounded-xl border border-[#E3DED6] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#E3DED6] px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1EEE8] text-[#6B6258]">
                <ReceiptText size={19} />
              </div>

              <div>
                <h2 className="text-base font-bold text-[#292725]">Order Summary</h2>

                <p className="text-xs text-[#99938B]">Price breakdown</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6F6A64]">Subtotal</span>

                <span className="text-sm font-medium text-[#292725]">₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6F6A64]">Delivery Charge</span>

                <span className="text-sm font-medium text-[#292725]">₹{order.deliveryCharge?.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6F6A64]">Tax</span>

                <span className="text-sm font-medium text-[#292725]">₹{order.tax?.toLocaleString('en-IN')}</span>
              </div>

              <div className="border-t border-[#E3DED6] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-[#292725]">Total Amount</span>

                  <span className="text-xl font-bold text-[#6B6258]">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERED PRODUCTS */}
        <div className="mt-5 rounded-xl border border-[#E3DED6] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E3DED6] px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1EEE8] text-[#6B6258]">
              <ShoppingBagIcon />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#292725]">Ordered Products</h2>

              <p className="text-xs text-[#99938B]">{order.items?.length || 0} product(s) in this order</p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-200">
              <thead>
                <tr className="border-b border-[#E3DED6] bg-[#FBFAF7]">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Product</th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Size</th>

                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[#99938B]">Qty</th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#99938B]">Price</th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#99938B]">Total</th>
                </tr>
              </thead>

              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={`${item.productId?._id || item.productId}-${index}`} className="border-b border-[#E3DED6] last:border-b-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#E3DED6] bg-[#F7F7F5]">
                          {/* src={item.image || item.productId?.images?.[0]} */}
                          {item.image || item.productId?.images?.[0] ? (
                            <img src={`http://localhost:3000${item.image || item.productId?.images?.[0]}`} alt={item.productName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[#99938B]">
                              <Package size={22} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-semibold text-[#292725]">{item.productName}</p>

                          <p className="mt-1 text-xs text-[#99938B]">Product ID: {item.productId?._id || item.productId || '-'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#6F6A64]">{item.size || '-'}</td>

                    <td className="px-5 py-4 text-center text-sm font-semibold text-[#292725]">{item.quantity}</td>

                    <td className="px-5 py-4 text-right text-sm text-[#6F6A64]">₹{item.discountPrice?.toLocaleString('en-IN')}</td>

                    <td className="px-5 py-4 text-right text-sm font-bold text-[#292725]">₹{item.totalPrice?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-[#E3DED6] md:hidden">
            {order.items?.map((item, index) => (
              <div key={`${item.productId?._id || item.productId}-${index}`} className="p-4">
                <div className="flex gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-[#E3DED6] bg-[#F7F7F5]">
                    {item.image || item.productId?.images?.[0] ? (
                      <img src={item.image || item.productId?.images?.[0]} alt={item.productName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#99938B]">
                        <Package size={24} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-[#292725]">{item.productName}</p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-md bg-[#F1EEE8] px-2 py-1 text-[#6F6A64]">Size: {item.size || '-'}</span>

                      <span className="rounded-md bg-[#F1EEE8] px-2 py-1 text-[#6F6A64]">Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#99938B]">Price</p>

                    <p className="text-sm font-semibold text-[#292725]">₹{item.discountPrice?.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-[#99938B]">Total</p>

                    <p className="text-base font-bold text-[#6B6258]">₹{item.totalPrice?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ORDER STATUS */}
        <div className="mt-5 rounded-xl border border-[#E3DED6] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E3DED6] px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F1EEE8] text-[#6B6258]">
              <Truck size={19} />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#292725]">Order Status</h2>

              <p className="text-xs text-[#99938B]">Current order progress</p>
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
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${isCompleted ? 'border-[#6B6258] bg-[#6B6258] text-white' : 'border-[#E3DED6] bg-white text-[#99938B]'}`}>
                        {isCompleted ? <CheckCircle2 size={18} /> : <Clock3 size={17} />}
                      </div>

                      <p className={`mt-2 text-center text-xs font-semibold ${isCurrent ? 'text-[#6B6258]' : 'text-[#99938B]'}`}>{status}</p>
                    </div>

                    {index < statuses.length - 1 && <div className={`mt-5 h-0.5 flex-1 ${currentIndex > index ? 'bg-[#6B6258]' : 'bg-[#E3DED6]'}`} />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>

        {/*   CANCEL / RETURN INFO */}
        {(order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned') && (
          <div className="mt-5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-5">
            <h3 className="text-sm font-bold text-[#B91C1C]">{order.orderStatus} Order</h3>

            {order.cancellationReason && <p className="mt-2 text-sm text-[#7F1D1D]">Reason: {order.cancellationReason}</p>}

            {order.cancelledAt && <p className="mt-1 text-xs text-[#991B1B]">Date: {formatDate(order.cancelledAt)}</p>}
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

export default AdminOrderDetails
