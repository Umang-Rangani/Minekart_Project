import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import { X, ArrowRight, UserPlus, Mail, Lock, ShieldCheck } from 'lucide-react'

export default function Login({ onClose }) {
  const [logIn, setLogIn] = useState({
    email: '',
    password: '',
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const { setUser, setShowLogin } = useUser()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const changeHandle = (e) => {
    const { name, value } = e.target

    setLogIn((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
  }

  const closeHandle = () => {
    setShowLogin(false)

    if (onClose) {
      onClose()
    }
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      const res = await axiosInstance.post('/users/login', logIn)

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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#351C18]/70 px-4 py-5 backdrop-blur-sm" onClick={closeHandle}>
      <div onClick={(e) => e.stopPropagation()} className="relative flex max-h-[calc(100vh-40px)] w-full max-w-4xl overflow-hidden rounded-3xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_25px_70px_rgba(53,28,24,0.25)]">
        {/* Close */}
        <button
          type="button"
          onClick={closeHandle}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8DDD4] bg-[#FFFDFC]/90 text-[#806C63] shadow-sm backdrop-blur-sm transition-all duration-300 hover:rotate-90 hover:bg-[#F8EEE8] hover:text-[#8E181F]"
        >
          <X size={19} />
        </button>

        {/* Left Section */}
        <div className="relative hidden w-[42%] overflow-hidden bg-linear-to-br from-[#351C18] via-[#681419] to-[#A51D26] p-8 text-white sm:flex sm:flex-col sm:justify-between lg:p-10">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#D4A373]/10" />
          <div className="absolute bottom-20 right-10 h-20 w-20 rounded-full bg-[#B5262D]/20" />

          <div className="relative z-10">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-sm">
              <UserPlus size={25} strokeWidth={1.8} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8B7B3]">Welcome Back</p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight lg:text-4xl">Login to MineKart</h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-[#F0D8D4]">Access your orders, profile and shopping experience from one place.</p>
          </div>

          <div className="relative z-10">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <ShieldCheck size={20} className="text-[#E8B7B3]" />
                </div>

                <div>
                  <p className="text-sm font-bold">Secure Shopping</p>
                  <p className="mt-0.5 text-xs text-[#E0C8C3]">Your account stays protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <form onSubmit={submitHandle} className="w-full overflow-y-auto px-6 py-8 sm:w-[58%] sm:px-9 sm:py-10 lg:px-11">
          {/* Title */}
          <div className="mb-7">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15">
              <Lock size={19} />
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight text-[#351C18]">Welcome Back</h2>

            <p className="mt-1.5 text-sm text-[#806C63]">Enter your details to continue shopping</p>
          </div>

          {/* Error */}
          {error && <div className="mb-5 rounded-xl border border-[#E7C8C5] bg-[#FFF2F1] px-4 py-3 text-sm font-medium text-[#A51D26]">{error}</div>}

          {/* Email */}
          <div className="mb-5">
            <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Email Address</label>

            <div className="group relative">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />

              <input
                onChange={changeHandle}
                value={logIn.email}
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Password</label>

            <div className="group relative">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />

              <input
                onChange={changeHandle}
                value={logIn.password}
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="h-12 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] font-bold text-white shadow-md shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#681419] hover:to-[#8E181F] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Logging in...
              </>
            ) : (
              <>
                Login
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>

          {/* Register */}
          <div className="mt-7 border-t border-[#E8DDD4] pt-5 text-center">
            <p className="text-sm text-[#806C63]">Don't have an account?</p>

            <button
              type="button"
              onClick={() => {
                setShowLogin(false)
                navigate('/register')
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#8E181F] transition-all duration-300 hover:gap-2.5 hover:text-[#A51D26]"
            >
              <UserPlus size={16} />
              Create Account
              <ArrowRight size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
