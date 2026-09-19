import React, { useState, useEffect } from 'react'
import { MapPin, Mail, Plus, CheckCircle2, User, Phone, Hash, Building2, ShieldCheck, Navigation, Home, Camera, Pencil, BriefcaseBusiness, Check, MapPinned, X, Save } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { axiosInstance } from '../config/axiosConfig'

export default function Profile() {
  const { user } = useUser()

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'Home',
  })

  const [addresses, setAddresses] = useState([])
  const [addressLoading, setAddressLoading] = useState(false)
  const [addressSaving, setAddressSaving] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#F8FAFC] px-4 py-8">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center shadow-sm">
          <User className="mx-auto mb-3 text-[#94A3B8]" size={40} />

          <h2 className="text-lg font-semibold text-[#172033]">Profile not available</h2>
        </div>
      </div>
    )
  }

  // ! get address API
  const getAddresses = async () => {
    try {
      setAddressLoading(true)

      const res = await axiosInstance.get('/address')

      if (res.data.success) {
        setAddresses(res.data.data || [])
      }
    } catch (error) {
      console.log('Get Addresses Error:', error.response?.data || error.message)
    } finally {
      setAddressLoading(false)
    }
  }

  // ! Address Change
  const handleAddressChange = (e) => {
    const { name, value } = e.target

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddAddress = (e) => {
    e.preventDefault()

    console.log('New Address:', addressForm)

    setShowAddressForm(false)
  }

  const initials =
    user.name
      ?.trim()
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 grid grid-cols-[1fr_auto] items-end gap-4">
        <div>
          <p className="text-sm font-medium text-[#64748B]">Account</p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">My Profile</h1>

          <p className="mt-1 text-sm text-[#64748B]">Manage your personal information and account details</p>
        </div>

        <button type="button" className="hidden items-center gap-2 rounded-lg bg-[#1D4ED8] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1E40AF] sm:flex">
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[34%_66%]">
        {/* Left Profile Card */}
        <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
          {/* Cover */}
          <div className="h-28 bg-linear-to-r from-[#1D4ED8] to-[#2563EB]" />

          <div className="px-5 pb-6">
            {/* Avatar + Status */}
            <div className="-mt-12 grid grid-cols-[1fr_auto] items-end gap-3">
              <div className="relative w-fit">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#EFF6FF] text-2xl font-bold text-[#1D4ED8] shadow-md">
                  {user.avatar ? <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full object-cover" /> : initials}
                </div>
              </div>

              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#16A34A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
                {user.status || 'Active'}
              </span>
            </div>

            {/* Name */}
            <div className="mt-4">
              <h2 className="text-xl font-bold text-[#172033]">{user.name || 'User'}</h2>

              <p className="mt-1 text-sm text-[#64748B]">MineKart Customer</p>
            </div>

            {/* Contact */}
            <div className="mt-6 grid gap-3 border-t border-[#E2E8F0] pt-5">
              <div className="grid grid-cols-[36px_1fr] items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#94A3B8]">Email</p>

                  <p className="truncate text-sm font-semibold text-[#292725]">{user.email || 'Not added'}</p>
                </div>
              </div>

              <div className="grid grid-cols-[36px_1fr] items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F3FF] text-[#7C3AED]">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-xs text-[#94A3B8]">Phone</p>

                  <p className="text-sm font-semibold text-[#292725]">{user.phone || 'Not added'}</p>
                </div>
              </div>
            </div>

            {/* Mobile Edit */}
            <button
              type="button"
              className="mt-6 grid w-full grid-cols-[auto_1fr] items-center justify-center gap-2 rounded-lg border border-[#1D4ED8] bg-white px-4 py-2.5 text-sm font-semibold text-[#1D4ED8] transition hover:bg-[#EFF6FF] sm:hidden"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="grid gap-6">
          {/* Personal Information */}
          <section className="rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#E2E8F0] px-5 py-4">
              <div>
                <h3 className="font-semibold text-[#172033]">Personal Information</h3>

                <p className="mt-0.5 text-xs text-[#64748B]">Your basic account information</p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                <User size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-6 p-5 sm:grid-cols-2">
              {/* Name */}
              <div className="grid grid-cols-[36px_1fr] gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                  <User size={17} />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#94A3B8]">Full Name</p>

                  <p className="mt-1 text-sm font-semibold text-[#292725]">{user.name || 'Not added'}</p>
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-[36px_1fr] gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                  <Mail size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#94A3B8]">Email Address</p>

                  <p className="mt-1 truncate text-sm font-semibold text-[#292725]">{user.email || 'Not added'}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-[36px_1fr] gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                  <Phone size={17} />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#94A3B8]">Phone Number</p>

                  <p className="mt-1 text-sm font-semibold text-[#292725]">{user.phone || 'Not added'}</p>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-[36px_1fr] gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#16A34A]">
                  <ShieldCheck size={17} />
                </div>

                <div>
                  <p className="text-xs font-medium text-[#94A3B8]">Account Status</p>

                  <p className="mt-1 text-sm font-semibold text-[#16A34A]">{user.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Address Information */}
          <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                  <MapPin size={18} strokeWidth={2} />
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-[#172033]">Delivery Address</h3>

                  <p className="text-[11px] text-[#64748B]">Where should we deliver your order?</p>
                </div>
              </div>

              {/* Add New */}
              {!showAddressForm && (
                <button type="button" onClick={() => setShowAddressForm(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-[11px] font-bold text-[#1D4ED8] transition hover:bg-[#DBEAFE]">
                  <Plus size={14} strokeWidth={2.5} />
                  Add New
                </button>
              )}
            </div>

            {/* Saved Addresses */}
            {!showAddressForm && (
              <div className="space-y-2.5 p-4">
                {addresses.map((address) => {
                  const isSelected = selectedAddress === address.id

                  return (
                    <button
                      key={address.id}
                      type="button"
                      onClick={() => setSelectedAddress(address.id)}
                      className={`group w-full rounded-lg border p-3 text-left transition-all ${isSelected ? 'border-[#1D4ED8] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-[#BFDBFE] hover:bg-[#F8FAFC]'}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Selection Icon */}
                        <div className="pt-0.5">{isSelected ? <CheckCircle2 size={18} className="text-[#1D4ED8]" strokeWidth={2.5} /> : <div className="h-4.5 w-4.5 rounded-full border-2 border-[#CBD5E1]" />}</div>

                        {/* Address Content */}
                        <div className="min-w-0 flex-1">
                          {/* Name + Type + Phone */}
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-extrabold text-[#172033]">{address.fullName}</p>

                            <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${isSelected ? 'bg-white text-[#1D4ED8]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>{address.addressType}</span>

                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#64748B]">
                              <Phone size={11} />
                              {address.phone}
                            </span>
                          </div>

                          {/* Address */}
                          <p className="mt-1.5 text-[11px] leading-4 text-[#64748B]">
                            {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                          </p>

                          {/* Landmark */}
                          {address.landmark && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] text-[#94A3B8]">
                              <Navigation size={10} />
                              <span>Near {address.landmark}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Add Address Form */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="space-y-3 p-4">
                {/* Name + Phone */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#475569]">Full Name</label>

                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

                      <input
                        type="text"
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleAddressChange}
                        placeholder="Enter full name"
                        required
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-xs text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#475569]">Phone Number</label>

                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        placeholder="Enter phone number"
                        required
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] bg-white pl-9 pr-3 text-xs text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#475569]">Address</label>

                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-[#94A3B8]" />

                    <textarea
                      name="addressLine"
                      value={addressForm.addressLine}
                      onChange={handleAddressChange}
                      placeholder="House no., building, street, area"
                      rows={2}
                      required
                      className="w-full resize-none rounded-lg border border-[#E2E8F0] bg-white py-2.5 pl-9 pr-3 text-xs text-[#172033] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* City / State / Pincode */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* City */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#475569]">City</label>

                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        required
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-xs outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#475569]">State</label>

                    <div className="relative">
                      <MapPinned size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        required
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-xs outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                      />
                    </div>
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#475569]">Pincode</label>

                    <div className="relative">
                      <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

                      <input
                        type="text"
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressChange}
                        placeholder="Pincode"
                        required
                        className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-xs outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                      />
                    </div>
                  </div>
                </div>

                {/* Landmark */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#475569]">
                    Landmark
                    <span className="ml-1 font-normal text-[#94A3B8]">(Optional)</span>
                  </label>

                  <div className="relative">
                    <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

                    <input
                      type="text"
                      name="landmark"
                      value={addressForm.landmark}
                      onChange={handleAddressChange}
                      placeholder="Nearby landmark"
                      className="h-10 w-full rounded-lg border border-[#E2E8F0] pl-9 pr-3 text-xs outline-none transition focus:border-[#1D4ED8] focus:ring-2 focus:ring-[#DBEAFE]"
                    />
                  </div>
                </div>

                {/* Address Type */}
                <div>
                  <label className="mb-2 block text-[11px] font-bold text-[#475569]">Address Type</label>

                  <div className="flex gap-2">
                    {[
                      {
                        name: 'Home',
                        icon: Home,
                      },
                      {
                        name: 'Work',
                        icon: BriefcaseBusiness,
                      },
                      {
                        name: 'Other',
                        icon: MapPinned,
                      },
                    ].map(({ name, icon: Icon }) => {
                      const isActive = addressForm.addressType === name

                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() =>
                            setAddressForm((prev) => ({
                              ...prev,
                              addressType: name,
                            }))
                          }
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-bold transition ${
                            isActive ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]' : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#BFDBFE] hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <Icon size={14} />
                          {name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2 border-t border-[#E2E8F0] pt-3">
                  <button type="button" onClick={() => setShowAddressForm(false)} className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] px-4 py-2 text-[11px] font-bold text-[#475569] transition hover:bg-[#F8FAFC]">
                    <X size={14} />
                    Cancel
                  </button>

                  <button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-[#1D4ED8] px-4 py-2 text-[11px] font-bold text-white transition hover:bg-[#1E40AF]">
                    <Save size={14} />
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Security */}
          <section className="grid grid-cols-[auto_1fr] gap-4 rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1D4ED8] shadow-sm">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-[#172033]">Your account is secure</h3>

              <p className="mt-1 text-sm leading-6 text-[#64748B]">Keep your email and phone number updated to protect your MineKart account and receive important order updates.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
