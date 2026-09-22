import React, { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, X, Image as ImageIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'

export default function AdminProductsView() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  // GET PRODUCT
  const getProduct = async () => {
    try {
      setLoading(true)

      const res = await axiosInstance.get(`/product/${id}`)

      const data = res.data.data

      setProduct(data)

      if (data?.images?.length > 0) {
        setSelectedImage(data.images[0])
      }
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProduct()
  }, [id])

  // IMAGE URL
  const getImageUrl = (image) => {
    if (!image) return ''

    if (image.startsWith('http')) {
      return image
    }

    return `http://localhost:3000${image}`
  }

  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm font-medium text-[#6F6A64]">Loading product...</p>
      </div>
    )
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <p className="text-sm font-semibold text-[#292725]">Product not found</p>

        <button type="button" onClick={() => navigate('/admin/products')} className="mt-4 rounded-xl bg-[#6B6258] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3F3A35]">
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="flex size-10 items-center justify-center rounded-xl border border-[#E3DED6] bg-white text-[#6F6A64] transition hover:bg-[#EEEAE4] hover:text-[#292725]"
            title="Back to Products"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#292725]">Product Details</h1>

            <p className="mt-1 text-sm text-[#6F6A64]">View complete product information.</p>
          </div>
        </div>

        {/* EDIT */}

        <button
          type="button"
          onClick={() => navigate(`/admin/products/${product._id}/update`)}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#6B6258] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5D554C]"
        >
          <Pencil size={17} />
          Edit Product
        </button>
      </div>

      {/* PRODUCT MAIN CARD */}
      <div className="overflow-hidden rounded-2xl border border-[#E3DED6] bg-white">
        <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-[420px_1fr]">
          {/* IMAGES */}
          <div>
            {/* MAIN IMAGE */}
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-[#E3DED6] bg-[#F8F6F2]">
              {selectedImage ? (
                <img src={getImageUrl(selectedImage)} alt={product.productName} className="h-full w-full object-contain p-5" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={40} className="mx-auto text-[#99938B]" />

                  <p className="mt-2 text-sm text-[#99938B]">No image available</p>
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {product.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`aspect-square overflow-hidden rounded-xl border bg-white transition ${selectedImage === image ? 'border-[#6B6258] ring-2 ring-[#E3DED6]' : 'border-[#E3DED6] hover:border-[#B8B0A6]'}`}
                  >
                    <img src={getImageUrl(image)} alt={`${product.productName} ${index + 1}`} className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BASIC PRODUCT INFO */}
          <div>
            {/* PRODUCT NAME */}
            <div className="border-b border-[#E3DED6] pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#292725]">{product.productName}</h2>

                  {product.brand?.brandName && <p className="mt-1 text-sm text-[#6F6A64]">{product.brand.brandName}</p>}
                </div>

                {/* STATUS */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${product.status === 'Active' ? 'bg-[#EAE7E1] text-[#5D554C]' : 'bg-[#F1E7E5] text-[#A44A3F]'}`}>
                  <span className={`size-1.5 rounded-full ${product.status === 'Active' ? 'bg-[#6B6258]' : 'bg-[#A44A3F]'}`} />

                  {product.status}
                </span>
              </div>

              {/* BEST SELLING */}
              {product.homeSection === 'BestSelling' && <span className="mt-3 inline-flex rounded-full bg-[#F1EEE8] px-3 py-1 text-xs font-semibold text-[#6B6258]">Best Selling</span>}
            </div>

            {/* PRICE */}
            <div className="border-b border-[#E3DED6] py-5">
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-[#292725]">₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}</p>

                {product.discount > 0 && (
                  <>
                    <p className="pb-1 text-sm text-[#99938B] line-through">₹{Number(product.price).toLocaleString('en-IN')}</p>

                    <span className="mb-1 rounded-md bg-[#EAE7E1] px-2 py-1 text-xs font-bold text-[#5D554C]">{product.discount}% OFF</span>
                  </>
                )}
              </div>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4">
              <div className="rounded-xl bg-[#F1EEE8] p-3">
                <p className="text-[11px] text-[#99938B]">Stock</p>

                <p className="mt-1 text-base font-bold text-[#292725]">{product.stock}</p>
              </div>

              <div className="rounded-xl bg-[#F1EEE8] p-3">
                <p className="text-[11px] text-[#99938B]">Rating</p>

                <p className="mt-1 text-base font-bold text-[#292725]">⭐ {product.rating}</p>
              </div>

              <div className="rounded-xl bg-[#F1EEE8] p-3">
                <p className="text-[11px] text-[#99938B]">Sold</p>

                <p className="mt-1 text-base font-bold text-[#292725]">{product.soldCount}</p>
              </div>

              <div className="rounded-xl bg-[#F1EEE8] p-3">
                <p className="text-[11px] text-[#99938B]">Discount</p>

                <p className="mt-1 text-base font-bold text-[#292725]">{product.discount}%</p>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="border-t border-[#E3DED6] pt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] text-[#99938B]">Category</p>

                  <p className="mt-1 text-sm font-semibold text-[#292725]">{product.category?.categoryName || '-'}</p>
                </div>

                <div>
                  <p className="text-[11px] text-[#99938B]">SubCategory</p>

                  <p className="mt-1 text-sm font-semibold text-[#292725]">{product.subCategory?.subCategoryName || '-'}</p>
                </div>

                <div>
                  <p className="text-[11px] text-[#99938B]">Brand</p>

                  <p className="mt-1 text-sm font-semibold text-[#292725]">{product.brand?.brandName || '-'}</p>
                </div>
              </div>
            </div>

            {/* SIZES */}
            <div className="mt-5 border-t border-[#E3DED6] pt-5">
              <p className="text-[11px] text-[#99938B]">Available Sizes</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes?.length > 0 ? (
                  product.sizes.map((size) => (
                    <span key={size} className="rounded-lg border border-[#E3DED6] bg-[#F8F6F2] px-3 py-1.5 text-xs font-semibold text-[#6B6258]">
                      {size}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[#6F6A64]">No sizes</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
        <div className="border-b border-[#E3DED6] pb-4">
          <h3 className="text-base font-bold text-[#292725]">Product Description</h3>
        </div>

        <p className="pt-4 text-sm leading-7 text-[#6F6A64]">{product.description || 'No description available.'}</p>
      </div>

      {/* WARRANTY & RETURN */}
      <div className="rounded-2xl border border-[#E3DED6] bg-white p-5">
        <div className="border-b border-[#E3DED6] pb-4">
          <h3 className="text-base font-bold text-[#292725]">Warranty & Return</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-4">
            <p className="text-[11px] text-[#99938B]">Warranty</p>

            <p className="mt-1 text-sm font-semibold text-[#292725]">{product.warranty || '-'}</p>
          </div>

          <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-4">
            <p className="text-[11px] text-[#99938B]">Duration</p>

            <p className="mt-1 text-sm font-semibold text-[#292725]">{product.warrantyDuration || '-'}</p>
          </div>

          <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-4">
            <p className="text-[11px] text-[#99938B]">Warranty Type</p>

            <p className="mt-1 text-sm font-semibold text-[#292725]">{product.warrantyType || '-'}</p>
          </div>

          <div className="rounded-xl border border-[#E3DED6] bg-[#FCFBF9] p-4">
            <p className="text-[11px] text-[#99938B]">Return Policy</p>

            <p className="mt-1 text-sm font-semibold text-[#292725]">{product.returnPolicy || '-'}</p>
          </div>
        </div>

        {/* DELIVERY */}
        <div className="mt-4 rounded-xl bg-[#F1EEE8] p-4">
          <p className="text-[11px] text-[#99938B]">Delivery Information</p>

          <p className="mt-1 text-sm font-medium text-[#292725]">{product.deliveryInfo || '-'}</p>
        </div>
      </div>
    </div>
  )
}
