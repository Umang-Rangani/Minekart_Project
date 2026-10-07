import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail, ShieldCheck, UserPlus, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import ForgotPassword from './ForgotPassword'

export default function LogIn({ onClose }) {
  const [logIn, setLogIn] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const { setUser, setShowLogin } = useUser()
  const navigate = useNavigate()

  const changeHandle = (e) => {
    const { name, value } = e.target

    setLogIn((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const closeHandle = () => {
    if (loading) {
      return
    }

    setShowLogin(false)
    setShowForgotPassword(false)

    if (onClose) {
      onClose()
    }
  }

  const openForgotPasswordHandle = () => {
    if (loading) {
      return
    }

    setShowForgotPassword(true)
  }

  const closeForgotPasswordHandle = () => {
    setShowForgotPassword(false)
  }

  const backToLoginHandle = () => {
    setShowForgotPassword(false)
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const res = await axiosInstance.post('/users/login', logIn)

      if (res.data.success) {
        setUser(res.data.user)
        setShowLogin(false)
        setShowForgotPassword(false)

        toast.success('Login successful')
      }
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || ''

      console.log(status)

      if (status === 404) {
        toast.error('Account not found. Please create an account first.')

        setShowLogin(false)
        navigate('/register')
      } else if (status === 401) {
        toast.error('Email or password is incorrect')
      } else {
        toast.error(message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return <ForgotPassword onClose={closeHandle} onBackToLogin={backToLoginHandle} />
  }

  return (
    <>
      <style>{`
        @keyframes authSheetUp {
          from {
            transform: translateY(100%);
            opacity: 0.92;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .auth-sheet {
          animation: authSheetUp 380ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (min-width: 640px) {
          .auth-sheet {
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .auth-sheet {
            animation: none;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-100 flex items-end justify-center overflow-hidden bg-[#351C18]/50 px-0 py-0 backdrop-blur-sm sm:items-center sm:px-4 sm:py-5" onClick={closeHandle}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="auth-sheet relative flex h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_-20px_70px_rgba(53,28,24,0.35)] sm:h-auto sm:max-h-[calc(100vh-40px)] sm:min-h-0 sm:flex-row sm:rounded-[28px] sm:shadow-[0_30px_90px_rgba(53,28,24,0.32)]"
        >
          <button
            type="button"
            onClick={closeHandle}
            disabled={loading}
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8DDD4] bg-[#FFFDFC]/95 text-[#806C63] shadow-md backdrop-blur-sm transition-all duration-300 hover:rotate-90 hover:bg-[#F8EEE8] hover:text-[#8E181F] disabled:cursor-not-allowed disabled:opacity-50 sm:right-4 sm:top-4"
          >
            <X size={19} />
          </button>

          <div className="relative hidden w-[43%] overflow-hidden bg-linear-to-br from-[#2B1210] via-[#571519] to-[#A51D26] p-8 text-white sm:flex sm:flex-col sm:justify-between lg:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/6 blur-2xl" />

            <div className="absolute -bottom-28 -left-20 h-60 w-60 rounded-full bg-[#D4A373]/12 blur-2xl" />

            <div className="absolute right-12 top-[42%] h-24 w-24 rounded-full bg-[#B5262D]/20 blur-xl" />

            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '34px 34px',
              }}
            />

            <div className="absolute -right-7 top-[28%] h-24 w-32 rotate-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />

            <div className="absolute bottom-[27%] -left-7 h-20 w-28 -rotate-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />

            <div className="relative z-10">
              <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-md">
                <UserPlus size={25} strokeWidth={1.8} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8B7B3]">Welcome Back</p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight lg:text-4xl">
                Login to
                <br />
                <span className="text-[#F1C7A5]">MineKart</span>
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-6 text-[#F0D8D4]">Continue your shopping journey and manage everything from one place.</p>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck size={20} className="text-[#F1C7A5]" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">Secure Shopping</p>

                    <p className="mt-0.5 text-xs text-[#E0C8C3]">Your account stays protected</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
                <span className="h-px w-8 bg-white/20" />
                Shop • Discover • Enjoy
              </div>
            </div>
          </div>

          <form onSubmit={submitHandle} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#FFFDFC] px-5 pb-7 pt-6 sm:w-[57%] sm:flex-none sm:px-9 sm:py-10 lg:px-11">
            <div className="mb-7 pr-8 sm:pr-0">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg shadow-[#7D171C]/15">
                <Lock size={19} />
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-[#351C18]">Welcome Back</h2>

              <p className="mt-1.5 text-sm text-[#806C63]">Enter your details to continue shopping</p>
            </div>

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
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

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
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  tabIndex={-1}
                  type="button"
                  onClick={openForgotPasswordHandle}
                  disabled={loading}
                  className="text-xs font-bold text-[#8E181F] transition-colors hover:text-[#A51D26] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

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

            <div className="mt-7 border-t border-[#E8DDD4] pt-5 pb-2 text-center">
              <p className="text-sm text-[#806C63]">Don't have an account?</p>

              <button
                type="button"
                onClick={() => {
                  if (loading) {
                    return
                  }

                  setShowLogin(false)
                  navigate('/register')
                }}
                disabled={loading}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-[#8E181F] transition-all duration-300 hover:gap-2.5 hover:text-[#A51D26] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <UserPlus size={16} />
                Create Account
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
