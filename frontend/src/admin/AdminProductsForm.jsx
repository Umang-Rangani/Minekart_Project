import React, { useEffect, useRef, useState } from 'react'
import { Plus, X, ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile, deleteFile } from '../utils/uploadFile'
import AdminBreadCrumb from './AdminBreadCrumb'
import toast from 'react-hot-toast'

const resetProductData = {
  productName: '',
  slug: '',
  description: '',
  category: '',
  subCategory: '',
  brand: '',
  images: [],
  sizes: [],
  price: '',
  discount: 0,
  discountPrice: '',
  status: 'Active',
  homeSection: 'Normal',
  rating: 0,
  stock: 0,
  soldCount: 0,
  warranty: '',
  warrantyDuration: '',
  warrantyType: 'No Warranty',
  returnPolicy: '',
  deliveryInfo: '',
}

export default function AdminProductsForm() {
  const navigate = useNavigate()
  const { id } = useParams()

  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEdit)

  const [productData, setProductData] = useState(resetProductData)

  const [categories, setCategories] = useState([])
  const [subcategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [previewImages, setPreviewImages] = useState([])

  const fileInputRef = useRef(null)

  // GET CATEGORIES
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('/category')

      setCategories(res.data.data || [])
    } catch (error) {
      console.error('Get categories error:', error.response?.data || error.message)
    }
  }

  // GET SUBCATEGORIES
  const getSubCategories = async () => {
    try {
      const res = await axiosInstance.get('/subcategory')

      setSubCategories(res.data.data || [])
    } catch (error) {
      console.error('Get subcategories error:', error.response?.data || error.message)
    }
  }

  // GET BRANDS
  const getBrands = async () => {
    try {
      const res = await axiosInstance.get('/brand')

      setBrands(res.data.data || [])
    } catch (error) {
      console.error('Get brands error:', error.response?.data || error.message)
    }
  }

  // IMAGE URL
  const getImageUrl = (image) => {
    if (!image) return ''

    if (image.startsWith('http')) {
      return image
    }

    return `http://localhost:3000${image}`
  }

  // GET PRODUCT FOR EDIT

  const getProduct = async () => {
    try {
      setPageLoading(true)

      const res = await axiosInstance.get(`/product/${id}`)

      const product = res.data.data

      setProductData({
        productName: product.productName || '',
        slug: product.slug || '',
        description: product.description || '',

        category: product.category?._id || product.category || '',

        subCategory: product.subCategory?._id || product.subCategory || '',

        brand: product.brand?._id || product.brand || '',

        images: product.images || [],
        sizes: product.sizes || [],

        price: product.price ?? '',
        discount: product.discount ?? 0,
        discountPrice: product.discountPrice ?? '',

        status: product.status || 'Active',
        homeSection: product.homeSection || 'Normal',

        rating: product.rating ?? 0,
        stock: product.stock ?? 0,
        soldCount: product.soldCount ?? 0,

        warranty: product.warranty || '',
        warrantyDuration: product.warrantyDuration || '',
        warrantyType: product.warrantyType || 'No Warranty',

        returnPolicy: product.returnPolicy || '',
        deliveryInfo: product.deliveryInfo || '',
      })

      const existingImages = (product.images || []).map((imagePath) => ({
        url: getImageUrl(imagePath),
        type: 'existing',
        path: imagePath,
      }))

      setPreviewImages(existingImages)
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message)
    } finally {
      setPageLoading(false)
    }
  }

  // INITIAL DATA
  useEffect(() => {
    getCategories()
    getSubCategories()
    getBrands()

    if (isEdit) {
      getProduct()
    } else {
      setProductData(resetProductData)
      setPreviewImages([])
    }
  }, [id])

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // SIZE CHANGE
  const handleSizeChange = (size) => {
    setProductData((prev) => ({
      ...prev,

      sizes: prev.sizes.includes(size) ? prev.sizes.filter((item) => item !== size) : [...prev.sizes, size],
    }))
  }

  // IMAGE CHANGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    const newPreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: 'new',
      file,
    }))

    setPreviewImages((prev) => [...prev, ...newPreviews])

    e.target.value = ''
  }

  // REMOVE IMAGE
  const removeImage = async (index) => {
    const image = previewImages[index]

    if (!image) return

    try {
      // Existing image
      if (image.type === 'existing') {
        await deleteFile(image.path)

        setProductData((prev) => ({
          ...prev,

          images: prev.images.filter((path) => path !== image.path),
        }))
      }

      // New image
      if (image.type === 'new') {
        URL.revokeObjectURL(image.url)
      }

      setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    } catch (error) {
      console.error('Remove image error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to remove image')
    }
  }

  // SUBMIT
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // New images
      const newImages = previewImages.filter((image) => image.type === 'new')

      const uploadedImages = []

      for (const image of newImages) {
        const filePath = await uploadFile(image.file.name, image.file, 'products')

        uploadedImages.push(filePath)
      }

      // Existing + uploaded images
      const finalImages = [...productData.images, ...uploadedImages]

      const payload = {
        productName: productData.productName,
        description: productData.description,
        category: productData.category,
        subCategory: productData.subCategory || null,
        brand: productData.brand || null,
        images: finalImages,
        sizes: productData.sizes,
        price: Number(productData.price),
        discount: Number(productData.discount || 0),
        discountPrice: Number(productData.discountPrice || 0),
        status: productData.status,
        homeSection: productData.homeSection,
        rating: Number(productData.rating || 0),
        stock: Number(productData.stock || 0),
        soldCount: Number(productData.soldCount || 0),
        warranty: productData.warranty,
        warrantyDuration: productData.warrantyDuration,
        warrantyType: productData.warrantyType,
        returnPolicy: productData.returnPolicy,
        deliveryInfo: productData.deliveryInfo,
      }

      // UPDATE
      if (isEdit) {
        await axiosInstance.put(`/product/${id}`, payload)

        toast.success('Product updated successfully')
      }

      // CREATE
      else {
        await axiosInstance.post('/product', payload)

        toast.success('Product created successfully')
      }

      // Back to product list
      navigate('/admin/products')
    } catch (error) {
      console.error('Submit product error:', error.response?.data || error.message)

      toast.error(error.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  // CANCEL
  const closeForm = () => {
    navigate('/admin/products')
  }

  // LOADING
  if (pageLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm font-medium text-[#6F6A64]">Loading product...</div>
      </div>
    )
  }

  let items
  if (isEdit) {
    items = [
      { title: 'Products', link: '/admin/products' },
      { title: `${productData.productName}`, link: `/admin/products/${id}` },
      { title: 'update', link: null },
    ]
  } else {
    items = [
      { title: 'Products', link: '/admin/products' },
      { title: 'new', link: null },
    ]
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <AdminBreadCrumb items={items} />

      {/* FORM */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
        <form onSubmit={submitHandle} className="p-5">
          <div className="space-y-8">
            {/* BASIC INFORMATION */}

            <section>
              <div className="mb-5">
                <h3 className="text-base font-semibold text-[#292725]">Basic Information *</h3>

                <p className="mt-1 text-xs text-[#99938B]">Add basic details about your product.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* PRODUCT NAME */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Product Name</label>

                  <input
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Men Regular Fit Printed Shirt"
                    required
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* BRAND */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Brand</label>

                  <select
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="">Select Brand</option>

                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.brandName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Category</label>

                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="">Select Category</option>

                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SUBCATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">SubCategory</label>

                  <select
                    name="subCategory"
                    value={productData.subCategory}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="">Select SubCategory</option>

                    {subcategories.map((subcategory) => (
                      <option key={subcategory._id} value={subcategory._id}>
                        {subcategory.subCategoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SIZES */}

                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Available Sizes</label>

                  <div className="flex flex-wrap gap-3">
                    {['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '28', '30', '32', '34', '36', '38', '40'].map((size) => {
                      const selected = productData.sizes.includes(size)

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => handleSizeChange(size)}
                          className={`flex h-12 min-w-16 items-center justify-center rounded-xl border px-4 text-sm font-medium transition ${
                            selected ? 'border-[#6B6258] bg-[#6B6258] text-white' : 'border-[#E3DED6] bg-white text-[#6F6A64] hover:bg-[#F8F6F2]'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>

                  <p className="mt-2 text-xs text-[#99938B]">Select the sizes available for this product.</p>
                </div>
              </div>
            </section>

            {/* PRICING */}

            <section>
              <div className="mb-5 border-t border-[#E3DED6] pt-7">
                <h3 className="text-base font-semibold text-[#292725]">Pricing & Inventory *</h3>

                <p className="mt-1 text-xs text-[#99938B]">Manage product pricing, discount and stock.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Price</label>

                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="₹ 0"
                    required
                    min="0"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* DISCOUNT */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Discount (%)</label>

                  <input
                    type="number"
                    name="discount"
                    value={productData.discount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* DISCOUNT PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Discount Price</label>

                  <input
                    type="number"
                    name="discountPrice"
                    value={productData.discountPrice}
                    onChange={handleChange}
                    placeholder="₹ 0"
                    min="0"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* STOCK */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Stock</label>

                  <input
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                {/* RATING */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Rating</label>

                  <input
                    type="number"
                    name="rating"
                    value={productData.rating}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="5"
                    step="0.1"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>
              </div>
            </section>

            {/* IMAGES */}

            <section>
              <div className="mb-4 border-t border-[#E3DED6] pt-7">
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#292725]">Product Images *</h3>
              </div>

              <div className="flex flex-wrap gap-4">
                {previewImages.map((image, index) => (
                  <div key={`${image.type}-${index}`} className="relative h-40 w-30 overflow-hidden rounded-xl border border-[#E3DED6] bg-white">
                    <img src={image.url} alt={`Product ${index + 1}`} className="h-full w-full object-contain" />

                    <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md transition hover:bg-[#DC2626]">
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-40 w-30 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D2C9] bg-white text-[#6F6A64] transition hover:border-[#6B6258] hover:bg-[#FAF9F7]"
                >
                  <Plus size={30} strokeWidth={1.7} className="text-[#292725]" />

                  <span className="mt-2 text-sm font-medium">Add Image</span>
                </button>

                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </div>
            </section>

            {/* STORE */}

            <section>
              <div className="mb-5 border-t border-[#E3DED6] pt-7">
                <h3 className="text-base font-semibold text-[#292725]">Store & Display *</h3>

                <p className="mt-1 text-xs text-[#99938B]">Control product visibility and homepage placement.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Status</label>

                  <select
                    name="status"
                    value={productData.status}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="Active">Active</option>

                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Home Section</label>

                  <select
                    name="homeSection"
                    value={productData.homeSection}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="Normal">Normal</option>

                    <option value="BestSelling">Best Selling</option>
                  </select>
                </div>
              </div>
            </section>

            {/* DESCRIPTION */}

            <section>
              <div className="mb-5 border-t border-[#E3DED6] pt-7">
                <h3 className="text-base font-semibold text-[#292725]">Product Description *</h3>

                <p className="mt-1 text-xs text-[#99938B]">Add detailed information about the product.</p>
              </div>

              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Enter product description..."
                className="w-full resize-none rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
              />
            </section>

            {/* FULFILLMENT */}

            <section>
              <div className="mb-5 border-t border-[#E3DED6] pt-7">
                <h3 className="text-base font-semibold text-[#292725]">Fulfillment & Policies</h3>

                <p className="mt-1 text-xs text-[#99938B]">Add warranty, return and delivery information.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Warranty Information</label>

                  <input
                    type="text"
                    name="warranty"
                    value={productData.warranty}
                    onChange={handleChange}
                    placeholder="e.g. 1 Year Manufacturer Warranty"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Warranty Duration</label>

                  <input
                    type="text"
                    name="warrantyDuration"
                    value={productData.warrantyDuration}
                    onChange={handleChange}
                    placeholder="e.g. 1 Year"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Warranty Type</label>

                  <select
                    name="warrantyType"
                    value={productData.warrantyType}
                    onChange={handleChange}
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  >
                    <option value="No Warranty">No Warranty</option>

                    <option value="Brand Warranty">Brand Warranty</option>

                    <option value="Seller Warranty">Seller Warranty</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Return Policy</label>

                  <input
                    type="text"
                    name="returnPolicy"
                    value={productData.returnPolicy}
                    onChange={handleChange}
                    placeholder="e.g. 7 Days Return"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#292725]">Delivery Information</label>

                  <input
                    type="text"
                    name="deliveryInfo"
                    value={productData.deliveryInfo}
                    onChange={handleChange}
                    placeholder="e.g. Delivery in 3-5 days"
                    className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 py-3 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex justify-end gap-3 border-t border-[#E3DED6] pt-5">
            <button type="button" onClick={closeForm} className="h-10 rounded-xl border border-[#E3DED6] bg-white px-5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="h-10 rounded-xl bg-[#6B6258] px-6 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
