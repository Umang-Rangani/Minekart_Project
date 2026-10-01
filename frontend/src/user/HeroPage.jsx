import React from 'react'

export default function HeroPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-[#FBF7F2] text-[#351C18]">
      {/* Background */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-125 w-125 rounded-full bg-[#F3E3D8] blur-[100px]" />

      <div className="pointer-events-none absolute -bottom-40 -right-40 h-125 w-125 rounded-full bg-[#F7E3DF] blur-[110px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A51D26]/2.5 blur-[100px]" />

      {/* Main */}
      <main className="relative z-10 flex min-h-screen flex-col">
        <section className="flex flex-1 items-center px-5 py-8 sm:px-8 lg:px-14">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 lg:flex-row lg:gap-10">
            {/* LEFT - CART */}
            <div className="relative flex h-98 w-full items-center justify-center sm:h-120 lg:h-155 lg:w-[55%]">
              {/* Main Glow */}
              <div className="absolute h-70 w-70 rounded-full bg-[#A51D26]/8 blur-[70px] sm:h-90 sm:w-90 lg:h-115 lg:w-115" />

              {/* Outer Ring */}
              <div className="absolute h-75 w-75 rounded-full border border-[#A51D26]/10 sm:h-98 sm:w-98 lg:h-125 lg:w-125 animate-[ringRotate_18s_linear_infinite]" />

              {/* Dashed Ring */}
              <div className="absolute h-65 w-65 rounded-full border border-dashed border-[#D4A373]/30 sm:h-85 sm:w-85 lg:h-108 lg:w-108 animate-[ringRotateReverse_24s_linear_infinite]" />

              {/* Decorative Arc */}
              <div className="absolute h-82 w-82 rounded-full border-t-2 border-[#A51D26]/20 sm:h-105 sm:w-105 lg:h-130 lg:w-130 animate-[ringRotate_10s_linear_infinite]" />

              {/* Orbit Dots */}
              <span className="absolute left-[17%] top-[26%] h-2.5 w-2.5 rounded-full bg-[#A51D26] shadow-[0_0_14px_rgba(165,29,38,0.35)] animate-[dotPulse_2s_ease-in-out_infinite]" />

              <span className="absolute right-[17%] top-[31%] h-2 w-2 rounded-full bg-[#D4A373] shadow-[0_0_12px_rgba(212,163,115,0.4)] animate-[dotPulse_2.5s_ease-in-out_infinite]" />

              <span className="absolute bottom-[23%] left-[23%] h-2 w-2 rounded-full bg-[#8E181F] animate-[dotPulse_3s_ease-in-out_infinite]" />

              {/* Cart Image */}
              <div className="relative z-10">
                <img
                  src="/cart_image.jpg"
                  alt="MineKart Shopping Cart"
                  className="
                    h-82
                    w-82
                    object-contain
                    drop-shadow-[0_30px_30px_rgba(73,54,49,0.20)]
                    sm:h-105
                    sm:w-105
                    lg:h-130
                    lg:w-130
                    animate-[cartFloat_4s_ease-in-out_infinite]
                  "
                />
              </div>

              {/* Ground Shadow */}
              <div className="absolute bottom-[11%] h-5 w-52 rounded-full bg-[#351C18]/15 blur-xl sm:w-64 lg:w-80" />
            </div>

            {/* RIGHT - CONTENT */}
            <div className="flex w-full flex-col items-center text-center lg:w-[45%] lg:items-start lg:text-left">
              {/* Welcome */}
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#A51D26]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#907A70]">Welcome to</span>

                <span className="h-px w-8 bg-[#A51D26] lg:hidden" />
              </div>

              {/* Logo */}
              <h1 className="text-6xl font-black tracking-[-0.055em] sm:text-7xl lg:text-[82px]">
                <span className="text-[#351C18]">Mine</span>

                <span className="text-[#A51D26]">Kart</span>
              </h1>

              {/* Logo Accent */}
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 w-14 rounded-full bg-[#A51D26]" />

                <div className="h-1 w-4 rounded-full bg-[#D4A373]" />

                <div className="h-1 w-2 rounded-full bg-[#A51D26]/40" />
              </div>

              {/* Heading */}
              <h2 className="mt-7 text-2xl font-extrabold leading-tight text-[#493631] sm:text-3xl">
                Shop More.
                <br />
                <span className="text-[#A51D26]">Live Better.</span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-md text-sm leading-7 text-[#806C63] sm:text-base">Everything you love, all in one place. Discover products, explore choices and enjoy a simple shopping experience with MineKart.</p>

              {/* Loading */}
              <div className="mt-9 w-full max-w-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#A51D26]" />

                    <span className="text-xs font-semibold text-[#806C63]">Preparing MineKart</span>
                  </div>

                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#A9958B]">Loading</span>
                </div>

                <div className="relative h-1.5 overflow-hidden rounded-full bg-[#E8DDD4]">
                  <div
                    className="
                      absolute
                      inset-y-0
                      left-0
                      w-1/2
                      rounded-full
                      bg-linear-to-r
                      from-[#7D171C]
                      via-[#A51D26]
                      to-[#C34B50]
                      animate-[loading_1.5s_ease-in-out_infinite]
                    "
                  />
                </div>
              </div>

              {/* Feature Cards */}
              <div className="mt-7 grid w-full max-w-md grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] px-3 py-3 shadow-[0_5px_20px_rgba(73,54,49,0.04)]">
                  <p className="text-xs font-bold text-[#493631]">Easy</p>

                  <p className="mt-1 text-[9px] font-medium text-[#9A857B]">Shopping</p>
                </div>

                <div className="rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] px-3 py-3 shadow-[0_5px_20px_rgba(73,54,49,0.04)]">
                  <p className="text-xs font-bold text-[#493631]">Better</p>

                  <p className="mt-1 text-[9px] font-medium text-[#9A857B]">Choices</p>
                </div>

                <div className="rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] px-3 py-3 shadow-[0_5px_20px_rgba(73,54,49,0.04)]">
                  <p className="text-xs font-bold text-[#493631]">Fast</p>

                  <p className="mt-1 text-[9px] font-medium text-[#9A857B]">Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Animations */}
      <style>{`

        @keyframes cartFloat {

          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }

          25% {
            transform: translateY(-10px) rotate(-2deg) scale(1.015);
          }

          50% {
            transform: translateY(0) rotate(0deg) scale(1);
          }

          75% {
            transform: translateY(-10px) rotate(2deg) scale(1.015);
          }

          100% {
            transform: translateY(0) rotate(0deg) scale(1);
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

        @keyframes loading {

          0% {
            transform: translateX(-120%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(230%);
          }

        }

        @keyframes dotPulse {

          0% {
            transform: scale(0.7);
            opacity: 0.35;
          }

          50% {
            transform: scale(1.4);
            opacity: 1;
          }

          100% {
            transform: scale(0.7);
            opacity: 0.35;
          }

        }

      `}</style>
    </div>
  )
}
