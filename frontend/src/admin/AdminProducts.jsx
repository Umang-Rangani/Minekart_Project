import React, { useEffect, useRef, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Package, ShoppingBag, CircleDollarSign, AlertTriangle, X, Image as ImageIcon, Upload, Eye } from 'lucide-react'
import { axiosInstance } from '../config/axiosConfig'
import { uploadFile, deleteFile } from '../utils/uploadFile'
// ! main product input object
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

export default function AdminProducts() {
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const [loading, setLoading] = useState(false)

  const [productData, setProductData] = useState(resetProductData)

  // ! table ma product btava mate
  const [products, setProducts] = useState([])
  const [viewProduct, setViewProduct] = useState(null)
  const [editId, setEditId] = useState(null)

  // table ni niche jova mate
  const [viewProductId, setViewProductId] = useState(null)

  // ! 1. previewImages btava mate
  const [previewImages, setPreviewImages] = useState([])

  // input fill
  const fileInputRef = useRef(null)
  const [imageFiles, setImageFiles] = useState([])

  // !  selectbar mate get api state
  const [categories, setCategories] = useState([])
  const [subcategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get('/category')

      setCategories(res.data.data)
    } catch (error) {
      console.error('Get categories error:', error.response?.data || error.message)
    }
  }

  const getSubCategories = async () => {
    try {
      const res = await axiosInstance.get('/subcategory')

      setSubCategories(res.data.data)
    } catch (error) {
      console.error('Get subcategories error:', error.response?.data || error.message)
    }
  }

  const getBrands = async () => {
    try {
      const res = await axiosInstance.get('/brand')

      setBrands(res.data.data)
    } catch (error) {
      console.error('Get brands error:', error.response?.data || error.message)
    }
  }

  // product
  const getProducts = async () => {
    try {
      const res = await axiosInstance.get('/product')

      setProducts(res.data.data || [])
    } catch (error) {
      console.error('Get products error:', error.response?.data || error.message)
    }
  }

  const filteredProducts = products.filter((product) => product.productName?.toLowerCase().includes(search.toLowerCase()))

  const editHandle = async (id) => {
    try {
      const res = await axiosInstance.get(`/product/${id}`)

      const product = res.data.data

      setEditId(product._id)

      setProductData({
        productName: product.productName || '',
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

      setShowForm(true)

      setViewProductId(null)
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message)
    }
  }

  const deleteHandle = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product?')

    if (!confirmDelete) return

    try {
      await axiosInstance.delete(`/product/${id}`)

      await getProducts()

      console.log('Product deleted successfully')
    } catch (error) {
      console.error('Delete product error:', error.response?.data || error.message)
    }
  }

  const viewHandle = (product) => {
    setViewProductId((prev) => (prev === product._id ? null : product._id))
    setShowForm(false)
  }

  const getImageUrl = (image) => {
    if (!image) return ''

    if (image.startsWith('http')) {
      return image
    }

    return `http://localhost:3000${image}`
  }

  useEffect(() => {
    getCategories()
    getSubCategories()
    getBrands()
    getProducts()
  }, [])

  // img shiva y na all input mate
  const handleChange = (e) => {
    const { name, value } = e.target

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Size select karva mate function ['S', 'M'] aavu bne
  const handleSizeChange = (size) => {
    setProductData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter((item) => item !== size) : [...prev.sizes, size],
    }))
  }

  // ! 2. imgage file input
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

  // ! 3. imgage ne delete krva mate
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
    }
  }

  //  CLOSE FORM
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

  // ! form submit handle
  const submitHandle = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // ! 4. new images upload
      const newImages = previewImages.filter((image) => image.type === 'new')

      const uploadedImages = []

      for (const image of newImages) {
        const filePath = await uploadFile(image.file.name, image.file, 'products')

        uploadedImages.push(filePath)
      }

      // ! Existing images + newly uploaded images
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

      if (editId) {
        // ! Update
        await axiosInstance.put(`/product/${editId}`, payload)
      } else {
        // ! Create
        await axiosInstance.post('/product', payload)
      }

      // ! Refresh product table
      await getProducts()

      // ! Close form
      closeForm()
    } catch (error) {
      console.error('Submit product error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // ! add product
  const addProductHandle = () => {
    setEditId(null)

    setProductData(resetProductData)

    setPreviewImages([])
    setImageFiles([])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setShowForm(true)
  }

  // ! product dashboard
  const totalProducts = products.length

  const activeProducts = products.filter((product) => product.status === 'Active').length

  const bestSellingProducts = products.filter((product) => product.homeSection === 'BestSelling').length

  const outOfStockProducts = products.filter((product) => product.stock === 0).length

  const stats = [
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
    },
    {
      title: 'Active Products',
      value: activeProducts,
      icon: ShoppingBag,
    },
    {
      title: 'Best Selling',
      value: bestSellingProducts,
      icon: CircleDollarSign,
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-6 transition-all duration-700">
      {/* HEADER */}
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

      {/* STATS */}
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

      {/* CREATE / EDIT FORM */}
      {showForm && (
        <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white shadow-sm">
          {/*  FORM HEADER  */}
          <div className="flex items-center justify-between border-b border-[#E3DED6] bg-[#F7F7F5] px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-[#292725]">{editId ? 'Edit Product' : 'Create Product'}</h2>
              <p className="mt-0.5 text-xs text-[#99938B]">{editId ? 'Update product information' : 'Add a new store product'}</p>
            </div>

            <button type="button" onClick={closeForm} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4]">
              <X size={19} />
            </button>
          </div>

          {/*  FORM  */}
          <form onSubmit={submitHandle} className="p-5">
            <div className="space-y-8">
              {/* BASIC INFORMATION */}
              <section>
                <div className="mb-5">
                  <h3 className="text-base font-semibold text-[#292725]">Basic Information *</h3>

                  <p className="mt-1 text-xs text-[#99938B]">Add basic details about your product.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* productNamef */}
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

                  {/* brandf */}
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

                  {/* categoryf */}
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

                  {/* subcategoryf */}
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

                  {/* SIZE */}
                  <div className="lg:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-[#292725]">Available Sizes</label>

                    <div className="flex flex-wrap gap-3">
                      {['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'].map((size) => {
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

              {/* PRICING & INVENTORY */}
              <section>
                <div className="mb-5 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-base font-semibold text-[#292725]">Pricing & Inventory *</h3>

                  <p className="mt-1 text-xs text-[#99938B]">Manage product pricing, discount and stock.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                  {/* Pricef*/}
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

                  {/* Discountf */}
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

                  {/* Discount Pricef */}
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

                  {/* Stockf */}
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

                  {/* Ratingf */}
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

              {/* img form  */}
              <section>
                <div className="mb-4 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-[#292725]">Product Images *</h3>
                </div>

                <div className="flex flex-wrap gap-4">
                  {/* preview img map */}
                  {previewImages.map((image, index) => (
                    <div key={`${image.type}-${index}`} className="relative h-40 w-30 overflow-hidden rounded-xl border border-[#E3DED6] bg-white">
                      <img src={image.url} alt={`Product ${index + 1}`} className="h-full w-full object-contain" />

                      {/* Remove Button */}

                      <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-md transition hover:bg-[#DC2626]">
                        <X size={10} strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}

                  {/* + button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-40 w-30 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8D2C9] bg-white text-[#6F6A64] transition hover:border-[#6B6258] hover:bg-[#FAF9F7]"
                  >
                    <Plus size={30} strokeWidth={1.7} className="text-[#292725]" />

                    <span className="mt-2 text-sm font-medium">Add Image</span>
                  </button>

                  {/* Hidden Input */}

                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                </div>
              </section>

              {/* STORE & DISPLAY */}
              <section>
                <div className="mb-5 border-t border-[#E3DED6] pt-7">
                  <h3 className="text-base font-semibold text-[#292725]">Store & Display *</h3>

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

              {/* FULFILLMENT & POLICIES */}
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

            {/* BUTTONS */}
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

      {/* product table */}
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
          <table className="w-full min-w-250">
            <thead>
              <tr className="border-b border-[#E3DED6] bg-[#F8F6F2]">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">index</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Product</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Category</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Brand</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Price</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Stock</th>

                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Status</th>

                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#99938B]">Action</th>
              </tr>
            </thead>

            {/*  */}
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <React.Fragment key={product._id}>
                    {/*  PRODUCT ROW  */}
                    <tr className="border-b border-[#E3DED6] transition hover:bg-[#FCFBF9]">
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#6F6A64]">{index + 1}</span>
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <p className="max-w-60 truncate text-sm font-semibold text-[#292725]">{product.productName}</p>

                            {product.homeSection === 'BestSelling' && <span className="mt-1 inline-flex rounded-full bg-[#F1EEE8] px-2 py-0.5 text-[10px] font-semibold text-[#6B6258]">Best Selling</span>}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#6F6A64]">{product.category?.categoryName || '-'}</span>
                      </td>

                      {/* Brand */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-[#292725]">{product.brand?.brandName || '-'}</span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[#292725]">₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}</p>

                        {product.discount > 0 && (
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <span className="text-xs text-[#99938B] line-through">₹{Number(product.price).toLocaleString('en-IN')}</span>

                            <span className="text-[10px] font-semibold text-[#6B6258]">{product.discount}% OFF</span>
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span className={`text-sm font-medium ${product.stock === 0 ? 'text-[#A44A3F]' : 'text-[#6F6A64]'}`}>{product.stock}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${product.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                          <span className={`size-1.5 rounded-full ${product.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => viewHandle(product)}
                            className={`flex size-9 items-center justify-center rounded-lg transition ${viewProductId === product._id ? 'bg-[#6B6258] text-white' : 'text-[#6F6A64] hover:bg-[#EEEAE4] hover:text-[#292725]'}`}
                            title="View Product"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit */}
                          <button type="button" onClick={() => editHandle(product._id)} className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]" title="Edit Product">
                            <Pencil size={16} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onMouseEnter={() => {
                              setShowForm(false)
                              setViewProductId(null)
                            }}
                            onClick={() => deleteHandle(product._id)}
                            className="flex size-9 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#F1E7E5] hover:text-[#A44A3F]"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* view product jova mate */}
                    {viewProductId === product._id && (
                      <tr>
                        <td colSpan="8" className="border-b border-[#E3DED6] bg-[#F8F6F2] px-5 py-5">
                          <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
                            {/* View Header */}
                            <div className="mb-5 flex items-center justify-between">
                              <div>
                                <h3 className="text-base font-bold text-[#292725]">Product Details</h3>

                                <p className="mt-1 text-xs text-[#99938B]">Complete information about this product</p>
                              </div>

                              <button type="button" onClick={() => setViewProductId(null)} className="flex size-8 items-center justify-center rounded-lg text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]">
                                <X size={17} />
                              </button>
                            </div>

                            {/* Main Details */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                              {/*  IMAGES  */}
                              <div>
                                <p className="mb-3 text-xs fonat-semibold uppercase tracking-wide text-[#6F6A64]">Product Images</p>

                                <div className="grid grid-cols-2 gap-3">
                                  {product.images?.length > 0 ? (
                                    product.images.map((image, imageIndex) => (
                                      <div key={imageIndex} className="aspect-square overflow-hidden rounded-xl border border-[#E3DED6] bg-[#F7F7F5]">
                                        <img src={getImageUrl(image)} alt={`${product.productName} ${imageIndex + 1}`} className="h-full w-full object-contain" />
                                      </div>
                                    ))
                                  ) : (
                                    <div className="col-span-2 flex aspect-square items-center justify-center rounded-xl border border-dashed border-[#E3DED6] bg-[#F7F7F5]">
                                      <div className="text-center">
                                        <ImageIcon size={28} className="mx-auto text-[#99938B]" />

                                        <p className="mt-2 text-xs text-[#99938B]">No images</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/*  BASIC INFO  */}
                              <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6F6A64]">Basic Information</p>

                                <div className="space-y-4">
                                  <div>
                                    <p className="text-[11px] text-[#99938B]">Product Name</p>

                                    <p className="mt-1 text-sm font-semibold text-[#292725]">{product.productName}</p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] text-[#99938B]">Category</p>

                                    <p className="mt-1 text-sm text-[#292725]">{product.category?.categoryName || '-'}</p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] text-[#99938B]">SubCategory</p>

                                    <p className="mt-1 text-sm text-[#292725]">{product.subCategory?.subCategoryName || '-'}</p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] text-[#99938B]">Brand</p>

                                    <p className="mt-1 text-sm text-[#292725]">{product.brand?.brandName || '-'}</p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] text-[#99938B]">Sizes</p>

                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {product.sizes?.length > 0 ? (
                                        product.sizes.map((size) => (
                                          <span key={size} className="rounded-lg border border-[#E3DED6] bg-[#F8F6F2] px-3 py-1.5 text-xs font-semibold text-[#6B6258]">
                                            {size}
                                          </span>
                                        ))
                                      ) : (
                                        <p className="text-sm text-[#6F6A64]">-</p>
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-[11px] text-[#99938B]">Description</p>

                                    <p className="mt-1 text-sm leading-6 text-[#6F6A64]">{product.description || '-'}</p>
                                  </div>
                                </div>
                              </div>

                              {/*  PRICING  */}
                              <div>
                                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6F6A64]">Pricing & Stock</p>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="rounded-xl bg-[#F1EEE8] p-3">
                                    <p className="text-[11px] text-[#99938B]">Price</p>

                                    <p className="mt-1 text-sm font-bold text-[#292725]">₹{Number(product.price).toLocaleString('en-IN')}</p>
                                  </div>

                                  <div className="rounded-xl bg-[#F1EEE8] p-3">
                                    <p className="text-[11px] text-[#99938B]">Discount</p>

                                    <p className="mt-1 text-sm font-bold text-[#292725]">{product.discount}%</p>
                                  </div>

                                  <div className="rounded-xl bg-[#F1EEE8] p-3">
                                    <p className="text-[11px] text-[#99938B]">Discount Price</p>

                                    <p className="mt-1 text-sm font-bold text-[#292725]">₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}</p>
                                  </div>

                                  <div className="rounded-xl bg-[#F1EEE8] p-3">
                                    <p className="text-[11px] text-[#99938B]">Stock</p>

                                    <p className="mt-1 text-sm font-bold text-[#292725]">{product.stock}</p>
                                  </div>

                                  <div className="rounded-xl bg-[#F1EEE8] p-3">
                                    <p className="text-[11px] text-[#99938B]">Rating</p>

                                    <p className="mt-1 text-sm font-bold text-[#292725]">⭐ {product.rating}</p>
                                  </div>

                                  <div className="rounded-xl bg-[#F1EEE8] p-3">
                                    <p className="text-[11px] text-[#99938B]">Sold</p>

                                    <p className="mt-1 text-sm font-bold text-[#292725]">{product.soldCount}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/*  WARRANTY  */}
                            <div className="mt-6 border-t border-[#E3DED6] pt-5">
                              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6F6A64]">Warranty & Return</p>

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-3">
                                  <p className="text-[11px] text-[#99938B]">Warranty</p>

                                  <p className="mt-1 text-sm font-medium text-[#292725]">{product.warranty || '-'}</p>
                                </div>

                                <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-3">
                                  <p className="text-[11px] text-[#99938B]">Duration</p>

                                  <p className="mt-1 text-sm font-medium text-[#292725]">{product.warrantyDuration || '-'}</p>
                                </div>

                                <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-3">
                                  <p className="text-[11px] text-[#99938B]">Warranty Type</p>

                                  <p className="mt-1 text-sm font-medium text-[#292725]">{product.warrantyType || '-'}</p>
                                </div>

                                <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-3">
                                  <p className="text-[11px] text-[#99938B]">Return Policy</p>

                                  <p className="mt-1 text-sm font-medium text-[#292725]">{product.returnPolicy || '-'}</p>
                                </div>
                              </div>
                            </div>

                            {/*  DELIVERY  */}
                            <div className="mt-4 rounded-xl bg-[#F1EEE8] p-4">
                              <p className="text-[11px] font-medium text-[#99938B]">Delivery Information</p>

                              <p className="mt-1 text-sm text-[#292725]">{product.deliveryInfo || '-'}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-sm text-[#99938B]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#E3DED6] bg-[#FCFBF9] px-5 py-3">
          <p className="text-xs text-[#99938B]">
            Showing <span className="font-semibold text-[#6F6A64]">{filteredProducts.length}</span> product
          </p>

          <p className="text-xs font-medium text-[#6F6A64]">Total {products.length} products</p>
        </div>
      </div>
    </div>
  )
}
