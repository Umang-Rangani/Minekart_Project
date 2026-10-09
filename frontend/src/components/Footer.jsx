import React from 'react'
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react'
import { FaInstagram, FaFacebookF, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  const shopLinks = [
    { label: 'Mobiles', to: '/search?q=Mobiles' },
    { label: 'Fashion', to: '/search?q=Fashion' },
    { label: 'Shoes', to: '/search?q=Shoes' },
    { label: 'Laptops', to: '/search?q=Laptops' },
    { label: 'Audio & Video', to: '/search?q=Audio%20%26%20Video' },
  ]

  const serviceLinks = [
    { label: 'Help Center', to: '/customer-help' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Track Order', to: '/track-order' },
    { label: 'Returns & Refunds', to: '/returns' },
    { label: 'Contact Us', to: '/contact' },
  ]

  const socialLinks = [
    {
      label: 'Instagram',
      href: 'https://instagram.com/',
      icon: <FaInstagram size={17} />,
    },
    {
      label: 'Facebook',
      href: 'https://facebook.com/',
      icon: <FaFacebookF size={16} />,
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/919999999999',
      icon: <FaWhatsapp size={18} />,
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com/',
      icon: <FaYoutube size={18} />,
    },
  ]

  const legalLinks = [
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy' },
    { label: 'Cookies', to: '/cookies' },
  ]

  const linkClass = 'group flex w-fit items-center gap-1.5 text-[11px] text-[#CDBDB5] transition-all duration-300 hover:translate-x-1 hover:text-[#F0A1A1] sm:gap-2 sm:text-sm'

  return (
    <footer
      className="block! w-full! overflow-hidden! bg-[#351C18]! text-white!"
      style={{
        backgroundColor: '#351C18',
        color: '#FFFFFF',
        isolation: 'isolate',
      }}
    >
      <div className="h-px w-full bg-linear-to-r from-transparent via-[#D65A5F]/70 to-transparent" />

      <div className="bg-[#351C18]! px-4 py-8 sm:px-7 sm:py-12 lg:py-14">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-14">
          <div className="col-span-2 text-center sm:text-left lg:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-2.5 sm:gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_3px_14px_rgba(0,0,0,0.16)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 sm:h-11 sm:w-11">
                <img src="/cart_image.jpg" alt="MineKart" className="h-full w-full rounded-xl object-contain" />
              </span>

              <span className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Mine<span className="text-[#E17B7F]">Kart</span>
              </span>
            </Link>

            <p className="mx-auto mt-3 max-w-xs text-[11px] leading-5 text-[#D4C4BD] sm:mx-0 sm:mt-5 sm:text-sm sm:leading-6">Your trusted online shopping destination for fashion, shoes, mobiles, laptops and more.</p>

            <div className="mt-4 flex items-center justify-center gap-2 sm:mt-6 sm:justify-start sm:gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#D4C4BD] transition-all duration-300 hover:-translate-y-1 hover:border-[#A51D26] hover:bg-[#8E181F] hover:text-white sm:h-10 sm:w-10"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] font-medium text-[#D4C4BD] sm:mt-5 sm:text-[10px]">
              <ShieldCheck size={13} className="text-[#E17B7F]" />
              Shopping made simple
            </div>
          </div>

          <div className="min-w-0 pl-1 sm:pl-0">
            <h3 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white sm:text-sm sm:tracking-[0.14em]">
              <span className="h-4 w-1 rounded-full bg-[#D65A5F]" />
              Shop
            </h3>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5">
              {shopLinks.map((item) => (
                <Link key={item.label} to={item.to} className={linkClass}>
                  <span>{item.label}</span>
                  <ArrowRight size={12} className="shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white sm:text-sm sm:tracking-[0.14em]">
              <span className="h-4 w-1 shrink-0 rounded-full bg-[#D65A5F]" />
              <span>Customer Service</span>
            </h3>

            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-3.5">
              {serviceLinks.map((item) => (
                <Link key={item.label} to={item.to} className={linkClass}>
                  <span>{item.label}</span>
                  <ArrowRight size={12} className="shrink-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 border-t border-white/10 pt-6 sm:pt-7 lg:col-span-1 lg:border-0 lg:pt-0">
            <h3 className="flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white sm:justify-start sm:text-sm">
              <span className="h-4 w-1 rounded-full bg-[#D65A5F]" />
              Contact Us
            </h3>

            <div className="mx-auto mt-4 grid max-w-md grid-cols-1 gap-3 sm:mx-0 sm:mt-5 sm:gap-4">
              <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-white/3 p-2.5 transition-colors duration-300 hover:bg-white/6 sm:border-0 sm:bg-transparent sm:p-0 sm:hover:bg-transparent">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D65A5F]/15 bg-[#8E181F]/20 text-[#E17B7F] sm:h-10 sm:w-10">
                  <MapPin size={17} />
                </span>
                <span className="text-[11px] leading-5 text-[#CDBDB5] sm:text-sm">
                  Nikol 382350, Ahmedabad,
                  <br />
                  Gujarat, India
                </span>
              </div>

              <a
                href="tel:+919408209662"
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-white/3 p-2.5 transition-colors duration-300 hover:bg-white/6 sm:border-0 sm:bg-transparent sm:p-0 sm:hover:bg-transparent"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D65A5F]/15 bg-[#8E181F]/20 text-[#E17B7F] transition-all duration-300 group-hover:bg-[#8E181F] group-hover:text-white sm:h-10 sm:w-10">
                  <Phone size={16} />
                </span>
                <span className="text-[11px] text-[#CDBDB5] transition-colors group-hover:text-white sm:text-sm">+91 94082 09662</span>
              </a>

              <a
                href="mailto:mansi@minekart.com"
                className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/5 bg-white/3 p-2.5 transition-colors duration-300 hover:bg-white/6 sm:border-0 sm:bg-transparent sm:p-0 sm:hover:bg-transparent"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#D65A5F]/15 bg-[#8E181F]/20 text-[#E17B7F] transition-all duration-300 group-hover:bg-[#8E181F] group-hover:text-white sm:h-10 sm:w-10">
                  <Mail size={16} />
                </span>
                <span className="break-all text-[11px] text-[#CDBDB5] transition-colors group-hover:text-white sm:text-sm">mansi@minekart.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-white/10 bg-[#2C1714]!">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2.5 px-4 py-4 text-center sm:flex-row sm:gap-4 sm:px-7 sm:py-4 sm:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[9px] leading-5 text-[#BFAEA6] sm:justify-start sm:gap-x-3 sm:text-xs">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#E17B7F]" />
              Genuine Products
            </span>
            <span className="text-white/20">•</span>
            <span>Secure Shopping</span>
            <span className="text-white/20">•</span>
            <span>Easy Returns</span>
          </div>

          <Link
            to="/tictactoe"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D65A5F]/20 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-[#E17B7F] transition-all duration-300 hover:border-[#D65A5F]/50 hover:bg-[#8E181F]/30 sm:text-xs"
          >
            <Sparkles size={12} />
            Time Pass Game
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#351C18]!">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-4 py-5 sm:px-7 sm:py-5 lg:flex-row lg:justify-between">
          <p className="text-center text-[10px] text-[#AFA09A] sm:text-xs">© {new Date().getFullYear()} MineKart. All rights reserved.</p>

          <div className="flex items-center justify-center gap-4 text-[10px] text-[#AFA09A] sm:gap-5 sm:text-xs">
            {legalLinks.map((item) => (
              <Link key={item.label} to={item.to} className="transition-colors duration-300 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#D65A5F]/25 bg-linear-to-r from-[#4A2420] via-[#3D201C] to-[#4A2420] px-3.5 py-2 shadow-[0_3px_14px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E17B7F]/60 hover:shadow-[0_5px_20px_rgba(214,90,95,0.12)] sm:px-4">
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/6 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#E17B7F]/30 bg-[#8E181F] text-[#FFD8D0]">
              <Heart size={12} fill="currentColor" />
            </span>

            <span className="relative flex flex-col gap-0.5">
              <span className="text-[8px] font-medium uppercase tracking-[0.16em] text-[#CDBDB5] sm:text-[9px]">Designed & Developed by</span>
              <span className="bg-linear-to-r from-[#FFE2CE] via-[#F0A1A1] to-[#E17B7F] bg-clip-text text-[11px] font-extrabold tracking-wide text-transparent sm:text-xs">Umang Rangani</span>
            </span>

            <span className="relative ml-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#E17B7F]/30 bg-white/5 text-[9px] font-black text-[#F0A1A1]">U</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
