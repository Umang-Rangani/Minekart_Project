import React, { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail, RefreshCw, ShieldCheck, X } from 'lucide-react'
import toast from 'react-hot-toast'

import { axiosInstance } from '../config/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/userProvider'

export default function ForgotPassword({email: initialEmail = '', onClose, onBackToLogin }) {
  const [step, setStep] = useState('email')
  const { getCurrentUser } = useUser()

  const navigate = useNavigate()

  const [email, setEmail] = useState(initialEmail)
  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    if (resendTimer <= 0) {
      return
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [resendTimer])

  const closeHandle = () => {
    if (loading || resendLoading) {
      return
    }

    if (onClose) {
      onClose()
    }
  }

  const backToLoginHandle = () => {
    if (loading || resendLoading) {
      return
    }

    if (onBackToLogin) {
      onBackToLogin()
    }
  }

  const sendOtpHandle = async (e) => {
    e.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      toast.error('Please enter your email address')
      return
    }

    try {
      setLoading(true)

      const res = await axiosInstance.post('/users/forgot-password', {
        email: normalizedEmail,
      })

      if (res.data.success) {
        setStep('otp')
        setOtp('')
        setResendTimer(60)

        toast.success('OTP sent to your email')
      }
    } catch (error) {
      console.log('Forgot Password Error:', error.response?.data || error.message)

      const errorData = error.response?.data

      if (errorData?.code === 'USER_NOT_FOUND') {
        if (onClose) {
          onClose()
        }

        navigate('/register', {
          state: {
            email: normalizedEmail,
          },
        })

        toast.error('No account found. Please create an account first.')
        return
      }

      const message = errorData?.message || 'Unable to send OTP. Please try again.'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtpHandle = async (e) => {
    e.preventDefault()

    if (!/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    try {
      setLoading(true)

      const res = await axiosInstance.post('/users/verify-otp', {
        email: email.trim().toLowerCase(),
        otp,
      })

      if (res.data.success) {
        setResetToken(res.data.resetToken)
        setStep('reset')

        toast.success('OTP verified successfully')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid OTP. Please try again.'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const resendOtpHandle = async () => {
    if (resendTimer > 0 || resendLoading) {
      return
    }

    try {
      setResendLoading(true)

      const res = await axiosInstance.post('/users/forgot-password', {
        email: email.trim().toLowerCase(),
      })

      if (res.data.success) {
        setOtp('')
        setResendTimer(60)

        toast.success('New OTP sent successfully')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to resend OTP. Please try again.'

      toast.error(message)
    } finally {
      setResendLoading(false)
    }
  }

  const resetPasswordHandle = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Please enter both passwords')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const res = await axiosInstance.post('/users/reset-password', {
        email: email.trim().toLowerCase(),
        resetToken,
        password,
        confirmPassword,
      })

      if (res.data.success) {
        await getCurrentUser()

        setStep('success')
        setPassword('')
        setConfirmPassword('')

        toast.success('Password reset successfully')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to reset password. Please try again.'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const maskedEmail = () => {
    const [name, domain] = email.split('@')

    if (!name || !domain) {
      return email
    }

    if (name.length <= 2) {
      return `${name[0] || ''}***@${domain}`
    }

    return `${name.slice(0, 2)}${'*'.repeat(Math.max(name.length - 2, 3))}@${domain}`
  }

  const getTitle = () => {
    if (step === 'email') {
      return 'Forgot Password?'
    }

    if (step === 'otp') {
      return 'Verify OTP'
    }

    if (step === 'reset') {
      return 'Create New Password'
    }

    return 'Password Reset Successful'
  }

  const getSubtitle = () => {
    if (step === 'email') {
      return 'Enter your registered email to receive a verification code.'
    }

    if (step === 'otp') {
      return `We sent a 6-digit verification code to ${maskedEmail()}`
    }

    if (step === 'reset') {
      return 'Create a strong new password for your MineKart account.'
    }

    return 'Your MineKart password has been updated successfully.'
  }

  return (
    <>
      <style>{`
        @keyframes forgotSheetUp {
          from {
            transform: translateY(100%);
            opacity: 0.94;
          }

          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .forgot-sheet {
          animation: forgotSheetUp 380ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (min-width: 640px) {
          .forgot-sheet {
            animation: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .forgot-sheet {
            animation: none;
          }
        }
      `}</style>

      <div
        className="
          fixed inset-0 z-110
          flex items-end justify-center
          overflow-hidden
          bg-mk-ink/55
          px-0 py-0
          backdrop-blur-sm
          sm:items-center
          sm:px-4 sm:py-5
        "
        onClick={closeHandle}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            forgot-sheet
            relative z-10
            flex
            w-full
            max-w-4xl
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
            disabled={loading || resendLoading}
            className="
              absolute right-3 top-3 z-40
              flex h-9 w-9
              items-center justify-center
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
                <ShieldCheck size={25} strokeWidth={1.8} />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-mk-border">Account Security</p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight lg:text-4xl">
                Reset your
                <br />
                <span className="text-mk-border">MineKart Password</span>
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-6 text-mk-border">Securely recover your account using a one-time verification code.</p>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <KeyRound size={20} className="text-mk-border" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">Secure Verification</p>

                    <p className="mt-0.5 text-xs text-mk-border">OTP protected password recovery</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/35">
                <span className="h-px w-8 bg-white/20" />
                Safe • Secure • Protected
              </div>
            </div>
          </div>

          <div
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
            <div className="pr-10">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-lg shadow-mk-primary-deep/15">
                {step === 'email' && <Mail size={20} />}

                {step === 'otp' && <ShieldCheck size={20} />}

                {step === 'reset' && <Lock size={20} />}

                {step === 'success' && <CheckCircle2 size={22} />}
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-mk-ink">{getTitle()}</h2>

                <p className="mt-1.5 max-w-md text-sm leading-6 text-mk-muted">{getSubtitle()}</p>
              </div>
            </div>

            {step !== 'success' && (
              <div className="mb-6 flex items-center gap-2">
                <StepIndicator active={step === 'email'} completed={step !== 'email'} number="1" label="Email" />

                <div className={`h-px flex-1 ${step === 'email' ? 'bg-mk-border' : 'bg-mk-primary-hover'}`} />

                <StepIndicator active={step === 'otp'} completed={step === 'reset'} number="2" label="OTP" />

                <div className={`h-px flex-1 ${step === 'reset' ? 'bg-mk-primary-hover' : 'bg-mk-border'}`} />

                <StepIndicator active={step === 'reset'} completed={false} number="3" label="Reset" />
              </div>
            )}

            {step === 'email' && (
              <form onSubmit={sendOtpHandle}>
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-xs font-bold text-mk-ink sm:text-sm">Email Address</label>
                  </div>

                  <div className="group relative">
                    <Mail
                      size={18}
                      className="
                        absolute left-3.5 top-1/2
                        -translate-y-1/2
                        text-mk-muted
                        transition-colors
                        group-focus-within:text-mk-primary-hover
                      "
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      autoComplete="email"
                      disabled={loading}
                      autoFocus
                      className="
                        h-12 w-full
                        rounded-xl
                        border border-mk-border
                        bg-mk-card
                        pl-11 pr-4
                        text-sm text-mk-ink
                        outline-none
                        transition-all duration-200
                        placeholder:text-mk-muted
                        hover:border-mk-border
                        focus:border-mk-primary
                        focus:bg-white
                        focus:ring-4
                        focus:ring-mk-primary/5
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button
                      tabIndex={-1}
                      type="button"
                      onClick={backToLoginHandle}
                      disabled={loading || resendLoading}
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
                      Back to Login ?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
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
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={verifyOtpHandle}>
                <div className="mb-5">
                  <label className="mb-2 block text-xs font-bold text-mk-ink sm:text-sm">Verification Code</label>

                  <p className="mb-4 text-xs leading-5 text-mk-muted">Enter the 6-digit verification code sent to your email.</p>

                  <div className="flex justify-center gap-1.5 xs:gap-2 sm:gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index] || ''}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')

                          if (!value) {
                            const newOtp = otp.split('')
                            newOtp[index] = ''
                            setOtp(newOtp.join(''))
                            return
                          }

                          const newOtp = otp.split('')
                          newOtp[index] = value
                          setOtp(newOtp.join('').slice(0, 6))

                          if (index < 5) {
                            document.getElementById(`otp-${index + 1}`)?.focus()
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otp[index] && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus()
                          }

                          if (e.key === 'ArrowLeft' && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus()
                          }

                          if (e.key === 'ArrowRight' && index < 5) {
                            document.getElementById(`otp-${index + 1}`)?.focus()
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault()

                          const pastedOtp = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

                          if (!pastedOtp) {
                            return
                          }

                          setOtp(pastedOtp)

                          const nextIndex = Math.min(pastedOtp.length, 5)

                          document.getElementById(`otp-${nextIndex}`)?.focus()
                        }}
                        autoFocus={index === 0}
                        disabled={loading}
                        className="
                          h-11
                          w-10
                          rounded-xl
                          border border-mk-border
                          bg-mk-card
                          text-center
                          text-lg
                          font-extrabold
                          text-mk-ink
                          outline-none
                          transition-all duration-200
                          hover:border-mk-border
                          focus:border-mk-primary
                          focus:bg-white
                          focus:ring-4
                          focus:ring-mk-primary/5
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                          sm:h-14
                          sm:w-12
                          sm:text-xl
                        "
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between gap-3">
                  <p className="text-xs text-mk-muted">Didn't receive the code?</p>

                  <button
                    type="button"
                    onClick={resendOtpHandle}
                    disabled={resendTimer > 0 || resendLoading || loading}
                    className="
                      inline-flex
                      shrink-0
                      items-center
                      gap-1.5
                      text-xs
                      font-bold
                      text-mk-primary-hover
                      transition-colors
                      hover:text-mk-primary
                      hover:underline
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <RefreshCw size={13} className={resendLoading ? 'animate-spin' : ''} />

                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify OTP
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!loading && !resendLoading) {
                      setStep('email')
                      setOtp('')
                    }
                  }}
                  disabled={loading || resendLoading}
                  className="
                    mt-4
                    w-full
                    text-center
                    text-xs
                    font-semibold
                    text-mk-muted
                    transition-colors
                    hover:text-mk-primary-hover
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Change email address
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={resetPasswordHandle}>
                <div className="mb-4">
                  <label className="mb-2 block text-xs font-bold text-mk-ink sm:text-sm">New Password</label>

                  <div className="group relative">
                    <Lock
                      size={18}
                      className="
                        absolute left-3.5 top-1/2
                        -translate-y-1/2
                        text-mk-muted
                        transition-colors
                        group-focus-within:text-mk-primary-hover
                      "
                    />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                      autoFocus
                      disabled={loading}
                      autoComplete="new-password"
                      className="
                        h-12 w-full
                        rounded-xl
                        border border-mk-border
                        bg-mk-card
                        pl-11 pr-12
                        text-sm text-mk-ink
                        outline-none
                        transition-all duration-200
                        placeholder:text-mk-muted
                        hover:border-mk-border
                        focus:border-mk-primary
                        focus:bg-white
                        focus:ring-4
                        focus:ring-mk-primary/5
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="
                        absolute right-3.5 top-1/2
                        -translate-y-1/2
                        text-mk-muted
                        transition-colors
                        hover:text-mk-primary-hover
                      "
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="mb-2 block text-xs font-bold text-mk-ink sm:text-sm">Confirm Password</label>

                  <div className="group relative">
                    <Lock
                      size={18}
                      className="
                        absolute left-3.5 top-1/2
                        -translate-y-1/2
                        text-mk-muted
                        transition-colors
                        group-focus-within:text-mk-primary-hover
                      "
                    />

                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                      disabled={loading}
                      autoComplete="new-password"
                      className="
                        h-12 w-full
                        rounded-xl
                        border border-mk-border
                        bg-mk-card
                        pl-11 pr-12
                        text-sm text-mk-ink
                        outline-none
                        transition-all duration-200
                        placeholder:text-mk-muted
                        hover:border-mk-border
                        focus:border-mk-primary
                        focus:bg-white
                        focus:ring-4
                        focus:ring-mk-primary/5
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="
                        absolute right-3.5 top-1/2
                        -translate-y-1/2
                        text-mk-muted
                        transition-colors
                        hover:text-mk-primary-hover
                      "
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <p className="mb-5 text-[11px] leading-5 text-mk-muted">Password must contain at least 6 characters.</p>

                <button
                  type="submit"
                  disabled={loading || !password || !confirmPassword}
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
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-mk-primary-soft text-mk-primary-hover">
                  <CheckCircle2 size={42} strokeWidth={1.7} />
                </div>

                <h3 className="mt-6 text-xl font-extrabold text-mk-ink">Password Reset Successful</h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-mk-muted">Your MineKart password has been successfully updated. You can now login using your new password.</p>

                {/* <button
                  type="button"
                  onClick={backToLoginHandle}
                  className="
                    group
                    mt-7
                    flex h-12 w-full
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
                  "
                >
                  Back to Login
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button> */}
              </div>
            )}

            {step !== 'success' && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-mk-border bg-mk-primary-soft/60 p-3.5">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-mk-primary-hover" />

                <p className="text-[10px] leading-5 text-mk-muted">Never share your OTP or password with anyone. MineKart will never ask you to share your verification code.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function StepIndicator({ active, completed, number, label }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-extrabold transition-all ${
          active || completed ? 'bg-mk-primary-hover text-white shadow-md shadow-mk-primary-hover/20' : 'border border-mk-border bg-mk-card text-mk-muted'
        }`}
      >
        {completed ? <CheckCircle2 size={14} /> : number}
      </div>

      <span className={`text-[9px] font-bold ${active || completed ? 'text-mk-primary-hover' : 'text-mk-muted'}`}>{label}</span>
    </div>
  )
}
