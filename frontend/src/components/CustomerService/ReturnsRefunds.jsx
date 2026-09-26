import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, RotateCcw, PackageCheck, Clock3, ShieldCheck, CircleHelp, CheckCircle2 } from 'lucide-react'
import BreadCrumb from '../../user/BreadCrumb'

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

  const items = [
    {
      title: 'Returns & Refunds',
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
                <RotateCcw size={27} strokeWidth={1.8} />
              </div>

              <h2 className="mt-4 text-lg font-extrabold text-white sm:text-xl">Returns & Refunds</h2>

              <p className="mt-1.5 text-xs leading-5 text-white/70 sm:text-sm">Simple and transparent information about returns and refunds.</p>

              <Link to="/orders" className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-extrabold text-[#351C18] transition hover:bg-[#F7EEE7]">
                My Orders
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 divide-x divide-[#E8DDD4] bg-[#FBF7F2] sm:grid-cols-3">
            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Process</p>

              <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">4 Simple Steps</p>
            </div>

            <div className="px-4 py-3 text-center">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Eligibility</p>

              <p className="mt-0.5 text-xs font-extrabold text-[#351C18]">Product Based</p>
            </div>

            <div className="col-span-2 border-t border-[#E8DDD4] px-4 py-3 text-center sm:col-span-1 sm:border-t-0">
              <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Support</p>

              <Link to="/contact" className="mt-0.5 inline-flex text-xs font-extrabold text-[#A51D26] transition hover:text-[#351C18]">
                Need Help?
              </Link>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-5 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#A51D26]">
              <RotateCcw size={21} strokeWidth={1.8} />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-[#351C18]">Returns made simple</h3>

              <p className="mt-1 text-xs leading-5 text-[#806C63]">If your eligible product needs to be returned, you can manage the return process directly from your order details.</p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="mt-5 rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#351C18]">How returns work</h3>

              <p className="mt-1 text-[10px] text-[#806C63]">Follow these simple steps to complete your return</p>
            </div>

            <div className="hidden h-8 items-center gap-1.5 rounded-lg bg-[#F7EEE7] px-2.5 text-[9px] font-bold text-[#351C18] sm:flex">
              <RotateCcw size={13} />
              Easy Returns
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-4">
            {returnSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <div key={step.title} className="relative flex items-start gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3 sm:block sm:p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#351C18] text-white shadow-[0_4px_10px_rgba(53,28,24,0.12)]">
                    <Icon size={18} strokeWidth={1.8} />
                  </div>

                  <div className="sm:mt-3">
                    <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#A51D26]">Step {index + 1}</p>

                    <h4 className="mt-1 text-xs font-extrabold text-[#351C18]">{step.title}</h4>

                    <p className="mt-1 text-[10px] leading-4 text-[#806C63]">{step.description}</p>
                  </div>

                  {index < returnSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
                      <ArrowRight size={14} className="text-[#C7B6AE]" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Policy */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* Eligibility */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)]">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF5EE] text-[#3E8B62]">
                <ShieldCheck size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Policy</p>

                <h3 className="text-sm font-extrabold text-[#351C18]">Return eligibility</h3>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#806C63]">Return eligibility can vary by product and order. Check the return information available in your order details.</p>
          </div>

          {/* Help */}
          <div className="rounded-2xl border border-[#E8DDD4] bg-white p-5 shadow-[0_4px_16px_rgba(73,54,49,0.04)]">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FCEBED] text-[#A51D26]">
                <CircleHelp size={18} strokeWidth={1.8} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#9A857B]">Support</p>

                <h3 className="text-sm font-extrabold text-[#351C18]">Need help?</h3>
              </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#806C63]">If you have a question about your return, contact the MineKart support team.</p>

            <Link to="/contact" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#A51D26] transition hover:text-[#351C18]">
              Contact Support
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Footer / Help CTA */}
        <div className="mt-5 overflow-hidden rounded-2xl bg-linear-to-br from-[#351C18] via-[#4A2520] to-[#7D171C] px-5 py-6 text-center shadow-[0_5px_18px_rgba(53,28,24,0.10)] sm:px-6 sm:py-7">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white">
            <CircleHelp size={20} strokeWidth={1.8} />
          </div>

          <h3 className="mt-3 text-sm font-extrabold text-white sm:text-base">Need help with a return?</h3>

          <p className="mx-auto mt-1 max-w-md text-[10px] leading-4 text-white/65 sm:text-xs">Our support team can help you with return eligibility and refund-related questions.</p>

          <Link to="/contact" className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-white px-4 text-[10px] font-extrabold text-[#351C18] transition hover:bg-[#F7EEE7]">
            Contact Support
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
