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
  offerImage: '',
  sizes: [],
  price: '',
  discount: 0,
  discountPrice: '',
  status: 'Active',
  isOffer: false,
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

  // ! offerimg 1.
  const [offerImagePreview, setOfferImagePreview] = useState('')
  const [offerImageFile, setOfferImageFile] = useState(null)

  const offerImageInputRef = useRef(null)

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
        offerImage: product.offerImage || '',
        sizes: product.sizes || [],

        price: product.price ?? '',
        discount: product.discount ?? 0,
        discountPrice: product.discountPrice ?? '',

        status: product.status || 'Active',
        isOffer: product.isOffer ?? false,

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

      // ! offerimg 3.

      if (product.offerImage) {
        setOfferImagePreview(getImageUrl(product.offerImage))
      } else {
        setOfferImagePreview('')
      }
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
    const { name, value, type, checked } = e.target

    setProductData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

  // ! offerimg 2.
  const handleOfferImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (offerImagePreview) {
      URL.revokeObjectURL(offerImagePreview)
    }

    const previewUrl = URL.createObjectURL(file)

    setOfferImageFile(file)
    setOfferImagePreview(previewUrl)

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

      // ! offerimg 4.
      let finalOfferImage = productData.offerImage

      if (offerImageFile) {
        finalOfferImage = await uploadFile(offerImageFile.name, offerImageFile, 'product-offers')
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
        offerImage: finalOfferImage,
        sizes: productData.sizes,
        price: Number(productData.price),
        discount: Number(productData.discount || 0),
        discountPrice: Number(productData.discountPrice || 0),
        status: productData.status,
        isOffer: productData.isOffer,
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
      <div className="overflow-hidden rounded-3xl border border-[#E3DED6] bg-white shadow-[0_10px_40px_rgba(63,58,53,0.06)]">
        <form onSubmit={submitHandle} className="p-5 sm:p-7 lg:p-8">
          <div className="space-y-10">
            {/* BASIC INFORMATION */}
            <section>
              <div className="mb-6 flex items-start gap-3">
                <div className="mt-1 h-9 w-1 rounded-full bg-[#6B6258]" />

                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-[#292725]">Basic Information</h3>

                  <p className="mt-1 text-xs text-[#99938B]">Add basic details about your product.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* PRODUCT NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Product Name</label>

                  <input
                    type="text"
                    name="productName"
                    value={productData.productName}
                    onChange={handleChange}
                    placeholder="e.g. Men Regular Fit Printed Shirt"
                    required
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  />
                </div>

                {/* BRAND */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Brand</label>

                  <select
                    name="brand"
                    value={productData.brand}
                    onChange={handleChange}
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
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
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Category</label>

                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleChange}
                    required
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
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
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">SubCategory</label>

                  <select
                    name="subCategory"
                    value={productData.subCategory}
                    onChange={handleChange}
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
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
                  <div className="mb-3 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-[#292725]">Available Sizes</label>

                    <span className="rounded-full bg-[#F1EEE8] px-3 py-1 text-[10px] font-semibold text-[#6B6258]">{productData.sizes.length} Selected</span>
                  </div>

                  <div className="rounded-2xl border border-[#E3DED6] bg-[#F8F6F2] p-4">
                    <div className="flex flex-wrap gap-2.5">
                      {['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '28', '30', '32', '34', '36', '38', '40'].map((size) => {
                        const selected = productData.sizes.includes(size)

                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => handleSizeChange(size)}
                            className={` flex h-11 min-w-14 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-all duration-200 ${selected ? 'border-[#6B6258] bg-[#6B6258] text-white shadow-sm' : 'border-[#E3DED6] bg-white text-[#6F6A64] hover:border-[#BDB5AB] hover:bg-[#EEEAE4] hover:text-[#292725]'} `}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#99938B]">Select the sizes available for this product.</p>
                </div>
              </div>
            </section>

            {/*  PRICING & INVENTORY */}
            <section>
              <div className="mb-6 border-t border-[#E8E3DC] pt-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-9 w-1 rounded-full bg-[#6B6258]" />

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[#292725]">Pricing & Inventory</h3>

                    <p className="mt-1 text-xs text-[#99938B]">Manage pricing, discount, stock and rating.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {/* PRICE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Price</label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#99938B]">₹</span>

                    <input
                      type="number"
                      name="price"
                      value={productData.price}
                      onChange={handleChange}
                      placeholder="0"
                      required
                      min="0"
                      className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white pl-9 pr-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                    />
                  </div>
                </div>

                {/* DISCOUNT */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Discount</label>

                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={productData.discount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      max="100"
                      className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 pr-10 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#99938B]">%</span>
                  </div>
                </div>

                {/* DISCOUNT PRICE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Discount Price</label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#99938B]">₹</span>

                    <input
                      type="number"
                      name="discountPrice"
                      value={productData.discountPrice}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white pl-9 pr-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                    />
                  </div>
                </div>

                {/* STOCK */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Stock</label>

                  <input
                    type="number"
                    name="stock"
                    value={productData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  />
                </div>

                {/* RATING */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Rating</label>

                  <input
                    type="number"
                    name="rating"
                    value={productData.rating}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="5"
                    step="0.1"
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  />
                </div>
              </div>
            </section>

            {/*  PRODUCT IMAGES */}
            <section>
              <div className="mb-6 border-t border-[#E8E3DC] pt-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-9 w-1 rounded-full bg-[#6B6258]" />

                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-[#292725]">Product Images</h3>

                      <p className="mt-1 text-xs text-[#99938B]">Add clear images of your product.</p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#F1EEE8] px-3 py-1.5 text-[10px] font-bold text-[#6B6258]">{previewImages.length} Images</span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#E3DED6] bg-[#F8F6F2] p-4 sm:p-5">
                <div className="flex flex-wrap gap-4">
                  {previewImages.map((image, index) => (
                    <div key={`${image.type}-${index}`} className=" group relative h-40 w-32 overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ">
                      <img src={image.url} alt={`Product ${index + 1}`} className="h-full w-full object-contain p-2transition-transform duration-300group-hover:scale-105 " />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className=" absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#A44A3F] text-white opacity-0 shadow-md transition-all duration-200 group-hover:opacity-100 hover:bg-[#913C33] "
                      >
                        <X size={13} strokeWidth={2.5} />
                      </button>

                      <div className="absolute bottom-2 left-2 rounded-md bg-[#292725]/75 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">Image {index + 1}</div>
                    </div>
                  ))}

                  {/* ADD IMAGE */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className=" group flex h-40 w-32 flex-col items-center justify-center rounded-2xl border border-dashed border-[#CFC8BF] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#6B6258] hover:bg-[#FAF9F7] hover:shadow-md "
                  >
                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#F1EEE8] transition-all duration-200 group-hover:bg-[#6B6258]">
                      <Plus size={23} strokeWidth={1.8} className="text-[#6B6258] transition-colors group-hover:text-white" />
                    </div>

                    <span className="mt-3 text-xs font-semibold text-[#292725]">Add Image</span>

                    <span className="mt-1 text-[10px] text-[#99938B]">JPG / PNG</span>
                  </button>

                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </div>
              </div>
            </section>

            {/*   STORE & DISPLAY */}
            <section>
              <div className="mb-6 border-t border-[#E8E3DC] pt-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-9 w-1 rounded-full bg-[#6B6258]" />

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[#292725]">Store & Display</h3>

                    <p className="mt-1 text-xs text-[#99938B]">Control product visibility and offer settings.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* STATUS */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Status</label>

                  <select
                    name="status"
                    value={productData.status}
                    onChange={handleChange}
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* OFFER TOGGLE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Offer Product</label>

                  <div className="flex h-13 items-center justify-between rounded-xl border border-[#E3DED6] bg-white px-4 shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-[#292725]">Special Offer</p>

                      <p className="mt-0.5 text-[11px] text-[#99938B]">Enable promotional display</p>
                    </div>

                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" name="isOffer" checked={productData.isOffer} onChange={handleChange} className="peer sr-only" />

                      <div className=" relative h-6 w-11 rounded-full bg-[#D8D2C9] transition-all duration-200 peer-checked:bg-[#6B6258] peer-focus:ring-4 peer-focus:ring-[#6B6258]/10 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform after:duration-200 after:content-[''] peer-checked:after:translate-x-5 " />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* OFFER IMAGE */}
            {productData.isOffer && (
              <section>
                <div className="mb-6 border-t border-[#E8E3DC] pt-8">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-9 w-1 rounded-full bg-[#A44A3F]" />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold tracking-tight text-[#292725]">Offer Image</h3>

                        <span className="rounded-full bg-[#F8E9E6] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#A44A3F]">Special Offer</span>
                      </div>

                      <p className="mt-1 text-xs text-[#99938B]">Add a dedicated promotional image for this product.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E8D8D3] bg-[#FCF8F6] p-5">
                  <div className="flex flex-wrap gap-4">
                    {offerImagePreview ? (
                      <div className=" group relative h-44 w-36 overflow-hidden rounded-2xl border border-[#E3DED6]  bg-white shadow-sm ">
                        <img src={offerImagePreview} alt="Offer" className=" h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105 " />

                        <button
                          type="button"
                          onClick={() => {
                            if (offerImageFile && offerImagePreview) {
                              URL.revokeObjectURL(offerImagePreview)
                            }

                            setOfferImageFile(null)
                            setOfferImagePreview('')

                            setProductData((prev) => ({
                              ...prev,
                              offerImage: '',
                            }))
                          }}
                          className=" absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-[#A44A3F] text-white shadow-md transition hover:bg-[#913C33] "
                        >
                          <X size={13} strokeWidth={2.5} />
                        </button>

                        <div className="absolute bottom-2 left-2 rounded-md bg-[#292725]/75 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">Offer Image</div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => offerImageInputRef.current?.click()}
                        className=" group flex h-44 w-36 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D8C8C2] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#A44A3F] hover:shadow-md "
                      >
                        <div className="flex size-12 items-center justify-center rounded-xl bg-[#F8E9E6] transition group-hover:bg-[#A44A3F]">
                          <Plus size={23} strokeWidth={1.8} className="text-[#A44A3F] transition group-hover:text-white" />
                        </div>

                        <span className="mt-3 text-xs font-semibold text-[#292725]">Add Offer Image</span>

                        <span className="mt-1 text-[10px] text-[#99938B]">JPG / PNG</span>
                      </button>
                    )}

                    <input ref={offerImageInputRef} type="file" accept="image/*" onChange={handleOfferImageChange} className="hidden" />
                  </div>
                </div>
              </section>
            )}

            {/* DESCRIPTION */}
            <section>
              <div className="mb-6 border-t border-[#E8E3DC] pt-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-9 w-1 rounded-full bg-[#6B6258]" />

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[#292725]">Product Description</h3>

                    <p className="mt-1 text-xs text-[#99938B]">Add detailed information about the product.</p>
                  </div>
                </div>
              </div>

              <textarea
                name="description"
                value={productData.description}
                onChange={handleChange}
                rows={7}
                placeholder="Enter product description..."
                className=" w-full resize-none rounded-2xl border border-[#E3DED6] bg-white px-4 py-4 text-sm leading-6 text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
              />
            </section>

            {/* FULFILLMENT & POLICIES */}
            <section>
              <div className="mb-6 border-t border-[#E8E3DC] pt-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-9 w-1 rounded-full bg-[#6B6258]" />

                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-[#292725]">Fulfillment & Policies</h3>

                    <p className="mt-1 text-xs text-[#99938B]">Add warranty, return and delivery information.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* WARRANTY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Warranty Information</label>

                  <input
                    type="text"
                    name="warranty"
                    value={productData.warranty}
                    onChange={handleChange}
                    placeholder="e.g. 1 Year Manufacturer Warranty"
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  />
                </div>

                {/* WARRANTY DURATION */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Warranty Duration</label>

                  <input
                    type="text"
                    name="warrantyDuration"
                    value={productData.warrantyDuration}
                    onChange={handleChange}
                    placeholder="e.g. 1 Year"
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  />
                </div>

                {/* WARRANTY TYPE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Warranty Type</label>

                  <select
                    name="warrantyType"
                    value={productData.warrantyType}
                    onChange={handleChange}
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  >
                    <option value="No Warranty">No Warranty</option>
                    <option value="Brand Warranty">Brand Warranty</option>
                    <option value="Seller Warranty">Seller Warranty</option>
                  </select>
                </div>

                {/* RETURN POLICY */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Return Policy</label>

                  <input
                    type="text"
                    name="returnPolicy"
                    value={productData.returnPolicy}
                    onChange={handleChange}
                    placeholder="e.g. 7 Days Return"
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  />
                </div>

                {/* DELIVERY */}
                <div className="lg:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-[#292725]">Delivery Information</label>

                  <input
                    type="text"
                    name="deliveryInfo"
                    value={productData.deliveryInfo}
                    onChange={handleChange}
                    placeholder="e.g. Delivery in 3-5 days"
                    className=" h-13 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition-all duration-200 placeholder:text-[#B0AAA2] hover:border-[#CFC8BF] focus:border-[#6B6258] focus:ring-4 focus:ring-[#6B6258]/10 "
                  />
                </div>
              </div>
            </section>
          </div>

          {/*    FORM ACTIONS */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#E8E3DC] pt-6 sm:flex-row sm:justify-end">
            <button type="button" onClick={closeForm} className=" h-11 rounded-xl border border-[#E3DED6] bg-white px-6 text-sm font-semibold text-[#6F6A64] transition-all duration-200 hover:border-[#CFC8BF] hover:bg-[#F8F6F2] hover:text-[#292725] ">
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className=" h-11 rounded-xl bg-[#6B6258] px-7 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#3F3A35] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#6B6258]/15 disabled:cursor-not-allowed disabled:opacity-60 "
            >
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
