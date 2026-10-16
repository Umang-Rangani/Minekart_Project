import React from 'react'
import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BreadCrumb({ items, className = '' }) {
  return (
    <nav className={`w-full pt-2 ${className}`} aria-label="Breadcrumb">
      <ol className="no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-[12px] sm:text-sm">
        {/* Home */}
        <li className="flex shrink-0 items-center">
          <Link to="/" className="group flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-semibold text-mk-primary-hover transition-all duration-200 hover:bg-mk-primary-soft">
            <Home size={15} strokeWidth={2} className="transition-transform duration-200 group-hover:scale-105" />
            <span>Home</span>
          </Link>
        </li>

        {/* Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={index}>
              {/* Separator */}
              <li className="flex shrink-0 items-center">
                <ChevronRight size={15} strokeWidth={1.8} className="text-mk-border" />
              </li>

              {/* Breadcrumb Item */}
              <li className="flex min-w-0 shrink-0 items-center" aria-current={isLast ? 'page' : undefined}>
                {item.link ? (
                  <Link to={item.link} className="max-w-45 truncate rounded-lg px-2 py-1.5 font-medium text-mk-muted transition-all duration-200 hover:bg-mk-primary-soft hover:text-mk-primary-hover">
                    {item.title}
                  </Link>
                ) : (
                  <span className="max-w-55 truncate rounded-lg bg-mk-primary-soft px-2.5 py-1.5 font-semibold text-mk-ink">{item.title}</span>
                )}
              </li>
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
