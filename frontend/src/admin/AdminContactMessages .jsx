import React, { useEffect, useState } from 'react'
import { Search, Eye, MessageSquare, Clock3, CircleCheck, CircleDot, ChevronDown, ChevronLeft, ChevronRight, X, Send, Trash2, User, Mail, Phone, LoaderCircle, ShieldCheck } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'
import toast from 'react-hot-toast'
import AdminTrashBox from './AdminTrashBox'
import { useNavigate } from 'react-router-dom'

export default function AdminContactMessages() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [search, setSearch] = useState(() => {
    return localStorage.getItem('adminContactMessagesSearch') || ''
  })

  const [statusFilter, setStatusFilter] = useState('All')

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const [selectedContact, setSelectedContact] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [replying, setReplying] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // ! 1. delete component
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)

  /* Get all support tickets */
  const getContacts = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/contact/admin')

      if (res.data.success) {
        setContacts(res.data.data || [])
      }
    } catch (error) {
      console.log('Get Admin Contact Messages Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to load support messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getContacts()
  }, [])

  /* Format date */
  const formatDate = (date) => {
    if (!date) return 'N/A'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  /* Format date and time */
  const formatDateTime = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /* Status style */
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-[#F1EEE8]',
          text: 'text-[#8A6A3D]',
          dot: 'bg-[#8A6A3D]',
        }

      case 'In Progress':
        return {
          bg: 'bg-[#EAE7E1]',
          text: 'text-[#6B6258]',
          dot: 'bg-[#6B6258]',
        }

      case 'Resolved':
        return {
          bg: 'bg-[#EAEDE7]',
          text: 'text-[#5E6C55]',
          dot: 'bg-[#5E6C55]',
        }

      default:
        return {
          bg: 'bg-[#F8F6F2]',
          text: 'text-[#6F6A64]',
          dot: 'bg-[#99938B]',
        }
    }
  }

  /* Search */
  const handleSearch = (value) => {
    setSearch(value)

    localStorage.setItem('adminContactMessagesSearch', value)

    setCurrentPage(1)
  }

  /* Clear search */
  const clearSearch = () => {
    setSearch('')

    localStorage.removeItem('adminContactMessagesSearch')

    setCurrentPage(1)
  }

  /* Status filter */
  const handleStatusFilter = (value) => {
    setStatusFilter(value)

    setCurrentPage(1)
  }

  /* Filter contacts */
  const filteredContacts = contacts.filter((contact) => {
    const searchValue = search.toLowerCase().trim()

    const latestMessage = contact.messages?.[contact.messages.length - 1]?.message || ''

    const matchesSearch =
      contact._id?.toLowerCase().includes(searchValue) ||
      contact.name?.toLowerCase().includes(searchValue) ||
      contact.email?.toLowerCase().includes(searchValue) ||
      contact.subject?.toLowerCase().includes(searchValue) ||
      latestMessage.toLowerCase().includes(searchValue)

    const matchesStatus = statusFilter === 'All' || contact.status === statusFilter

    return matchesSearch && matchesStatus
  })

  /* Pagination */
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(filteredContacts.length / itemsPerPage)

  const startIndex = itemsPerPage === 'all' ? 0 : (currentPage - 1) * itemsPerPage

  const endIndex = itemsPerPage === 'all' ? filteredContacts.length : startIndex + itemsPerPage

  const currentContacts = itemsPerPage === 'all' ? filteredContacts : filteredContacts.slice(startIndex, endIndex)

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value)

    setCurrentPage(1)
  }

  /* Statistics */
  const totalMessages = contacts.length

  const pendingMessages = contacts.filter((contact) => contact.status === 'Pending').length

  const progressMessages = contacts.filter((contact) => contact.status === 'In Progress').length

  const resolvedMessages = contacts.filter((contact) => contact.status === 'Resolved').length

  const stats = [
    {
      title: 'Total Messages',
      value: totalMessages,
      icon: MessageSquare,
    },
    {
      title: 'Pending',
      value: pendingMessages,
      icon: Clock3,
    },
    {
      title: 'In Progress',
      value: progressMessages,
      icon: CircleDot,
    },
    {
      title: 'Resolved',
      value: resolvedMessages,
      icon: CircleCheck,
    },
  ]

  /* Open ticket */
  const handleViewContact = async (contact) => {
    try {
      const res = await axiosInstance.get(`/contact/admin/${contact._id}`)

      if (res.data.success) {
        setSelectedContact(res.data.data)
        setReplyMessage('')
      }
    } catch (error) {
      console.log('Get Contact Details Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to load support ticket')
    }
  }

  /* Admin reply */
  const handleReply = async () => {
    if (!replyMessage.trim()) {
      toast.error('Reply message is required')
      return
    }

    if (!selectedContact) return

    try {
      setReplying(true)

      const res = await axiosInstance.post(`/contact/admin/${selectedContact._id}/reply`, {
        message: replyMessage.trim(),
      })

      if (res.data.success) {
        const updatedContact = res.data.data

        setSelectedContact(updatedContact)

        setContacts((prev) => prev.map((contact) => (contact._id === updatedContact._id ? updatedContact : contact)))

        setReplyMessage('')

        toast.success('Reply sent successfully')
      }
    } catch (error) {
      console.log('Admin Reply Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Unable to send reply')
    } finally {
      setReplying(false)
    }
  }

  /* Update status */
  const handleStatusChange = async (contactId, status) => {
    try {
      setUpdatingStatusId(contactId)

      const res = await axiosInstance.put(`/contact/admin/${contactId}/status`, {
        status,
      })

      if (res.data.success) {
        const updatedContact = res.data.data

        setContacts((prev) => prev.map((contact) => (contact._id === contactId ? updatedContact : contact)))

        if (selectedContact?._id === contactId) {
          setSelectedContact(updatedContact)
        }

        toast.success(`Support ticket marked as ${status}`)
      }
    } catch (error) {
      console.log('Update Contact Status Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to update status')
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // ! 2. delete component
  const handleDeleteOpen = (contact) => {
    setDeleteItem(contact)
    setDeleteModalOpen(true)
  }

  // ! 3. Delete ticket
  const deleteHandle = async () => {
    if (!deleteItem) return

    try {
      setDeletingId(deleteItem._id)

      await axiosInstance.delete(`/contact/admin/${deleteItem._id}`)

      toast.success('Support ticket deleted successfully')

      setDeleteModalOpen(false)
      setDeleteItem(null)

      await getContacts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete support ticket')
    } finally {
      setDeletingId(null)
    }
  }

  const items = [{ title: 'Contact Messages', link: null }]

  return (
    <div className="space-y-6 transition-all duration-700">
      <AdminBreadCrumb items={items} />

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="rounded-2xl border border-[#E3DED6] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#99938B]">{item.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-[#292725]">{item.value}</h2>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-[#F1EEE8] text-[#6B6258]">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* Search + Filter */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xl">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search messages..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-10 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />

            {search && (
              <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-[#99938B] transition hover:bg-[#EEEAE4] hover:text-[#292725]" title="Clear Search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="h-10 min-w-45 appearance-none rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4 pr-10 text-sm font-semibold text-[#6F6A64] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A64]" />
            </div>

            <div className="flex h-10 items-center gap-2 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4">
              <MessageSquare size={17} className="text-[#6B6258]" />

              <span className="text-sm font-semibold text-[#292725]">{filteredContacts.length} Messages</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-275">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Customer</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Subject</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Message</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Date</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading support messages...
                  </td>
                </tr>
              ) : currentContacts.length > 0 ? (
                currentContacts.map((contact, index) => {
                  const statusStyle = getStatusStyle(contact.status)

                  const latestMessage = contact.messages?.[contact.messages.length - 1]

                  const isDeleting = deletingId === contact._id

                  return (
                    <tr key={contact._id} className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#6F6A64]">{startIndex + index + 1}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-40">
                          <p className="max-w-45 truncate text-sm font-semibold text-[#292725]">{contact.name || 'N/A'}</p>

                          <p className="mt-1 max-w-50 truncate text-xs text-[#99938B]">{contact.email || 'N/A'}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-40 truncate text-sm font-semibold text-[#292725]">{contact.subject || 'Customer Support'}</p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="max-w-70">
                          <p className="line-clamp-2 text-xs leading-5 text-[#6F6A64]">{latestMessage?.message || 'No message'}</p>

                          {contact.messages?.length > 1 && <p className="mt-1 text-[10px] font-semibold text-[#99938B]">{contact.messages.length} messages</p>}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="relative inline-block">
                          <select
                            value={contact.status}
                            disabled={updatingStatusId === contact._id}
                            onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                            className={`appearance-none rounded-lg border border-[#E3DED6] py-2 pl-3 pr-8 text-xs font-semibold outline-none transition disabled:cursor-not-allowed disabled:opacity-60 ${statusStyle.bg} ${statusStyle.text}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>

                          <ChevronDown size={14} className="pointer-events-none absolute right-2 top-2.5 text-[#6F6A64]" />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-medium text-[#6F6A64]">{formatDate(contact.updatedAt || contact.createdAt)}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => navigate(`/admin/contact-messages/${contact._id}`)}
                            className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                            title="View Message"
                          >
                            <Eye size={16} />
                          </button>

                          <button type="button" onClick={() => handleDeleteOpen(contact)} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-[#F1EEE8] text-[#6B6258]">
                        <MessageSquare size={27} />
                      </div>

                      <p className="mt-3 text-sm font-semibold text-[#292725]">No support messages found</p>

                      <p className="mt-1 text-xs text-[#99938B]">Try changing your search or status filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-[#E3DED6] bg-[#FCFBF9] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#99938B]">Show</span>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                const value = e.target.value

                handleItemsPerPageChange(value === 'all' ? 'all' : Number(value))
              }}
              className="h-8 rounded-lg border border-[#E3DED6] bg-white px-2.5 pr-7 text-xs font-semibold text-[#6F6A64] outline-none transition focus:border-[#6B6258]"
            >
              <option value={5}>5 Documents</option>
              <option value={10}>10 Documents</option>
              <option value={20}>20 Documents</option>
              <option value="all">All Documents</option>
            </select>

            <span className="text-xs text-[#99938B]">of {filteredContacts.length}</span>
          </div>

          {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="flex size-8 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6F6A64] transition hover:bg-[#EEEAE4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex size-8 items-center justify-center rounded-lg px-2 text-xs font-semibold transition ${currentPage === page ? 'bg-[#6B6258] text-white' : 'border border-[#E3DED6] bg-white text-[#6F6A64] hover:bg-[#EEEAE4]'}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="flex size-8 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6F6A64] transition hover:bg-[#EEEAE4] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#FBFAF7] shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E3DED6] bg-white px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EEE8] text-[#6B6258]">
                  <MessageSquare size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-[#292725]">{selectedContact.subject || 'Customer Support'}</h2>

                  <p className="mt-0.5 truncate text-[11px] text-[#99938B]">Support ticket • {formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <button type="button" onClick={() => setSelectedContact(null)} className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]">
                <X size={18} />
              </button>
            </div>

            {/* Customer Info */}
            <div className="border-b border-[#E3DED6] bg-[#F8F6F2] px-5 py-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B6258]">
                    <User size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-[#99938B]">Customer</p>

                    <p className="truncate text-xs font-semibold text-[#292725]">{selectedContact.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B6258]">
                    <Mail size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-[#99938B]">Email</p>

                    <p className="truncate text-xs font-semibold text-[#292725]">{selectedContact.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#6B6258]">
                    <Phone size={15} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-[#99938B]">Phone</p>

                    <p className="truncate text-xs font-semibold text-[#292725]">{selectedContact.userId?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation */}
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div className="space-y-4">
                {selectedContact.messages?.map((message, index) => {
                  const isAdmin = message.senderType === 'Admin'

                  return (
                    <div key={message._id || index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl border px-4 py-3 ${isAdmin ? 'border-[#6B6258] bg-[#6B6258] text-white' : 'border-[#E3DED6] bg-white text-[#292725]'}`}>
                        <div className="mb-1.5 flex items-center gap-2">
                          {isAdmin ? <ShieldCheck size={13} /> : <User size={13} />}

                          <span className={`text-[10px] font-bold ${isAdmin ? 'text-white/80' : 'text-[#6B6258]'}`}>{isAdmin ? 'Admin' : selectedContact.name}</span>

                          <span className={`text-[9px] ${isAdmin ? 'text-white/60' : 'text-[#99938B]'}`}>{formatDateTime(message.createdAt)}</span>
                        </div>

                        <p className={`whitespace-pre-wrap text-xs leading-5 ${isAdmin ? 'text-white' : 'text-[#6F6A64]'}`}>{message.message}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Reply + Status */}
            <div className="border-t border-[#E3DED6] bg-white p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[#292725]">Reply to customer</p>

                  <p className="mt-0.5 text-[10px] text-[#99938B]">Send a response to this support ticket.</p>
                </div>

                <div className="relative shrink-0">
                  <select
                    value={selectedContact.status}
                    disabled={updatingStatusId === selectedContact._id}
                    onChange={(e) => handleStatusChange(selectedContact._id, e.target.value)}
                    className={`appearance-none rounded-lg border border-[#E3DED6] py-2 pl-3 pr-8 text-[11px] font-semibold outline-none ${getStatusStyle(selectedContact.status).bg} ${getStatusStyle(selectedContact.status).text}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <ChevronDown size={13} className="pointer-events-none absolute right-2 top-2.5 text-[#6F6A64]" />
                </div>
              </div>

              {selectedContact.status === 'Resolved' ? (
                <div className="rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-4 py-3 text-center">
                  <CircleCheck size={20} className="mx-auto text-[#5E6C55]" />

                  <p className="mt-1.5 text-xs font-semibold text-[#292725]">This ticket is resolved</p>

                  <p className="mt-0.5 text-[10px] text-[#99938B]">Change the status to continue the conversation.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Write your reply..."
                    rows={3}
                    className="min-h-20 flex-1 resize-none rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3.5 py-3 text-xs leading-5 text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
                  />

                  <button
                    type="button"
                    onClick={handleReply}
                    disabled={replying || !replyMessage.trim()}
                    className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-xs font-bold text-white transition hover:bg-[#5D554C] disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
                  >
                    {replying ? <LoaderCircle size={15} className="animate-spin" /> : <Send size={15} />}

                    {replying ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <AdminTrashBox
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setDeleteItem(null)
          }}
          type="danger"
          title="Delete Support Ticket?"
          message={`Are you sure you want to delete this support ticket from ${deleteItem?.name}?`}
          actionButtonText="Delete"
          cancelButtonText="Cancel"
          onAction={deleteHandle}
        />
      )}
    </div>
  )
}
