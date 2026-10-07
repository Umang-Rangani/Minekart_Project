import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Eye, EyeOff, LockKeyhole, Mail, Phone, Save, ShieldCheck, User, UserRound, CheckCircle2, X, Maximize2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import BreadCrumb from './BreadCrumb'
import ProfileForgotPassword from './ProfileForgotPassword'

export default function ProfileUpdate() {
  const navigate = useNavigate()
  const { user, setUser } = useUser()

  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const [showAvatarViewer, setShowAvatarViewer] = useState(false)

  const [passwordFlowBusy, setPasswordFlowBusy] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    })

    setAvatarPreview(user.avatar || '')
    setLoading(false)

    document.title = 'Profile-Update | MineKart'
  }, [user])

  useEffect(() => {
    if (!showAvatarViewer) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowAvatarViewer(false)
      }
    }

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showAvatarViewer])

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const getAvatarSrc = () => {
    if (!avatarPreview) return ''

    return avatarPreview.startsWith('blob:') ? avatarPreview : getImageUrl(avatarPreview)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image')
      e.target.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      e.target.value = ''
      return
    }

    if (avatarPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)

    const previewUrl = URL.createObjectURL(file)

    setAvatarPreview(previewUrl)

    e.target.value = ''
  }

  const uploadAvatar = async () => {
    if (!avatarFile) return user?.avatar || ''

    try {
      const formData = new FormData()

      formData.append('filename', avatarFile.name)
      formData.append('uploadFolder', 'user-avatars')
      formData.append('file', avatarFile)

      const response = await axiosInstance.post('/uploads', formData)

      return response.data.filePath || ''
    } catch (error) {
      console.error('Avatar Upload Error:', error.response?.data || error.message)

      throw new Error('Avatar upload failed')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Please enter your name')
      return
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email')
      return
    }

    setSaving(true)

    try {
      const avatar = await uploadAvatar()

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        avatar,
      }

      const response = await axiosInstance.put('/users/profile', payload)

      if (response.data.success) {
        const updatedUser = response.data.user

        setUser(updatedUser)

        toast.success('Profile updated successfully')

        navigate('/profile')
      }
    } catch (error) {
      console.error('Profile Update Error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || error.message || 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#FBF7F2] px-3 py-4 sm:px-5 sm:py-5">
        <div className="mx-auto">
          <div className="animate-pulse">
            {/* BREADCRUMB SHIMMER */}
            <div className="mb-3 flex h-5 items-center gap-2 px-1 sm:mb-4">
              <div className="h-3 w-14 rounded bg-[#E8DDD4]" />
              <div className="h-3 w-3 rounded bg-[#EEE5DF]" />
              <div className="h-3 w-20 rounded bg-[#E8DDD4]" />
            </div>

            {/* HEADER SHIMMER */}
            <div className="mb-4 flex h-16 items-center justify-between overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-[#EEE5DF] sm:h-10 sm:w-10" />

                <div className="space-y-1.5">
                  <div className="h-3 w-24 rounded bg-[#E8DDD4] sm:w-28" />
                  <div className="h-2.5 w-40 rounded bg-[#F0E9E4] sm:w-52" />
                </div>
              </div>

              <div className="h-8 w-16 rounded-lg bg-[#F0E9E4] sm:w-20" />
            </div>

            {/* MAIN SHIMMER */}
            <div className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
              {/* PHOTO SHIMMER */}
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
                <div className="h-20 bg-[#EEE5DF]" />

                <div className="px-4 pb-5 sm:px-5">
                  <div className="-mt-9 flex justify-center">
                    <div className="h-24 w-24 rounded-full border-4 border-white bg-[#E8DDD4] shadow-sm sm:h-28 sm:w-28" />
                  </div>

                  <div className="mt-4 flex flex-col items-center">
                    <div className="h-3.5 w-24 rounded bg-[#E8DDD4]" />
                    <div className="mt-2 h-2.5 w-32 rounded bg-[#F0E9E4]" />
                  </div>

                  <div className="mt-4 h-10 rounded-xl bg-[#F0E9E4]" />

                  <div className="mt-4 h-16 rounded-xl bg-[#F0E9E4]" />
                </div>
              </div>

              {/* FORM SHIMMER */}
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white">
                  <div className="flex items-center gap-3 border-b border-[#EEE5DF] px-4 py-3.5 sm:px-5">
                    <div className="h-9 w-9 rounded-xl bg-[#EEE5DF]" />

                    <div className="space-y-1.5">
                      <div className="h-3.5 w-36 rounded bg-[#E8DDD4]" />
                      <div className="h-2.5 w-48 rounded bg-[#F0E9E4]" />
                    </div>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-16 rounded bg-[#E8DDD4]" />
                      <div className="h-11 rounded-xl bg-[#F0E9E4]" />
                    </div>

                    <div className="space-y-1.5">
                      <div className="h-2.5 w-20 rounded bg-[#E8DDD4]" />
                      <div className="h-11 rounded-xl bg-[#F0E9E4]" />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <div className="h-2.5 w-24 rounded bg-[#E8DDD4]" />
                      <div className="h-11 rounded-xl bg-[#F0E9E4]" />
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white">
                  <div className="flex items-center gap-3 border-b border-[#EEE5DF] px-4 py-3.5 sm:px-5">
                    <div className="h-9 w-9 rounded-xl bg-[#EEE5DF]" />

                    <div className="space-y-1.5">
                      <div className="h-3.5 w-32 rounded bg-[#E8DDD4]" />
                      <div className="h-2.5 w-48 rounded bg-[#F0E9E4]" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="h-11 rounded-xl bg-[#F0E9E4]" />

                    <div className="mt-3 h-12 rounded-xl bg-[#F0E9E4]" />
                  </div>
                </div>

                <div className="h-20 rounded-2xl bg-[#F0E9E4]" />

                <div className="flex gap-2.5">
                  <div className="h-11 flex-1 rounded-xl bg-[#E8DDD4] sm:flex-none sm:w-24" />
                  <div className="h-11 flex-1 rounded-xl bg-[#E8DDD4] sm:flex-none sm:w-32" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#FBF7F2] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#E8DDD4] bg-white p-8 text-center shadow-[0_8px_30px_rgba(73,54,49,0.07)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F7EEE7] text-[#A51D26]">
            <UserRound size={28} />
          </div>

          <h2 className="mt-4 text-lg font-extrabold text-[#351C18]">Please login first</h2>

          <p className="mt-1 text-xs text-[#806C63]">Login to update your profile information.</p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-2.5 text-xs font-bold text-white shadow-[0_5px_15px_rgba(125,23,28,0.16)] transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <ArrowLeft size={14} />
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const items = [
    { title: 'Profile', link: '/profile' },
    { title: 'Profile Update', link: null },
  ]

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FBF7F2]">
      {/* IMAGE VIEWER */}
      {showAvatarViewer && avatarPreview && (
        <div
          className="fixed inset-0 z-200 flex h-screen w-screen items-center justify-center overflow-hidden bg-white/35 p-4 backdrop-blur-md"
          onClick={() => setShowAvatarViewer(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo preview"
        >
          <button
            type="button"
            onClick={() => setShowAvatarViewer(false)}
            aria-label="Close image preview"
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#351C18] shadow-[0_4px_16px_rgba(73,54,49,0.12)] backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-white hover:text-[#8E181F] sm:right-6 sm:top-6"
          >
            <X size={19} />
          </button>

          <div className="relative flex max-h-[82vh] max-w-[92vw] items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={getAvatarSrc()}
              alt={formData.name || 'Profile'}
              className="max-h-[76vh] max-w-[88vw] rounded-2xl object-contain shadow-[0_20px_60px_rgba(53,28,24,0.22)] sm:max-h-[80vh] sm:max-w-[82vw] md:max-w-[72vw] lg:max-w-[60vw] xl:max-w-[52vw]"
            />

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[9px] font-semibold text-[#67544D] shadow-sm backdrop-blur-md sm:bottom-4 sm:px-4 sm:py-2 sm:text-[10px]">
              Profile Photo
            </div>
          </div>
        </div>
      )}

      <BreadCrumb items={items} />

      <div className="mx-auto pb-8 pt-4 sm:pt-5">
        {/* HEADER */}
        <div className="mb-4 flex h-16 items-center justify-between gap-3 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:h-17 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_4px_12px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <UserRound size={18} strokeWidth={1.8} className="relative z-10" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-sm">Edit Profile</h1>

              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Update your personal account information</p>
            </div>
          </div>

          <div className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-2.5 text-[8px] font-bold text-[#67544D] sm:px-3 sm:text-[9px]">
            <ShieldCheck size={13} className="text-[#3E8B62]" />

            <span className="hidden sm:inline">{user.status || 'Active'}</span>

            <span className="sm:hidden">Secure</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
            {/* PROFILE PHOTO */}
            <aside className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
              <div className="relative h-20 overflow-hidden bg-linear-to-br from-[#351C18] via-[#67231F] to-[#A51D26]">
                <div className="absolute -right-8 -top-10 h-24 w-24 rounded-full border-15 border-white/5" />

                <div className="absolute -bottom-12 left-10 h-24 w-24 rounded-full bg-[#D4A373]/10" />

                <div className="absolute left-4 top-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/60">Account</p>

                  <p className="mt-0.5 text-xs font-extrabold text-white">Profile Photo</p>
                </div>
              </div>

              <div className="px-4 pb-5 sm:px-5">
                <div className="-mt-9 flex justify-center">
                  <div className="relative">
                    {/* PROFILE IMAGE */}
                    <div
                      onClick={() => avatarPreview && setShowAvatarViewer(true)}
                      className={`group flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#F7EEE7] text-[#A51D26] shadow-[0_6px_20px_rgba(73,54,49,0.12)] ring-1 ring-[#E8DDD4] sm:h-28 sm:w-28 ${
                        avatarPreview ? 'cursor-zoom-in' : ''
                      }`}
                    >
                      {avatarPreview ? (
                        <>
                          <img src={getAvatarSrc()} alt={formData.name || 'Profile'} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />

                          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                            <div className="flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-white/90 text-[#8E181F] opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                              <Maximize2 size={14} />
                            </div>
                          </div>
                        </>
                      ) : (
                        <User size={42} strokeWidth={1.5} />
                      )}
                    </div>

                    {/* CAMERA */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={passwordFlowBusy}
                      aria-label="Change profile photo"
                      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md transition hover:scale-105"
                    >
                      <Camera size={15} />
                    </button>

                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h2 className="truncate text-sm font-extrabold text-[#351C18]">{formData.name || 'Your Name'}</h2>

                  <p className="mt-1 truncate text-[10px] text-[#806C63]">{formData.email || 'Your email'}</p>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={passwordFlowBusy}
                  className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] px-3 py-2.5 text-[10px] font-bold text-[#67544D] transition hover:border-[#CDAFA4] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                >
                  <Camera size={13} />
                  Change Photo
                </button>

                <div className="mt-4 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3">
                  <div className="flex items-start gap-2">
                    <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#3E8B62]" />

                    <div>
                      <p className="text-[10px] font-bold text-[#351C18]">Photo guidelines</p>

                      <p className="mt-1 text-[9px] leading-4 text-[#806C63]">
                        JPG, PNG or WEBP
                        <br />
                        Maximum file size: 5MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* FORM CONTENT */}
            <main className="min-w-0 space-y-4">
              <div className="grid  sm:grid-cols-2 gap-5">
                {/* PERSONAL INFORMATION */}
                <section className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
                  <div className="flex items-center gap-3 border-b border-[#EEE5DF] px-4 py-3.5 sm:px-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
                      <UserRound size={17} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Personal Information</h2>

                      <p className="mt-0.5 truncate text-[9px] text-[#9A857B] sm:text-[10px]">Keep your account details up to date</p>
                    </div>
                  </div>

                  <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                    {/* NAME */}
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Full Name</label>

                      <div className="relative">
                        <UserRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          disabled={passwordFlowBusy}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-3 text-xs font-medium text-[#351C18] outline-none transition placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                        />
                      </div>
                    </div>

                    {/* PHONE */}
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Phone Number</label>

                      <div className="relative">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          disabled={passwordFlowBusy}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-3 text-xs font-medium text-[#351C18] outline-none transition placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Email Address</label>

                      <div className="relative">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled={passwordFlowBusy}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-3 text-xs font-medium text-[#351C18] outline-none transition placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                        />
                      </div>

                      <p className="mt-1.5 text-[9px] text-[#9A857B]">Your email is used for account communication and login.</p>
                    </div>
                  </div>
                </section>

                {/* PASSWORD */}
                <section className={`overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)] transition ${passwordFlowBusy ? 'ring-2 ring-[#F2D9D6]' : ''}`}>
                  <div className="flex items-center gap-3 border-b border-[#EEE5DF] px-4 py-3.5 sm:px-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
                      <LockKeyhole size={17} />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-sm font-extrabold text-[#351C18] sm:text-base">Change Password</h2>

                      <p className="mt-0.5 truncate text-[9px] text-[#9A857B] sm:text-[10px]">Securely update your password using OTP</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <ProfileForgotPassword email={user.email} onBusyChange={setPasswordFlowBusy} />
                  </div>
                </section>
              </div>

              {/* ACCOUNT STATUS */}
              <section className="relative overflow-hidden rounded-2xl border border-[#E6D5C5] bg-linear-to-r from-[#FFF9F2] to-[#F7EEE7] p-4 sm:p-5">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#D4A373]/10" />

                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#3E8B62] shadow-sm">
                    <CheckCircle2 size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-extrabold text-[#351C18] sm:text-sm">Account information</h3>

                    <p className="mt-1 text-[9px] leading-4 text-[#806C63] sm:text-[10px]">
                      Your account is currently <span className="font-extrabold text-[#3E8B62]">{user.status || 'Active'}</span>. Keep your profile information accurate for orders and delivery updates.
                    </p>
                  </div>
                </div>
              </section>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  disabled={saving || passwordFlowBusy}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-white px-5 text-xs font-bold text-[#67544D] transition hover:bg-[#F7EEE7] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  <ArrowLeft size={15} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || passwordFlowBusy}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-6 text-xs font-extrabold text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(125,23,28,0.22)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </main>
          </div>
        </form>
      </div>
    </div>
  )
}
