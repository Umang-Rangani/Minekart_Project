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
      <div className="min-h-screen bg-[#F4F2EE] p-5 lg:p-7">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-7 h-10 w-72 animate-pulse rounded-xl bg-[#E3DED6]" />
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
      <div className="flex min-h-125 items-center justify-center bg-[#F4F2EE] p-5">
        <div className="w-full max-w-md rounded-2xl border border-[#E3DED6] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5EAE7] text-[#8E181F]">
            <AlertTriangle size={25} />
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-[#3F3A35]">Dashboard unavailable</h2>

          <p className="mt-2 text-sm text-[#7C746D]">{error}</p>

          <button type="button" onClick={getDashboard} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6B6258] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#3F3A35]">
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
      return 'bg-[#EAF4ED] text-[#467653]'
    }

    if (status === 'Cancelled' || status === 'Failed') {
      return 'bg-[#F8E8E7] text-[#9A3E3A]'
    }

    if (status === 'Returned') {
      return 'bg-[#F7EFE3] text-[#9A6A32]'
    }

    return 'bg-[#F2EEE8] text-[#6B6258]'
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(overview?.totalRevenue),
      icon: Wallet,
      iconBg: 'bg-[#F0EBE5]',
      iconColor: 'text-[#6B6258]',
      navi: null,
    },
    {
      title: 'Total Orders',
      value: overview?.totalOrders || 0,
      icon: ShoppingBag,
      iconBg: 'bg-[#F3ECE8]',
      iconColor: 'text-[#8E5145]',
      navi: '/admin/orders',
    },
    {
      title: 'Total Products',
      value: overview?.totalProducts || 0,
      icon: Package,
      iconBg: 'bg-[#EEECE7]',
      iconColor: 'text-[#756D64]',
      navi: '/admin/products',
    },
    {
      title: 'Total Customers',
      value: overview?.totalUsers || 0,
      icon: Users,
      iconBg: 'bg-[#F4EEE7]',
      iconColor: 'text-[#9A6A32]',
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
    <div className="min-h-screen bg-[#F4F2EE] space-y-6">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6B6258] text-white shadow-sm">
                <BarChart3 size={20} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-[#3F3A35]">Dashboard</h1>
                <p className="text-xs font-medium text-[#8A8179]">Welcome back to your MineKart admin panel</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={getDashboard}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#D9D1C8] bg-[#FBFAF7] px-4 py-2.5 text-xs font-bold text-[#5C554E] shadow-sm transition-all duration-300 hover:border-[#B9AEA3] hover:bg-white hover:shadow-md sm:self-auto"
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
                className="group cursor-pointer rounded-2xl border border-[#E3DED6] bg-white p-5 shadow-[0_4px_18px_rgba(63,58,53,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(63,58,53,0.08)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#958C84]">{stat.title}</p>

                    <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#3F3A35]">{stat.value}</p>
                  </div>

                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor} transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={20} />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-[#7A726A]">
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
          <div className="rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="flex items-center justify-between border-b border-[#EAE5DE] px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-[#3F3A35]">Sales Overview</h2>
                <p className="mt-1 text-[11px] font-medium text-[#958C84]">Last 7 days performance</p>
              </div>

              <div className="rounded-lg bg-[#F4F1EC] px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#958C84]">Revenue</p>
                <p className="mt-0.5 text-sm font-extrabold text-[#6B6258]">{formatCurrency(salesOverview?.totalRevenue)}</p>
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
                            <div className="w-full rounded-t-lg bg-linear-to-t from-[#6B6258] to-[#A0958A] transition-all duration-500 hover:from-[#3F3A35] hover:to-[#6B6258]" style={{ height: `${height * 2.25}px`, maxHeight: '225px' }} />

                            <div className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 rounded-lg bg-[#3F3A35] px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block">{formatCurrency(item.sales)}</div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-[9px] font-bold text-[#8F877F] sm:text-[10px]">
                            {new Date(item.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                            })}
                          </p>
                          <p className="mt-0.5 text-[9px] font-medium text-[#B0A79F]">{item.orders} orders</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex h-70 flex-col items-center justify-center text-center">
                  <BarChart3 size={34} className="text-[#C5BCB3]" />
                  <p className="mt-3 text-sm font-bold text-[#6B6258]">No sales data</p>
                  <p className="mt-1 text-xs text-[#958C84]">Sales will appear here when orders are placed.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Overview */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-[#EAE5DE] px-5 py-4">
              <h2 className="text-sm font-extrabold text-[#3F3A35]">Order Overview</h2>
              <p className="mt-1 text-[11px] font-medium text-[#958C84]">Current order statuses</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              {orderStatuses.map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-[#E9E4DD] bg-[#FBFAF7] p-3 transition-all duration-200 hover:border-[#D5CCC2] hover:bg-white">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0ECE7] text-[#6B6258]">
                        <Icon size={14} />
                      </div>

                      <span className="truncate text-[10px] font-bold text-[#716960]">{item.label}</span>
                    </div>

                    <span className="ml-2 text-sm font-extrabold text-[#3F3A35]">{item.value || 0}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Product Overview */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-[#EAE5DE] px-5 py-4">
              <h2 className="text-sm font-extrabold text-[#3F3A35]">Product Overview</h2>
              <p className="mt-1 text-[11px] text-[#958C84]">Inventory summary</p>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between rounded-xl bg-[#F6F3EF] p-3.5">
                <div className="flex items-center gap-3">
                  <Box size={17} className="text-[#6B6258]" />
                  <span className="text-xs font-bold text-[#6B6258]">Total Products</span>
                </div>
                <span className="text-sm font-extrabold text-[#3F3A35]">{productOverview?.total || 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#F3F7F3] p-3.5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={17} className="text-[#467653]" />
                  <span className="text-xs font-bold text-[#55725C]">Active</span>
                </div>
                <span className="text-sm font-extrabold text-[#467653]">{productOverview?.active || 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#F7F3ED] p-3.5">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={17} className="text-[#9A6A32]" />
                  <span className="text-xs font-bold text-[#846036]">Low Stock</span>
                </div>
                <span className="text-sm font-extrabold text-[#9A6A32]">{productOverview?.lowStock || 0}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#F8EDEC] p-3.5">
                <div className="flex items-center gap-3">
                  <ShoppingCart size={17} className="text-[#9A3E3A]" />
                  <span className="text-xs font-bold text-[#8C4946]">Out of Stock</span>
                </div>
                <span className="text-sm font-extrabold text-[#9A3E3A]">{productOverview?.outOfStock || 0}</span>
              </div>
            </div>
          </div>

          {/* Customer Overview */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-[#EAE5DE] px-5 py-4">
              <h2 className="text-sm font-extrabold text-[#3F3A35]">Customer Overview</h2>
              <p className="mt-1 text-[11px] text-[#958C84]">Customer statistics</p>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4 rounded-2xl bg-linear-to-br from-[#F4F0EB] to-[#FBFAF7] p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6B6258] text-white shadow-sm">
                  <Users size={24} />
                </div>

                <div>
                  <p className="text-2xl font-extrabold text-[#3F3A35]">{customerOverview?.total || 0}</p>
                  <p className="text-[11px] font-bold text-[#958C84]">Total Customers</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E4E8E4] bg-[#F7FAF7] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#829287]">Active</p>
                  <p className="mt-2 text-xl font-extrabold text-[#467653]">{customerOverview?.active || 0}</p>
                </div>

                <div className="rounded-xl border border-[#E9E4DD] bg-[#FBFAF7] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#958C84]">Inactive</p>
                  <p className="mt-2 text-xl font-extrabold text-[#6B6258]">{customerOverview?.inactive || 0}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#F7F1E9] px-4 py-3">
                <span className="text-xs font-bold text-[#846036]">New this month</span>
                <span className="text-sm font-extrabold text-[#9A6A32]">+{customerOverview?.newCustomers || 0}</span>
              </div>
            </div>
          </div>

          {/* Payment Overview */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="border-b border-[#EAE5DE] px-5 py-4">
              <h2 className="text-sm font-extrabold text-[#3F3A35]">Payment Overview</h2>
              <p className="mt-1 text-[11px] text-[#958C84]">Payment methods & status</p>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#E3DED6] bg-[#FBFAF7] p-4">
                  <div className="flex items-center gap-2">
                    <CreditCard size={15} className="text-[#6B6258]" />
                    <span className="text-[10px] font-bold text-[#958C84]">COD</span>
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-[#3F3A35]">{paymentOverview?.methods?.cod || 0}</p>
                </div>

                <div className="rounded-xl border border-[#E3DED6] bg-[#FBFAF7] p-4">
                  <div className="flex items-center gap-2">
                    <Wallet size={15} className="text-[#6B6258]" />
                    <span className="text-[10px] font-bold text-[#958C84]">Online</span>
                  </div>
                  <p className="mt-2 text-xl font-extrabold text-[#3F3A35]">{paymentOverview?.methods?.onlineOnDelivery || 0}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {[
                  ['Pending', paymentOverview?.status?.pending, 'text-[#9A6A32]', 'bg-[#F7F1E9]'],
                  ['Paid', paymentOverview?.status?.paid, 'text-[#467653]', 'bg-[#F1F7F2]'],
                  ['Failed', paymentOverview?.status?.failed, 'text-[#9A3E3A]', 'bg-[#F8EDEC]'],
                  ['Refunded', paymentOverview?.status?.refunded, 'text-[#6B6258]', 'bg-[#F1EFEB]'],
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
          <div className="rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="flex items-center justify-between border-b border-[#EAE5DE] px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-[#3F3A35]">Recent Orders</h2>
                <p className="mt-1 text-[11px] text-[#958C84]">Latest customer orders</p>
              </div>

              <button type="button" className="flex items-center gap-1 text-[11px] font-bold text-[#6B6258] transition-colors hover:text-[#3F3A35]">
                View All
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-175">
                <thead>
                  <tr className="border-b border-[#EAE5DE] bg-[#FBFAF7]">
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#958C84]">Customer</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#958C84]">Items</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#958C84]">Amount</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#958C84]">Payment</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#958C84]">Status</th>
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider text-[#958C84]">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders?.length ? (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="border-b border-[#F0ECE7] transition-colors hover:bg-[#FBFAF7]">
                        <td className="px-5 py-4">
                          <div>
                            <p className="max-w-38 truncate text-xs font-bold text-[#3F3A35]">{order.userId?.name || 'Unknown'}</p>
                            <p className="mt-0.5 max-w-38 truncate text-[10px] text-[#9A9189]">{order.userId?.email || '-'}</p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs font-bold text-[#6B6258]">{order.items?.length || 0}</td>

                        <td className="px-5 py-4 text-xs font-extrabold text-[#3F3A35]">{formatCurrency(order.totalAmount)}</td>

                        <td className="px-5 py-4">
                          <span className="text-[10px] font-bold text-[#6B6258]">{order.paymentMethod === 'COD' ? 'COD' : 'Online'}</span>
                        </td>

                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                        </td>

                        <td className="px-5 py-4 text-[10px] font-semibold text-[#8E867E]">{formatDate(order.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-5 py-12 text-center text-xs font-semibold text-[#958C84]">
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Selling */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
            <div className="flex items-center justify-between border-b border-[#EAE5DE] px-5 py-4">
              <div>
                <h2 className="text-sm font-extrabold text-[#3F3A35]">Top Selling Products</h2>
                <p className="mt-1 text-[11px] text-[#958C84]">Products with highest sales</p>
              </div>

              <Store size={18} className="text-[#8D837A]" />
            </div>

            <div className="space-y-2.5 p-4">
              {topSellingProducts?.length ? (
                topSellingProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center gap-3 rounded-xl border border-[#EAE5DE] bg-[#FBFAF7] p-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEEAE4] text-[10px] font-extrabold text-[#6B6258]">{String(index + 1).padStart(2, '0')}</span>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E3DED6] bg-white">
                      {product.images?.[0] ? <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="h-full w-full object-contain p-1" /> : <Package size={18} className="text-[#B4AAA1]" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-[#3F3A35]">{product.productName}</p>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-[#6B6258]">{product.soldCount || 0} sold</span>
                        <span className="text-[10px] text-[#B2A9A1]">•</span>
                        <span className="text-[10px] font-semibold text-[#8E867E]">{formatCurrency(product.discountPrice || product.price)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-xs font-semibold text-[#958C84]">No selling data found.</div>
              )}
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="mt-5 rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.05)]">
          <div className="flex items-center justify-between border-b border-[#EAE5DE] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7F1E9] text-[#9A6A32]">
                <AlertTriangle size={17} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#3F3A35]">Low Stock Alert</h2>
                <p className="mt-1 text-[11px] text-[#958C84]">Products that need inventory attention</p>
              </div>
            </div>

            <span className="rounded-full bg-[#F7F1E9] px-3 py-1.5 text-[10px] font-extrabold text-[#9A6A32]">{productOverview?.lowStock || 0} Low Stock</span>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {lowStockProducts?.length ? (
              lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/admin/products/${product._id}/update`)}
                  className="rounded-xl border border-[#E8E1D8] bg-[#FBFAF7] p-3 transition-all duration-200 hover:border-[#D7CFC5] hover:bg-white hover:shadow-sm"
                >
                  <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[#E7E0D8] bg-white">
                    {product.images?.[0] ? <img src={`http://localhost:3000${product.images[0]}`} alt={product.productName} className="h-full w-full object-contain p-2" /> : <Package size={25} className="text-[#B4AAA1]" />}
                  </div>

                  <p className="mt-3 truncate text-xs font-bold text-[#3F3A35]">{product.productName}</p>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#8E867E]">{formatCurrency(product.discountPrice || product.price)}</span>

                    <span className={`rounded-full px-2 py-1 text-[9px] font-extrabold ${product.stock === 0 ? 'bg-[#F8E8E7] text-[#9A3E3A]' : 'bg-[#F7F1E9] text-[#9A6A32]'}`}>{product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-xs font-semibold text-[#958C84]">No low stock products.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
