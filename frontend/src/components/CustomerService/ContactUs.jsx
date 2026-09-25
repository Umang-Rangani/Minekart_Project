import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone, MapPin, MessageCircle, Clock3, Send } from 'lucide-react'

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#F7EEE7]">
      <div className="mx-auto max-w-300 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />
              <MessageCircle size={18} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold text-[#351C18] sm:text-sm">Contact Us</h1>
              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">We're here to help you</p>
            </div>
          </div>

          <Link to="/customer-help" className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2.5 text-[9px] font-bold text-[#67544D] transition hover:text-[#A51D26] sm:px-3 sm:text-[10px]">
            Help Center
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Contact Info */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.05)] sm:p-6">
            <h2 className="text-base font-extrabold text-[#351C18]">Get in touch</h2>

            <p className="mt-1.5 text-xs leading-5 text-[#806C63]">Have a question about your order, delivery or return? Our support team is ready to help.</p>

            <div className="mt-6 space-y-3">
              <a href="tel:+919999999999" className="group flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3 transition hover:border-[#D9B7B2]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <Phone size={18} />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Phone</p>
                  <p className="mt-0.5 text-xs font-bold text-[#351C18]">+91 99999 99999</p>
                </div>
              </a>

              <a href="mailto:support@minekart.com" className="group flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3 transition hover:border-[#D9B7B2]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <Mail size={18} />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Email</p>
                  <p className="mt-0.5 break-all text-xs font-bold text-[#351C18]">support@minekart.com</p>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <MapPin size={18} />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Location</p>
                  <p className="mt-0.5 text-xs font-bold text-[#351C18]">Ahmedabad, Gujarat, India</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#A51D26] shadow-sm">
                  <Clock3 size={18} />
                </span>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Support Hours</p>
                  <p className="mt-0.5 text-xs font-bold text-[#351C18]">Mon - Sat · 10 AM - 7 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.05)] sm:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#A51D26]">
                <MessageCircle size={18} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-[#351C18]">Send us a message</h2>
                <p className="text-[10px] text-[#806C63]">We'll get back to you as soon as possible.</p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Name</label>

                <input type="text" placeholder="Enter your name" className="h-10 w-full rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 text-xs text-[#351C18] outline-none transition focus:border-[#A51D26]" />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Email</label>

                <input type="email" placeholder="Enter your email" className="h-10 w-full rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 text-xs text-[#351C18] outline-none transition focus:border-[#A51D26]" />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Message</label>

                <textarea rows="5" placeholder="How can we help you?" className="w-full resize-none rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 py-2.5 text-xs text-[#351C18] outline-none transition focus:border-[#A51D26]" />
              </div>

              <button
                type="button"
                className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] text-xs font-bold text-white shadow-[0_5px_15px_rgba(125,23,28,0.18)] transition hover:from-[#681419] hover:to-[#8E181F]"
              >
                <Send size={15} />
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-5 rounded-2xl border border-[#E8DDD4] bg-[#351C18] p-5 text-center text-white">
          <p className="text-xs text-[#D4C4BD]">Need help with an existing order?</p>

          <Link to="/orders" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#E17B7F] hover:text-white">
            View My Orders
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
