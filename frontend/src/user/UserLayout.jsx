import React from 'react'
import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="w-full">
        <div className="mx-auto w-full max-w-[1600px] px-6 ">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
