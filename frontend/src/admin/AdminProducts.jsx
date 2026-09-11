import React, { useRef, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Package, ShoppingBag, CircleDollarSign, AlertTriangle, X, Image as ImageIcon, Upload } from 'lucide-react'

export default function AdminProducts() {
  // ================= STATES =================

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef(null)

  const resetProductData = {
    productName: '',
    slug: '',
    description: '',
    category: '',
    brand: '',
    images: [],
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

  const [productData, setProductData] = useState(resetProductData)

  // Temporary states
  // API connect કરતી વખતે setCategories / setBrands કરી શકશો
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])

  const [imageFiles, setImageFiles] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  // ================= HANDLERS =================

  const handleChange = (e) => {
    const { name, value } = e.target

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // ================= IMAGE CHANGE =================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) {
      return
    }

    setImageFiles(files)

    const previews = files.map((file) => URL.createObjectURL(file))

    setPreviewImages(previews)
  }

  // ================= CLOSE FORM =================

  const closeForm = () => {
    setShowForm(false)
    setEditId(null)

    setProductData(resetProductData)

    setImageFiles([])
    setPreviewImages([])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // ================= ADD PRODUCT =================

  const addProductHandle = () => {
    setEditId(null)
    setProductData(resetProductData)

    setImageFiles([])
    setPreviewImages([])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setShowForm(true)
  }

  // ================= SUBMIT =================

  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      console.log('Product Data:', productData)

      if (editId) {
        console.log('PUT Product:', editId)
      } else {
        console.log('POST Product')
      }

      closeForm()
    } catch (error) {
      console.error('Product submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ================= EDIT =================

  const editHandle = (product) => {
    setEditId(product._id)

    setProductData({
      productName: product.productName || '',
      slug: product.slug || '',
      description: product.description || '',

      category: product.category?._id || product.category || '',
      brand: product.brand?._id || product.brand || '',

      images: product.images || [],

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

    // Existing images preview
    if (product.images?.length > 0) {
      setPreviewImages(product.images.map((image) => (image.startsWith('http') ? image : `http://localhost:3000${image}`)))
    } else {
      setPreviewImages([])
    }

    setImageFiles([])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setShowForm(true)
  }

  // ================= DELETE =================

  const deleteHandle = (id) => {
    console.log('Delete Product:', id)
  }

  // ================= STATS =================

  const stats = [
    {
      title: 'Total Products',
      value: '248',
      icon: Package,
    },
    {
      title: 'Active Products',
      value: '215',
      icon: ShoppingBag,
    },
    {
      title: 'Best Selling',
      value: '32',
      icon: CircleDollarSign,
    },
    {
      title: 'Out of Stock',
      value: '7',
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-6">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#292725]">Products</h1>

          <p className="mt-1 text-sm text-[#6F6A64]">Manage your products, pricing and inventory.</p>
        </div>

        <button type="button" onClick={addProductHandle} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D554C]">
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.title} className="rounded-2xl border border-[#E3DED6] bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#99938B]">{item.title}</p>

                  <h2 className="mt-2 text-2xl font-bold text-[#292725]">{item.value}</h2>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-[#F1EEE8] text-[#6B6258]">
                  <Icon size={21} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ================================================= */}
      {/* CREATE / EDIT FORM */}
      {/* ================================================= */}

      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
          {/* ================= FORM HEADER ================= */}

          <div className="flex items-center justify-between border-b border-[#E3DED6] bg-[#F7F7F5] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#292725]">{editId ? 'Edit Product' : 'Create Product'}</h2>

              <p className="mt-0.5 text-xs text-[#99938B]">{editId ? 'Update product information' : 'Add a new store product'}</p>
            </div>

            <button type="button" onClick={closeForm} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              <X size={19} />
            </button>
          </div>

          {/* ================= FORM ================= */}

          <form onSubmit={submitHandle} className="p-5">
            <div className="space-y-8">
              {/* ================================================= */}
              {/* BASIC INFORMATION */}
              {/* ================================================= */}

              <section>
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-[#292725]">Basic Information</h3>

                  <p className="mt-1 text-xs text-[#99938B]">Add basic details about your product.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Product Name */}

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

                  {/* Category */}

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

                  {/* Brand */}

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
                </div>
              </section>

              {/* ================================================= */}
              {/* PRICING & INVENTORY */}
              {/* ================================================= */}

              <section>
                <div className="mb-5 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-base font-semibold text-[#292725]">Pricing & Inventory</h3>

                  <p className="mt-1 text-xs text-[#99938B]">Manage product pricing, discount and stock.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {/* Price */}

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

                  {/* Discount */}

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

                  {/* Discount Price */}

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

                  {/* Stock */}

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

                  {/* Rating */}

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

                  {/* Sold Count */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#292725]">Sold Count</label>

                    <input
                      type="number"
                      name="soldCount"
                      value={productData.soldCount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                    />
                  </div>
                </div>
              </section>

              <section>
                {/* Heading */}

                <div className="mb-4 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#292725]">Product Images</h3>
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* ALL SELECTED IMAGES */}

                  {previewImages.map((image, index) => (
                    <div key={index} className="relative h-40 w-40 overflow-hidden rounded-xl border border-[#E3DED6] bg-white">
                      <img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-contain" />

                      {/* Remove Button */}

                      <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md transition hover:bg-[#DC2626]">
                        <X size={17} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}

                  {/* ADD IMAGE BOX */}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-40 w-40 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D2C9] bg-white text-[#6F6A64] transition hover:border-[#6B6258] hover:bg-[#FAF9F7]"
                  >
                    <Plus size={30} strokeWidth={1.7} className="text-[#292725]" />

                    <span className="mt-2 text-sm font-medium">Add Image</span>
                  </button>

                  {/* Hidden Input */}

                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </div>
              </section>
              {/* ================================================= */}
              {/* STORE & DISPLAY */}
              {/* ================================================= */}

              <section>
                <div className="mb-5 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-base font-semibold text-[#292725]">Store & Display</h3>

                  <p className="mt-1 text-xs text-[#99938B]">Control product visibility and homepage placement.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Status */}

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

                  {/* Home Section */}

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

              {/* ================================================= */}
              {/* DESCRIPTION */}
              {/* ================================================= */}

              <section>
                <div className="mb-5 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-base font-semibold text-[#292725]">Product Description</h3>

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

              {/* ================================================= */}
              {/* FULFILLMENT & POLICIES */}
              {/* ================================================= */}

              <section>
                <div className="mb-5 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-base font-semibold text-[#292725]">Fulfillment & Policies</h3>

                  <p className="mt-1 text-xs text-[#99938B]">Add warranty, return and delivery information.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Warranty */}

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

                  {/* Warranty Duration */}

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

                  {/* Warranty Type */}
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

                  {/* Return Policy */}
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

                  {/* Delivery Info */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#292725]">Delivery Information</label>

                    <input
                      type="text"
                      name="deliveryInfo"
                      value={productData.deliveryInfo}
                      onChange={handleChange}
                      placeholder="e.g. Delivery in 3-5 days"
                      className="h-14 w-full rounded-xl border border-[#E3DED6] bg-white px-4 text-sm text-[#292725] outline-none transition placeholder:text-[#99938B] focus:border-[#6B6258] focus:ring-2 focus:ring-[#EEEAE4]"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* ================================================= */}
            {/* BUTTONS */}
            {/* ================================================= */}

            <div className="mt-8 flex justify-end gap-3 border-t border-[#E3DED6] pt-5">
              <button type="button" onClick={closeForm} className="h-10 rounded-xl border border-[#E3DED6] bg-white px-5 text-sm font-medium text-[#6F6A64] transition hover:bg-[#EEEAE4]">
                Cancel
              </button>

              <button type="submit" disabled={loading} className="h-10 rounded-xl bg-[#6B6258] px-6 text-sm font-semibold text-white transition hover:bg-[#3F3A35] disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Saving...' : editId ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================================================= */}
      {/* PRODUCT TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-[#E3DED6] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#99938B]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-xl border border-[#E3DED6] bg-[#F8F6F2] pl-10 pr-4 text-sm text-[#292725] outline-none placeholder:text-[#99938B] transition focus:border-[#6B6258] focus:ring-2 focus:ring-[#E3DED6]"
            />
          </div>

          <p className="text-xs text-[#99938B]">Manage your product inventory</p>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Product</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Category</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Brand</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Price</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Stock</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            <tbody>
              {/* Temporary sample product */}

              <tr className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                {/* Product */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E3DED6] bg-[#F8F6F2]">
                      <img src="/product.jpg" alt="" className="h-full w-full object-contain" />
                    </div>

                    <div className="min-w-0">
                      <p className="max-w-[240px] truncate text-sm font-semibold text-[#292725]">Men Regular Fit Printed Shirt</p>

                      <span className="mt-1 inline-flex rounded-full bg-[#F1EEE8] px-2 py-0.5 text-[10px] font-semibold text-[#6B6258]">Best Selling</span>
                    </div>
                  </div>
                </td>

                {/* Category */}

                <td className="px-5 py-4">
                  <span className="text-sm text-[#6F6A64]">Fashion</span>
                </td>

                {/* Brand */}

                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-[#292725]">COLORPLUS</span>
                </td>

                {/* Price */}

                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-[#292725]">₹1,499</p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-xs text-[#99938B] line-through">₹1,999</span>

                    <span className="text-[10px] font-semibold text-[#6B6258]">25% OFF</span>
                  </div>
                </td>

                {/* Stock */}

                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-[#6F6A64]">24</span>
                </td>

                {/* Status */}

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAE7E1] px-2.5 py-1 text-[11px] font-semibold text-[#5D554C]">
                    <span className="size-1.5 rounded-full bg-[#6B6258]" />
                    Active
                  </span>
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        editHandle({
                          _id: 'PRODUCT_ID',

                          productName: 'Men Regular Fit Printed Shirt',

                          slug: 'men-regular-fit-printed-shirt',

                          category: '',
                          brand: '',

                          images: [],

                          price: 1999,
                          discount: 25,
                          discountPrice: 1499,

                          stock: 24,

                          status: 'Active',
                          homeSection: 'BestSelling',

                          rating: 4.5,
                          soldCount: 120,

                          description: '',

                          warranty: '1 Year Manufacturer Warranty',

                          warrantyDuration: '1 Year',

                          warrantyType: 'Brand Warranty',

                          returnPolicy: '7 Days Return',

                          deliveryInfo: 'Delivery in 3-5 days',
                        })
                      }
                      className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
                      title="Edit Product"
                    >
                      <Pencil size={16} />
                    </button>

                    <button type="button" onClick={() => deleteHandle('PRODUCT_ID')} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]" title="Delete Product">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E3DED6] bg-[#FCFBF9] px-5 py-3">
          <p className="text-xs text-[#99938B]">
            Showing <span className="font-semibold text-[#6F6A64]">1</span> product
          </p>

          <p className="text-xs font-medium text-[#6F6A64]">Total 248 products</p>
        </div>
      </div>
    </div>
  )
}
