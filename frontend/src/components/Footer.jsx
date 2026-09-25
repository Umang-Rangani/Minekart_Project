import React from 'react'
import { Mail, Phone, MapPin, ArrowRight, Globe, Camera, MessageCircle, Play, ShoppingBag, UserRound, RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#351C18] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-[1600px] px-5 py-12 sm:px-7 lg:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-14">
          {/* Brand */}
          <div>
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#B5262D] shadow-lg shadow-black/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                <span className="text-lg font-extrabold">M</span>
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Mine
                <span className="text-[#E17B7F]">Kart</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#D4C4BD]">Your trusted online shopping destination for fashion, electronics, mobiles, home products and more.</p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-2.5">
              <Link
                to="/"
                aria-label="MineKart"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <Globe size={17} />
              </Link>

              <Link
                to="/profile"
                aria-label="Profile"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <Camera size={17} />
              </Link>

              <Link
                to="/orders"
                aria-label="Orders"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <MessageCircle size={17} />
              </Link>

              <Link
                to="/cart"
                aria-label="Cart"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <ShoppingBag size={17} />
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Shop</h3>

            <div className="mt-5 space-y-3">
              <Link to="/search?q=Mobiles" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Mobiles
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Fashion" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Fashion
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Electronics" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Electronics
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Home" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Home & Kitchen
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Best Sellers" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Best Sellers
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Customer Service</h3>

            <div className="mt-5 space-y-3">
              <Link to="/customer-help" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Help Center
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/orders" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                My Orders
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/track-order" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Track Order
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/returns" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Returns & Refunds
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/contact" className="group flex items-center gap-2 text-sm text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F]">
                Contact Us
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Contact Us</h3>

            <div className="mt-5 space-y-4">
              {/* Location */}
              <div className="group flex gap-3 text-sm text-[#CDBDB5]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D65A5F]">
                  <MapPin size={17} />
                </span>

                <span className="leading-5">
                  Ahmedabad,
                  <br />
                  Gujarat, India
                </span>
              </div>

              {/* Phone */}
              <a href="tel:+919999999999" className="group flex items-center gap-3 text-sm text-[#CDBDB5] transition-colors duration-300 hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D65A5F] transition-all duration-300 group-hover:bg-[#8E181F] group-hover:text-white">
                  <Phone size={17} />
                </span>

                <span>+91 99999 99999</span>
              </a>

              {/* Email */}
              <a href="mailto:support@minekart.com" className="group flex items-center gap-3 text-sm text-[#CDBDB5] transition-colors duration-300 hover:text-white">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D65A5F] transition-all duration-300 group-hover:bg-[#8E181F] group-hover:text-white">
                  <Mail size={17} />
                </span>

                <span className="break-all">support@minekart.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="border-y border-white/10 bg-[#2C1714]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-5 py-4 text-center sm:flex-row sm:px-7 sm:text-left">
          <p className="text-xs text-[#BFAEA6]">Genuine Products&nbsp; • &nbsp;Secure Shopping&nbsp; • &nbsp;Easy Returns</p>

          <p className="text-xs font-semibold text-[#D65A5F]">Shop with confidence</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-[#AFA09A] sm:flex-row sm:px-7">
          <p>© 2026 MineKart. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link to="/" className="transition-colors duration-300 hover:text-white">
              Terms
            </Link>

            <Link to="/profile" className="transition-colors duration-300 hover:text-white">
              Privacy
            </Link>

            <Link to="/" className="transition-colors duration-300 hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
