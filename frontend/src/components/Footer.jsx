import React from 'react'
import { Mail, Phone, MapPin, ArrowRight, ShoppingBag } from 'lucide-react'
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#351C18] text-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-[1600px] px-5 py-9 sm:px-7 sm:py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-14">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <Link to="/" className="group inline-flex items-center gap-2.5 sm:gap-3">
              <img src="/cart_image.jpg" alt="MineKart" className="h-10 w-10 rounded-xl object-contain transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-11 sm:w-11" />

              <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                Mine
                <span className="text-[#E17B7F]">Kart</span>
              </span>
            </Link>

            <p className="mx-auto mt-4 max-w-sm text-xs leading-5 text-[#D4C4BD] sm:mx-0 sm:mt-5 sm:text-sm sm:leading-6">Your trusted online shopping destination for fashion, electronics, mobiles, home products and more.</p>

            {/* Social */}
            <div className="mt-5 flex items-center justify-center gap-2 sm:mt-6 sm:justify-start sm:gap-2.5">
              {/* Instagram */}
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <FaInstagram size={16} />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <FaFacebookF size={15} />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <FaWhatsapp size={17} />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white"
              >
                <FaYoutube size={17} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white sm:text-sm">Shop</h3>

            <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
              <Link to="/search?q=Mobiles" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Mobiles
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Fashion" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Fashion
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Electronics" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Electronics
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Home" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Home & Kitchen
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/search?q=Best Sellers" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Best Sellers
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white sm:text-sm">Customer Service</h3>

            <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
              <Link to="/customer-help" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Help Center
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/orders" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                My Orders
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/track-order" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Track Order
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/returns" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Returns & Refunds
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link to="/contact" className="group flex items-center gap-2 text-xs text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#E17B7F] sm:text-sm">
                Contact Us
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white sm:text-sm">Contact Us</h3>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              {/* Location */}
              <div className="group flex gap-2.5 text-xs text-[#CDBDB5] sm:gap-3 sm:text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#D65A5F] sm:h-9 sm:w-9 sm:rounded-xl">
                  <MapPin size={16} />
                </span>

                <span className="leading-5">
                  Nikol 382350, Ahmedabad,
                  <br />
                  Gujarat, India
                </span>
              </div>

              {/* Phone */}
              <a href="tel:+919999999999" className="group flex items-center gap-2.5 text-xs text-[#CDBDB5] transition-colors duration-300 hover:text-white sm:gap-3 sm:text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#D65A5F] transition-all duration-300 group-hover:bg-[#8E181F] group-hover:text-white sm:h-9 sm:w-9 sm:rounded-xl">
                  <Phone size={16} />
                </span>

                <span>+91 94082 09662</span>
              </a>

              {/* Email */}
              <a href="mailto:mansi@minekart.com" className="group flex items-center gap-2.5 text-xs text-[#CDBDB5] transition-colors duration-300 hover:text-white sm:gap-3 sm:text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#D65A5F] transition-all duration-300 group-hover:bg-[#8E181F] group-hover:text-white sm:h-9 sm:w-9 sm:rounded-xl">
                  <Mail size={16} />
                </span>

                <span className="break-all">mansi@minekart.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="border-y border-white/10 bg-[#2C1714]">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-5 py-3.5 text-center sm:flex-row sm:px-7 sm:py-4 sm:text-left">
          <p className="text-[10px] leading-5 text-[#BFAEA6] sm:text-xs">Genuine Products&nbsp; • &nbsp;Secure Shopping&nbsp; • &nbsp;Easy Returns</p>

          <Link to="/tictactoe" className="text-[10px] font-semibold text-[#D65A5F] sm:text-xs">
            Time Pass Game
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-3 px-5 py-4 text-[10px] text-[#AFA09A] sm:flex-row sm:px-7 sm:py-5 sm:text-xs">
          <p>© 2026 MineKart. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <Link to="/terms" className="transition-colors duration-300 hover:text-white">
              Terms
            </Link>

            <Link to="/privacy" className="transition-colors duration-300 hover:text-white">
              Privacy
            </Link>

            <Link to="/cookies" className="transition-colors duration-300 hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
