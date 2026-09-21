import React, { useRef, useState } from 'react'
import { Camera, Mail, Lock, User, Phone, X, UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile } from '../utils/uploadFile'
import { useUser } from '../context/userProvider'

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
      setError('Please select a valid image')
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
      setError('Name, email and password are required')
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
          setError('Profile photo upload failed')
          return
        }
      }

      const registerData = {
        ...signUp,
        avatar: avatarPath,
      }

      const res = await axiosInstance.post('/users/register', registerData)

      if (res.data.success) {
        setSuccess('Account created successfully')

        setTimeout(() => {
          setShowLogin(true)
        }, 1000)
      }
    } catch (error) {
      console.log('Register Error:', error.response?.data || error.message)
      setError(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#F7EEE7] via-[#FBF7F2] to-[#F3E8E0] px-4 py-5 sm:py-8">
      <div className="flex max-h-[calc(100vh-40px)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_25px_70px_rgba(73,54,49,0.16)]">
        {/* Header */}
        <div className="relative shrink-0 overflow-hidden bg-linear-to-r from-[#351C18] via-[#6F171C] to-[#A51D26] px-5 py-5 text-white sm:px-8">
          <div className="absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-20 right-24 h-36 w-36 rounded-full bg-[#D4A373]/10" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <UserPlus size={19} />
                </div>
                <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">Create Account</h1>
              </div>
              <p className="mt-1.5 text-xs text-[#F3DCD5] sm:text-sm">Join MineKart and start shopping</p>
            </div>

            <button type="button" onClick={() => navigate('/')} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:rotate-90">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submitHandle} className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden md:grid-cols-[290px_1fr]">
          {/* Avatar */}
          <div className="flex shrink-0 flex-col items-center justify-center border-b border-[#E8DDD4] bg-linear-to-b from-[#FBF7F2] to-[#F7EEE7] px-6 py-6 md:border-b-0 md:border-r md:px-8">
            <div className="mb-5 text-center">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#F3E5DE] text-[#8E181F]">
                <User size={18} />
              </div>
              <h2 className="text-base font-extrabold text-[#351C18]">Profile Photo</h2>
              <p className="mt-1 text-xs text-[#806C63]">Add a profile picture</p>
            </div>

            <div className="relative">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-4 border-[#FFFDFC] bg-[#F3E5DE] shadow-[0_10px_30px_rgba(73,54,49,0.15)] ring-1 ring-[#E2D5CC] sm:h-48 sm:w-48">
                {preview ? (
                  <img src={preview} alt="Profile Preview" className="h-full w-full object-cover" />
                ) : (
                  <User size={82} strokeWidth={1.2} className="text-[#8E181F]" />
                )}
              </div>

              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 flex h-11 w-11 items-center justify-center rounded-full border-4 border-[#FFFDFC] bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <Camera size={19} />
              </button>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <div className="mt-5 flex items-center gap-1.5 rounded-full border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-1.5 text-[10px] font-semibold text-[#806C63]">
              <ShieldCheck size={13} className="text-[#3E8B62]" />
              JPG, PNG or WEBP
            </div>
          </div>

          {/* Form Area */}
          <div className="min-h-0 overflow-y-auto p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15">
                <UserPlus size={19} />
              </div>

              <div>
                <h2 className="font-extrabold text-[#351C18]">Personal Information</h2>
                <p className="text-xs text-[#806C63]">Enter your details below</p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-center rounded-xl border border-[#E7C8C5] bg-[#FFF2F1] px-4 py-3 text-sm font-medium text-[#A51D26]">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-5 flex items-center rounded-xl border border-[#CFE4D7] bg-[#F0F8F3] px-4 py-3 text-sm font-medium text-[#3E8B62]">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Full Name</label>
                <div className="group relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />
                  <input type="text" name="name" value={signUp.name} onChange={handleChange} placeholder="Enter your name" className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Email Address</label>
                <div className="group relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />
                  <input type="email" name="email" value={signUp.email} onChange={handleChange} placeholder="Enter your email" className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Password</label>
                <div className="group relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />
                  <input type="password" name="password" value={signUp.password} onChange={handleChange} placeholder="Create password" className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5" />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#493631] sm:text-sm">Phone Number</label>
                <div className="group relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors duration-200 group-focus-within:text-[#8E181F]" />
                  <input type="tel" name="phone" value={signUp.phone} onChange={handleChange} placeholder="Enter phone number" className="h-11 w-full rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] pl-11 pr-4 text-sm text-[#351C18] outline-none transition-all duration-200 placeholder:text-[#B09E95] focus:border-[#A51D26] focus:bg-white focus:ring-4 focus:ring-[#A51D26]/5" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#E8DDD4] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={clearHandle} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-5 text-sm font-semibold text-[#806C63] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8] hover:text-[#493631]">
                <X size={17} />
                Clear
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate('/')} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-5 text-sm font-semibold text-[#493631] transition-all duration-300 hover:border-[#CDAFA4] hover:bg-[#F8EEE8]">
                  <ArrowLeft size={17} />
                  Back
                </button>

                <button type="submit" disabled={loading} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-7 text-sm font-bold text-white shadow-md shadow-[#7D171C]/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-[#681419] hover:to-[#8E181F] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0">
                  <UserPlus size={17} />
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}