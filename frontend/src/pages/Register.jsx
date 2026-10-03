import React, { useEffect, useRef, useState } from 'react'
import { Camera, Mail, Lock, User, Phone, X, UserPlus, ArrowLeft, ShieldCheck, ImagePlus, Maximize2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile } from '../utils/uploadFile'
import { useUser } from '../context/userProvider'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const { setShowLogin, setUser } = useUser()

  const fileInputRef = useRef(null)

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  const [showProfilePopup, setShowProfilePopup] = useState(false)
  const [showImageViewer, setShowImageViewer] = useState(false)

  const [signUp, setSignUp] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const isOverlayOpen = showProfilePopup || showImageViewer

    if (!isOverlayOpen) {
      document.body.style.overflow = ''
      return
    }

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [showProfilePopup, showImageViewer])

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

    if (showProfilePopup) {
      setShowProfilePopup(true)
    }
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
    setShowProfilePopup(false)
    setShowImageViewer(false)

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
        setUser(res.data.user)
        setShowLogin(false)

        toast.success('Account created successfully')
        navigate('/')
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

  const openProfilePopup = () => {
    setShowProfilePopup(true)
  }

  const closeProfilePopup = () => {
    setShowProfilePopup(false)
  }

  const openImageViewer = () => {
    if (!preview) return

    setShowImageViewer(true)
  }

  const closeImageViewer = () => {
    setShowImageViewer(false)
  }

  const chooseProfilePhoto = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative flex h-screen min-h-screen items-center justify-center overflow-hidden bg-[#241210] px-3 py-3 sm:px-5 sm:py-6 lg:px-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#241210] via-[#4B171A] to-[#8E181F]" />

        <div className="absolute -left-32 -top-32 h-105 w-105 rounded-full bg-[#A51D26]/35 blur-[100px]" />

        <div className="absolute -bottom-40 -right-32 h-125 w-125 rounded-full bg-[#D4A373]/15 blur-[120px]" />

        <div className="absolute left-[45%] top-[10%] h-56 w-56 rounded-full bg-[#7D171C]/30 blur-[90px]" />

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

        <div className="absolute bottom-[13%] left-[13%] h-16 w-16 rounded-full border border-[#D4A373]/20 bg-[#D4A373]/5 backdrop-blur-sm" />

        <div className="absolute right-[16%] top-[15%] h-20 w-20 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />

        <div className="absolute left-8 top-8 hidden select-none text-white/10 xl:block">
          <p className="text-4xl font-black tracking-tight">
            Mine
            <span className="text-[#D4A373]">Kart</span>
          </p>

          <p className="mt-1 text-[9px] font-semibold tracking-[0.35em]">SHOP • DISCOVER • ENJOY</p>
        </div>

        <div className="absolute bottom-8 right-8 hidden select-none text-right text-white/10 xl:block">
          <p className="text-[10px] font-semibold tracking-[0.35em]">YOUR SHOPPING JOURNEY</p>

          <p className="mt-1 text-2xl font-black">STARTS HERE</p>
        </div>

        <div className="absolute inset-0 bg-[#1F0D0B]/20" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 flex h-[calc(100vh-24px)] max-h-[calc(100vh-24px)] w-full max-w-6xl flex-col overflow-hidden rounded-[20px] border border-white/20 bg-[#FFFDFC] shadow-[0_35px_100px_rgba(0,0,0,0.35)] sm:h-auto sm:max-h-[calc(100vh-48px)] sm:rounded-[30px]">
        <div className="relative z-10 flex h-full max-h-[calc(100vh-24px)] w-full max-w-6xl flex-col overflow-hidden rounded-[20px] border border-[#E3D5CC] bg-[#FFFDFC]/95 shadow-[0_30px_90px_rgba(53,28,24,0.18)] backdrop-blur-xl sm:max-h-[calc(100vh-48px)] sm:rounded-[28px]">
          {/* Header */}
          <div className="relative shrink-0 overflow-hidden bg-linear-to-r from-[#321715] via-[#64171B] to-[#A51D26] px-3.5 py-3 text-white sm:px-8 sm:py-6">
            <div className="absolute -right-16 -top-24 h-40 w-40 rounded-full bg-white/7 blur-sm sm:h-56 sm:w-56" />

            <div className="absolute -bottom-20 right-[18%] h-36 w-36 rounded-full bg-[#D4A373]/10 blur-2xl sm:-bottom-28 sm:h-52 sm:w-52" />

            <div className="absolute -bottom-14 -left-12 h-28 w-28 rounded-full bg-[#A51D26]/30 blur-xl sm:-bottom-20 sm:-left-16 sm:h-40 sm:w-40" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/10 shadow-lg backdrop-blur-md sm:h-10 sm:w-10 sm:rounded-xl">
                    <UserPlus size={16} strokeWidth={2} className="sm:size-4.75" />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-base font-extrabold tracking-tight sm:text-2xl">Create Account</h1>

                    <p className="mt-0.5 truncate text-[9px] leading-3.5 text-[#F3DCD5] sm:text-xs">Your MineKart shopping journey starts here</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white transition-all duration-300 hover:rotate-90 hover:bg-white/15 sm:h-9 sm:w-9 sm:rounded-xl"
              >
                <X size={16} className="sm:size-4.75" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 h-px w-full bg-linear-to-r from-transparent via-[#D4A373]/40 to-transparent" />
          </div>

          {/* Main Form */}
          <form onSubmit={submitHandle} className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[280px_1fr] lg:grid-cols-[310px_1fr]">
            {/* Desktop Profile Section */}
            <div className="relative hidden min-h-0 shrink-0 flex-col items-center justify-center overflow-hidden border-b border-[#E8DDD4] bg-linear-to-br from-[#FBF7F2] via-[#F8EFE9] to-[#F3E6DE] px-8 md:flex md:border-b-0 md:border-r">
              <div className="pointer-events-none absolute -left-16 top-8 h-40 w-40 rounded-full bg-[#A51D26]/6 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#D4A373]/15 blur-3xl" />

              {/* Profile Heading */}
              <div className="relative z-10 mb-5 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#8E181F]/10 text-[#8E181F]">
                  <User size={17} />
                </div>

                <h2 className="text-sm font-extrabold text-[#351C18]">Profile Photo</h2>

                {/* <p className="mt-1 text-[10px] text-[#806C63]">Click image to preview</p> */}
              </div>

              {/* Square Profile Image */}
              <div className="relative z-10">
                <button
                  type="button"
                  onClick={openImageViewer}
                  className="group relative block h-40 w-40 overflow-hidden rounded-full border-2 border-white bg-linear-to-br from-[#F5E8E1] to-[#EBD8CE] shadow-[0_14px_32px_rgba(73,54,49,0.16)] ring-1 ring-[#DCCBC1] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(73,54,49,0.20)] lg:h-44 lg:w-44"
                >
                  {preview ? (
                    <img src={preview} alt="Profile Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={62} strokeWidth={1.1} className="text-[#8E181F]/70" />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-[#351C18]/10" />

                  {preview && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#351C18]/0 opacity-0 transition-all duration-300 group-hover:bg-[#351C18]/20 group-hover:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#8E181F] shadow-lg backdrop-blur-sm">
                        <Maximize2 size={17} />
                      </div>
                    </div>
                  )}
                </button>

                {/* Camera - Edit Only */}
                <button
                  type="button"
                  onClick={chooseProfilePhoto}
                  className="absolute bottom-1 right-4 flex h-10 w-10 items-center justify-center rounded-xl border-[3px] border-white bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_6px_16px_rgba(125,23,28,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                  aria-label="Change profile photo"
                >
                  <Camera size={17} />
                </button>
              </div>

              {/* Hidden Input */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

              {/* Upload Info */}
              <div className="relative z-10 mt-5 flex items-center gap-2 rounded-full border border-[#E2D5CC] bg-white/80 px-3.5 py-1.5 text-[10px] font-semibold text-[#806C63] shadow-sm backdrop-blur-sm">
                <ShieldCheck size={13} className="text-[#3E8B62]" />
                JPG, PNG or WEBP
              </div>

              <div className="relative z-10 mt-2 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A8958C]">Click image to view • Camera to edit</p>
              </div>
            </div>

            {/* Form Area */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-[#FFFDFC] p-4 sm:p-7 lg:p-9">
              {/* Mobile Profile Section */}
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-[#E2D5CC] bg-[#FBF7F2] p-3 shadow-[0_4px_14px_rgba(73,54,49,0.04)] sm:hidden">
                {/* Image Only = Preview */}
                <button
                  type="button"
                  onClick={openImageViewer}
                  className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-linear-to-br from-[#F5E8E1] to-[#EBD8CE] shadow-sm ring-1 ring-[#DCCBC1]"
                  aria-label="Preview profile photo"
                >
                  {preview ? (
                    <img src={preview} alt="Profile Preview" className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={22} strokeWidth={1.2} className="text-[#8E181F]/70" />
                    </div>
                  )}

                  {preview && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#351C18]/0 transition-all duration-200 group-active:bg-[#351C18]/15">
                      <Maximize2 size={13} className="text-white opacity-0 drop-shadow-lg group-active:opacity-100" />
                    </div>
                  )}
                </button>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-[#351C18]">{preview ? 'Profile Photo Added' : 'Profile Photo'}</p>

                  <p className="mt-0.5 text-[10px] leading-4 text-[#806C63]">{preview ? 'Tap image to preview' : 'Add a photo to your account'}</p>
                </div>

                {/* ImagePlus = Popup */}
                <button
                  type="button"
                  onClick={openProfilePopup}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E1D1C8] bg-white text-[#8E181F] shadow-sm transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] active:scale-95"
                  aria-label="Open profile photo options"
                >
                  <ImagePlus size={17} />
                </button>
              </div>

              {/* Section Header */}
              <div className="mb-5 hidden items-center gap-2.5 sm:mb-6 sm:flex sm:gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg shadow-[#7D171C]/15 sm:h-11 sm:w-11">
                  <UserPlus size={16} className="sm:size-4.75" />
                </div>

                <div>
                  <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Personal Information</h2>

                  <p className="mt-0.5 text-[10px] leading-4 text-[#806C63] sm:text-xs">Enter your details to create your MineKart account</p>
                </div>
              </div>

              {/* Error */}
              {error && <div className="mb-4 flex items-center rounded-xl border border-[#E7C8C5] bg-[#FFF2F1] px-3 py-2.5 text-xs font-medium text-[#A51D26] shadow-sm sm:mb-5 sm:px-4 sm:py-3 sm:text-sm">{error}</div>}

              {/* Success */}
              {success && <div className="mb-4 flex items-center rounded-xl border border-[#CFE4D7] bg-[#F0F8F3] px-3 py-2.5 text-xs font-medium text-[#3E8B62] shadow-sm sm:mb-5 sm:px-4 sm:py-3 sm:text-sm">{success}</div>}

              {/* Inputs */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#493631] sm:mb-2 sm:text-sm">Full Name</label>

                  <div className="group relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F] sm:left-3.5 sm:size-4.5" />

                    <input
                      type="text"
                      name="name"
                      value={signUp.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-10 pr-4 text-xs text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5 sm:h-11 sm:pl-11 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#493631] sm:mb-2 sm:text-sm">Email Address</label>

                  <div className="group relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F] sm:left-3.5 sm:size-4.5" />

                    <input
                      type="email"
                      name="email"
                      value={signUp.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-10 pr-4 text-xs text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5 sm:h-11 sm:pl-11 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#493631] sm:mb-2 sm:text-sm">Password</label>

                  <div className="group relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F] sm:left-3.5 sm:size-4.5" />

                    <input
                      type="password"
                      name="password"
                      value={signUp.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-10 pr-4 text-xs text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5 sm:h-11 sm:pl-11 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#493631] sm:mb-2 sm:text-sm">Phone Number</label>

                  <div className="group relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F] sm:left-3.5 sm:size-4.5" />

                    <input
                      type="tel"
                      name="phone"
                      value={signUp.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-10 pr-4 text-xs text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] hover:border-[#D5C2B8] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5 sm:h-11 sm:pl-11 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-5 flex flex-col-reverse gap-2.5 border-t border-[#E8DDD4] pt-4 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
                {/* Clear */}
                <button
                  type="button"
                  onClick={clearHandle}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-4 text-xs font-semibold text-[#806C63] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#493631] sm:h-11 sm:px-5 sm:text-sm"
                >
                  <X size={15} className="sm:size-4.25" />
                  Clear
                </button>

                {/* Back + Create */}
                <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-3 text-xs font-semibold text-[#493631] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] sm:h-11 sm:gap-2 sm:px-5 sm:text-sm"
                  >
                    <ArrowLeft size={15} className="sm:size-4.25" />
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-3 text-xs font-bold text-white shadow-md shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#681419] hover:to-[#8E181F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 sm:h-11 sm:gap-2 sm:px-7 sm:text-sm"
                  >
                    <UserPlus size={15} className="sm:size-4.25" />

                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Profile Popup */}
      {showProfilePopup && (
        <div className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden bg-[#241210]/75 px-4 py-4 backdrop-blur-md md:hidden" onClick={closeProfilePopup}>
          <div
            className="relative flex max-h-[calc(100vh-32px)] w-full max-w-sm flex-col overflow-hidden rounded-[24px] border border-white/30 bg-[#FFFDFC]/95 shadow-[0_25px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="relative shrink-0 overflow-hidden bg-linear-to-br from-[#351C18] via-[#5A211E] to-[#8E181F] px-5 py-4 text-white">
              <div className="absolute -right-10 -top-12 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold">Profile Photo</h3>

                  <p className="mt-0.5 text-[10px] text-white/65">Tap image to view • Camera to edit</p>
                </div>

                <button type="button" onClick={closeProfilePopup} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-white transition-all duration-300 hover:rotate-90 hover:bg-white/15">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Popup Body */}
            <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 py-6">
              {/* Square Image */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={openImageViewer}
                  className="group relative block h-60 w-60 overflow-hidden rounded-full border-[4px] border-white bg-linear-to-br from-[#F5E8E1] to-[#EBD8CE] shadow-[0_15px_35px_rgba(73,54,49,0.18)] ring-1 ring-[#DCCBC1]"
                >
                  {preview ? (
                    <img src={preview} alt="Profile Preview" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User size={70} strokeWidth={1.1} className="text-[#8E181F]/70" />
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-[#351C18]/10" />

                  {preview && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#351C18]/0 opacity-0 transition-all duration-300 group-hover:bg-[#351C18]/20 group-hover:opacity-100">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#8E181F] shadow-lg backdrop-blur-sm">
                        <Maximize2 size={18} />
                      </div>
                    </div>
                  )}
                </button>

                {/* Camera = Edit */}
                <button
                  type="button"
                  onClick={chooseProfilePhoto}
                  className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-white bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_6px_16px_rgba(125,23,28,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
                  aria-label="Change profile photo"
                >
                  <Camera size={18} />
                </button>
              </div>

              {/* Info */}
              <div className="mt-5 flex shrink-0 items-center gap-1.5 rounded-full border border-[#E2D5CC] bg-[#FBF7F2] px-3 py-1.5 text-[9px] font-semibold text-[#806C63]">
                <ShieldCheck size={12} className="text-[#3E8B62]" />
                JPG, PNG or WEBP
              </div>

              {/* Change Photo */}
              <button
                type="button"
                onClick={chooseProfilePhoto}
                className="mt-5 flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] text-xs font-bold text-white shadow-md shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#681419] hover:to-[#8E181F]"
              >
                <Camera size={16} />
                {preview ? 'Change Photo' : 'Choose Photo'}
              </button>

              {/* Done */}
              <button
                type="button"
                onClick={closeProfilePopup}
                className="mt-2.5 h-10 w-full shrink-0 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] text-xs font-semibold text-[#493631] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8]"
              >
                Done
              </button>

              <p className="mt-3 text-center text-[9px] leading-4 text-[#A8958C]">Profile photo is optional</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer */}
      {showImageViewer && preview && (
        <div className="fixed inset-0 z-[200] flex h-screen w-screen items-center justify-center overflow-hidden bg-[#180908]/90 p-4 backdrop-blur-xl" onClick={closeImageViewer}>
          <button
            type="button"
            onClick={closeImageViewer}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-white/20 sm:right-6 sm:top-6"
          >
            <X size={19} />
          </button>

          <div className="relative flex max-h-[88vh] max-w-[92vw] items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Profile Preview Large" className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-[0_30px_100px_rgba(0,0,0,0.5)]" />

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[9px] font-semibold text-white/75 backdrop-blur-md">Profile Photo</div>
          </div>
        </div>
      )}
    </div>
  )
}
