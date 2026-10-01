import React from 'react'
import { ArrowLeft, ArrowRight, Home, Search, ShoppingBag } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FBF7F2] text-[#351C18]">
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-125 w-125 rounded-full bg-[#F3E3D8] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-[#F7E3DF] blur-[110px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A51D26]/5 blur-[100px]" />

      {/* Decorative Dots */}
      <span className="absolute left-[10%] top-[22%] h-2.5 w-2.5 rounded-full bg-[#A51D26]/60 animate-[dotFloat_4s_ease-in-out_infinite]" />

      <span className="absolute right-[13%] top-[28%] h-2 w-2 rounded-full bg-[#D4A373] animate-[dotFloat_5s_ease-in-out_infinite_reverse]" />

      <span className="absolute bottom-[22%] left-[18%] h-2 w-2 rounded-full bg-[#8E181F]/40 animate-[dotFloat_4.5s_ease-in-out_infinite]" />

      <span className="absolute bottom-[18%] right-[22%] h-2.5 w-2.5 rounded-full bg-[#D4A373]/70 animate-[dotFloat_5.5s_ease-in-out_infinite_reverse]" />

      {/* Main */}
      <main className="relative z-10 flex min-h-screen items-center px-5 py-10 sm:px-8 lg:px-14">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-10 lg:flex-row lg:gap-16">
          {/* LEFT - Illustration */}
          <div className="relative flex h-80 w-full items-center justify-center sm:h-105 lg:h-125 lg:w-[52%]">
            {/* Glow */}
            <div className="absolute h-60 w-60 rounded-full bg-[#A51D26]/8 blur-[70px] sm:h-80 sm:w-80 lg:h-105 lg:w-105" />

            {/* Rings */}
            <div className="absolute h-65 w-65 rounded-full border border-[#A51D26]/10 sm:h-85 sm:w-85 lg:h-110 lg:w-110 animate-[ringRotate_22s_linear_infinite]" />

            <div className="absolute h-55 w-55 rounded-full border border-dashed border-[#D4A373]/35 sm:h-75 sm:w-75 lg:h-95 lg:w-95 animate-[ringRotateReverse_28s_linear_infinite]" />

            {/* 404 Badge */}
            <div className="absolute left-[13%] top-[13%] flex h-16 w-16 rotate-[-10deg] items-center justify-center rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_12px_30px_rgba(73,54,49,0.08)] sm:left-[17%] sm:top-[14%] sm:h-20 sm:w-20">
              <span className="text-lg font-black tracking-tight text-[#A51D26] sm:text-xl">404</span>
            </div>

            {/* Small Shopping Icon */}
            <div className="absolute right-[12%] top-[20%] flex h-11 w-11 rotate-[8deg] items-center justify-center rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] text-[#8E181F] shadow-[0_10px_25px_rgba(73,54,49,0.07)] sm:right-[17%]">
              <ShoppingBag size={20} strokeWidth={1.8} />
            </div>

            {/* Cart */}
            <div className="relative z-10 animate-[cartFloat_4s_ease-in-out_infinite]">
              <img src="/cart_image.jpg" alt="MineKart" className="h-70 w-70 object-contain drop-shadow-[0_30px_30px_rgba(73,54,49,0.18)] sm:h-90 sm:w-90 lg:h-110 lg:w-110" />
            </div>

            {/* Ground Shadow */}
            <div className="absolute bottom-[10%] h-5 w-48 rounded-full bg-[#351C18]/15 blur-xl sm:w-64 lg:w-72" />

            {/* Decorative Lines */}
            <div className="absolute bottom-[16%] left-[12%] h-px w-14 bg-[#D4A373]/60 sm:left-[18%] sm:w-20" />

            <div className="absolute bottom-[13%] left-[18%] h-px w-6 bg-[#A51D26]/40 sm:left-[27%] sm:w-8" />
          </div>

          {/* RIGHT - Content */}
          <div className="flex w-full max-w-xl flex-col items-center text-center lg:w-[48%] lg:items-start lg:text-left">
            {/* Small Label */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A51D26]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#907A70]">Oops! Something went missing</span>

              <span className="h-px w-8 bg-[#A51D26] lg:hidden" />
            </div>

            {/* 404 */}
            <h1 className="text-[90px] font-black leading-[0.8] tracking-[-0.07em] text-[#351C18] sm:text-[110px] lg:text-[125px]">
              4<span className="text-[#A51D26]">0</span>4
            </h1>

            {/* Accent */}
            <div className="mt-6 flex items-center gap-2">
              <div className="h-1 w-14 rounded-full bg-[#A51D26]" />
              <div className="h-1 w-4 rounded-full bg-[#D4A373]" />
              <div className="h-1 w-2 rounded-full bg-[#A51D26]/40" />
            </div>

            {/* Heading */}
            <h2 className="mt-7 text-3xl font-extrabold leading-tight text-[#493631] sm:text-4xl">
              This page took a
              <br />
              <span className="text-[#A51D26]">wrong turn.</span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-md text-sm leading-7 text-[#806C63] sm:text-base">Looks like the page you're looking for isn't here. It may have moved, disappeared, or taken a little shopping break.</p>

            {/* Buttons */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link to="/" className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#A51D26] px-6 text-sm font-bold text-white shadow-[0_10px_25px_rgba(165,29,38,0.18)] transition-colors duration-200 hover:bg-[#8E181F]">
                <Home size={17} strokeWidth={2} />

                <span>Back to Home</span>

                <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-6 text-sm font-bold text-[#493631] transition-colors duration-200 hover:border-[#CFA8A0] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
              >
                <ArrowLeft size={17} strokeWidth={2} />

                <span>Go Back</span>
              </button>
            </div>

            {/* Search Hint */}
            <div className="mt-7 flex items-center gap-2 text-xs text-[#A08C82]">
              <Search size={14} strokeWidth={1.8} />

              <span>Or head back and continue shopping</span>
            </div>

            {/* Mini Brand */}
            <div className="mt-9 flex items-center gap-2.5 border-t border-[#E8DDD4] pt-5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-[#E4CFC5] bg-[#F6E9E0]">
                <img src="/cart_image.jpg" alt="MineKart" className="h-7 w-7 object-contain" />
              </div>

              <div className="text-left leading-none">
                <p className="text-sm font-black text-[#351C18]">
                  Mine<span className="text-[#A51D26]">Kart</span>
                </p>

                <p className="mt-1 text-[7px] font-bold tracking-[0.18em] text-[#967E74]">SHOP MORE • LIVE BETTER</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes cartFloat {
          0% {
            transform: translateY(0) rotate(0deg);
          }

          25% {
            transform: translateY(-9px) rotate(-1.5deg);
          }

          50% {
            transform: translateY(0) rotate(0deg);
          }

          75% {
            transform: translateY(-9px) rotate(1.5deg);
          }

          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        @keyframes ringRotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ringRotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes dotFloat {
          0% {
            transform: translateY(0);
            opacity: 0.35;
          }

          50% {
            transform: translateY(-10px);
            opacity: 0.9;
          }

          100% {
            transform: translateY(0);
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  )
}
