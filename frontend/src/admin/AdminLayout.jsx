import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Store, LayoutGrid, Tag, Grid2X2 } from 'lucide-react'

export default function AdminLayout() {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Category',
      path: '/admin/category',
      icon: LayoutGrid,
    },

    {
      name: 'SubCategory',
      path: '/admin/subcategory',
      icon: Grid2X2,
    },

    {
      name: 'Brand',
      path: '/admin/brand',
      icon: Tag,
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: Package,
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Users',
      path: '/admin/users',
      icon: Users,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#292725]">
      {/* ================= HEADER ================= */}
      <header className="fixed left-0 right-0 top-0 z-50 h-17 border-b border-[#E3DED6] bg-[#FBFAF7]/95 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-5 lg:px-7">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#6B6258] text-white shadow-sm">
              <Store size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-[#292725]">
                Mine<span className="text-[#6B6258]">Kart</span>
              </h1>

              <p className="text-[11px] font-medium text-[#99938B]">Admin Panel</p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= SIDEBAR ================= */}
      <aside className="fixed bottom-0 left-0 top-17 z-40 hidden w-60 border-r border-[#E3DED6] bg-[#F8F6F2] lg:block">
        <div className="flex h-full flex-col px-4 py-5">
          {/* Menu Title */}
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Main Menu</p>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) => `group flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium transition ${isActive ? 'bg-[#6B6258] text-white shadow-sm' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'}`}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={19} strokeWidth={isActive ? 2.2 : 1.9} />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Divider */}
          <div className="my-5 border-t border-[#E3DED6]" />

          {/* Settings */}
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Settings</p>

          <button type="button" className="flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]">
            <Settings size={19} />

            <span>Settings</span>
          </button>

          {/* Bottom */}
          <div className="mt-auto">
            <div className="rounded-2xl border border-[#E3DED6] bg-[#F1EEE8] p-4">
              <p className="text-xs font-semibold text-[#292725]">MineKart Admin</p>

              <p className="mt-1 text-[11px] leading-5 text-[#99938B]">Manage your store, products and orders.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="min-h-screen pt-17 lg:pl-60">
        <div className="min-h-[calc(100vh-70px)] p-5 sm:p-6 lg:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
