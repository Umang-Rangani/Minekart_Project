import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile, deleteFile } from '../utils/uploadFile'
import AdminBreadCrumb from './AdminBreadCrumb'
import toast from 'react-hot-toast'

const resetBrandData = {
  brandName: '',
  brandLogo: '',
  description: '',
  status: 'Active',
}

export default function AdminBrandForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)

  const [brandData, setBrandData] = useState(resetBrandData)

  const [preview, setPreview] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const fileInputRef = useRef(null)

  //  IMAGE URL
  //  GET BRAND
  const getBrand = async () => {
    try {
      setPageLoading(true)

      const res = await axiosInstance.get(`/brand/${id}`)

      const brand = res.data.data

      setBrandData({
        brandName: brand.brandName || '',
        brandLogo: brand.brandLogo || '',
        description: brand.description || '',
        status: brand.status || 'Active',
      })

      setPreview(getImageUrl(brand.brandLogo))
    } catch (error) {
      console.error('Get brand error:', error.response?.data || error.message)
    } finally {
      setPageLoading(false)
    }
  }

  //  INITIAL DATA
  useEffect(() => {
    if (isEdit) {
      getBrand()
    } else {
      setBrandData(resetBrandData)
      setPreview('')
      setImageFile(null)
    }
  }, [id])

  //  INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target

    setBrandData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  //  IMAGE CHANGE
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      return
    }

    setImageFile(file)

    const previewUrl = URL.createObjectURL(file)

    setPreview(previewUrl)

    e.target.value = ''
  }

  //  REMOVE IMAGE
  const removeImage = async () => {
    if (!preview) return

    try {
      // Existing logo
      if (!imageFile && brandData.brandLogo) {
        await deleteFile(brandData.brandLogo)

        setBrandData((prev) => ({
          ...prev,
          brandLogo: '',
        }))
      }

      // New image
      if (imageFile) {
        URL.revokeObjectURL(preview)
        setImageFile(null)
      }

      setPreview('')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Remove brand logo error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to remove logo')
    }
  }

  // SUBMIT
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      let logoPath = brandData.brandLogo

      // Upload new logo
      if (imageFile) {
        logoPath = await uploadFile(imageFile.name, imageFile, 'Logo')
      }

      const payload = {
        brandName: brandData.brandName,
        brandLogo: logoPath,
        description: brandData.description,
        status: brandData.status,
      }

      // UPDATE
      if (isEdit) {
        const oldLogo = brandData.brandLogo

        await axiosInstance.put(`/brand/${id}`, payload)

        // Delete old logo after successful update
        if (imageFile && oldLogo) {
          try {
            await deleteFile(oldLogo)
          } catch (error) {
            console.error('Delete old logo error:', error.response?.data || error.message)
          }
        }

        toast.success('Brand updated successfully')
      }

      // CREATE
      else {
        await axiosInstance.post('/brand', payload)

        toast.success('Brand created successfully')
      }

      navigate('/admin/brand')
    } catch (error) {
      console.error('Submit brand error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to save brand')
    } finally {
      setLoading(false)
    }
  }

  //  CANCEL
  const closeForm = () => {
    navigate('/admin/brand')
  }

  //  LOADING
  if (pageLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm font-medium text-mk-muted-admin">Loading brand...</div>
      </div>
    )
  }

  //  BREADCRUMB
  let items

  if (isEdit) {
    items = [
      {
        title: 'Brands',
        link: '/admin/brand',
      },
      {
        title: `${brandData.brandName}`,
        link: `/admin/brand/${id}`,
      },
      {
        title: 'update',
        link: null,
      },
    ]
  } else {
    items = [
      {
        title: 'Brands',
        link: '/admin/brand',
      },
      {
        title: 'new',
        link: null,
      },
    ]
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <AdminBreadCrumb items={items} />

      {/* FORM */}
      <div className="overflow-hidden rounded-2xl border border-mk-border-admin bg-white shadow-sm">
        <form onSubmit={submitHandle} className="p-6 lg:p-7">
          <div className="space-y-8">
            {/* FORM HEADER */}
            <div>
              <h3 className="text-lg font-semibold text-mk-ink-admin">Brand Information</h3>

              <p className="mt-1 text-sm text-mk-subtle">Add your brand details and logo.</p>
            </div>

            {/* MAIN FORM AREA */}
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
              {/*  BRAND LOGO  */}
              <section>
                <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Brand Logo</label>

                <div className="rounded-2xl border border-mk-border-admin bg-mk-bg-admin p-4">
                  {/* LOGO PREVIEW */}
                  <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-mk-border-admin bg-white">
                    {preview ? (
                      <>
                        <img src={preview} alt="Brand Logo" className="h-full w-full object-contain p-7" />

                        {/* REMOVE LOGO */}
                        <button type="button" onClick={removeImage} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-mk-danger text-white shadow-md transition hover:bg-mk-primary">
                          <X size={15} strokeWidth={2.5} />
                        </button>
                      </>
                    ) : (
                      /* ADD LOGO */
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center rounded-xl text-mk-muted-admin transition hover:bg-mk-bg">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-mk-surface">
                          <Plus size={30} strokeWidth={1.7} className="text-mk-admin" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-mk-ink-admin">Upload Logo</p>

                        <p className="mt-1 text-xs text-mk-subtle">Click to select an image</p>
                      </button>
                    )}
                  </div>

                  {/* LOGO INFO */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-mk-muted-admin">Recommended size</p>

                    <p className="mt-1 text-xs text-mk-subtle">Square logo • PNG, JPG, WEBP</p>
                  </div>

                  {/* CHANGE LOGO */}
                  {preview && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 h-10 w-full rounded-xl border border-mk-border-admin bg-white px-4 text-sm font-medium text-mk-muted-admin transition hover:bg-mk-surface">
                      Change Logo
                    </button>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </section>

              {/*  BRAND DETAILS  */}
              <section className="min-w-0">
                <div className="space-y-6">
                  {/* BRAND NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Brand Name</label>

                    <input
                      type="text"
                      name="brandName"
                      value={brandData.brandName}
                      onChange={handleChange}
                      placeholder="e.g. Samsung"
                      required
                      className="h-14 w-full rounded-xl border border-mk-border-admin bg-white px-4 text-sm text-mk-ink-admin outline-none transition placeholder:text-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-surface"
                    />
                  </div>

                  {/* STATUS */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Status</label>

                    <select
                      name="status"
                      value={brandData.status}
                      onChange={handleChange}
                      className="h-14 w-full rounded-xl border border-mk-border-admin bg-white px-4 text-sm text-mk-ink-admin outline-none transition focus:border-mk-admin focus:ring-2 focus:ring-mk-surface"
                    >
                      <option value="Active">Active</option>

                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Description</label>

                    <textarea
                      name="description"
                      value={brandData.description}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Enter brand description..."
                      className="w-full resize-none rounded-xl border border-mk-border-admin bg-white px-4 py-3 text-sm leading-6 text-mk-ink-admin outline-none transition placeholder:text-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-surface"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/*  ACTIONS  */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-mk-border-admin pt-6">
            <button type="button" onClick={closeForm} className="h-11 rounded-xl border border-mk-border-admin bg-white px-6 text-sm font-medium text-mk-muted-admin transition hover:bg-mk-surface">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="h-11 rounded-xl bg-mk-admin px-7 text-sm font-semibold text-white transition hover:bg-mk-ink-admin disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Update Brand' : 'Create Brand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
