import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, CheckCircle2, Clock3, LoaderCircle, Mail, MessageSquare, Send, ShieldCheck, Trash2, User } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { axiosInstance } from '../config/axiosConfig'
import AdminTrashBox from './AdminTrashBox'
import AdminBreadCrumb from './AdminBreadCrumb'

export default function AdminContactMessageView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState('')
  const [replying, setReplying] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const getContact = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get(`/contact/admin/${id}`)

      if (response.data?.success) {
        setContact(response.data.data)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load support ticket')
      navigate('/admin/contact-messages')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getContact()
  }, [id])

  const handleReply = async (e) => {
    e.preventDefault()

    if (!replyMessage.trim()) {
      toast.error('Please enter a reply')
      return
    }

    if (contact?.status === 'Resolved') {
      toast.error('Resolved ticket cannot be replied')
      return
    }

    try {
      setReplying(true)

      const response = await axiosInstance.post(`/contact/admin/${id}/reply`, {
        message: replyMessage.trim(),
      })

      if (response.data?.success) {
        setReplyMessage('')
        toast.success('Reply sent successfully')
        await getContact()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to send reply')
    } finally {
      setReplying(false)
    }
  }

  const handleStatusChange = async (status) => {
    if (!status || status === contact?.status) return

    try {
      setUpdatingStatus(true)

      const response = await axiosInstance.put(`/contact/admin/${id}/status`, {
        status,
      })

      if (response.data?.success) {
        setContact((prev) => ({
          ...prev,
          status,
        }))

        toast.success('Status updated successfully')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const deleteHandle = async () => {
    try {
      setDeleting(true)

      const response = await axiosInstance.delete(`/contact/admin/${id}`)

      if (response.data?.success) {
        toast.success('Support ticket deleted successfully')
        setDeleteModalOpen(false)
        navigate('/admin/contact-messages')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete support ticket')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return '-'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusStyle = (status) => {
    if (status === 'Pending') {
      return {
        wrapper: 'bg-[#F1EEE8] border-[#E4DED4] text-[#8A6A3D]',
        dot: 'bg-[#B87935]',
      }
    }

    if (status === 'In Progress') {
      return {
        wrapper: 'bg-[#EAE7E1] border-[#DDD8D0] text-[#6B6258]',
        dot: 'bg-[#6B6258]',
      }
    }

    return {
      wrapper: 'bg-[#EAEDE7] border-[#D9E0D5] text-[#5E6C55]',
      dot: 'bg-[#5E6C55]',
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-[#F4F2EE] p-4 sm:p-5">
        <div className="flex min-h-125 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-[#6F6A64]">
            <LoaderCircle size={30} className="animate-spin text-[#6B6258]" />
            <p className="text-sm font-semibold">Loading support ticket...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!contact) {
    return null
  }

  const statusStyle = getStatusStyle(contact.status)

  const items = [
    {
      title: 'Contact-Messages',
      link: '/admin/contact-messages',
    },
    {
      title: `${contact.name}`,
      link: null,
    },
  ]

  return (
    <div className="min-h-full bg-[#F4F2EE] space-y-6">
      <AdminBreadCrumb items={items} />

      {/* Main */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Conversation */}
        <div className="flex min-h-162 flex-col overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-[0_4px_18px_rgba(63,58,53,0.04)]">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-[#E3DED6] bg-[#FBFAF7] px-4 py-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAE7E1] text-[#6B6258]">
                <MessageSquare size={19} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#292725]">Conversation</h2>

                {/* <p className="mt-0.5 text-[11px] text-[#99938B]">Ticket #{contact._id?.slice(-8)}</p> */}
              </div>
            </div>

            <div className="hidden items-center gap-1.5 text-[10px] font-semibold text-[#99938B] sm:flex">
              <Clock3 size={13} />
              {formatDate(contact.createdAt)}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto bg-[#FCFBF9] p-4 sm:p-6">
            {contact.messages?.length ? (
              contact.messages.map((message, index) => {
                const isAdmin = message.senderType === 'Admin'

                return (
                  <div key={message._id || index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[88%] gap-2.5 sm:max-w-[75%] ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isAdmin ? 'bg-[#6B6258] text-white' : 'border border-[#E3DED6] bg-white text-[#6B6258]'}`}>
                        {isAdmin ? <ShieldCheck size={15} /> : <User size={15} />}
                      </div>

                      <div className={`min-w-0 ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#6F6A64]">{isAdmin ? 'Admin' : contact.name}</span>

                          <span className="text-[9px] text-[#AAA39B]">{formatTime(message.createdAt)}</span>
                        </div>

                        <div className={`rounded-2xl px-3.5 py-3 text-xs leading-5 shadow-[0_2px_8px_rgba(63,58,53,0.04)] ${isAdmin ? 'rounded-tr-md bg-[#6B6258] text-white' : 'rounded-tl-md border border-[#E3DED6] bg-[#F7F3EE] text-[#4A4540]'}`}>
                          {message.message}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex min-h-87 items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EEE8] text-[#8A8179]">
                    <MessageSquare size={20} />
                  </div>

                  <p className="text-sm font-bold text-[#6F6A64]">No messages yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Reply */}
          <div className="border-t border-[#E3DED6] bg-white p-4 sm:p-5">
            {contact.status === 'Resolved' ? (
              <div className="flex items-center justify-center gap-2 rounded-xl border border-[#D9E0D5] bg-[#EAEDE7] px-4 py-3 text-xs font-bold text-[#5E6C55]">
                <CheckCircle2 size={16} />
                This support ticket has been resolved.
              </div>
            ) : (
              <form onSubmit={handleReply}>
                <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#FBFAF7] transition focus-within:border-[#BEB6AC] focus-within:ring-2 focus-within:ring-[#6B6258]/10">
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply to the customer..."
                    rows={3}
                    className="w-full resize-none bg-transparent px-4 py-3 text-xs text-[#292725] outline-none placeholder:text-[#AAA39B]"
                  />

                  <div className="flex items-center justify-between border-t border-[#E3DED6] px-3 py-2.5">
                    <p className="text-[10px] text-[#AAA39B]">Reply as Admin</p>

                    <button
                      type="submit"
                      disabled={replying || !replyMessage.trim()}
                      className="flex h-9 items-center gap-2 rounded-xl bg-[#6B6258] px-4 text-xs font-bold text-white transition hover:bg-[#5D554C] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {replying ? (
                        <>
                          <LoaderCircle size={15} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white p-5 shadow-[0_4px_18px_rgba(63,58,53,0.04)]">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAE7E1] text-[#6B6258]">
                <User size={17} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#292725]">Customer Information</h2>

                <p className="text-[10px] text-[#99938B]">Contact details</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-[#E3DED6] bg-[#FBFAF7] p-3">
                <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#AAA39B]">Name</p>

                <p className="text-xs font-bold text-[#292725]">{contact.name || '-'}</p>
              </div>

              <div className="rounded-xl border border-[#E3DED6] bg-[#FBFAF7] p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <Mail size={11} className="text-[#8A8179]" />
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#AAA39B]">Email</p>
                </div>

                <p className="break-all text-xs font-semibold text-[#4A4540]">{contact.email || '-'}</p>
              </div>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white p-5 shadow-[0_4px_18px_rgba(63,58,53,0.04)]">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAE7E1] text-[#6B6258]">
                <MessageSquare size={17} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#292725]">Ticket Information</h2>

                <p className="text-[10px] text-[#99938B]">Support ticket details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-[#AAA39B]">Subject</p>

                <p className="text-xs font-bold leading-5 text-[#292725]">{contact.subject || 'Customer Support'}</p>
              </div>

              {/* <div>
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-[#AAA39B]">Ticket ID</p>

                <p className="break-all font-mono text-[10px] font-semibold text-[#6F6A64]">#{contact._id}</p>
              </div> */}

              <div>
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-[#AAA39B]">Created</p>

                <p className="text-xs font-semibold text-[#4A4540]">{formatDate(contact.createdAt)}</p>
              </div>

              {/* Status */}
              <div>
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wide text-[#AAA39B]">Status</p>

                <div className="relative">
                  <select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                    className={`h-10 w-full appearance-none rounded-xl border bg-white px-3 pr-9 text-xs font-bold outline-none transition ${statusStyle.wrapper} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  {updatingStatus && <LoaderCircle size={14} className="absolute right-3 top-3 animate-spin text-[#6B6258]" />}
                </div>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="rounded-2xl border border-[#E3DED6] bg-white p-5 shadow-[0_4px_18px_rgba(63,58,53,0.04)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAEDE7] text-[#5E6C55]">
                <Check size={17} />
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#292725]">Support Workflow</p>

                <p className="mt-1 text-[10px] leading-4 text-[#99938B]">Reply to the customer and update the ticket status as the conversation progresses.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <AdminTrashBox
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          type="danger"
          title="Delete Support Ticket?"
          message={`Are you sure you want to delete this support ticket from ${contact.name}?`}
          actionButtonText="Delete"
          cancelButtonText="Cancel"
          onAction={deleteHandle}
        />
      )}
    </div>
  )
}
