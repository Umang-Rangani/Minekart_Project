import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, Box, CheckCircle2, ChevronRight, Clock3, CreditCard, DollarSign, Package, RefreshCw, ShoppingBag, ShoppingCart, Store, Truck, Users, Wallet, AlertTriangle } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const getDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const res = await axiosInstance.get('/admin/dashboard')

      if (res.data?.success) {
        setDashboard(res.data.data)
      }
    } catch (error) {
      console.log('Dashboard Error:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    getDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-mk-bg-admin p-5 lg:p-7">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-7 h-10 w-72 animate-pulse rounded-xl bg-mk-border-admin" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-36 animate-pulse rounded-2xl bg-white shadow-sm" />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
            <div className="h-100 animate-pulse rounded-2xl bg-white" />
            <div className="h-100 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-125 items-center justify-center bg-mk-bg-admin p-5">
        <div className="w-full max-w-md rounded-2xl border border-mk-border-admin bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mk-primary-soft text-mk-primary-hover">
            <AlertTriangle size={25} />
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-mk-ink-admin">Dashboard unavailable</h2>

          <p className="mt-2 text-sm text-mk-muted">{error}</p>

          <button type="button" onClick={getDashboard} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-mk-admin px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-mk-ink-admin">
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { overview, salesOverview, orderOverview, productOverview, customerOverview, paymentOverview, recentOrders, topSellingProducts, lowStockProducts } = dashboard || {}

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`
  }

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusClass = (status) => {
    if (status === 'Delivered' || status === 'Paid') {
      return 'bg-mk-success-soft text-mk-success'
    }

    if (status === 'Cancelled' || status === 'Failed') {
      return 'bg-mk-primary-soft text-mk-danger'
    }

    if (status === 'Returned') {
      return 'bg-mk-primary-soft text-mk-warning'
    }

    return 'bg-mk-surface text-mk-admin'
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(overview?.totalRevenue),
      icon: Wallet,
      iconBg: 'bg-mk-danger-soft',
      iconColor: 'text-mk-admin',
      navi: null,
    },
    {
      title: 'Total Orders',
      value: overview?.totalOrders || 0,
      icon: ShoppingBag,
      iconBg: 'bg-mk-surface',
      iconColor: 'text-mk-danger',
      navi: '/admin/orders',
    },
    {
      title: 'Total Products',
      value: overview?.totalProducts || 0,
      icon: Package,
      iconBg: 'bg-mk-surface',
      iconColor: 'text-mk-muted-admin',
      navi: '/admin/products',
    },
    {
      title: 'Total Customers',
      value: overview?.totalUsers || 0,
      icon: Users,
      iconBg: 'bg-mk-primary-soft',
      iconColor: 'text-mk-warning',
      navi: '/admin/users',
    },
  ]

  const orderStatuses = [
    { label: 'Pending', value: orderOverview?.pending, icon: Clock3 },
    { label: 'Confirmed', value: orderOverview?.confirmed, icon: CheckCircle2 },
    { label: 'Processing', value: orderOverview?.processing, icon: Activity },
    { label: 'Shipped', value: orderOverview?.shipped, icon: Truck },
    { label: 'Out for Delivery', value: orderOverview?.outForDelivery, icon: Truck },
    { label: 'Delivered', value: orderOverview?.delivered, icon: CheckCircle2 },
    { label: 'Cancelled', value: orderOverview?.cancelled, icon: ArrowDownRight },
    { label: 'Returned', value: orderOverview?.returned, icon: RefreshCw },
  ]

  const maxSales = Math.max(...(salesOverview?.salesChart || []).map((item) => item.sales || 0), 1)

  return (
    <div className="min-h-screen bg-mk-bg-admin space-y-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mk-admin text-white shadow-sm">
                <BarChart3 size={20} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-mk-ink-admin">Dashboard</h1>
                <p className="text-xs font-medium text-mk-disabled">Welcome back to your MineKart admin panel</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={getDashboard}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-mk-border-admin bg-mk-bg px-4 py-2.5 text-xs font-bold text-mk-admin-hover shadow-sm transition-all duration-300 hover:border-mk-subtle hover:bg-white hover:shadow-md sm:self-auto"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.title}
                onClick={() => navigate(`${stat.navi}`)}
                className="group cursor-pointer rounded-2xl border border-mk-border-admin bg-white p-5 shadow-[0_4px_18px_rgba(63,58,53,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(63,58,53,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-mk-subtle">{stat.title}</p>

                    <p className="mt-3 text-2xl font-extrabold tracking-tight text-mk-ink-admin">{stat.value}</p>
                  </div>

                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-mk-muted">
                  <ArrowUpRight size={13} />
                  Current overview
                </div>
              </div>
            )
          })}
        </div>

        {/* Sales + Order Overview */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.8fr)]">
          {/* Sales */}
          <div className="rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="flex items-center justify-between border-b border-mk-surface px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-mk-ink-admin">Sales Overview</h2>
                <p className="mt-1 text-[11px] font-medium text-mk-subtle">Last 7 days performance</p>
              </div>

              <div className="rounded-lg bg-mk-surface px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-mk-subtle">Revenue</p>
                <p className="mt-0.5 text-sm font-extrabold text-mk-admin">{formatCurrency(salesOverview?.totalRevenue)}</p>
              </div>
            </div>

            <div className="p-5">
              {salesOverview?.salesChart?.length ? (
                <div className="flex h-70 items-end gap-2 sm:gap-4">
                  {salesOverview.salesChart.map((item) => {
                    const height = Math.max((item.sales / maxSales) * 100, 5)

                    return (
                      <div key={item.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <div className="relative flex h-full w-full items-end justify-center">
                          <div className="group relative w-full max-w-12">
                            <div className="w-full rounded-t-lg bg-linear-to-t from-mk-admin to-mk-subtle transition-all duration-500 hover:from-mk-ink-admin hover:to-mk-admin" style={{ height: `${height * 2.25}px`, maxHeight: '225px' }} />

                            <div className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-lg bg-mk-ink-admin px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block">{formatCurrency(item.sales)}</div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-[9px] font-bold text-mk-disabled sm:text-[10px]">
                            {new Date(item.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                            })}
                          </p>
                          <p className="mt-0.5 text-[9px] font-medium text-mk-subtle">{item.orders} orders</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex h-70 flex-col items-center justify-center text-center">
                  <BarChart3 size={34} className="text-mk-border-admin" />
                  <p className="mt-3 text-sm font-bold text-mk-admin">No sales data</p>
                  <p className="mt-1 text-xs text-mk-subtle">Sales will appear here when orders are placed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Overview */}
          <div className="rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-mk-surface px-5 py-4">
              <h2 className="text-sm font-extrabold text-mk-ink-admin">Order Overview</h2>
              <p className="mt-1 text-[11px] font-medium text-mk-subtle">Current order statuses</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              {orderStatuses.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-mk-disabled-bg bg-mk-bg p-3 transition-all duration-200 hover:border-mk-border-admin hover:bg-white">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-mk-surface text-mk-admin">
                        <Icon size={14} />
                      </div>

                      <span className="truncate text-[10px] font-bold text-mk-muted-admin">{item.label}</span>
                    </div>

                    <span className="ml-2 text-sm font-extrabold text-mk-ink-admin">{item.value || 0}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Product Overview */}
          <div className="rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-mk-surface px-5 py-4">
              <h2 className="text-sm font-extrabold text-mk-ink-admin">Product Overview</h2>
              <p className="mt-1 text-[11px] text-mk-subtle">Inventory summary</p>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between rounded-xl bg-mk-bg-admin p-3.5">
                <div className="flex items-center gap-3">
                  <Box size={17} className="text-mk-admin" />
                  <span className="text-xs font-bold text-mk-admin">Total Products</span>
                </div>
                <span className="text-sm font-extrabold text-mk-ink-admin">{productOverview?.total || 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-mk-bg-admin p-3.5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-mk-success" />
                  <span className="text-xs font-bold text-mk-admin">Active</span>
                </div>
                <span className="text-sm font-extrabold text-mk-success">{productOverview?.active || 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-mk-bg-admin p-3.5">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={17} className="text-mk-warning" />
                  <span className="text-xs font-bold text-mk-warning">Low Stock</span>
                </div>
                <span className="text-sm font-extrabold text-mk-warning">{productOverview?.lowStock || 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-mk-primary-soft p-3.5">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={17} className="text-mk-danger" />
                  <span className="text-xs font-bold text-mk-danger">Out of Stock</span>
                </div>
                <span className="text-sm font-extrabold text-mk-danger">{productOverview?.outOfStock || 0}</span>
              </div>
            </div>
          </div>

          {/* Customer Overview */}
          <div className="rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-mk-surface px-5 py-4">
              <h2 className="text-sm font-extrabold text-mk-ink-admin">Customer Overview</h2>
              <p className="mt-1 text-[11px] text-mk-subtle">Customer statistics</p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-mk-surface to-mk-bg p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mk-admin text-white shadow-sm">
                  <Users size={24} />
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-mk-ink-admin">{customerOverview?.total || 0}</p>
                  <p className="text-[11px] font-bold text-mk-subtle">Total Customers</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-mk-disabled-bg bg-mk-bg-admin p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mk-disabled">Active</p>
                  <p className="mt-2 text-xl font-extrabold text-mk-success">{customerOverview?.active || 0}</p>
                </div>

                <div className="rounded-xl border border-mk-disabled-bg bg-mk-bg p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-mk-subtle">Inactive</p>
                  <p className="mt-2 text-xl font-extrabold text-mk-admin">{customerOverview?.inactive || 0}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-mk-bg px-4 py-3">
                <span className="text-xs font-bold text-mk-warning">New this month</span>
                <span className="text-sm font-extrabold text-mk-warning">+{customerOverview?.newCustomers || 0}</span>
              </div>
            </div>
          </div>

          {/* Payment Overview */}
          <div className="rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-mk-surface px-5 py-4">
              <h2 className="text-sm font-extrabold text-mk-ink-admin">Payment Overview</h2>
              <p className="mt-1 text-[11px] text-mk-subtle">Payment methods & status</p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-mk-border-admin bg-mk-bg p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={15} className="text-mk-admin" />
                    <span className="text-[10px] font-bold text-mk-subtle">COD</span>
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-mk-ink-admin">{paymentOverview?.methods?.cod || 0}</p>
                </div>

                <div className="rounded-xl border border-mk-border-admin bg-mk-bg p-4">
                  <div className="flex items-center gap-2">
                    <Wallet size={15} className="text-mk-admin" />
                    <span className="text-[10px] font-bold text-mk-subtle">Online</span>
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-mk-ink-admin">{paymentOverview?.methods?.onlineOnDelivery || 0}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  ['Pending', paymentOverview?.status?.pending, 'text-mk-warning', 'bg-mk-bg'],
                  ['Paid', paymentOverview?.status?.paid, 'text-mk-success', 'bg-mk-bg-admin'],
                  ['Failed', paymentOverview?.status?.failed, 'text-mk-danger', 'bg-mk-primary-soft'],
                  ['Refunded', paymentOverview?.status?.refunded, 'text-mk-admin', 'bg-mk-surface'],
                ].map(([label, value, textColor, bgColor]) => (
                  <div key={label} className={`flex items-center justify-between rounded-lg px-3 py-2.5 ${bgColor}`}>
                    <span className={`text-[11px] font-bold ${textColor}`}>{label}</span>
                    <span className={`text-xs font-extrabold ${textColor}`}>{value || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders + Top Selling */}
        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
          {/* Recent Orders */}
          <div className="rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="flex items-center justify-between border-b border-mk-surface px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-mk-ink-admin">Recent Orders</h2>
                <p className="mt-1 text-[11px] text-mk-subtle">Latest customer orders</p>
              </div>

              <button type="button" className="flex items-center gap-1 text-[11px] font-bold text-mk-admin transition-colors hover:text-mk-ink-admin">
                View All
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-175">
                <thead>
                  <tr className="border-b border-mk-surface bg-mk-bg">
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-mk-subtle">Customer</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-mk-subtle">Items</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-mk-subtle">Amount</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-mk-subtle">Payment</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-mk-subtle">Status</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-mk-subtle">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders?.length ? (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-mk-surface transition-colors hover:bg-mk-bg">
                        <td className="px-5 py-4">
                          <div>
                            <p className="max-w-38 truncate text-xs font-bold text-mk-ink-admin">{order.userId?.name || 'Unknown'}</p>
                            <p className="mt-0.5 max-w-38 truncate text-[10px] text-mk-subtle">{order.userId?.email || '-'}</p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs font-bold text-mk-admin">{order.items?.length || 0}</td>

                        <td className="px-5 py-4 text-xs font-extrabold text-mk-ink-admin">{formatCurrency(order.totalAmount)}</td>

                        <td className="px-5 py-4">
                          <span className="text-[10px] font-bold text-mk-admin">{order.paymentMethod === 'COD' ? 'COD' : 'Online'}</span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                        </td>

                        <td className="px-5 py-4 text-[10px] font-semibold text-mk-disabled">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-12 text-center text-xs font-semibold text-mk-subtle">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Selling */}
          <div className="rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="flex items-center justify-between border-b border-mk-surface px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-mk-ink-admin">Top Selling Products</h2>
                <p className="mt-1 text-[11px] text-mk-subtle">Products with highest sales</p>
              </div>

              <Store size={18} className="text-mk-disabled" />
            </div>

            <div className="space-y-2.5 p-4">
              {topSellingProducts?.length ? (
                topSellingProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center gap-3 rounded-xl border border-mk-surface bg-mk-bg p-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mk-surface text-[10px] font-extrabold text-mk-admin">{String(index + 1).padStart(2, '0')}</span>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-mk-border-admin bg-white">
                      {product.images?.[0] ? <img src={getImageUrl(product.images[0])} alt={product.productName} className="h-full w-full object-contain p-1" /> : <Package size={18} className="text-mk-subtle" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-mk-ink-admin">{product.productName}</p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-mk-admin">{product.soldCount || 0} sold</span>
                        <span className="text-[10px] text-mk-subtle">•</span>
                        <span className="text-[10px] font-semibold text-mk-disabled">{formatCurrency(product.discountPrice || product.price)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-xs font-semibold text-mk-subtle">No selling data found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="mt-5 rounded-2xl border border-mk-border-admin bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
          <div className="flex items-center justify-between border-b border-mk-surface px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mk-bg text-mk-warning">
                <AlertTriangle size={17} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-mk-ink-admin">Low Stock Alert</h2>
                <p className="mt-1 text-[11px] text-mk-subtle">Products that need inventory attention</p>
              </div>
            </div>

            <span className="rounded-full bg-mk-bg px-3 py-1.5 text-[10px] font-extrabold text-mk-warning">{productOverview?.lowStock || 0} Low Stock</span>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {lowStockProducts?.length ? (
              lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/admin/products/${product._id}/update`)}
                  className="rounded-xl border border-mk-border bg-mk-bg p-3 transition-all duration-200 hover:border-mk-border-admin hover:bg-white hover:shadow-sm"
                >
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-mk-border-admin bg-white">
                    {product.images?.[0] ? <img src={getImageUrl(product.images[0])} alt={product.productName} className="h-full w-full object-contain p-2" /> : <Package size={25} className="text-mk-subtle" />}
                  </div>

                  <p className="mt-3 truncate text-xs font-bold text-mk-ink-admin">{product.productName}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-mk-disabled">{formatCurrency(product.discountPrice || product.price)}</span>

                    <span className={`rounded-full px-2 py-1 text-[9px] font-extrabold ${product.stock === 0 ? 'bg-mk-primary-soft text-mk-danger' : 'bg-mk-bg text-mk-warning'}`}>{product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs font-semibold text-mk-subtle">No low stock products.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
