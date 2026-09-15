import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function BreadCrumb({ items, className = '' }) {
  return (
    <nav className={`${className}`} aria-label="MascevBreadcrumb">
      <ol className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-sm">
        <li className="flex items-center gap-4">
          <Link to="/" className=" font-semibold text-[#1D4ED8] transition hover:text-[#1E40AF] ">
            <span className="hidden sm:inline">Home</span>
          </Link>

          <span className="text-[#CBD5E1]">/</span>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2" aria-current={index === items.length - 1 ? 'page' : undefined}>
            {index > 0 && <span className="text-[#CBD5E1]">/</span>}

            {item.link ? (
              <Link to={item.link} className=" font-medium text-[#64748B] transition hover:text-[#1D4ED8] ">
                {item.title}
              </Link>
            ) : (
              <span className="font-medium text-[#64748B]">{item.title}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
