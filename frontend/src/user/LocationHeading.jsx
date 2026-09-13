import { MapPin, Zap } from 'lucide-react'
import React from 'react'
import { useUser } from '../context/userProvider'

export default function LocationHeading() {
  const { logout, user, setShowLogin } = useUser()

  return (
    <div className="flex items-center justify-end px-6 py-4">
      {user ? (
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={19} className="fill-[#1D4ED8] text-[#1D4ED8]" />

          <span className="font-semibold text-[#172033]">Delivery Location at</span>

          <button className="font-semibold text-[#1D4ED8] transition hover:text-[#F59E0B]">
            {user.address}, {user.city},{user.pincode}
          </button>

          {/* <span className="text-lg text-[#94A3B8]">›</span> */}

          {/* Coin */}
          <div className="ml-6 flex items-center gap-1 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[#B45309]">
            <Zap size={17} className="fill-[#F59E0B] text-[#F59E0B]" />

            <span className="font-semibold">0</span>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
