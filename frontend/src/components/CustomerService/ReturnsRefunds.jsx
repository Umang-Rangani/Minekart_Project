import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, PackageCheck, Clock3, ShieldCheck, CircleHelp, CheckCircle2 } from 'lucide-react'

export default function ReturnsRefunds() {
  const returnSteps = [
    {
      icon: PackageCheck,
      title: 'Request a Return',
      description: 'Open your order and select the eligible product for return.',
    },
    {
      icon: Clock3,
      title: 'Verification',
      description: 'Our team reviews the return request and product eligibility.',
    },
    {
      icon: RotateCcw,
      title: 'Product Pickup',
      description: 'The product is collected from your delivery address.',
    },
    {
      icon: CheckCircle2,
      title: 'Refund Processed',
      description: 'Your refund is processed according to the payment method.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7EEE7]">
      <div className="mx-auto max-w-300 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-5 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />
              <RotateCcw size={18} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold text-[#351C18] sm:text-sm">Returns & Refunds</h1>
              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Simple and transparent return information</p>
            </div>
          </div>

          <Link to="/orders" className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[#A51D26] px-2.5 text-[9px] font-bold text-white transition hover:bg-[#7D171C] sm:px-3 sm:text-[10px]">
            My Orders
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Intro */}
        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.05)] sm:p-7">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#A51D26]">
              <RotateCcw size={26} />
            </div>

            <h2 className="mt-4 text-lg font-extrabold text-[#351C18] sm:text-xl">Returns made simple</h2>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-[#806C63] sm:text-sm">If your eligible product needs to be returned, you can manage the return process directly from your order details.</p>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-5">
          <h3 className="mb-3 text-sm font-extrabold text-[#351C18]">How returns work</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {returnSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <div key={step.title} className="rounded-2xl border border-[#E8DDD4] bg-white p-4 shadow-[0_3px_12px_rgba(73,54,49,0.04)] sm:p-5">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#A51D26]">
                      <Icon size={18} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold text-[#A51D26]">STEP {index + 1}</span>
                      </div>

                      <h4 className="mt-1 text-sm font-extrabold text-[#351C18]">{step.title}</h4>

                      <p className="mt-1 text-xs leading-5 text-[#806C63]">{step.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Policy */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#3E8B62]" />
              <h3 className="text-sm font-extrabold text-[#351C18]">Return eligibility</h3>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#806C63]">Return eligibility can vary by product and order. Check the return information available in your order details.</p>
          </div>

          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5">
            <div className="flex items-center gap-2">
              <CircleHelp size={18} className="text-[#A51D26]" />
              <h3 className="text-sm font-extrabold text-[#351C18]">Need help?</h3>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#806C63]">If you have a question about your return, contact the MineKart support team.</p>

            <Link to="/contact" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#A51D26] hover:text-[#7D171C]">
              Contact Support
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
