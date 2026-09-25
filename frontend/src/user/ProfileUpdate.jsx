import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Check, Eye, EyeOff, LockKeyhole, Mail, Phone, Save, ShieldCheck, User, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { axiosInstance } from '../config/axiosConfig'
import { useUser } from '../context/userProvider'
import BreadCrumb from './BreadCrumb'

export default function ProfileUpdate() {
  const navigate = useNavigate()
  const { user, setUser } = useUser()

  const fileInputRef = useRef(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
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
      password: '',
    })

    setAvatarPreview(user.avatar || '')
    setLoading(false)


     document.title = `Profile-Update | MineKart`
  }, [user])

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
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
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

      if (formData.password.trim()) {
        payload.password = formData.password.trim()
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
      <div className="min-h-[70vh] bg-[#F7EEE7] px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white">
            <div className="h-24 bg-[#F7EEE7]" />
            <div className="space-y-5 p-5 sm:p-7">
              <div className="h-20 w-20 rounded-full bg-[#EEE5DF]" />
              <div className="h-11 rounded-xl bg-[#EEE5DF]" />
              <div className="h-11 rounded-xl bg-[#EEE5DF]" />
              <div className="h-11 rounded-xl bg-[#EEE5DF]" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7EEE7] px-4">
        <div className="rounded-2xl border border-[#E8DDD4] bg-white p-8 text-center shadow-sm">
          <UserRound size={38} className="mx-auto text-[#A51D26]" />

          <h2 className="mt-4 text-lg font-extrabold text-[#351C18]">Please login first</h2>

          <button type="button" onClick={() => navigate('/')} className="mt-5 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-5 py-2.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const items = [
    { title: 'Profile', link: '/profile' },
    { title: 'ProfileUpdate', link: null },
  ]

  return (
    <div className="min-h-screen  ">
      <BreadCrumb items={items} />
      <div className="mx-auto pt-5">
        {/* Header */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.06)]">
          <div className="relative flex h-23 items-center justify-between overflow-hidden bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] px-4 sm:h-24 sm:px-6">
            <div className="absolute -right-12 -top-14 h-32 w-32 rounded-full bg-[#A51D26]/[0.035]" />
            <div className="absolute -bottom-16 left-1/3 h-28 w-28 rounded-full bg-[#D4A373]/5" />

            <div className="relative flex min-w-0 items-center gap-3">
              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_5px_15px_rgba(125,23,28,0.16)] sm:flex">
                <UserRound size={21} strokeWidth={1.8} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-1 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />

                  <h1 className="truncate text-lg font-extrabold tracking-tight text-[#351C18] sm:text-xl">Edit Profile</h1>
                </div>

                <p className="ml-3 mt-1 text-[10px] text-[#806C63] sm:text-xs">Update your personal account information</p>
              </div>
            </div>

            <div className="relative hidden items-center gap-2 rounded-xl border border-[#E2D5CC] bg-white px-3.5 py-2.5 shadow-sm sm:flex">
              <ShieldCheck size={16} className="text-[#3E8B62]" />

              <div>
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#9A857B]">Account</p>

                <p className="text-[10px] font-extrabold text-[#67544D]">{user.status || 'Active'}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Profile Preview */}
            <div className="h-fit overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
              <div className="border-b border-[#EEE5DF] bg-[#FFFCFA] px-5 py-4">
                <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9A857B]">Profile</p>

                <h2 className="mt-1 text-sm font-extrabold text-[#351C18]">Profile photo</h2>
              </div>

              <div className="flex flex-col items-center px-5 py-6">
                <div className="relative">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#FFF8F5] bg-[#F7EEE7] shadow-[0_5px_20px_rgba(73,54,49,0.10)] ring-1 ring-[#E8DDD4]">
                    {avatarPreview ? (
                      <img src={avatarPreview.startsWith('blob:') ? avatarPreview : `http://localhost:3000${avatarPreview}`} alt={formData.name || 'Profile'} className="h-full w-full object-cover" />
                    ) : (
                      <User size={42} strokeWidth={1.5} className="text-[#A51D26]" />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md transition-transform hover:scale-105"
                  >
                    <Camera size={15} />
                  </button>

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </div>

                <h3 className="mt-4 max-w-full truncate text-sm font-extrabold text-[#351C18]">{formData.name || 'Your Name'}</h3>

                <p className="mt-1 max-w-full truncate text-[10px] text-[#806C63]">{formData.email}</p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 rounded-lg border border-[#E8DDD4] bg-[#FBF7F2] px-3 py-2 text-[10px] font-bold text-[#67544D] transition-all hover:border-[#D8C1B6] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                >
                  Change Photo
                </button>

                <p className="mt-3 text-center text-[9px] leading-4 text-[#9A857B]">
                  JPG, PNG or WEBP
                  <br />
                  Maximum 5MB
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Personal Information */}
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
                <div className="border-b border-[#EEE5DF] bg-[#FFFCFA] px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
                      <UserRound size={17} />
                    </div>

                    <div>
                      <h2 className="text-sm font-extrabold text-[#351C18]">Personal Information</h2>

                      <p className="mt-0.5 text-[9px] text-[#9A857B]">Keep your account details up to date</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Full Name</label>

                    <div className="relative">
                      <UserRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-3 text-xs font-medium text-[#351C18] outline-none transition-all placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-3 focus:ring-[#A51D26]/10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Phone Number</label>

                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-3 text-xs font-medium text-[#351C18] outline-none transition-all placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-3 focus:ring-[#A51D26]/10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-[10px] font-bold text-[#67544D]">Email Address</label>

                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-3 text-xs font-medium text-[#351C18] outline-none transition-all placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-3 focus:ring-[#A51D26]/10"
                      />
                    </div>

                    <p className="mt-1.5 text-[9px] text-[#9A857B]">Your email is used for account communication and login.</p>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
                <div className="border-b border-[#EEE5DF] bg-[#FFFCFA] px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
                      <LockKeyhole size={17} />
                    </div>

                    <div>
                      <h2 className="text-sm font-extrabold text-[#351C18]">Change Password</h2>

                      <p className="mt-0.5 text-[9px] text-[#9A857B]">Leave blank if you don't want to change it</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="relative">
                    <LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A857B]" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="h-11 w-full rounded-xl border border-[#E8DDD4] bg-[#FFFCFA] pl-10 pr-11 text-xs font-medium text-[#351C18] outline-none transition-all placeholder:text-[#B7A49B] focus:border-[#A51D26] focus:bg-white focus:ring-3 focus:ring-[#A51D26]/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#806C63] transition-colors hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] px-3 py-2.5">
                    <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#3E8B62]" />

                    <p className="text-[9px] leading-4 text-[#806C63]">Your password is securely encrypted before it is stored.</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate('/profile')}
                  disabled={saving}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-white px-5 text-xs font-bold text-[#67544D] transition-all hover:bg-[#FBF7F2] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={15} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-6 text-xs font-extrabold text-white shadow-[0_6px_16px_rgba(125,23,28,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(125,23,28,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
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
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
