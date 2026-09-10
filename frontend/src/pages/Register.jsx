import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { Camera, User, Mail, Lock, Phone, RotateCcw, UserPlus, Image, MapPinned, Building2, MapPin } from 'lucide-react'
import { useRef } from 'react'
import { uploadFile } from '../utils/uploadFile'
import { useUser } from '../context/userProvider'

export default function Register() {
  const [signUp, setSignUp] = useState({
    avatar: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()
  const { setShowLogin } = useUser()

  // upload file mate
  const fileInputRef = useRef(null)
  const [imageFile, setImageFile] = useState(null)

  // img ne select krta create ma btava mte
  const [preview, setPreview] = useState(null)

  // ! text input mate
  const changeHandle = (e) => {
    const { name, value } = e.target

    setSignUp((prev) => ({
      ...prev,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  // ! file input mate
  const handleImage = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    setImageFile(file)

    // purpose  preview img btava mte
    const imageUrl = URL.createObjectURL(file)
    setPreview(imageUrl)

    // console.log('imageUrl', imageUrl)
    // console.log('file', file)
  }

  // ! submit handle
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      let avatarPath = ''

      // AVATAR UPLOAD
      if (imageFile) {
        try {
          avatarPath = await uploadFile(imageFile.name, imageFile, 'Avatar')
        } catch (error) {
          console.log('File Upload Error:', error)
          setError('Profile photo upload failed')
          return
        }
      }

      // REGISTER DATA
      const registerData = {
        ...signUp,
        avatar: avatarPath,
      }

      // console.log('Register Data:', registerData)

      // REGISTER API
      const res = await axiosInstance.post('/users/register', registerData)

      // console.log('Signup Response:', res.data)

      if (res.data.success) {
        setSuccess('Account created successfully!')

        // Clear form
        setSignUp({
          avatar: '',
          name: '',
          email: '',
          password: '',
          phone: '',
          address: '',
          city: '',
          pincode: '',
        })

        setImageFile(null)
        setPreview(null)

        // Login page
        setTimeout(() => {
          navigate('/')
          setShowLogin(true)
        }, 1000)
      }
    } catch (error) {
      console.log('Signup Error:', error)

      setError(error.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">
          {/* header */}
          <div className="border-b border-[#E2E8F0] bg-[#1D4ED8] px-8 py-5">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>

            <p className="mt-1 text-sm text-blue-100">Create your MineKart account</p>
          </div>

          {/* two side */}
          <form onSubmit={submitHandle} className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
            {/* left side */}
            <div className="flex flex-col items-center justify-center border-b border-[#E2E8F0] bg-[#F8FAFC] px-8 py-10 md:border-b-0 md:border-r">
              {/* Avatar */}

              <div className="relative">
                <div className="flex size-60 items-center justify-center overflow-hidden rounded-full border-4 border-black/30 border-x-0 bg-[#EFF6FF] shadow-lg">
                  {preview ? <img src={preview} onClick={() => fileInputRef.current?.click()} alt="preview" className=" rounded-lg object-contain" /> : <User size={80} strokeWidth={1.5} className="text-[#1D4ED8]" />}
                </div>

                {/* file input */}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />

                {/* Camera */}
                {!preview && (
                  <button onClick={() => fileInputRef.current?.click()} type="button" className="absolute bottom-1 right-7 flex h-11 w-11 items-center justify-center rounded-full bg-[#1D4ED8] text-white shadow-lg transition hover:bg-[#1E40AF]">
                    <Image size={20} />
                  </button>
                )}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#172033]">Profile Photo</h3>

              <p className="mt-1 text-center text-sm text-[#64748B]">Upload your profile picture</p>

              <p className="mt-2 text-xs text-[#94A3B8]">JPG, PNG up to 2MB</p>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#172033]">Name</label>

                  <div className="relative">
                    <User size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />

                    <input
                      onChange={changeHandle}
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#172033]">Email</label>

                  <div className="relative">
                    <Mail size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />

                    <input
                      onChange={changeHandle}
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#172033]">Password</label>

                  <div className="relative">
                    <Lock size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />

                    <input
                      onChange={changeHandle}
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#172033]">Phone</label>

                  <div className="relative">
                    <Phone size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />

                    <input
                      onChange={changeHandle}
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#172033]">Address</label>

                  <div className="relative">
                    <MapPin size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />

                    <input
                      onChange={changeHandle}
                      name="address"
                      type="text"
                      placeholder="Enter your address"
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#172033]">City</label>

                  <div className="relative">
                    <Building2 size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />

                    <input
                      onChange={changeHandle}
                      name="city"
                      type="text"
                      placeholder="Enter your city"
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* Pincode */}
                <div className="">
                  <label className="mb-2 block text-sm font-medium text-[#172033]">Pincode</label>

                  <div className="relative">
                    <MapPinned size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />

                    <input
                      onChange={changeHandle}
                      name="pincode"
                      type="text"
                      placeholder="Enter your pincode"
                      maxLength={6}
                      className="h-12 w-full rounded-lg border border-[#CBD5E1] bg-white pl-11 pr-4 text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>
              </div>

              {/* ================= BUTTONS ================= */}
              <div className="mt-8 flex justify-end gap-3 border-t border-[#E2E8F0] pt-6">
                <button type="button" className="flex items-center gap-2 rounded-lg border border-[#CBD5E1] px-6 py-3 font-semibold text-[#475569] transition hover:bg-[#F8FAFC]">
                  <RotateCcw size={18} />
                  Clear
                </button>

                {/* <button type="submit" className="flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-7 py-3 font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#1E40AF] active:scale-[0.98]">
                  <UserPlus size={18} />
                  Create Account
                </button> */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-[#1D4ED8] px-7 py-3 font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-[#1E40AF] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <UserPlus size={18} />
                  {loading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
