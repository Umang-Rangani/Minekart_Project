import { getImageUrl } from '../utils/imageUrl'
import React, { useState, useEffect } from 'react'
import { MapPin, Mail, Plus, CheckCircle2, User, Phone, Building2, ShieldCheck, Navigation, Home, Pencil, BriefcaseBusiness, MapPinned, X, Save, ShoppingCart, ChevronRight, Package, Camera, ArrowRight, MoreVertical, Trash2 } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { axiosInstance } from '../config/axiosConfig'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function Profile() {
  const { user } = useUser()
  const { cart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

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
  const [showProfileImageViewer, setShowProfileImageViewer] = useState(false)

  const [openAddressMenu, setOpenAddressMenu] = useState(null)

  const fromCheckout = new URLSearchParams(location.search).get('fromcheckout') === 'true'

  const cartCount = cart?.totalQuantity || cart?.items?.length || 0
  const items = [{ title: 'Profile', link: null }]

  const initials =
    user?.name
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

  const formFields = [
    { label: 'Full Name', name: 'fullName', placeholder: 'Enter full name', icon: User, required: true },
    { label: 'Phone Number', name: 'phone', placeholder: 'Enter phone number', icon: Phone, required: true, type: 'tel' },
    { label: 'City', name: 'city', placeholder: 'City', icon: Building2, required: true },
    { label: 'State', name: 'state', placeholder: 'State', icon: MapPinned, required: true },
    { label: 'Pincode', name: 'pincode', placeholder: 'Pincode', icon: Navigation, required: true },
    { label: 'Landmark', name: 'landmark', placeholder: 'Nearby landmark', icon: MapPin, required: false },
  ]

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
    window.scrollTo({ top: 0, behavior: 'smooth' })

    if (user) {
      getAddresses()
      document.title = 'My Profile | MineKart'
    }
  }, [user])

  useEffect(() => {
    if (!showProfileImageViewer) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setShowProfileImageViewer(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showProfileImageViewer])

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: value }))
  }

  const openAddAddress = () => {
    resetAddressForm()
    setEditingAddressId(null)
    setShowAddressForm(true)
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

  const closeAddressForm = () => {
    resetAddressForm()
    setEditingAddressId(null)
    setShowAddressForm(false)
  }

  const handleAddAddress = async (e) => {
    e.preventDefault()

    try {
      setAddressSaving(true)
      const res = await axiosInstance.post('/address', addressForm)

      if (res.data.success) {
        setAddresses((prev) => [res.data.data, ...prev])
        closeAddressForm()

        if (fromCheckout) navigate('/checkout')
      }
    } catch (error) {
      console.log('Add Address Error:', error.response?.data || error.message)
    } finally {
      setAddressSaving(false)
    }
  }

  const handleEditAddress = async (e) => {
    e.preventDefault()
    if (!editingAddressId) return

    try {
      setAddressSaving(true)
      const res = await axiosInstance.put(`/address/${editingAddressId}`, addressForm)

      if (res.data.success) {
        const updatedAddress = res.data.data

        setAddresses((prev) => prev.map((address) => (address._id === editingAddressId ? updatedAddress : address)))

        closeAddressForm()
      }
    } catch (error) {
      console.log('Update Address Error:', error.response?.data || error.message)
    } finally {
      setAddressSaving(false)
    }
  }

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return

    try {
      setAddressDeleting(true)
      const res = await axiosInstance.delete(`/address/${addressId}`)

      if (res.data.success) {
        setAddresses((prev) => prev.filter((address) => address._id !== addressId))

        if (editingAddressId === addressId) closeAddressForm()
      }
    } catch (error) {
      console.log('Delete Address Error:', error.response?.data || error.message)
    } finally {
      setAddressDeleting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#FBF7F2] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E8DDD4] bg-white p-8 text-center shadow-[0_8px_30px_rgba(73,54,49,0.07)] sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7EEE7] text-[#8E181F]">
            <User size={30} />
          </div>
          <h2 className="mt-5 text-xl font-extrabold text-[#351C18]">Profile not available</h2>
          <p className="mt-2 text-sm text-[#806C63]">Please login to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FBF7F2]">
      <BreadCrumb items={items} />

      <div className="mx-auto pb-8 pt-4 sm:pt-5">
        {/* PAGE HEADER */}
        <div className="mb-4 flex min-h-16 items-center justify-between gap-2 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white px-3 shadow-[0_3px_12px_rgba(73,54,49,0.05)] sm:mb-5 sm:px-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm sm:h-10 sm:w-10">
              <User size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold text-[#351C18] sm:text-sm">My Profile</h1>
              <p className="mt-0.5 truncate text-[9px] text-[#806C63] sm:text-[10px]">Manage your account and delivery details</p>
            </div>
          </div>
        </div>

        {/* PROFILE + ADDRESS LAYOUT */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)]">
          {/* PROFILE SIDEBAR */}
          <aside className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.06)]">
            <div className="relative h-20 overflow-hidden bg-linear-to-br from-[#351C18] via-[#67231F] to-[#A51D26] sm:h-24">
              <div className="absolute -right-10 -top-14 h-32 w-32 rounded-full border-20 border-white/5" />
              <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-[#D4A373]/10" />
              <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/15 px-2.5 py-1 backdrop-blur-md">
                <ShieldCheck size={12} className="text-[#E7C9A7]" />
                <span className="text-[9px] font-bold text-white/90">{user.role || 'User'}</span>
              </div>
            </div>

            <div className="px-3 pb-4 sm:px-5 sm:pb-5">
              <div className="-mt-9 flex items-end justify-between gap-3 sm:-mt-11">
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => user.avatar && setShowProfileImageViewer(true)}
                    disabled={!user.avatar}
                    aria-label="View profile photo"
                    className={`relative flex h-18 w-18 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#F7EEE7] text-lg font-extrabold text-[#8E181F] shadow-lg sm:h-22 sm:w-22 ${user.avatar ? 'cursor-zoom-in transition hover:scale-[1.03]' : 'cursor-default'}`}
                  >
                    {user.avatar ? <img src={getImageUrl(user.avatar)} alt={user.name || 'Profile'} className="h-full w-full object-cover" /> : initials}
                  </button>
                  <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white bg-[#3E8B62]" />
                </div>
                <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#EAF6EF] px-2.5 py-1 text-[9px] font-bold text-[#3E8B62]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3E8B62]" />
                  {user.status || 'Active'}
                </span>
              </div>

              <div className="mt-3">
                <h2 className="truncate text-base font-extrabold text-[#351C18] sm:text-lg">{user.name || 'User'}</h2>
                <p className="mt-0.5 text-[10px] font-medium text-[#9A857B] sm:text-[11px]">{user.role || 'Customer'}</p>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2 border-t border-[#EEE5DF] pt-3">
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#FBF7F2] px-2.5 py-2.5 sm:px-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <Mail size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Email</p>
                    <p className="mt-0.5 truncate text-[11px] font-bold text-[#351C18] sm:text-xs">{user.email || 'Not added'}</p>
                  </div>
                </div>
                <div className="flex min-w-0 items-center gap-2.5 rounded-xl bg-[#FBF7F2] px-2.5 py-2.5 sm:px-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <Phone size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#9A857B]">Phone</p>
                    <p className="mt-0.5 truncate text-[11px] font-bold text-[#351C18] sm:text-xs">{user.phone || 'Not added'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-[#EEE5DF] pt-3">
                <button type="button" onClick={() => navigate('/orders')} className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-[#FBF7F2]">
                  <span className="flex items-center gap-2.5">
                    <Package size={15} className="text-[#8E181F]" />
                    <span className="text-xs font-bold text-[#67544D] group-hover:text-[#8E181F]">My Orders</span>
                  </span>
                  <ChevronRight size={14} className="text-[#A89890] transition-transform group-hover:translate-x-0.5 group-hover:text-[#8E181F]" />
                </button>

                <button type="button" onClick={() => navigate('/cart')} className="group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-[#FBF7F2]">
                  <span className="flex items-center gap-2.5">
                    <ShoppingCart size={15} className="text-[#8E181F]" />

                    <span className="text-xs font-bold text-[#67544D] group-hover:text-[#8E181F]">My Cart</span>
                  </span>

                  <span className="flex items-center gap-2">
                    {cartCount > 0 && <span className="rounded-full bg-[#F7EEE7] px-2 py-0.5 text-[10px] font-extrabold text-[#8E181F]">{cartCount}</span>}

                    <ChevronRight size={14} className="text-[#A89890] transition-transform group-hover:translate-x-0.5 group-hover:text-[#8E181F]" />
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* DELIVERY ADDRESSES */}
          <main className="min-w-0">
            <section className="overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-[0_4px_18px_rgba(73,54,49,0.05)]">
              <div className="flex items-center gap-3 border-b border-[#EEE5DF] px-3.5 py-3 sm:px-5 sm:py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-sm sm:h-10 sm:w-10">
                  <MapPin size={17} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-[#351C18] sm:text-base">Delivery Addresses</h3>
                  <p className="mt-0.5 text-[9px] text-[#806C63] sm:text-xs">
                    {addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>

              {/* LEFT ADDRESS LIST + RIGHT ACTION / FORM */}
              <div className="grid grid-cols-1 items-start gap-0 md:grid-cols-2">
                {/* LEFT SIDE: ADDRESS LIST */}
                <div className="space-y-3 border-b border-[#EEE5DF] p-3 sm:p-5 md:border-b-0 md:border-r">
                  {addressLoading ? (
                    <div className="animate-pulse rounded-xl border border-[#E8DDD4] bg-[#FBF7F2] p-4">
                      <div className="h-3 w-32 rounded bg-[#E2D5CC]" />
                      <div className="mt-3 h-3 w-full rounded bg-[#E8DDD4]" />
                      <div className="mt-2 h-3 w-2/3 rounded bg-[#E8DDD4]" />
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#D8C8BF] bg-[#FBF7F2] px-4 py-8 text-center">
                      <MapPin size={24} className="mx-auto text-[#8E181F]" />
                      <p className="mt-3 text-xs font-extrabold text-[#351C18]">No saved addresses</p>
                      <p className="mt-1 text-[10px] text-[#806C63]">Add an address using the panel on the right.</p>
                    </div>
                  ) : (
                    addresses.map((address) => (
                      <div key={address._id} className={`rounded-xl border p-3 transition-all ${address.isDefault ? 'border-[#D9B7AF] bg-[#FFF8F6]' : 'border-[#E8DDD4] bg-white hover:bg-[#FBF7F2]'}`}>
                        <div className="flex items-start gap-2.5">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${address.isDefault ? 'bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white' : 'bg-[#F7EEE7] text-[#8E181F]'}`}>
                            <MapPin size={15} />
                          </div>

                          <div className="min-w-0 flex-1">
                            {/* HEADER */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                                <p className="text-xs font-extrabold text-[#351C18]">{address.fullName}</p>

                                <span className="rounded-md bg-[#F7EEE7] px-1.5 py-0.5 text-[8px] font-bold text-[#8E181F]">{address.addressType || 'Home'}</span>

                                {address.isDefault && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-[#EAF6EF] px-1.5 py-0.5 text-[8px] font-bold text-[#3E8B62]">
                                    <CheckCircle2 size={10} />
                                    Default
                                  </span>
                                )}
                              </div>

                              {/* DROPDOWN - HEADER RIGHT */}
                              <div className="relative -mt-1 -mr-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setOpenAddressMenu(openAddressMenu === address._id ? null : address._id)}
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${openAddressMenu === address._id ? 'bg-[#F7EEE7] text-[#8E181F]' : 'text-[#806C63] hover:bg-[#F7EEE7] hover:text-[#8E181F]'}`}
                                  aria-label="Address options"
                                >
                                  <MoreVertical size={17} />
                                </button>

                                {openAddressMenu === address._id && (
                                  <div className="absolute right-10 top-0 z-30 w-40 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white p-1.5 shadow-lg shadow-[#493631]/10">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenAddressMenu(null)
                                        startEditAddress(address)
                                      }}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-[#67544D] transition hover:bg-[#FBF7F2] hover:text-[#8E181F]"
                                    >
                                      <Pencil size={14} />
                                      Edit Address
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenAddressMenu(null)
                                        handleDeleteAddress(address._id)
                                      }}
                                      disabled={addressDeleting}
                                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-[#A51D26] transition hover:bg-[#FCEBEC] disabled:opacity-50"
                                    >
                                      <Trash2 size={14} />
                                      Delete Address
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* ADDRESS DETAILS */}
                            <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#806C63]">
                              <Phone size={10} />
                              {address.phone}
                            </p>

                            <p className="mt-2 text-[10px] leading-5 text-[#67544D]">
                              {address.addressLine}, {address.city}, {address.state} - {address.pincode}
                            </p>

                            {address.landmark && <p className="mt-1 text-[9px] text-[#9A857B]">Near {address.landmark}</p>}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* RIGHT SIDE: ADD CARD OR FORM */}
                <div className="min-w-0 p-3 sm:p-5">
                  {!showAddressForm ? (
                    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C8BF] bg-[#FBF7F2] p-5 text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7EEE7] text-[#8E181F]">
                        <MapPinned size={25} />
                      </div>
                      <h4 className="mt-4 text-sm font-extrabold text-[#351C18]">Add New Address</h4>
                      <p className="mt-1.5 max-w-xs text-[10px] leading-5 text-[#806C63]">Save your delivery address for a faster and easier checkout.</p>
                      <button
                        type="button"
                        onClick={openAddAddress}
                        className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7D171C] to-[#A51D26] px-4 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <Plus size={15} />
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={editingAddressId ? handleEditAddress : handleAddAddress} className="space-y-3">
                      <div className="flex items-start justify-between gap-2 border-b border-[#EEE5DF] pb-3">
                        <div>
                          <h4 className="text-sm font-extrabold text-[#351C18]">{editingAddressId ? 'Edit Address' : 'Add New Address'}</h4>
                          <p className="mt-1 text-[10px] text-[#806C63]">{editingAddressId ? 'Update your saved details' : 'Enter your delivery details'}</p>
                        </div>
                        <button type="button" onClick={closeAddressForm} aria-label="Close address form" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#806C63] hover:bg-[#F7EEE7] hover:text-[#8E181F]">
                          <X size={16} />
                        </button>
                      </div>

                      {formFields.slice(0, 2).map((field) => {
                        const Icon = field.icon
                        return (
                          <div key={field.name}>
                            <label className="mb-1 block text-[10px] font-bold text-[#67544D]">{field.label}</label>
                            <div className="relative">
                              <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                              <input
                                type={field.type || 'text'}
                                name={field.name}
                                value={addressForm[field.name]}
                                onChange={handleAddressChange}
                                placeholder={field.placeholder}
                                required={field.required}
                                className="h-10 w-full rounded-lg border border-[#E2D5CC] bg-[#FBF7F2] pl-9 pr-3 text-xs text-[#351C18] outline-none placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                              />
                            </div>
                          </div>
                        )
                      })}

                      <div>
                        <label className="mb-1 block text-[10px] font-bold text-[#67544D]">Address</label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3 top-3 text-[#A89890]" />
                          <textarea
                            name="addressLine"
                            value={addressForm.addressLine}
                            onChange={handleAddressChange}
                            placeholder="House no., building, street, area"
                            rows={2}
                            required
                            className="w-full resize-none rounded-lg border border-[#E2D5CC] bg-[#FBF7F2] py-2.5 pl-9 pr-3 text-xs text-[#351C18] outline-none placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {formFields.slice(2, 5).map((field) => {
                          const Icon = field.icon
                          return (
                            <div key={field.name}>
                              <label className="mb-1 block text-[10px] font-bold text-[#67544D]">{field.label}</label>
                              <div className="relative">
                                <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                                <input
                                  type="text"
                                  name={field.name}
                                  value={addressForm[field.name]}
                                  onChange={handleAddressChange}
                                  placeholder={field.placeholder}
                                  required={field.required}
                                  className="h-10 w-full rounded-lg border border-[#E2D5CC] bg-[#FBF7F2] pl-8 pr-2 text-xs text-[#351C18] outline-none placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <div>
                        <label className="mb-1 block text-[10px] font-bold text-[#67544D]">
                          Landmark <span className="font-normal text-[#A89890]">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Navigation size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A89890]" />
                          <input
                            type="text"
                            name="landmark"
                            value={addressForm.landmark}
                            onChange={handleAddressChange}
                            placeholder="Nearby landmark"
                            className="h-10 w-full rounded-lg border border-[#E2D5CC] bg-[#FBF7F2] pl-8 pr-3 text-xs text-[#351C18] outline-none placeholder:text-[#A89890] focus:border-[#A51D26] focus:bg-white focus:ring-2 focus:ring-[#F2D9D6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[10px] font-bold text-[#67544D]">Address Type</label>
                        <div className="grid grid-cols-3 gap-2">
                          {addressTypeData.map(({ name, icon: Icon }) => {
                            const isActive = addressForm.addressType === name
                            return (
                              <button
                                key={name}
                                type="button"
                                onClick={() => setAddressForm((prev) => ({ ...prev, addressType: name }))}
                                className={`inline-flex min-h-9 items-center justify-center gap-1 rounded-lg border px-1.5 text-[10px] font-bold transition ${isActive ? 'border-[#8E181F] bg-[#F7EEE7] text-[#8E181F]' : 'border-[#E2D5CC] bg-white text-[#806C63] hover:bg-[#FBF7F2]'}`}
                              >
                                <Icon size={12} />
                                {name}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex flex-col-reverse gap-2 border-t border-[#EEE5DF] pt-3 sm:flex-row">
                        <button type="button" onClick={closeAddressForm} className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-white px-3 text-[11px] font-bold text-[#67544D] hover:bg-[#F7EEE7]">
                          <X size={13} />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={addressSaving}
                          className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-3 text-[11px] font-bold text-white shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save size={13} />
                          {addressSaving ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* SECURITY NOTE */}
            <section className="relative mt-4 overflow-hidden rounded-2xl border border-[#E6D5C5] bg-linear-to-r from-[#FFF9F2] to-[#F7EEE7] p-3.5 sm:p-5">
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#D4A373]/10" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#8E181F] shadow-sm sm:h-10 sm:w-10">
                  <ShieldCheck size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-extrabold text-[#351C18] sm:text-sm">Your account is secure</h3>
                  <p className="mt-1 text-[10px] leading-5 text-[#806C63] sm:text-xs">Keep your contact details updated to receive important order and delivery updates.</p>
                </div>
              </div>
            </section>

            {/* MOBILE QUICK NAVIGATION */}
            <div className="mt-4 grid grid-cols-2 gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => navigate('/orders')}
                className="flex min-h-11 items-center justify-between rounded-xl border border-[#E8DDD4] bg-white px-3 text-[10px] font-bold text-[#67544D] shadow-sm transition hover:bg-[#F7EEE7]"
              >
                <span className="flex items-center gap-2">
                  <Package size={15} className="text-[#8E181F]" />
                  My Orders
                </span>
                <ArrowRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="flex min-h-11 items-center justify-between rounded-xl border border-[#E8DDD4] bg-white px-3 text-[10px] font-bold text-[#67544D] shadow-sm transition hover:bg-[#F7EEE7]"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart size={15} className="text-[#8E181F]" />
                  My Cart
                </span>
                <ArrowRight size={13} />
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* PROFILE IMAGE VIEWER */}
      {showProfileImageViewer && user.avatar && (
        <div
          className="fixed inset-0 z-200 flex h-screen w-screen items-center justify-center overflow-hidden bg-white/35 p-4 backdrop-blur-md"
          onClick={() => setShowProfileImageViewer(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo preview"
        >
          <button
            type="button"
            onClick={() => setShowProfileImageViewer(false)}
            aria-label="Close image preview"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/75 text-[#351C18] shadow-[0_4px_16px_rgba(73,54,49,0.12)] backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:bg-white hover:text-[#8E181F] sm:right-6 sm:top-6"
          >
            <X size={19} />
          </button>
          <div className="relative flex max-h-[82vh] max-w-[90vw] items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={getImageUrl(user.avatar)}
              alt={user.name || 'Profile'}
              className="max-h-[78vh] max-w-[88vw] rounded-2xl object-contain shadow-[0_20px_60px_rgba(53,28,24,0.22)] sm:max-h-[80vh] sm:max-w-[82vw] md:max-w-[72vw] lg:max-w-[60vw] xl:max-w-[52vw]"
            />
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/70 bg-white/70 px-4 py-1.5 text-[10px] font-semibold text-[#67544D] shadow-sm backdrop-blur-md">Profile Photo</div>
          </div>
        </div>
      )}
    </div>
  )
}
