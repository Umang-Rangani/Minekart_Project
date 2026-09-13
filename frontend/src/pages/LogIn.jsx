import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import { X, ArrowRight, UserPlus } from 'lucide-react'

export default function Login({ onClose }) {
  const [logIn, setLogIn] = useState({
    email: '',
    password: '',
  })

  const { setUser, setShowLogin } = useUser()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ================= CHANGE =================
  const changeHandle = (e) => {
    const { name, value } = e.target

    setLogIn((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
  }

  // ================= CLOSE =================
  const closeHandle = () => {
    setShowLogin(false)

    if (onClose) {
      onClose()
    }
  }

  // ================= SUBMIT =================
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const res = await axiosInstance.post('/users/login', logIn)

      // console.log('Login Response:', res.data)

      if (res.data.success) {
        setUser(res.data.user)
        setShowLogin(false)
      }
    } catch (error) {
      console.log('Login Error:', error)

      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#172033]/70 px-4 backdrop-blur-[2px]" onClick={closeHandle}>
      <div onClick={(e) => e.stopPropagation()} className="relative flex w-full max-w-190 overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* ================= CLOSE ================= */}
        <button type="button" onClick={closeHandle} className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#172033]">
          <X size={20} />
        </button>

        {/* ================= LEFT SECTION ================= */}
        <div className="hidden w-[40%] flex-col justify-between bg-[#1D4ED8] p-8 text-white sm:flex">
          <div>
            <h2 className="text-3xl font-semibold">Login</h2>

            <p className="mt-4 text-[17px] leading-7 text-blue-100">Get access to your orders, wishlist and recommendations</p>
          </div>

          {/* Simple Illustration */}
          <div className="flex justify-center">
            <div className="flex h-32 w-40 items-center justify-center rounded-xl bg-white/10">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                  <UserPlus size={30} className="text-white" />
                </div>

                <p className="text-sm text-blue-100">Welcome to MineKart</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <form onSubmit={submitHandle} className="w-full px-7 py-9 sm:w-[60%] sm:px-10">
          {/* ================= TITLE ================= */}
          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-[#172033]">Login to MineKart</h2>

            <p className="mt-2 text-sm text-[#64748B]">Enter your email and password to continue</p>
          </div>

          {/* ================= ERROR ================= */}
          {error && <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          {/* ================= EMAIL ================= */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[#172033]">Email</label>

            <input
              onChange={changeHandle}
              value={logIn.email}
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="h-12 w-full rounded-md border border-[#CBD5E1] bg-white px-4 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
            />
          </div>

          {/* ================= PASSWORD ================= */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-[#172033]">Password</label>

            <input
              onChange={changeHandle}
              value={logIn.password}
              type="password"
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="h-12 w-full rounded-md border border-[#CBD5E1] bg-white px-4 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
            />
          </div>

          {/* ================= LOGIN BUTTON ================= */}
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#1D4ED8] font-semibold text-white shadow-sm transition hover:bg-[#1E40AF] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              'Logging in...'
            ) : (
              <>
                Login
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* ================= REGISTER ================= */}
          <div className="mt-7 border-t border-[#E2E8F0] pt-5 text-center">
            <p className="text-sm text-[#64748B]">Don't have an account?</p>

            <button
              type="button"
              onClick={() => {
                setShowLogin(false)
                navigate('/register')
              }}
              className="mt-2 font-semibold text-[#1D4ED8] transition hover:text-[#1E40AF]"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
