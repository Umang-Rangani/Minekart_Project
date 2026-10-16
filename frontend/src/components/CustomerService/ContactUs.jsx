import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Phone, MapPin, MessageCircle, Clock3, Send, LoaderCircle, Package, MessagesSquare, LockKeyhole } from 'lucide-react'
import { toast } from 'react-hot-toast'
import BreadCrumb from '../../user/BreadCrumb'
import { axiosInstance } from '../../config/axiosConfig'
import { useUser } from '../../context/userProvider'

export default function ContactUs() {
  const { user, setShowLogin } = useUser()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [sending, setSending] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = 'Contact Us | MineKart'
  }, [])

  const items = [
    {
      title: 'Contact Us',
      link: null,
    },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const name = formData.name.trim()
    const email = formData.email.trim()
    const message = formData.message.trim()

    if (user) {
      if (!name) {
        toast.error('Please enter your name')
        return
      }

      if (!email) {
        toast.error('Please enter your email')
        return
      }

      if (!message) {
        toast.error('Please enter your message')
        return
      }
    }

    if (!user) {
      setShowLogin(true)
      return
    }

    try {
      setSending(true)

      const response = await axiosInstance.post('/contact', {
        name,
        email,
        message,
      })

      if (response.data?.success) {
        toast.success(response.data.message || 'Message sent successfully')

        setFormData({
          name: '',
          email: '',
          message: '',
        })

        navigate('/my-support')
      } else {
        toast.error(response.data?.message || 'Unable to send message')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen   mx-auto  ">
      <BreadCrumb items={items} />

      <div className="py-5 ">
        {/* Header */}
        <div className="overflow-hidden rounded-2xl border border-mk-border bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          <div className="bg-linear-to-br from-mk-ink via-mk-ink to-mk-primary-deep px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                <MessageCircle size={27} strokeWidth={1.8} />
              </div>

              <h2 className="mt-4 text-lg font-extrabold text-white sm:text-xl">Contact Us</h2>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">We're here to help with your orders, delivery and returns.</p>

              <Link to="/customer-help" className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-extrabold text-mk-ink transition hover:bg-mk-primary-soft">
                Help Center
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Content */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Contact Options */}
          <div className="rounded-2xl border border-mk-border bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
            <div>
              <h3 className="text-sm font-extrabold text-mk-ink">Customer Support</h3>

              <p className="mt-1 text-[10px] leading-4 text-mk-muted sm:text-xs">Choose an option below to get help with your MineKart order.</p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Call Support */}
              <button
                type="button"
                onClick={() => (window.location.href = 'tel:+919408209662')}
                className="group flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3 text-left transition hover:border-mk-danger-soft hover:bg-mk-primary-soft"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-mk-primary shadow-sm">
                  <Phone size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Phone Support</p>

                  <p className="mt-0.5 text-xs font-extrabold text-mk-ink">Call Support</p>

                  <p className="mt-0.5 text-[9px] text-mk-muted">+91 94082 09662</p>
                </div>

                <ArrowRight size={14} className="ml-auto shrink-0 text-mk-border transition group-hover:translate-x-1 group-hover:text-mk-primary" />
              </button>

              {/* Email Support */}
              <button
                type="button"
                onClick={() => (window.location.href = 'mailto:up24419@gmail.com')}
                className="group flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3 text-left transition hover:border-mk-danger-soft hover:bg-mk-primary-soft"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-mk-primary shadow-sm">
                  <Mail size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Email Support</p>

                  <p className="mt-0.5 truncate text-xs font-extrabold text-mk-ink">Send Email</p>

                  <p className="mt-0.5 truncate text-[9px] text-mk-muted">up24419@gmail.com</p>
                </div>

                <ArrowRight size={14} className="ml-auto shrink-0 text-mk-border transition group-hover:translate-x-1 group-hover:text-mk-primary" />
              </button>

              {/* Help Center */}
              <Link to="/customer-help" className="group flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3 transition hover:border-mk-danger-soft hover:bg-mk-primary-soft">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-mk-primary shadow-sm">
                  <MessageCircle size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Self Service</p>

                  <p className="mt-0.5 text-xs font-extrabold text-mk-ink">Help Center</p>

                  <p className="mt-0.5 text-[9px] text-mk-muted">Find answers quickly</p>
                </div>

                <ArrowRight size={14} className="ml-auto shrink-0 text-mk-border transition group-hover:translate-x-1 group-hover:text-mk-primary" />
              </Link>

              {/* My Orders */}
              <Link to="/orders" className="group flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3 transition hover:border-mk-danger-soft hover:bg-mk-primary-soft">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-mk-primary shadow-sm">
                  <Package size={18} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Orders</p>

                  <p className="mt-0.5 text-xs font-extrabold text-mk-ink">My Orders</p>

                  <p className="mt-0.5 text-[9px] text-mk-muted">View order details</p>
                </div>

                <ArrowRight size={14} className="ml-auto shrink-0 text-mk-border transition group-hover:translate-x-1 group-hover:text-mk-primary" />
              </Link>
            </div>

            {/* Support Details */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-mk-primary">
                  <MapPin size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Location</p>

                  <p className="mt-0.5 text-[10px] font-extrabold text-mk-ink">Ahmedabad, Gujarat</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-mk-primary">
                  <Clock3 size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Support Hours</p>

                  <p className="mt-0.5 text-[10px] font-extrabold text-mk-ink">Mon - Sat · 10 AM - 7 PM</p>
                </div>
              </div>
            </div>

            {/* My Support */}
            <Link to="/my-support" className="group  mt-4 flex items-center gap-3 rounded-xl border border-mk-border bg-mk-bg p-3 transition hover:border-mk-danger-soft hover:bg-mk-primary-soft">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-mk-primary shadow-sm">
                {/* <MessageCircle  /> */}

                <MessagesSquare size={18} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wide text-mk-muted">Support</p>

                <p className="mt-0.5 text-xs font-extrabold text-mk-ink">My Support</p>

                <p className="mt-0.5 text-[9px] text-mk-muted">View support chat</p>
              </div>

              <ArrowRight size={14} className="ml-auto shrink-0 text-mk-border transition group-hover:translate-x-1 group-hover:text-mk-primary" />
            </Link>
          </div>

          {/* Send Message */}
          <div className="rounded-2xl border border-mk-border bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mk-primary-soft text-mk-primary">
                <MessageCircle size={19} strokeWidth={1.8} />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-mk-ink">Send us a message</h3>

                <p className="mt-0.5 text-[10px] text-mk-muted">Our support team will get back to you.</p>
              </div>
            </div>

            {/* input form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-mk-muted">Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  disabled={sending}
                  className="h-10 w-full rounded-xl border border-mk-border bg-mk-bg px-3 text-xs text-mk-ink outline-none transition placeholder:text-mk-muted focus:border-mk-primary focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-mk-muted">Email</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={sending}
                  className="h-10 w-full rounded-xl border border-mk-border bg-mk-bg px-3 text-xs text-mk-ink outline-none transition placeholder:text-mk-muted focus:border-mk-primary focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-mk-muted">Message</label>

                <textarea
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  disabled={sending}
                  className="w-full resize-none rounded-xl border border-mk-border bg-mk-bg px-3 py-2.5 text-xs text-mk-ink outline-none transition placeholder:text-mk-muted focus:border-mk-primary focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {!user && (
                <div className="flex items-center gap-2 rounded-xl border border-mk-border bg-mk-bg px-3 py-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-mk-primary/10">
                    <LockKeyhole size={14} className="text-mk-primary" />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-mk-ink">Login required</p>

                    <p className="text-[9px] text-mk-muted">Please login before sending your message.</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-mk-primary-deep to-mk-primary text-xs font-bold text-white shadow-[0_5px_15px_rgba(125,23,28,0.18)] transition hover:-translate-y-0.5 hover:from-mk-primary-deep hover:to-mk-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} strokeWidth={1.8} />
                    {user ? 'Send Message' : <button onClick={() => setShowLogin(true)}>Login to Send Message</button>}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer / Help CTA */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-linear-to-br from-mk-ink via-mk-ink to-mk-primary-deep px-5 py-6 text-center shadow-[0_5px_18px_rgba(53,28,24,0.10)] sm:px-6 sm:py-7">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white">
            <MessageCircle size={20} strokeWidth={1.8} />
          </div>

          <h3 className="mt-3 text-sm font-extrabold text-white sm:text-base">Need help with an existing order?</h3>

          <p className="mx-auto mt-1 max-w-md text-[10px] leading-4 text-white/65 sm:text-xs">Check your order details or contact our support team for further assistance.</p>

          <Link to="/orders" className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-extrabold text-mk-ink transition hover:bg-mk-primary-soft">
            View My Orders
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
