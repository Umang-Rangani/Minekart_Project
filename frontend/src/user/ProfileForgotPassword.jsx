import React, { useEffect, useState } from 'react'
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, RefreshCw, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../config/axiosConfig'

export default function ProfileForgotPassword({ email, onBusyChange }) {
  const [step, setStep] = useState('start')

  const [otp, setOtp] = useState('')
  const [resetToken, setResetToken] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [otpLoading, setOtpLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const [resendTimer, setResendTimer] = useState(0)

  const isBusy = step !== 'start' || otpLoading || verifyLoading || resetLoading || resendLoading

  useEffect(() => {
    onBusyChange?.(isBusy)
  }, [isBusy, onBusyChange])

  useEffect(() => {
    if (resendTimer <= 0) return

    const timer = setTimeout(() => {
      setResendTimer((prev) => Math.max(prev - 1, 0))
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendTimer])

  const maskedEmail = () => {
    if (!email) return ''

    const [name, domain] = email.split('@')

    if (!name || !domain) return email

    if (name.length <= 2) {
      return `${name.charAt(0)}***@${domain}`
    }

    return `${name.slice(0, 2)}***@${domain}`
  }

  const sendOtp = async () => {
    if (!email) {
      toast.error('Registered email not found')
      return
    }

    setOtpLoading(true)

    try {
      const response = await axiosInstance.post('/users/forgot-password', {
        email: email.trim().toLowerCase(),
      })

      if (response.data.success) {
        setOtp('')
        setResetToken('')
        setResendTimer(60)
        setStep('otp')

        toast.success('OTP sent successfully')
      }
    } catch (error) {
      console.error('Profile Password OTP Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || error.message || 'Unable to send OTP')
    } finally {
      setOtpLoading(false)
    }
  }

  const verifyOtp = async () => {
    const cleanOtp = otp.replace(/\D/g, '')

    if (cleanOtp.length !== 6) {
      toast.error('Please enter the 6-digit OTP')
      return
    }

    setVerifyLoading(true)

    try {
      const response = await axiosInstance.post('/users/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      })

      if (response.data.success) {
        setResetToken(response.data.resetToken)
        setStep('reset')

        toast.success('OTP verified successfully')
      }
    } catch (error) {
      console.error('Profile Verify OTP Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || error.message || 'Invalid OTP')
    } finally {
      setVerifyLoading(false)
    }
  }

  const resendOtp = async () => {
    if (resendTimer > 0 || resendLoading) return

    if (!email) {
      toast.error('Registered email not found')
      return
    }

    setResendLoading(true)

    try {
      const response = await axiosInstance.post('/users/forgot-password', {
        email: email.trim().toLowerCase(),
      })

      if (response.data.success) {
        setOtp('')
        setResendTimer(60)

        toast.success('New OTP sent successfully')
      }
    } catch (error) {
      console.error('Profile Resend OTP Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || error.message || 'Unable to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  const resetPassword = async () => {
    const cleanPassword = password.trim()
    const cleanConfirmPassword = confirmPassword.trim()

    if (!cleanPassword) {
      toast.error('Please enter a new password')
      return
    }

    if (cleanPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!cleanConfirmPassword) {
      toast.error('Please confirm your password')
      return
    }

    if (cleanPassword !== cleanConfirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!resetToken) {
      toast.error('Password reset session expired')
      return
    }

    setResetLoading(true)

    try {
      const response = await axiosInstance.post('/users/reset-password', {
        email: email.trim().toLowerCase(),
        resetToken,
        password: cleanPassword,
        confirmPassword: cleanConfirmPassword,
      })

      if (response.data.success) {
        setStep('success')

        setOtp('')
        setResetToken('')
        setPassword('')
        setConfirmPassword('')
        setResendTimer(0)
        setShowPassword(false)
        setShowConfirmPassword(false)

        toast.success('Password updated successfully')
      }
    } catch (error) {
      console.error('Profile Reset Password Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || error.message || 'Unable to update password')
    } finally {
      setResetLoading(false)
    }
  }

  const changeAgain = () => {
    setStep('start')
    setOtp('')
    setResetToken('')
    setPassword('')
    setConfirmPassword('')
    setResendTimer(0)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  if (step === 'start') {
    return (
      <div>
        <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#8E181F] shadow-sm">
              <Mail size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#67544D]">Registered Email</p>

              <p className="mt-1 text-xs font-extrabold text-[#351C18]">{email}</p>

              <p className="mt-1 text-[9px] leading-4 text-[#9A857B]">A 6-digit verification code will be sent to your registered email.</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={sendOtp}
          disabled={otpLoading}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 text-xs font-extrabold text-white shadow-[0_6px_16px_rgba(125,23,28,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_9px_20px_rgba(125,23,28,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {otpLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending OTP...
            </>
          ) : (
            <>
              <Mail size={15} />
              Send OTP
            </>
          )}
        </button>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <div>
        <div className="rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#8E181F] shadow-sm">
              <ShieldCheck size={16} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#67544D]">Verification Code</p>

              <p className="mt-1 text-xs font-extrabold text-[#351C18]">OTP sent to {maskedEmail()}</p>

              <p className="mt-1 text-[9px] leading-4 text-[#9A857B]">Enter the 6-digit code received on your registered email.</p>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1.5 block text-[10px] font-bold text-[#67544D] ">Verification Code</label>

          <div className="flex justify-between gap-2 sm:gap-3 xl:px-20">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                maxLength={1}
                value={otp[index] || ''}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')

                  if (!value) return

                  const otpArray = otp.split('')
                  otpArray[index] = value

                  const newOtp = otpArray.join('').slice(0, 6)
                  setOtp(newOtp)

                  const nextInput = e.target.parentElement?.children[index + 1]

                  if (nextInput) {
                    nextInput.focus()
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                    const otpArray = otp.split('')
                    otpArray[index - 1] = ''

                    setOtp(otpArray.join(''))

                    const previousInput = e.target.parentElement?.children[index - 1]

                    if (previousInput) {
                      previousInput.focus()
                    }
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault()

                  const pastedOtp = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

                  if (!pastedOtp) return

                  setOtp(pastedOtp)

                  const targetIndex = Math.min(pastedOtp.length, 6) - 1
                  const targetInput = e.target.parentElement?.children[targetIndex]

                  if (targetInput) {
                    targetInput.focus()
                  }
                }}
                className="h-11 w-full min-w-0 rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] text-center text-base font-extrabold text-[#351C18] outline-none transition focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6] sm:h-12"
              />
            ))}
          </div>

          <p className="mt-2 text-center text-[9px] text-[#9A857B]">Enter the 6-digit OTP received on your email</p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={resendOtp}
            tabIndex={-1}
            disabled={resendTimer > 0 || resendLoading}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8E181F] transition hover:text-[#A51D26] disabled:cursor-not-allowed disabled:text-[#B7A49B]"
          >
            {resendLoading ? <RefreshCw size={13} className="animate-spin" /> : <RefreshCw size={13} />}

            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </button>

          <button
            type="button"
            onClick={verifyOtp}
            disabled={verifyLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 text-[10px] font-extrabold text-white shadow-[0_5px_14px_rgba(125,23,28,0.15)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifyLoading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying...
              </>
            ) : (
              'Verify OTP'
            )}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'reset') {
    return (
      <div>
        <div className="mb-3 rounded-xl border border-[#D9E9DE] bg-[#F4FAF6] p-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#3E8B62]" />

            <p className="text-[9px] leading-4 text-[#527363]">OTP verified successfully. Create your new password below.</p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">New Password</label>

          <div className="relative">
            <LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              autoComplete="new-password"
              className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-11 text-xs font-medium text-[#351C18] outline-none transition placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#806C63] transition hover:bg-[#F7EEE7] hover:text-[#8E181F]"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Confirm Password</label>

          <div className="relative">
            <LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-11 text-xs font-medium text-[#351C18] outline-none transition placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#806C63] transition hover:bg-[#F7EEE7] hover:text-[#8E181F]"
            >
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 py-2.5">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#3E8B62]" />

          <p className="text-[9px] leading-4 text-[#806C63]">Your password is securely encrypted before it is stored.</p>
        </div>

        <button
          type="button"
          onClick={resetPassword}
          disabled={resetLoading}
          className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 text-xs font-extrabold text-white shadow-[0_6px_16px_rgba(125,23,28,0.16)] transition hover:-translate-y-0.5 hover:shadow-[0_9px_20px_rgba(125,23,28,0.20)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {resetLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Updating Password...
            </>
          ) : (
            <>
              <LockKeyhole size={15} />
              Update Password
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-57.5 flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF6EE] text-[#3E8B62]">
        <CheckCircle2 size={26} />
      </div>

      <h3 className="mt-3 text-sm font-extrabold text-[#351C18]">Password Updated Successfully</h3>

      <p className="mt-1 max-w-xs text-[9px] leading-4 text-[#806C63]">Your password has been updated securely.</p>

      <button
        type="button"
        onClick={changeAgain}
        className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] px-5 text-[10px] font-bold text-[#67544D] transition hover:border-[#CDAFA4] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
      >
        Change Again
      </button>
    </div>
  )
}
