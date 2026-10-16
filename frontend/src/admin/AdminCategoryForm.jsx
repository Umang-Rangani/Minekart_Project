import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile, deleteFile } from '../utils/uploadFile'
import AdminBreadCrumb from './AdminBreadCrumb'
import toast from 'react-hot-toast'

const resetCategoryData = {
  categoryName: '',
  categoryImage: '',
  description: '',
  status: 'Active',
}

export default function AdminCategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)

  const [categoryData, setCategoryData] = useState(resetCategoryData)

  const [preview, setPreview] = useState('')
  const [imageFile, setImageFile] = useState(null)

  const fileInputRef = useRef(null)

  const getCategory = async () => {
    try {
      setPageLoading(true)

      const res = await axiosInstance.get(`/category/${id}`)

      const category = res.data.data

      setCategoryData({
        categoryName: category.categoryName || '',
        categoryImage: category.categoryImage || '',
        description: category.description || '',
        status: category.status || 'Active',
      })

      setPreview(getImageUrl(category.categoryImage))
    } catch (error) {
      console.error('Get category error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to load category')
    } finally {
      setPageLoading(false)
    }
  }

  useEffect(() => {
    if (isEdit) {
      getCategory()
    } else {
      setCategoryData(resetCategoryData)
      setPreview('')
      setImageFile(null)
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target

    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image')
      return
    }

    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }

    setImageFile(file)

    const previewUrl = URL.createObjectURL(file)

    setPreview(previewUrl)

    e.target.value = ''
  }

  const removeImage = async () => {
    if (!preview) return

    try {
      if (!imageFile && categoryData.categoryImage) {
        await deleteFile(categoryData.categoryImage)

        setCategoryData((prev) => ({
          ...prev,
          categoryImage: '',
        }))
      }

      if (imageFile) {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }

        setImageFile(null)
      }

      setPreview('')

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Remove category image error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to remove image')
    }
  }

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      let imagePath = categoryData.categoryImage

      if (imageFile) {
        imagePath = await uploadFile(imageFile.name, imageFile, 'Category')
      }

      const payload = {
        categoryName: categoryData.categoryName,
        categoryImage: imagePath,
        description: categoryData.description,
        status: categoryData.status,
      }

      if (isEdit) {
        const oldImage = categoryData.categoryImage

        await axiosInstance.put(`/category/${id}`, payload)

        if (imageFile && oldImage) {
          try {
            await deleteFile(oldImage)
          } catch (error) {
            console.error('Delete old category image error:', error.response?.data || error.message)
          }
        }

        toast.success('Category updated successfully')
      } else {
        await axiosInstance.post('/category', payload)

        toast.success('Category created successfully')
      }

      navigate('/admin/category')
    } catch (error) {
      console.error('Submit category error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  const closeForm = () => {
    navigate('/admin/category')
  }

  if (pageLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm font-medium text-mk-muted-admin">Loading category...</div>
      </div>
    )
  }

  const items = isEdit
    ? [
        {
          title: 'Categories',
          link: '/admin/category',
        },
        {
          title: categoryData.categoryName,
          link: `/admin/category/${id}`,
        },
        {
          title: 'update',
          link: null,
        },
      ]
    : [
        {
          title: 'Categories',
          link: '/admin/category',
        },
        {
          title: 'new',
          link: null,
        },
      ]

  return (
    <div className="space-y-6">
      <AdminBreadCrumb items={items} />

      <div className="overflow-hidden rounded-2xl border border-mk-border-admin bg-white shadow-sm">
        <form onSubmit={submitHandle} className="p-6 lg:p-7">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-mk-ink-admin">Category Information</h3>

              <p className="mt-1 text-sm text-mk-subtle">Add your category details and image.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
              <section>
                <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Category Image</label>

                <div className="rounded-2xl border border-mk-border-admin bg-mk-bg-admin p-4">
                  <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-mk-border-admin bg-white">
                    {preview ? (
                      <>
                        <img src={preview} alt="Category" className="h-full w-full object-contain p-7" />

                        <button type="button" onClick={removeImage} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-mk-danger text-white shadow-md transition hover:bg-mk-primary">
                          <X size={15} strokeWidth={2.5} />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="flex h-full w-full flex-col items-center justify-center rounded-xl text-mk-muted-admin transition hover:bg-mk-bg">
                        <div className="flex size-16 items-center justify-center rounded-2xl bg-mk-surface">
                          <Plus size={30} strokeWidth={1.7} className="text-mk-admin" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-mk-ink-admin">Upload Image</p>

                        <p className="mt-1 text-xs text-mk-subtle">Click to select an image</p>
                      </button>
                    )}
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-medium text-mk-muted-admin">Recommended size</p>

                    <p className="mt-1 text-xs text-mk-subtle">Square image • PNG, JPG, WEBP</p>
                  </div>

                  {preview && (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-4 h-10 w-full rounded-xl border border-mk-border-admin bg-white px-4 text-sm font-medium text-mk-muted-admin transition hover:bg-mk-surface">
                      Change Image
                    </button>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>
              </section>

              <section className="min-w-0">
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Category Name</label>

                    <input
                      type="text"
                      name="categoryName"
                      value={categoryData.categoryName}
                      onChange={handleChange}
                      placeholder="e.g. Electronics"
                      required
                      className="h-14 w-full rounded-xl border border-mk-border-admin bg-white px-4 text-sm text-mk-ink-admin outline-none transition placeholder:text-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-surface"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Status</label>

                    <select
                      name="status"
                      value={categoryData.status}
                      onChange={handleChange}
                      className="h-14 w-full rounded-xl border border-mk-border-admin bg-white px-4 text-sm text-mk-ink-admin outline-none transition focus:border-mk-admin focus:ring-2 focus:ring-mk-surface"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-mk-ink-admin">Description</label>

                    <textarea
                      name="description"
                      value={categoryData.description}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Enter category description..."
                      className="w-full resize-none rounded-xl border border-mk-border-admin bg-white px-4 py-3 text-sm leading-6 text-mk-ink-admin outline-none transition placeholder:text-mk-subtle focus:border-mk-admin focus:ring-2 focus:ring-mk-surface"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-mk-border-admin pt-6">
            <button type="button" onClick={closeForm} className="h-11 rounded-xl border border-mk-border-admin bg-white px-6 text-sm font-medium text-mk-muted-admin transition hover:bg-mk-surface">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="h-11 rounded-xl bg-mk-admin px-7 text-sm font-semibold text-white transition hover:bg-mk-ink-admin disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
