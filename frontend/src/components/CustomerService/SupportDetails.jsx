import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock3, LoaderCircle, MessageSquare, Send, ShieldCheck, User } from 'lucide-react'
import { axiosInstance } from '../../config/axiosConfig'
import toast from 'react-hot-toast'
import BreadCrumb from '../../user/BreadCrumb'

export default function SupportDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchSupportDetails()

    document.title = 'My Support View | MineKart'
  }, [id])

  const fetchSupportDetails = async () => {
    try {
      setLoading(true)

      const response = await axiosInstance.get(`/contact/my/${id}`)

      if (response.data.success) {
        setContact(response.data.data)
      }
    } catch (error) {
      console.error(error)

      toast.error(error.response?.data?.message || 'Unable to load support ticket')

      navigate('/my-support')
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      toast.error('Please enter a message')
      return
    }

    try {
      setSending(true)

      const response = await axiosInstance.post(`/contact/${id}/reply`, {
        message: trimmedMessage,
      })

      if (response.data.success) {
        setContact(response.data.data)
        setMessage('')
        toast.success('Reply sent successfully')
      }
    } catch (error) {
      console.error(error)

      toast.error(error.response?.data?.message || 'Unable to send reply')
    } finally {
      setSending(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusStyle = (status) => {
    if (status === 'Resolved') {
      return {
        wrapper: 'border-[#D8E5DA] bg-[#EAEDE7] text-[#5E6C55]',
        icon: <CheckCircle2 size={13} />,
      }
    }

    if (status === 'In Progress') {
      return {
        wrapper: 'border-[#DED9D0] bg-[#F1EEE8] text-[#6B6258]',
        icon: <Clock3 size={13} />,
      }
    }

    return {
      wrapper: 'border-[#E5D8C8] bg-[#F1EEE8] text-[#8A6A3D]',
      icon: <Clock3 size={13} />,
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#F7EEE7] px-3 py-4 sm:px-5">
        <div className="flex min-h-[50vh] items-center justify-center">
          <LoaderCircle size={28} className="animate-spin text-[#A51D26]" />
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
      title: 'Contact Us',
      link: '/contact',
    },
    {
      title: 'My Support',
      link: '/my-support',
    },
    {
      title: 'My Support View',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen  max-w-350 mx-auto ">
      <BreadCrumb items={items} />

      <div className=" py-5 ">
        {/* Header */}
        <div className="mb-4 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5">
          <div className="flex min-h-16 items-center justify-between gap-3 px-3 py-2.5 sm:min-h-17 sm:px-4">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />
                <MessageSquare size={18} strokeWidth={1.8} className="relative z-10" />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Support Request</p>

                <h1 className="mt-0.5 truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">{contact.subject || 'Customer Support'}</h1>
              </div>
            </div>

            <div className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2 text-[8px] font-bold sm:px-2.5 sm:text-[9px] ${statusStyle.wrapper}`}>
              {statusStyle.icon}
              <span>{contact.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-[#F0E7E1] bg-[#FBF7F2]">
            <div className="border-r border-[#E8DDD4] px-3 py-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#9A857B]">Subject</p>

              <p className="mt-0.5 truncate text-[10px] font-bold text-[#351C18] sm:text-xs">{contact.subject || 'Customer Support'}</p>
            </div>

            <div className="border-r border-[#E8DDD4] px-3 py-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#9A857B]">Created</p>

              <p className="mt-0.5 text-[10px] font-bold text-[#351C18] sm:text-xs">{formatDate(contact.createdAt)}</p>
            </div>

            <div className="px-3 py-2.5">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-[#9A857B]">Updated</p>

              <p className="mt-0.5 text-[10px] font-bold text-[#351C18] sm:text-xs">{formatDate(contact.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          {/* Conversation Header */}
          <div className="flex items-center justify-between border-b border-[#E8DDD4] bg-[#FBF7F2] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1E5DE] text-[#7D171C]">
                <MessageSquare size={15} />
              </div>

              <div>
                <h2 className="text-xs font-extrabold text-[#351C18]">Conversation</h2>

                <p className="text-[9px] text-[#806C63]">Customer support messages</p>
              </div>
            </div>

            <ShieldCheck size={17} className="text-[#6B6258]" />
          </div>

          {/* Messages */}
          <div className="max-h-140 min-h-75 space-y-4 overflow-y-auto bg-[#FFFDFC] p-3 sm:p-5">
            {contact.messages?.map((item, index) => {
              const isUser = item.senderType === 'User'

              return (
                <div key={item._id || index} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex max-w-[88%] items-end gap-2 sm:max-w-[75%] ${isUser ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Avatar */}
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isUser ? 'border border-[#E8DDD4] bg-[#F7EEE7] text-[#7D171C]' : 'bg-[#A51D26] text-white'}`}>
                      {isUser ? <User size={14} /> : <ShieldCheck size={14} />}
                    </div>

                    {/* Message */}
                    <div>
                      <div className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${isUser ? 'rounded-bl-md border border-[#E8DDD4] bg-[#F7EEE7] text-[#4C3B35]' : 'rounded-br-md bg-[#A51D26] text-white'}`}>{item.message}</div>

                      <p className={`mt-1 text-[8px] text-[#9A857B] ${isUser ? 'text-left' : 'text-right'}`}>
                        {isUser ? 'You' : 'Support Team'} · {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}

            {(!contact.messages || contact.messages.length === 0) && (
              <div className="flex min-h-65 items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={30} className="mx-auto text-[#C8B9B0]" />

                  <p className="mt-2 text-xs font-bold text-[#67544D]">No messages yet</p>
                </div>
              </div>
            )}
          </div>

          {/* Reply Area */}
          {contact.status === 'Resolved' ? (
            <div className="border-t border-[#E8DDD4] bg-[#F8FAF7] p-4">
              <div className="flex items-center justify-center gap-2 rounded-xl border border-[#D8E5DA] bg-[#EAEDE7] px-3 py-3 text-xs font-semibold text-[#5E6C55]">
                <CheckCircle2 size={16} />
                <span>This support ticket has been resolved.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReply} className="border-t border-[#E8DDD4] bg-[#FBF7F2] p-3 sm:p-4">
              <div className="rounded-xl border border-[#E8DDD4] bg-white p-2 shadow-[0_2px_8px_rgba(73,54,49,0.03)]">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Write your reply..."
                  disabled={sending}
                  className="w-full resize-none bg-transparent px-2 py-1 text-xs text-[#351C18] outline-none placeholder:text-[#B1A19A] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="flex items-center justify-between gap-2 border-t border-[#F0E8E3] pt-2">
                  <span className="px-2 text-[8px] text-[#9A857B]">{message.length}/1000</span>

                  <button
                    type="submit"
                    disabled={sending || !message.trim()}
                    className="flex h-8 items-center gap-1.5 rounded-lg bg-[#A51D26] px-3 text-[9px] font-bold text-white transition hover:bg-[#7D171C] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <LoaderCircle size={13} className="animate-spin" />
                        Sending
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        Send Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Note */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[9px] text-[#9A857B]">
          <ShieldCheck size={12} />
          Your conversation is securely handled by MineKart Support.
        </div>
      </div>
    </div>
  )
}
