import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, UserPlus, X } from 'lucide-react'
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
  const [showPassword, setShowPassword] = useState(false)

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

  const backToLoginHandle = () => {
    setShowForgotPassword(false)
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    const email = logIn.email.trim()
    const password = logIn.password.trim()

    if (!email && !password) {
      toast.error('Please enter your email and password')
      return
    }

    if (!email) {
      toast.error('Please enter your email')
      return
    }

    if (!password) {
      toast.error('Please enter your password')
      return
    }

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
        navigate('/register', {
          state: {
            email: email,
          },
        })
      } else if (status === 401) {
        toast.error('Email or password is incorrect')
      } else {
        toast.error('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (showForgotPassword) {
    return <ForgotPassword email={logIn.email} onClose={closeHandle} onBackToLogin={backToLoginHandle} />
  }

  return (
    <>
      <style>{`
        @keyframes loginSheetUp {
          from {
            transform: translateY(100%);
            opacity: 0.94;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .login-sheet {
          animation: loginSheetUp 380ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (min-width: 640px) {
          .login-sheet {
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-sheet {
            animation: none;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-100 flex items-end justify-center overflow-hidden bg-mk-ink/55 px-0 py-0 backdrop-blur-sm sm:items-center sm:px-4 sm:py-5" onClick={closeHandle}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            login-sheet
            relative z-10
            flex w-full max-w-4xl
            flex-col
            overflow-hidden
            rounded-t-[30px]
            border border-mk-border
            bg-mk-card
            shadow-[0_-18px_70px_rgba(53,28,24,0.32)]
            sm:max-h-[calc(100vh-40px)]
            sm:flex-row
            sm:rounded-[28px]
            sm:shadow-[0_30px_90px_rgba(53,28,24,0.32)]
          "
        >
          <button
            type="button"
            onClick={closeHandle}
            disabled={loading}
            className="
              absolute right-3 top-3 z-40
              flex h-9 w-9 items-center justify-center
              rounded-xl
              border border-mk-border
              bg-mk-card/95
              text-mk-muted
              shadow-md
              backdrop-blur-sm
              transition-all duration-300
              hover:rotate-90
              hover:bg-mk-primary-soft
              hover:text-mk-primary-hover
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:right-4 sm:top-4
            "
          >
            <X size={19} />
          </button>

          <div className="relative hidden w-[43%] overflow-hidden bg-linear-to-br from-mk-ink via-mk-ink to-mk-primary p-8 text-white sm:flex sm:flex-col sm:justify-between lg:p-10">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/6 blur-2xl" />

            <div className="absolute -bottom-28 -left-20 h-60 w-60 rounded-full bg-mk-accent/12 blur-2xl" />

            <div className="absolute right-12 top-[42%] h-24 w-24 rounded-full bg-mk-primary/20 blur-xl" />

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

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mk-border">Welcome Back</p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight lg:text-4xl">
                Login to
                <br />
                <span className="text-mk-border">MineKart</span>
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-6 text-mk-border">Continue your shopping journey and manage everything from one place.</p>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck size={20} className="text-mk-border" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">Secure Shopping</p>

                    <p className="mt-0.5 text-xs text-mk-border">Your account stays protected</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
                <span className="h-px w-8 bg-white/20" />
                Shop • Discover • Enjoy
              </div>
            </div>
          </div>

          <form
            onSubmit={submitHandle}
            className="
              flex
              w-full
              flex-col
              overflow-y-auto
              overscroll-contain
              bg-mk-card
              px-5
              pb-6
              pt-6
              sm:w-[57%]
              sm:px-9
              sm:py-10
              lg:px-11
            "
          >
            <div className="mb-6 pr-10 sm:mb-7 sm:pr-0">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-lg shadow-mk-primary-deep/15">
                <Lock size={19} />
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-mk-ink">Welcome Back</h2>

              <p className="mt-1.5 text-sm text-mk-muted">Enter your details to continue shopping</p>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold text-mk-ink sm:text-sm">Email Address</label>

              <div className="group relative">
                <Mail
                  size={18}
                  className="
                    absolute left-3.5 top-1/2
                    -translate-y-1/2
                    text-mk-muted
                    transition-colors duration-200
                    group-focus-within:text-mk-primary-hover
                  "
                />

                <input
                  onChange={changeHandle}
                  value={logIn.email}
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  className=" h-12 w-full rounded-xl border border-mk-border bg-mk-card pl-11 pr-4 text-sm text-mk-ink outline-none transition-all duration-200 placeholder:text-mk-muted hover:border-mk-border focus:border-mk-primary focus:bg-white focus:ring-4 focus:ring-mk-primary/5 disabled:cursor-not-allowed disabled:opacity-60 "
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-xs font-bold text-mk-ink sm:text-sm">Password</label>

              <div className="group relative">
                <Lock size={18} className=" absolute left-3.5 top-1/2 -translate-y-1/2 text-mk-muted transition-colors duration-200 group-focus-within:text-mk-primary-hover " />

                <input
                  onChange={changeHandle}
                  value={logIn.password}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  className=" h-12 w-full rounded-xl border border-mk-border bg-mk-card pl-11 pr-12 text-sm text-mk-ink outline-none transition-all duration-200 placeholder:text-mk-muted hover:border-mk-border focus:border-mk-primary focus:bg-white focus:ring-4 focus:ring-mk-primary/5 disabled:cursor-not-allowed disabled:opacity-60 "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  className=" absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-mk-muted transition-colors duration-200 hover:text-mk-primary-hover disabled:cursor-not-allowed disabled:opacity-50 "
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  tabIndex={-1}
                  type="button"
                  onClick={openForgotPasswordHandle}
                  disabled={loading}
                  className="
                    text-xs font-bold
                    text-mk-primary-hover
                    transition-colors
                    hover:text-mk-primary
                    hover:underline
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                group
                flex h-12 w-full
                shrink-0
                items-center justify-center gap-2
                rounded-xl
                bg-linear-to-r from-mk-primary-deep to-mk-primary
                font-bold text-white
                shadow-md shadow-mk-primary-deep/20
                transition-all duration-300
                hover:-translate-y-0.5
                hover:from-mk-primary-deep
                hover:to-mk-primary-hover
                hover:shadow-lg
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:translate-y-0
              "
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

            <div className="mt-6 border-t border-mk-border pt-4 text-center sm:mt-7 sm:pt-5">
              <p className="text-sm text-mk-muted">Don't have an account?</p>

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
                className="
                  mt-2
                  inline-flex items-center gap-1.5
                  text-sm font-bold
                  text-mk-primary-hover
                  transition-all duration-300
                  hover:gap-2.5
                  hover:text-mk-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
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
