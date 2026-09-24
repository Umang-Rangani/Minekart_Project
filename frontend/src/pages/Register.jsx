import React, { useRef, useState } from 'react'
import { Camera, Mail, Lock, User, Phone, X, UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile } from '../utils/uploadFile'
import { useUser } from '../context/userProvider'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { setShowLogin } = useUser()

  const fileInputRef = useRef(null)

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  const [signUp, setSignUp] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setSignUp((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      const message = 'Please select a valid image'

      setError(message)
      toast.error(message)

      return
    }

    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setError('')
  }

  const clearHandle = () => {
    setSignUp({
      name: '',
      email: '',
      password: '',
      phone: '',
    })

    setImageFile(null)
    setPreview('')
    setError('')
    setSuccess('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!signUp.name || !signUp.email || !signUp.password) {
      const message = 'Name, email and password are required'

      setError(message)
      toast.error(message)

      return
    }

    try {
      setLoading(true)

      let avatarPath = ''

      if (imageFile) {
        try {
          avatarPath = await uploadFile(imageFile.name, imageFile, 'Avatar')
        } catch (uploadError) {
          console.log('Upload Error:', uploadError.response?.data || uploadError.message)

          const message = 'Profile photo upload failed'

          setError(message)
          toast.error(message)

          return
        }
      }

      const registerData = {
        ...signUp,
        avatar: avatarPath,
      }

      const res = await axiosInstance.post('/users/register', registerData)

      if (res.data.success) {
        const message = 'Account created successfully'

        setSuccess(message)
        toast.success(message)

        navigate('/')
        setShowLogin(true)
      }
    } catch (error) {
      console.log('Register Error:', error.response?.data || error.message)

      const message = error.response?.data?.message || 'Registration failed. Please try again.'

      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#241210] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      {/* Premium MineKart Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Main gradients */}
        <div className="absolute inset-0 bg-linear-to-br from-[#241210] via-[#4B171A] to-[#8E181F]" />

        {/* Large glow */}
        <div className="absolute -left-32 -top-32 h-105 w-105 rounded-full bg-[#A51D26]/35 blur-[100px]" />

        <div className="absolute -bottom-40 -right-32 h-125 w-125 rounded-full bg-[#D4A373]/15 blur-[120px]" />

        <div className="absolute left-[45%] top-[10%] h-56 w-56 rounded-full bg-[#7D171C]/30 blur-[90px]" />

        {/* E-commerce grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
          linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)
        `,
            backgroundSize: '42px 42px',
          }}
        />

        {/* Decorative floating cards */}
        <div className="absolute left-[5%] top-[18%] hidden h-24 w-36 -rotate-12 rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm lg:block">
          <div className="p-4">
            <div className="h-2 w-16 rounded-full bg-white/20" />
            <div className="mt-3 h-2 w-24 rounded-full bg-white/10" />
            <div className="mt-4 flex gap-2">
              <div className="h-7 w-7 rounded-lg bg-[#D4A373]/20" />
              <div className="h-7 flex-1 rounded-lg bg-white/5" />
            </div>
          </div>
        </div>

        <div className="absolute bottom-[15%] right-[5%] hidden h-28 w-40 rotate-10 rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm lg:block">
          <div className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-[#A51D26]/40" />
              <div>
                <div className="h-2 w-14 rounded-full bg-white/20" />
                <div className="mt-2 h-2 w-20 rounded-full bg-white/10" />
              </div>
            </div>
            <div className="mt-4 h-7 w-full rounded-lg bg-white/5" />
          </div>
        </div>

        {/* Floating circles */}
        <div className="absolute left-[13%] bottom-[13%] h-16 w-16 rounded-full border border-[#D4A373]/20 bg-[#D4A373]/5 backdrop-blur-sm" />

        <div className="absolute right-[16%] top-[15%] h-20 w-20 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />

        {/* Brand decorative text */}
        <div className="absolute left-8 top-8 hidden select-none text-white/10 xl:block">
          <p className="text-4xl font-black tracking-tight">
            Mine<span className="text-[#D4A373]">Kart</span>
          </p>
          <p className="mt-1 text-[9px] font-semibold tracking-[0.35em]">SHOP • DISCOVER • ENJOY</p>
        </div>

        <div className="absolute bottom-8 right-8 hidden select-none text-right text-white/10 xl:block">
          <p className="text-[10px] font-semibold tracking-[0.35em]">YOUR SHOPPING JOURNEY</p>
          <p className="mt-1 text-2xl font-black">STARTS HERE</p>
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#1F0D0B]/20" />
      </div>

      {/* Register Card */}
      <div className="relative z-10 flex max-h-[calc(100vh-32px)] w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-white/20 bg-[#FFFDFC] shadow-[0_35px_100px_rgba(0,0,0,0.35)] sm:max-h-[calc(100vh-48px)]">
        {/* Main Card */}
        <div className="relative z-10 flex max-h-[calc(100vh-32px)] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-[#E3D5CC] bg-[#FFFDFC]/95 shadow-[0_30px_90px_rgba(53,28,24,0.18)] backdrop-blur-xl sm:max-h-[calc(100vh-48px)]">
          {/* Header */}
          <div className="relative shrink-0 overflow-hidden bg-linear-to-r from-[#321715] via-[#64171B] to-[#A51D26] px-5 py-5 text-white sm:px-8 sm:py-6">
            {/* Header Glow */}
            <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-white/7 blur-sm" />
            <div className="absolute -bottom-28 right-[22%] h-52 w-52 rounded-full bg-[#D4A373]/10 blur-2xl" />
            <div className="absolute -left-16 -bottom-20 h-40 w-40 rounded-full bg-[#A51D26]/30 blur-xl" />

            <div className="relative flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/10 shadow-lg backdrop-blur-md">
                    <UserPlus size={19} strokeWidth={2} />
                  </div>

                  <div>
                    <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Create Account</h1>

                    <p className="mt-0.5 text-[11px] text-[#F3DCD5] sm:text-xs">Your MineKart shopping journey starts here</p>
                  </div>
                </div>
              </div>

              <button type="button" onClick={() => navigate('/')} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:rotate-90 hover:bg-white/15">
                <X size={19} />
              </button>
            </div>

            {/* Header Bottom Line */}
            <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[#D4A373]/40 to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={submitHandle} className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[310px_1fr]">
            {/* Profile Section */}
            <div className="relative flex shrink-0 flex-col items-center justify-center overflow-hidden border-b border-[#E8DDD4] bg-linear-to-br from-[#FBF7F2] via-[#F8EFE9] to-[#F3E6DE] px-6 py-7 md:border-b-0 md:border-r md:px-8">
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full bg-[#A51D26]/6 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#D4A373]/15 blur-3xl" />

              <div className="relative z-10 mb-5 text-center">
                <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#8E181F]/10 text-[#8E181F]">
                  <User size={18} />
                </div>

                <h2 className="text-base font-extrabold text-[#351C18]">Profile Photo</h2>

                <p className="mt-1 text-xs text-[#806C63]">Personalize your account</p>
              </div>

              {/* Avatar */}
              <div className="relative z-10">
                <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-linear-to-br from-[#F5E8E1] to-[#EBD8CE] shadow-[0_18px_45px_rgba(73,54,49,0.18)] ring-1 ring-[#DCCBC1] sm:h-44 sm:w-44">
                  {preview ? <img src={preview} alt="Profile Preview" className="h-full w-full object-cover" /> : <User size={78} strokeWidth={1.1} className="text-[#8E181F]/70" />}

                  {/* Inner shine */}
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-br from-white/25 via-transparent to-[#351C18]/5" />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_8px_20px_rgba(125,23,28,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_12px_25px_rgba(125,23,28,0.4)]"
                >
                  <Camera size={18} />
                </button>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* Upload info */}
              <div className="relative z-10 mt-5 flex items-center gap-2 rounded-full border border-[#E2D5CC] bg-white/80 px-3.5 py-1.5 text-[10px] font-semibold text-[#806C63] shadow-sm backdrop-blur-sm">
                <ShieldCheck size={13} className="text-[#3E8B62]" />
                JPG, PNG or WEBP
              </div>

              {/* Small shopping line */}
              <div className="relative z-10 mt-5 hidden text-center md:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8958C]">Shop more • Live better</p>
              </div>
            </div>

            {/* Form Area */}
            <div className="min-h-0 overflow-y-auto bg-[#FFFDFC] p-5 sm:p-7 lg:p-9">
              {/* Section Header */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg shadow-[#7D171C]/15">
                  <UserPlus size={19} />
                </div>

                <div>
                  <h2 className="font-extrabold text-[#351C18]">Personal Information</h2>

                  <p className="mt-0.5 text-xs text-[#806C63]">Enter your details to create your MineKart account</p>
                </div>
              </div>

              {/* Error */}
              {error && <div className="mb-5 flex items-center rounded-xl border border-[#E7C8C5] bg-[#FFF2F1] px-4 py-3 text-sm font-medium text-[#A51D26] shadow-sm">{error}</div>}

              {/* Success */}
              {success && <div className="mb-5 flex items-center rounded-xl border border-[#CFE4D7] bg-[#F0F8F3] px-4 py-3 text-sm font-medium text-[#3E8B62] shadow-sm">{success}</div>}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Full Name</label>

                  <div className="group relative">
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />

                    <input
                      type="text"
                      name="name"
                      value={signUp.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Email Address</label>

                  <div className="group relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />

                    <input
                      type="email"
                      name="email"
                      value={signUp.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Password</label>

                  <div className="group relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />

                    <input
                      type="password"
                      name="password"
                      value={signUp.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Phone Number</label>

                  <div className="group relative">
                    <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />

                    <input
                      type="tel"
                      name="phone"
                      value={signUp.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#E8DDD4] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={clearHandle}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-5 text-sm font-semibold text-[#806C63] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#493631]"
                >
                  <X size={17} />
                  Clear
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-5 text-sm font-semibold text-[#493631] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8]"
                  >
                    <ArrowLeft size={17} />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-7 text-sm font-bold text-white shadow-md shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#681419] hover:to-[#8E181F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <UserPlus size={17} />
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
