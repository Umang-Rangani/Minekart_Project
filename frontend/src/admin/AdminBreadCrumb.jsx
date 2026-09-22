import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminBreadCrumb({ items, className = '' }) {
  return (
    <nav className={`w-full ${className}`} aria-label="Breadcrumb">
      <ol className="no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-sm">
        {/* Home */}
        <li className="flex shrink-0 items-center">
          <Link to="/admin" className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-semibold text-[#8E181F] transition-all duration-200 hover:bg-[#F7EEE7]">
            <Home size={15} strokeWidth={2} className="transition-transform duration-200 group-hover:scale-105" />
            <span>Dashboard</span>
          </Link>
        </li>

        {/* Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={index}>
              {/* Separator */}
              <li className="flex shrink-0 items-center">
                <ChevronRight size={15} strokeWidth={1.8} className="text-[#C9B8AF]" />
              </li>

              {/* Breadcrumb Item */}
              <li className="flex min-w-0 shrink-0 items-center" aria-current={isLast ? 'page' : undefined}>
                {item.link ? (
                  <Link to={item.link} className="max-w-45 truncate rounded-lg px-2 py-1.5 font-medium text-[#806C63] transition-all duration-200 hover:bg-[#F7EEE7] hover:text-[#8E181F]">
                    {item.title}
                  </Link>
                ) : (
                  <span className="max-w-55 truncate rounded-lg bg-[#F7EEE7] px-2.5 py-1.5 font-semibold text-[#351C18]">{item.title}</span>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
