import React, { useRef, useState } from 'react'
import { Camera, Mail, Lock, User, Phone, MapPin, MapPinned, Hash, X, UserPlus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile } from '../utils/uploadFile'
import { useUser } from '../context/userProvider'

export default function Register() {
  const navigate = useNavigate()
  const { setShowLogin } = useUser()
  
  // ! img state
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

  // ! Input Change
  const handleChange = (e) => {
    const { name, value } = e.target

    setSignUp((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
  }

  // ! Image Select
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

  // ! Clear Form
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

  // ! Submit
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

      // ! Upload Avatar
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

      // ! Register Data
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
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-4">
      {/* ! Register Dialog */}
      <div className="flex max-h-[calc(100vh-32px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
        {/* ! Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-blue-700 bg-[#1D4ED8] px-6 py-4 sm:px-8">
          <div>
            <h1 className="text-xl font-semibold text-white sm:text-2xl">Create Account</h1>

            <p className="mt-1 text-sm text-blue-100">Join MineKart and start shopping</p>
          </div>

          <button type="button" onClick={() => navigate('/')} className="flex size-9 items-center justify-center rounded-full text-white transition hover:bg-white/15">
            <X size={21} />
          </button>
        </div>

        {/* ! Form */}
        <form onSubmit={submitHandle} className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[280px_1fr]">
          {/* ! Left Avatar Section */}
          <div className="flex shrink-0 flex-col items-center justify-center border-b border-[#E2E8F0] bg-[#F8FAFC] px-8 py-6 md:border-b-0 md:border-r">
            <div className="mb-5 text-center">
              <h2 className="text-lg font-semibold text-[#172033]">Profile Photo</h2>

              <p className="mt-1 text-sm text-[#64748B]">Add a profile picture</p>
            </div>

            {/* ! Avatar */}
            <div className="relative">
              <div className="flex size-60 items-center justify-center overflow-hidden rounded-full border-4 border-black/30 border-x-0 bg-[#EFF6FF] shadow-lg">
                {preview ? <img src={preview} alt="Profile Preview" className="h-full w-full object-cover" /> : <User size={100} strokeWidth={1.3} className="text-[#1D4ED8]" />}
              </div>

              {/* ! Camera Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 flex size-12 items-center justify-center rounded-full border-4 border-white bg-[#1D4ED8] text-white shadow-lg transition hover:bg-blue-700"
              >
                <Camera size={21} />
              </button>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>

            <p className="mt-5 text-center text-xs text-[#64748B]">JPG, PNG or WEBP</p>
          </div>

          {/* ! Right Form Area */}
          <div className="min-h-0 overflow-y-auto p-5 sm:p-7">
            {/* ! Form Heading */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-[#DBEAFE]">
                  <UserPlus size={19} className="text-[#1D4ED8]" />
                </div>

                <div>
                  <h2 className="font-semibold text-[#172033]">Personal Information</h2>

                  <p className="text-xs text-[#64748B]">Enter your details below</p>
                </div>
              </div>
            </div>

            {/* ! Error */}
            {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

            {/* ! Success */}
            {success && <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">{success}</div>}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* ! Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">Full Name</label>

                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />

                  <input
                    type="text"
                    name="name"
                    value={signUp.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white pl-11 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                  />
                </div>
              </div>

              {/* ! Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">Email Address</label>

                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />

                  <input
                    type="email"
                    name="email"
                    value={signUp.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white pl-11 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                  />
                </div>
              </div>

              {/* ! Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">Password</label>

                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />

                  <input
                    type="password"
                    name="password"
                    value={signUp.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white pl-11 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                  />
                </div>
              </div>

              {/* ! Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#172033]">Phone Number</label>

                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />

                  <input
                    type="tel"
                    name="phone"
                    value={signUp.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="h-11 w-full rounded-lg border border-[#E2E8F0] bg-white pl-11 pr-4 text-sm text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                  />
                </div>
              </div>

            </div>

            {/* ! Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#E2E8F0] pt-5 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={clearHandle}
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-5 text-sm font-medium text-[#64748B] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC] hover:text-[#172033]"
              >
                <X size={17} />
                Clear
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate('/')} className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-5 text-sm font-medium text-[#172033] transition hover:bg-[#F8FAFC]">
                  <ArrowLeft size={17} />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1D4ED8] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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
  )
}
