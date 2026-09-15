import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="w-full pt-25 pb-20 bg-[#EFF6FF]">
        <div className="mx-auto w-full max-w-[1600px] px-6  ">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}
