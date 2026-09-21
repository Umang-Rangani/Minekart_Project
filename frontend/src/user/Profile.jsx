import React, { useState, useEffect } from 'react'
import { MapPin, Mail, Plus, CheckCircle2, User, Phone, Building2, ShieldCheck, Navigation, Home, Pencil, BriefcaseBusiness, MapPinned, X, Save, ShoppingCart, ChevronRight } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { axiosInstance } from '../config/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'

export default function Profile() {
  const { user } = useUser()
  const { cart } = useCart()
  const navigate = useNavigate()

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

  const [addressLoading, setAddressLoading] = useState(false)
  const [addressSaving, setAddressSaving] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressDeleting, setAddressDeleting] = useState(false)

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      addressLine: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      addressType: 'Home',
    })
  }

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

  useEffect(() => {
    if (user) {
      getAddresses()
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#FBF7F2] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] p-10 text-center shadow-[0_8px_30px_rgba(73,54,49,0.07)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
            <User size={30} />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">Profile not available</h2>
          <p className="mt-2 text-sm text-[#806C63]">Please login to view your profile.</p>
        </div>
      </div>
    )
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()

    try {
      setAddressSaving(true)

      const res = await axiosInstance.post('/address', addressForm)

      if (res.data.success) {
        const newAddress = res.data.data

        setAddresses((prev) => [newAddress, ...prev])
        resetAddressForm()
        setShowAddressForm(false)
      }
    } catch (error) {
      console.log('Add Address Error:', error.response?.data || error.message)
    } finally {
      setAddressSaving(false)
    }
  }

  const handleEditAddress = async (e) => {
    e.preventDefault()

    try {
      setAddressSaving(true)

      const res = await axiosInstance.put(`/address/${editingAddressId}`, addressForm)

      if (res.data.success) {
        const updatedAddress = res.data.data

        setAddresses((prev) => prev.map((address) => (address._id === editingAddressId ? updatedAddress : address)))

        resetAddressForm()
        setEditingAddressId(null)
        setShowAddressForm(false)
      }
    } catch (error) {
      console.log('Update Address Error:', error.response?.data || error.message)
    } finally {
      setAddressSaving(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this address?')

    if (!confirmDelete) return

    try {
      setAddressDeleting(true)

      const res = await axiosInstance.delete(`/address/${addressId}`)

      if (res.data.success) {
        setAddresses((prev) => prev.filter((address) => address._id !== addressId))
      }
    } catch (error) {
      console.log('Delete Address Error:', error.response?.data || error.message)
    } finally {
      setAddressDeleting(false)
    }
  }

  const startEditAddress = (address) => {
    setAddressForm({
      fullName: address.fullName || '',
      phone: address.phone || '',
      addressLine: address.addressLine || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      landmark: address.landmark || '',
      addressType: address.addressType || 'Home',
    })

    setEditingAddressId(address._id)
    setShowAddressForm(true)
  }

  const initials =
    user.name
      ?.trim()
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'

  const addressTypeData = [
    { name: 'Home', icon: Home },
    { name: 'Work', icon: BriefcaseBusiness },
    { name: 'Other', icon: MapPinned },
  ]

  return (
    <div className="min-h-[calc(100vh-80px)] px-4  sm:px-6 lg:px-8">
      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-5 w-1 rounded-full bg-linear-to-b from-[#7D171C] to-[#B5262D]" />
            <p className="text-xs font-bold uppercase tracking-widest text-[#8E181F]">Account</p>
          </div>

          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#351C18] sm:text-3xl">My Profile</h1>

          <p className="mt-1 text-sm text-[#806C63]">Manage your personal information and delivery addresses</p>
        </div>

        <button
          type="button"
          className="hidden items-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:flex"
        >
          <Pencil size={16} />
          Edit Profile
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* PROFILE CARD */}
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_6px_24px_rgba(73,54,49,0.07)]">
          {/* COVER */}
          <div className="relative h-28 shrink-0 overflow-hidden bg-linear-to-br from-[#351C18] via-[#5A2A25] to-[#8E181F]">
            <div className="absolute -right-8 -top-12 h-32 w-32 rounded-full border-18 border-white/5" />
            <div className="absolute -bottom-16 left-10 h-28 w-28 rounded-full bg-[#D4A373]/10" />

            <div className="absolute bottom-3 left-5 flex items-center gap-2 rounded-lg border border-white/10 bg-black/10 px-2.5 py-1.5 backdrop-blur-sm">
              <ShieldCheck size={13} className="text-[#E7C9A7]" />
              <span className="text-[10px] font-bold text-white/80">Verified Customer</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col px-5 pb-5">
            {/* AVATAR + STATUS */}
            <div className="-mt-12 flex items-end justify-between">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#FFFDFC] bg-[#F7EEE7] text-2xl font-extrabold text-[#8E181F] shadow-lg">
                  {user.avatar ? <img src={`http://localhost:3000${user.avatar}`} alt={user.name} className="h-full w-full object-cover" /> : initials}
                </div>

                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-[#3E8B62]" />
              </div>

              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-[#D5E9DC] bg-[#EAF6EF] px-2.5 py-1 text-[10px] font-bold text-[#3E8B62]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3E8B62]" />
                {user.status || 'Active'}
              </span>
            </div>

            {/* NAME */}
            <div className="mt-4">
              <h2 className="text-xl font-extrabold text-[#351C18]">{user.name || 'User'}</h2>
              <p className="mt-1 text-xs font-medium text-[#9A857B]">MineKart Customer</p>
            </div>

            {/* CONTACT */}
            <div className="mt-6 space-y-3 border-t border-[#E8DDD4] pt-5">
              <div className="flex items-center gap-3 rounded-xl bg-[#FBF7F2] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Email</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-[#351C18]">{user.email || 'Not added'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#FBF7F2] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                  <Phone size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">Phone</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-[#351C18]">{user.phone || 'Not added'}</p>
                </div>
              </div>
            </div>

            {/* MOBILE EDIT */}
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#D8C8BF] bg-[#FFFDFC] px-4 py-2.5 text-sm font-bold text-[#67544D] transition-all duration-300 hover:border-[#8E181F] hover:bg-[#F7EEE7] hover:text-[#8E181F] sm:hidden"
            >
              <Pencil size={15} />
              Edit Profile
            </button>

            {/* CONTINUE SHOPPING - ALWAYS BOTTOM */}
            {cart && (
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="mt-auto flex w-full items-center justify-between rounded-xl border border-[#E2D5CC] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#CDAFA4] hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm">
                    <ShoppingCart size={16} />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold text-[#351C18]">Continue Shopping</p>
                    <p className="mt-0.5 text-[10px] text-[#806C63]">{cart.length || 0} items in your cart</p>
                  </div>
                </div>

                <ChevronRight size={17} className="shrink-0 text-[#8E181F]" />
              </button>
            )}
          </div>
        </div>



        {/* RIGHT CONTENT */}
        <div className="grid gap-6">
          {/* PERSONAL INFORMATION */}
          <section className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_6px_24px_rgba(73,54,49,0.06)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] to-[#F7EEE7] px-5 py-4">
              <div>
                <h3 className="text-base font-extrabold text-[#351C18]">Personal Information</h3>
                <p className="mt-0.5 text-xs text-[#806C63]">Your basic account information</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
                <User size={18} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
              {[
                { label: 'Full Name', value: user.name, icon: User },
                { label: 'Email Address', value: user.email, icon: Mail },
                { label: 'Phone Number', value: user.phone, icon: Phone },
                { label: 'Account Status', value: user.status || 'Active', icon: ShieldCheck, status: true },
              ].map(({ label, value, icon: Icon, status }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-3.5 transition-all duration-200 hover:border-[#D8C8BF] hover:bg-[#F7EEE7]">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status ? 'bg-[#EAF6EF] text-[#3E8B62]' : 'bg-[#FFFDFC] text-[#8E181F]'}`}>
                    <Icon size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9A857B]">{label}</p>
                    <p className={`mt-1 truncate text-sm font-bold ${status ? 'text-[#3E8B62]' : 'text-[#351C18]'}`}>{value || 'Not added'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ADDRESS */}
          <section className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_6px_24px_rgba(73,54,49,0.06)]">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-4 border-b border-[#E8DDD4] bg-linear-to-r from-[#FFFDFC] via-[#FBF7F2] to-[#F7EEE7] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-md shadow-[#7D171C]/15">
                  <MapPin size={18} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-[#351C18]">Delivery Address</h3>
                  <p className="mt-0.5 truncate text-xs text-[#806C63]">Where should we deliver your order?</p>
                </div>
              </div>

              {!showAddressForm && (
                <button
                  type="button"
                  onClick={() => {
                    resetAddressForm()
                    setEditingAddressId(null)
                    setShowAddressForm(true)
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-3.5 py-2.5 text-[11px] font-bold text-white shadow-sm shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Add New</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>

            {/* SAVED ADDRESSES */}
            {!showAddressForm && (
              <div className="space-y-3 p-5">
                {addressLoading ? (
                  <div className="animate-pulse rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-6 text-center">
                    <div className="mx-auto h-4 w-32 rounded bg-[#E2D5CC]" />
                    <div className="mx-auto mt-2 h-3 w-48 rounded bg-[#E8DDD4]" />
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#D8C8BF] bg-[#FBF7F2] p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F]">
                      <MapPin size={23} />
                    </div>

                    <p className="mt-3 text-sm font-extrabold text-[#351C18]">No saved address</p>
                    <p className="mt-1 text-xs text-[#806C63]">Add an address to use it during checkout.</p>

                    <button
                      type="button"
                      onClick={() => {
                        resetAddressForm()
                        setEditingAddressId(null)
                        setShowAddressForm(true)
                      }}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#7D171C] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#A51D26]"
                    >
                      <Plus size={14} />
                      Add Address
                    </button>
                  </div>
                ) : (
                  addresses.map((address) => {
                    const isDefault = address.isDefault

                    return (
                      <div key={address._id} className={`rounded-xl border p-4 transition-all duration-300 ${isDefault ? 'border-[#D9B7AF] bg-[#FFF7F5] shadow-sm' : 'border-[#E8DDD4] bg-[#FFFDFC] hover:border-[#D8C8BF] hover:bg-[#FBF7F2]'}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDefault ? 'bg-[#7D171C] text-white' : 'bg-[#F7EEE7] text-[#8E181F]'}`}>
                            <MapPin size={16} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-extrabold text-[#351C18]">{address.fullName}</p>

                              <span className={`rounded-md px-2 py-0.5 text-[9px] font-bold ${isDefault ? 'bg-[#F7EEE7] text-[#8E181F]' : 'bg-[#F7F2EE] text-[#806C63]'}`}>{address.addressType}</span>

                              {isDefault && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-[#EAF6EF] px-2 py-0.5 text-[9px] font-bold text-[#3E8B62]">
                                  <CheckCircle2 size={10} />
                                  Default
                                </span>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                              <span className="flex items-center gap-1 text-[10px] font-semibold text-[#806C63]">
                                <Phone size={11} />
                                {address.phone}
                              </span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-[#67544D]">
                              {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                            </p>

                            {address.landmark && (
                              <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#9A857B]">
                                <Navigation size={10} />
                                <span>Near {address.landmark}</span>
                              </div>
                            )}

                            <div className="mt-3 flex items-center gap-2 border-t border-[#E8DDD4] pt-3">
                              <button
                                type="button"
                                onClick={() => startEditAddress(address)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] px-3 py-1.5 text-[10px] font-bold text-[#67544D] transition-all hover:border-[#BFA49A] hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                              >
                                <Pencil size={12} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(address._id)}
                                disabled={addressDeleting}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E7C8C8] bg-[#FFFDFC] px-3 py-1.5 text-[10px] font-bold text-[#A51D26] transition hover:bg-[#FCEBEC] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <X size={12} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* ADDRESS FORM */}
            {showAddressForm && (
              <form onSubmit={editingAddressId ? handleEditAddress : handleAddAddress} className="space-y-4 p-5">
                <div className="flex items-center justify-between border-b border-[#E8DDD4] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-1 rounded-full bg-[#8E181F]" />
                      <h3 className="text-sm font-extrabold text-[#351C18]">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h3>
                    </div>
                    <p className="mt-1 ml-3 text-[11px] text-[#806C63]">{editingAddressId ? 'Update your delivery address details' : 'Add a new delivery address'}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      resetAddressForm()
                      setEditingAddressId(null)
                      setShowAddressForm(false)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#806C63] transition hover:bg-[#F7EEE7] hover:text-[#8E181F]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* NAME + PHONE */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#67544D]">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                      <input
                        type="text"
                        name="fullName"
                        value={addressForm.fullName}
                        onChange={handleAddressChange}
                        placeholder="Enter full name"
                        required
                        className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] pl-9 pr-3 text-xs text-[#351C18] outline-none transition placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#67544D]">Phone Number</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                      <input
                        type="tel"
                        name="phone"
                        value={addressForm.phone}
                        onChange={handleAddressChange}
                        placeholder="Enter phone number"
                        required
                        className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] pl-9 pr-3 text-xs text-[#351C18] outline-none transition placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                      />
                    </div>
                  </div>
                </div>

                {/* ADDRESS */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#67544D]">Address</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-[#A89890]" />
                    <textarea
                      name="addressLine"
                      value={addressForm.addressLine}
                      onChange={handleAddressChange}
                      placeholder="House no., building, street, area"
                      rows={2}
                      required
                      className="w-full resize-none rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] py-2.5 pl-9 pr-3 text-xs text-[#351C18] outline-none transition placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                    />
                  </div>
                </div>

                {/* CITY / STATE / PINCODE */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#67544D]">City</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                      <input
                        type="text"
                        name="city"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        required
                        className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] pl-9 pr-3 text-xs text-[#351C18] outline-none transition focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#67544D]">State</label>
                    <div className="relative">
                      <MapPinned size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                      <input
                        type="text"
                        name="state"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        required
                        className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] pl-9 pr-3 text-xs text-[#351C18] outline-none transition focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold text-[#67544D]">Pincode</label>
                    <div className="relative">
                      <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                      <input
                        type="text"
                        name="pincode"
                        value={addressForm.pincode}
                        onChange={handleAddressChange}
                        placeholder="Pincode"
                        required
                        className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] pl-9 pr-3 text-xs text-[#351C18] outline-none transition focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                      />
                    </div>
                  </div>
                </div>

                {/* LANDMARK */}
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold text-[#67544D]">
                    Landmark
                    <span className="ml-1 font-normal text-[#A89890]">(Optional)</span>
                  </label>

                  <div className="relative">
                    <Navigation size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                    <input
                      type="text"
                      name="landmark"
                      value={addressForm.landmark}
                      onChange={handleAddressChange}
                      placeholder="Nearby landmark"
                      className="h-10 w-full rounded-xl border border-[#E2D5CC] bg-[#FBF7F2] pl-9 pr-3 text-xs text-[#351C18] outline-none transition placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                    />
                  </div>
                </div>

                {/* ADDRESS TYPE */}
                <div>
                  <label className="mb-2 block text-[11px] font-bold text-[#67544D]">Address Type</label>

                  <div className="flex flex-wrap gap-2">
                    {addressTypeData.map(({ name, icon: Icon }) => {
                      const isActive = addressForm.addressType === name

                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setAddressForm((prev) => ({ ...prev, addressType: name }))}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[11px] font-bold transition-all duration-200 ${isActive ? 'border-[#8E181F] bg-[#F7EEE7] text-[#8E181F] shadow-sm' : 'border-[#E2D5CC] bg-[#FFFDFC] text-[#806C63] hover:border-[#CDAFA4] hover:bg-[#FBF7F2]'}`}
                        >
                          <Icon size={14} />
                          {name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* FORM BUTTONS */}
                <div className="flex flex-wrap justify-end gap-2 border-t border-[#E8DDD4] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      resetAddressForm()
                      setEditingAddressId(null)
                      setShowAddressForm(false)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2D5CC] bg-[#FFFDFC] px-4 py-2.5 text-[11px] font-bold text-[#67544D] transition hover:bg-[#F7EEE7]"
                  >
                    <X size={14} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={addressSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 py-2.5 text-[11px] font-bold text-white shadow-sm shadow-[#7D171C]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Save size={14} />
                    {addressSaving ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* SECURITY */}
          <section className="relative overflow-hidden rounded-2xl border border-[#E6D5C5] bg-linear-to-r from-[#FFF9F2] to-[#F7EEE7] p-5 shadow-[0_5px_20px_rgba(73,54,49,0.04)]">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A373]/10" />

            <div className="relative flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFFDFC] text-[#8E181F] shadow-sm">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h3 className="font-extrabold text-[#351C18]">Your account is secure</h3>
                <p className="mt-1 text-xs leading-5 text-[#806C63]">Keep your email and phone number updated to protect your MineKart account and receive important order updates.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
