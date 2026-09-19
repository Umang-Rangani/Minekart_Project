import React, { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Store, LayoutGrid, Tag, Grid2X2, ChevronLeft, ChevronRight } from 'lucide-react'
import { MdDashboard, MdCategory  } from 'react-icons/md'
import { TbCategory2 } from 'react-icons/tb'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: MdDashboard,
    },
    {
      name: 'Category',
      path: '/admin/category',
      icon: LayoutGrid,
    },
    {
      name: 'SubCategory',
      path: '/admin/subcategory',
      icon: TbCategory2,
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
      {/*  HEADER  */}
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

            {/* Sidebar Toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              title={sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              className="ml-2 flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
            >
              {sidebarOpen ? <ChevronLeft size={21} /> : <ChevronRight size={21} />}
            </button>
          </div>
        </div>
      </header>

      {/*  SIDEBAR  */}
      <aside className={`fixed bottom-0 left-0 top-17 z-40 border-r border-[#E3DED6] bg-[#F8F6F2] transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-18'}`}>
        <div className={`flex h-full flex-col py-5 ${sidebarOpen ? 'px-4' : 'px-2'}`}>
          {/* Menu Title */}
          <p className={`mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#99938B] ${sidebarOpen ? 'px-3' : 'text-center'}`}>{sidebarOpen ? 'Main Menu' : 'Menu'}</p>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  title={!sidebarOpen ? item.name : ''}
                  className={({ isActive }) =>
                    `group flex h-11 items-center rounded-xl text-sm font-medium transition ${sidebarOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} ${
                      isActive ? 'bg-[#6B6258] text-white shadow-sm' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={19} strokeWidth={isActive ? 2.2 : 1.9} />

                      {sidebarOpen && <span>{item.name}</span>}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Divider */}
          <div className="my-5 border-t border-[#E3DED6]" />

          {/* Settings Title */}
          <p className={`mb-3 text-[11px] font-semibold uppercase tracking-wider text-[#99938B] ${sidebarOpen ? 'px-3' : 'text-center'}`}>{sidebarOpen ? 'Settings' : '•••'}</p>

          {/* Settings */}
          <button
            type="button"
            title={!sidebarOpen ? 'Settings' : ''}
            className={`flex h-11 items-center rounded-xl text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725] ${sidebarOpen ? 'gap-3 px-3.5' : 'justify-center px-0'}`}
          >
            <Settings size={19} />

            {sidebarOpen && <span>Settings</span>}
          </button>

          {/* Bottom Info */}
          {sidebarOpen && (
            <div className="mt-auto rounded-2xl border border-[#E3DED6] bg-[#F1EEE8] p-4">
              <p className="text-xs font-semibold text-[#292725]">MineKart Admin</p>

              <p className="mt-1 text-[11px] leading-5 text-[#99938B]">Manage your store, products and orders.</p>
            </div>
          )}
        </div>
      </aside>

      {/*  MAIN CONTENT  */}
      <main className={`min-h-screen pt-17 transition-all duration-300 ${sidebarOpen ? 'lg:pl-60' : 'lg:pl-18'}`}>
        <div className="min-h-[calc(100vh-70px)] p-5 sm:p-6 lg:p-7">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
