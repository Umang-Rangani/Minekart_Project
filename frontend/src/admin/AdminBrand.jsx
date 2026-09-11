import React, { useEffect, useRef, useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, Tag, Image as ImageIcon } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { deleteFile, uploadFile } from '../utils/uploadFile'

export default function AdminBrand() {
  const [brands, setBrands] = useState([])

  const [brandData, setBrandData] = useState({
    brandName: '',
    brandLogo: '',
    description: '',
    status: 'Active',
  })

  const [search, setSearch] = useState('')

  // ! img1. state
  const fileInputRef = useRef(null)

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  //   ! error & success
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ! Form
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  // ! Loading
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(null)

  // ! Get Brands
  const getBrands = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get('/brand')

      setBrands(res.data.data || [])
    } catch (error) {
      console.log('Get brands error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ! Get Brands on Page Load
  useEffect(() => {
    getBrands()
  }, [])

  // ! Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target

    setBrandData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  //  ! img2.
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image')
      return
    }

    setImageFile(file)

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    setError('')
  }

  const resetForm = () => {
    setBrandData({
      brandName: '',
      brandLogo: '',
      description: '',
      status: 'Active',
    })

    //  img3.
    setImageFile(null)
    setPreview('')
    setError('')
    setSuccess('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setEditId(null)
  }

  // ! Open Create Form
  const openCreateForm = () => {
    resetForm()
    setShowForm(true)
  }

  // ! Close Form
  const closeForm = () => {
    setShowForm(false)
    resetForm()
  }

  // ! Edit Brand
  const editHandle = (brand) => {
    setBrandData({
      brandName: brand.brandName || '',
      brandLogo: brand.brandLogo || '',
      description: brand.description || '',
      status: brand.status || 'Active',
    })

    // img4.
    setImageFile(null)

    // Existing image preview
    setPreview(brand.brandLogo ? `http://localhost:3000${brand.brandLogo}` : '')

    setError('')
    setSuccess('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setEditId(brand._id)
    setShowForm(true)
  }

  // ! Submit Form
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      // img5.
      // ! Upload Logo
      let logoPath = brandData.brandLogo

      if (imageFile) {
        try {
          logoPath = await uploadFile(imageFile.name, imageFile, 'Logo')
        } catch (uploadError) {
          console.log('Upload Error:', uploadError.response?.data || uploadError.message)

          setError('Logo photo upload failed')
          return
        }
      }

      // ! Final Brand Data
      const BrandData = {
        ...brandData,
        brandLogo: logoPath,
      }

      // ! Edit
      if (editId) {
        await axiosInstance.put(`/brand/${editId}`, BrandData)
      } else {
        // ! Create
        await axiosInstance.post('/brand', BrandData)
      }

      await getBrands()

      setSuccess(editId ? 'Brand updated successfully' : 'Brand created successfully')

      closeForm()
    } catch (error) {
      console.log('Brand submit error:', error.response?.data || error.message)

      setError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // ! Delete Brand

  const deleteHandle = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this brand?')

    if (!confirmDelete) return

    try {
      setDeleteLoading(id)

      // 1. Delete brand file
      const brand = brands.find((item) => item._id === id)

      if (brand?.brandLogo) {
        await deleteFile(brand.brandLogo)
      }

      // 2. Delete brand from MongoDB
      await axiosInstance.delete(`/brand/${id}`)

      // 3. Update UI
      setBrands((prev) => prev.filter((brand) => brand._id !== id))
    } catch (error) {
      console.log('Delete brand error:', error.response?.data || error.message)
    } finally {
      setDeleteLoading(null)
    }
  }

  // ! Search Filter
  const filteredBrands = brands.filter((brand) => brand.brandName?.toLowerCase().includes(search.toLowerCase()))

  //   console.log('imageFile', imageFile)
    console.log('preview', preview )

  return (
    <div className="min-h-[calc(100vh-70px)]">
      {/*  HEADER  */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#6B6258]">
              <Tag size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#292725]">Brands</h1>

              <p className="mt-0.5 text-sm text-[#99938B]">Manage your store brands</p>
            </div>
          </div>
        </div>

        {/* Add Brand */}
        <button type="button" onClick={openCreateForm} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3F3A35]">
          <Plus size={18} />
          Add Brand
        </button>
      </div>

      {/* Create Brand post & Edit Brand put */}
      {showForm && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
          {/* Form Header */}
          <div className="flex items-center justify-between border-b border-[#E3DED6] bg-[#F7F7F5] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#292725]">{editId ? 'Edit Brand' : 'Create Brand'}</h2>

              <p className="mt-0.5 text-xs text-[#99938B]">{editId ? 'Update brand information' : 'Add a new store brand'}</p>
            </div>

            <button type="button" onClick={closeForm} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              <X size={19} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={submitHandle} className="p-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/*  LEFT SIDE  */}
              <div className="space-y-5">
                {/* Brand Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Brand Name</label>

                  <input
                    type="text"
                    name="brandName"
                    value={brandData.brandName}
                    onChange={handleChange}
                    placeholder="e.g. Samsung"
                    required
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Description</label>

                  <textarea
                    name="description"
                    value={brandData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter brand description..."
                    className="w-full resize-none rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Status</label>

                  <select
                    name="status"
                    value={brandData.status}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/*  RIGHT SIDE IMG  */}
              <div className="flex flex-col gap-5">
                {/* Logo Preview */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Logo Preview</label>

                  <div className="flex h-53 w-full items-center justify-center overflow-hidden rounded-xl border border-[#E3DED6] bg-[#F7F7F5]">
                    {preview ? (
                      <img src={preview} alt="Brand Preview" className="h-full w-full object-contain p-8" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#99938B]">
                        <ImageIcon size={35} strokeWidth={1.5} />

                        <p className="mt-2 text-sm">Logo preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Brand Logo */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Brand Logo</label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    name="brandLogo"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="h-14 w-full cursor-pointer rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-[#EEEAE4] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#6B6258] hover:file:bg-[#E3DED6] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />

                  {imageFile && <p className="mt-2 text-xs text-[#99938B]">Selected: {imageFile.name}</p>}
                </div>
              </div>
            </div>

            {/*  BUTTONS  */}
            <div className="mt-6 flex justify-end gap-3 border-t border-[#E3DED6] pt-5">
              <button type="button" onClick={closeForm} className="h-10 rounded-xl border border-[#E3DED6] bg-white px-5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4]">
                Cancel
              </button>

              <button type="submit" disabled={loading} className="h-10 rounded-xl bg-[#6B6258] px-6 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Saving...' : editId ? 'Update Brand' : 'Create Brand'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* All Brands table */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
        {/* Table Top */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#292725]">All Brands</h2>

            <p className="mt-0.5 text-xs text-[#99938B]">{filteredBrands.length} brands</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-70">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brand..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F7F7F5] pl-10 pr-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-187">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F7F7F5]">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Logo</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Brand</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Description</th>

                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-[#99938B]">Status</th>

                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-[#99938B]">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading && brands.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    Loading brands...
                  </td>
                </tr>
              ) : filteredBrands.length === 0 ? (
                /* Empty */
                <tr>
                  <td colSpan="5" className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[#EEEAE4] text-[#99938B]">
                        <Tag size={22} />
                      </div>

                      <p className="text-sm font-medium text-[#6F6A64]">No brands found</p>

                      <p className="mt-1 text-xs text-[#99938B]">Create your first brand</p>
                    </div>
                  </td>
                </tr>
              ) : (
                /* Brand List */
                filteredBrands.map((brand) => (
                  <tr key={brand._id} className="border-b border-[#E3DED6] transition last:border-b-0 hover:bg-[#F7F7F5]">
                    {/* Logo */}
                    <td className="px-5 py-4">
                      <div className="flex w-12 h-10 items-center justify-center overflow-hidden  shadow-2xl ">
                        {brand.brandLogo ? <img src={`http://localhost:3000${brand.brandLogo}`} alt={brand.brandName} className="h-full w-full object-contain border border-[#E3DED6]" /> : <ImageIcon size={20} className="text-[#99938B]" />}
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[#292725]">{brand.brandName}</p>
                    </td>

                    {/* Description */}
                    <td className="max-w-75 px-5 py-4">
                      <p className="truncate text-sm text-[#6F6A64]">{brand.description || 'No description'}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${brand.status === 'Active' ? 'bg-[#E8F0E8] text-[#4F684F]' : 'bg-[#F3E8E6] text-[#8A554E]'}`}>{brand.status}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {/* Edit */}
                        <button type="button" onClick={() => editHandle(brand)} className="flex size-9 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#6B6258] transition hover:bg-[#EEEAE4]" title="Edit">
                          <Pencil size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => deleteHandle(brand._id)}
                          disabled={deleteLoading === brand._id}
                          className="flex size-9 items-center justify-center rounded-lg border border-[#E3DED6] bg-white text-[#9A5A53] transition hover:bg-[#F3E8E6] disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
