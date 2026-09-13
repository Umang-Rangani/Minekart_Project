import React from 'react'
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Globe,
  Camera,
  MessageCircle,
  Play,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-10 bg-[#172033] text-white">
      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ================= BRAND ================= */}
          <div>
            <a
              href="https://www.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1D4ED8]">
                <span className="text-lg font-bold">M</span>
              </div>

              <span className="text-2xl font-bold">MineKart</span>
            </a>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
              Your trusted online shopping destination for fashion,
              electronics, mobiles, home products and more.
            </p>

            {/* ================= SOCIAL ================= */}
            <div className="mt-5 flex items-center gap-3">
              {/* Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#1D4ED8]"
              >
                <Globe size={17} />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#1D4ED8]"
              >
                <Camera size={17} />
              </a>

              {/* Twitter */}
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#1D4ED8]"
              >
                <MessageCircle size={17} />
              </a>

              {/* Youtube */}
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#1D4ED8]"
              >
                <Play size={17} />
              </a>
            </div>
          </div>

          {/* ================= SHOP ================= */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Shop
            </h3>

            <div className="mt-5 space-y-3">
              <a
                href="https://www.amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-slate-300 transition hover:text-white"
              >
                Mobiles
              </a>

              <a
                href="https://www.amazon.in/fashion"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-slate-300 transition hover:text-white"
              >
                Fashion
              </a>

              <a
                href="https://www.amazon.in/electronics"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-slate-300 transition hover:text-white"
              >
                Electronics
              </a>

              <a
                href="https://www.amazon.in/home"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-slate-300 transition hover:text-white"
              >
                Home & Kitchen
              </a>

              <a
                href="https://www.amazon.in/gp/bestsellers"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-slate-300 transition hover:text-white"
              >
                Best Sellers
              </a>
            </div>
          </div>

          {/* ================= CUSTOMER SERVICE ================= */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Customer Service
            </h3>

            <div className="mt-5 space-y-3">
              <a
                href="https://www.example.com/help"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                Help Center
                <ArrowRight size={14} />
              </a>

              <a
                href="https://www.example.com/orders"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                Track Order
                <ArrowRight size={14} />
              </a>

              <a
                href="https://www.example.com/returns"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                Returns & Refunds
                <ArrowRight size={14} />
              </a>

              <a
                href="https://www.example.com/faq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                FAQ
                <ArrowRight size={14} />
              </a>

              <a
                href="https://www.example.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
              >
                Privacy Policy
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* ================= CONTACT ================= */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Contact Us
            </h3>

            <div className="mt-5 space-y-4">
              {/* Location */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 text-sm text-slate-300 transition hover:text-white"
              >
                <MapPin size={18} className="mt-0.5 shrink-0" />

                <span>
                  Ahmedabad,
                  <br />
                  Gujarat, India
                </span>
              </a>

              {/* Phone */}
              <a
                href="tel:+919999999999"
                className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-white"
              >
                <Phone size={18} />

                <span>+91 99999 99999</span>
              </a>

              {/* Email */}
              <a
                href="mailto:support@minekart.com"
                className="flex items-center gap-3 text-sm text-slate-300 transition hover:text-white"
              >
                <Mail size={18} />

                <span>support@minekart.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM FOOTER ================= */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <p>© 2026 MineKart. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a
              href="https://www.example.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Terms
            </a>

            <a
              href="https://www.example.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Privacy
            </a>

            <a
              href="https://www.example.com/cookies"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}