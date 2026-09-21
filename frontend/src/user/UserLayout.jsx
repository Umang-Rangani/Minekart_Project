import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#FBF7F2] text-[#351C18]">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className=" w-full bg-linear-to-b from-[#FFFDFC] via-[#FBF5EF] to-[#F7EEE7]  py-35 ">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-7">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
