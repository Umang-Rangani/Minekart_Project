import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight, Clock3, LoaderCircle, MessageSquare, Plus, UserRound } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../../config/axiosConfig'
import BreadCrumb from '../../user/BreadCrumb'
import MySupportShimmer from '../../userShimmer/MySupportShimmer'

export default function MySupport() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. filter
  const [selectedStatus, setSelectedStatus] = useState('')

  const getSupportRequests = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get('/contact/my')

      if (response.data?.success) {
        setContacts(response.data.data || [])
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load support requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'My Support | MineKart'

    getSupportRequests()
  }, [])

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusStyle = (status) => {
    if (status === 'Pending') {
      return 'border-mk-border bg-mk-primary-soft text-mk-warning'
    }

    if (status === 'In Progress') {
      return 'border-mk-border bg-mk-surface text-mk-admin'
    }

    return 'border-mk-border-admin bg-mk-surface text-mk-success'
  }

  // 2. filter
  const uniqueStatuses = [...new Set(contacts.map((contact) => contact.status).filter(Boolean))]

  const filteredContacts = selectedStatus ? contacts.filter((contact) => contact.status === selectedStatus) : contacts

  if (loading) {
    return <MySupportShimmer />
  }

  const items = [
    {
      title: 'Contact Us',
      link: '/contact',
    },
    {
      title: 'My Support',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen  mx-auto ">
      <BreadCrumb items={items} />

      <div className=" py-5 ">
        {/* Header */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-mk-border bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <MessageSquare size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-mk-ink sm:text-sm">My Support</h1>

              <p className="mt-0.5 truncate text-[9px] text-mk-muted sm:text-[10px]">Get help and manage your requests</p>
            </div>
          </div>

          <Link to="/contact" className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-mk-primary px-2.5 text-[9px] font-bold text-white transition hover:bg-mk-primary-deep sm:px-3 sm:text-[10px]">
            <Plus size={14} />
            New Request
          </Link>
        </div>

        {/*3. STATUS FILTER */}
        {filteredContacts.length > 0 && uniqueStatuses.length > 0 && (
          <div className="mb-5">
            <div className="mb-2 flex items-center gap-1.5">
              <MessageSquare size={13} className="text-mk-primary-hover" />

              <span className="text-[9px] font-bold uppercase tracking-wider text-mk-muted">Filter By Status</span>
            </div>

            <div className="no-scrollbar overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2">
                {/* ALL */}
                <button
                  type="button"
                  onClick={() => setSelectedStatus('')}
                  className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[10px] font-bold transition-all duration-200 active:scale-95 sm:text-[11px] ${
                    selectedStatus === '' ? 'bg-mk-primary-hover text-white shadow-[0_4px_12px_rgba(142,24,31,0.16)]' : 'border border-mk-border bg-white text-mk-muted hover:border-mk-border hover:bg-mk-bg hover:text-mk-primary-hover'
                  }`}
                >
                  {selectedStatus === '' && <Check size={12} strokeWidth={2.5} />}

                  <span>All</span>

                  <span className={`rounded-md px-1.5 py-0.5 text-[8px] ${selectedStatus === '' ? 'bg-white/15 text-white' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>{contacts.length}</span>
                </button>

                {/* STATUS */}
                {uniqueStatuses.map((status) => {
                  const active = selectedStatus === status

                  const count = contacts.filter((contact) => contact.status === status).length

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setSelectedStatus(status)}
                      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[10px] font-semibold transition-all duration-200 active:scale-95 sm:text-[11px] ${
                        active ? 'bg-mk-primary-hover text-white shadow-[0_4px_12px_rgba(142,24,31,0.16)]' : 'border border-mk-border bg-white text-mk-muted hover:border-mk-border hover:bg-mk-bg hover:text-mk-primary-hover'
                      }`}
                    >
                      {active && <Check size={12} strokeWidth={2.5} />}

                      <span>{status}</span>

                      <span className={`rounded-md px-1.5 py-0.5 text-[8px] ${active ? 'bg-white/15 text-white' : 'bg-mk-primary-soft text-mk-primary-hover'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Support Requests */}
        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-mk-border bg-white px-5 py-16 text-center shadow-[0_3px_15px_rgba(73,54,49,0.04)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mk-primary-soft text-mk-primary">
              <MessageSquare size={24} />
            </div>

            <h2 className="text-sm font-extrabold text-mk-ink sm:text-base">No support requests</h2>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-mk-muted">Need help with an order or something else?</p>

            <Link to="/contact" className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-mk-primary px-4 text-xs font-bold text-white transition hover:bg-mk-primary-deep">
              <Plus size={15} />
              Contact Support
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContacts.map((contact) => {
              const lastMessage = contact.messages?.[contact.messages.length - 1]

              const messageCount = contact.messages?.length || 0

              return (
                <Link
                  key={contact._id}
                  to={`/my-support/${contact._id}`}
                  className="group overflow-hidden rounded-2xl border border-mk-border bg-white shadow-[0_3px_15px_rgba(73,54,49,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-mk-border hover:shadow-[0_7px_22px_rgba(73,54,49,0.08)]"
                >
                  {/* Card Top */}
                  <div className="border-b border-mk-primary-soft bg-mk-bg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-mk-primary shadow-sm">
                          <MessageSquare size={18} strokeWidth={1.8} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Support Request</p>

                          <h2 className="mt-0.5 truncate text-sm font-extrabold text-mk-ink">{contact.subject || 'Customer Support'}</h2>
                        </div>
                      </div>

                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold ${getStatusStyle(contact.status)}`}>{contact.status}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-[9px] font-semibold text-mk-muted">
                      <UserRound size={13} />
                      <span>{contact.name}</span>
                    </div>

                    <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-mk-muted">{lastMessage?.message || 'No message available'}</p>

                    {/* Properties */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-mk-border bg-mk-bg px-2.5 py-2">
                        <p className="text-[8px] font-bold uppercase tracking-wide text-mk-muted">Messages</p>

                        <p className="mt-0.5 text-[10px] font-extrabold text-mk-ink">{messageCount}</p>
                      </div>

                      <div className="rounded-lg border border-mk-border bg-mk-bg px-2.5 py-2">
                        <p className="text-[8px] font-bold uppercase tracking-wide text-mk-muted">Updated</p>

                        <p className="mt-0.5 flex items-center gap-1 text-[10px] font-extrabold text-mk-ink">
                          <Clock3 size={11} />
                          {formatDate(contact.updatedAt || contact.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* View */}
                    <div className="mt-4 flex items-center justify-between border-t border-mk-primary-soft pt-3">
                      <span className="text-[9px] font-semibold text-mk-muted">Open conversation</span>

                      <div className="flex items-center gap-1 text-[10px] font-bold text-mk-primary transition group-hover:gap-2">
                        View
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
