import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone, MapPin, MessageCircle, Clock3, Send } from 'lucide-react'
import BreadCrumb from '../../user/BreadCrumb'

export default function ContactUs() {
  const items = [
    {
      title: 'Contact Us',
      link: null,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto max-w-350 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_16px_rgba(73,54,49,0.05)]">
          <div className="bg-linear-to-br from-[#351C18] via-[#4A2520] to-[#7D171C] px-5 py-6 sm:px-8 sm:py-8">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
                <MessageCircle size={27} strokeWidth={1.8} />
              </div>

              <h2 className="mt-4 text-lg font-extrabold text-white sm:text-xl">Contact Us</h2>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">We're here to help with your orders, delivery and returns.</p>

              <Link to="/customer-help" className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-extrabold text-[#351C18] transition hover:bg-[#F7EEE7]">
                Help Center
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 divide-x divide-[#E8DDD4] bg-[#FBF7F2] sm:grid-cols-3">
            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Support</p>

              <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">Mon - Sat</p>
            </div>

            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Hours</p>

              <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">10 AM - 7 PM</p>
            </div>

            <div className="col-span-2 border-t border-[#E8DDD4] px-4 py-3 text-center sm:col-span-1 sm:border-t-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Help</p>

              <Link to="/customer-help" className="mt-0.5 inline-flex text-xs font-extrabold text-[#A51D26] transition hover:text-[#351C18]">
                Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Content */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Contact Information */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
            <div>
              <h3 className="text-sm font-extrabold text-[#351C18]">Get in touch</h3>

              <p className="mt-1 text-[10px] leading-4 text-[#806C63] sm:text-xs">Have a question about your order, delivery or return? Our support team is ready to help.</p>
            </div>

            <div className="mt-5 space-y-3">
              {/* Phone */}
              <a href="tel:+919999999999" className="group flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3 transition hover:border-[#D9B7B2] hover:bg-[#F7EEE7]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <Phone size={18} strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Phone</p>

                  <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">+91 99999 99999</p>
                </div>

                <ArrowRight size={14} className="ml-auto text-[#C7B6AE] transition group-hover:text-[#A51D26]" />
              </a>

              {/* Email */}
              <a href="mailto:support@minekart.com" className="group flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3 transition hover:border-[#D9B7B2] hover:bg-[#F7EEE7]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <Mail size={18} strokeWidth={1.8} />
                </span>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Email</p>

                  <p className="mt-0.5 break-all text-xs font-extrabold text-[#351C18]">support@minekart.com</p>
                </div>

                <ArrowRight size={14} className="ml-auto shrink-0 text-[#C7B6AE] transition group-hover:text-[#A51D26]" />
              </a>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <MapPin size={18} strokeWidth={1.8} />
                </span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Location</p>

                  <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">Ahmedabad, Gujarat, India</p>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <Clock3 size={18} strokeWidth={1.8} />
                </span>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Support Hours</p>

                  <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">Mon - Sat · 10 AM - 7 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#A51D26]">
                <MessageCircle size={19} strokeWidth={1.8} />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-[#351C18]">Send us a message</h3>

                <p className="mt-0.5 text-[10px] text-[#806C63]">We'll get back to you as soon as possible.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  className="h-10 w-full rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 text-xs text-[#351C18] outline-none transition placeholder:text-[#A8978F] focus:border-[#A51D26] focus:bg-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Email</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-10 w-full rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 text-xs text-[#351C18] outline-none transition placeholder:text-[#A8978F] focus:border-[#A51D26] focus:bg-white"
                />
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Message</label>

                <textarea
                  rows="5"
                  placeholder="How can we help you?"
                  className="w-full resize-none rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 py-2.5 text-xs text-[#351C18] outline-none transition placeholder:text-[#A8978F] focus:border-[#A51D26] focus:bg-white"
                />
              </div>

              {/* Submit */}
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] text-xs font-bold text-white shadow-[0_5px_15px_rgba(125,23,28,0.18)] transition hover:from-[#681419] hover:to-[#8E181F]"
              >
                <Send size={15} strokeWidth={1.8} />
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Footer / Help CTA */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-linear-to-br from-[#351C18] via-[#4A2520] to-[#7D171C] px-5 py-6 text-center shadow-[0_5px_18px_rgba(53,28,24,0.10)] sm:px-6 sm:py-7">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white">
            <MessageCircle size={20} strokeWidth={1.8} />
          </div>

          <h3 className="mt-3 text-sm font-extrabold text-white sm:text-base">Need help with an existing order?</h3>

          <p className="mx-auto mt-1 max-w-md text-[10px] leading-4 text-white/65 sm:text-xs">Check your order details or contact our support team for further assistance.</p>

          <Link to="/orders" className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-extrabold text-[#351C18] transition hover:bg-[#F7EEE7]">
            View My Orders
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
