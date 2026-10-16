import { getImageUrl } from '../utils/imageUrl'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Pencil, X, Image as ImageIcon } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import AdminBreadCrumb from './AdminBreadCrumb'

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
  // LOADING
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-sm font-medium text-mk-muted-admin">Loading product...</p>
      </div>
    )
  }

  // NOT FOUND
  if (!product) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center">
        <p className="text-sm font-semibold text-mk-ink-admin">Product not found</p>

        <button type="button" onClick={() => navigate('/admin/products')} className="mt-4 rounded-xl bg-mk-admin px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-mk-ink-admin">
          Back to Products
        </button>
      </div>
    )
  }

  const items = [
    { title: 'Products', link: '/admin/products' },
    { title: `${product.productName}`, link: null },
  ]

  return (
    <div className="space-y-6">
      <AdminBreadCrumb items={items} />

      {/* PRODUCT MAIN CARD */}
      <div className="overflow-hidden rounded-2xl border border-mk-border-admin bg-white">
        <div className="grid grid-cols-1 gap-8 p-5 lg:grid-cols-[420px_1fr]">
          {/* IMAGES */}
          <div>
            {/* MAIN IMAGE */}
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-mk-border-admin bg-mk-bg-admin">
              {selectedImage ? (
                <img src={getImageUrl(selectedImage)} alt={product.productName} className="h-full w-full object-contain p-5" />
              ) : (
                <div className="text-center">
                  <ImageIcon size={40} className="mx-auto text-mk-subtle" />

                  <p className="mt-2 text-sm text-mk-subtle">No image available</p>
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
                    className={`aspect-square overflow-hidden rounded-xl border bg-white transition ${selectedImage === image ? 'border-mk-admin ring-2 ring-mk-border-admin' : 'border-mk-border-admin hover:border-mk-subtle'}`}
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
            <div className="border-b border-mk-border-admin pb-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-mk-ink-admin">{product.productName}</h2>

                  {product.brand?.brandName && <p className="mt-1 text-sm text-mk-muted-admin">{product.brand.brandName}</p>}
                </div>

                {/* STATUS */}
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${product.status === 'Active' ? 'bg-mk-surface text-mk-admin-hover' : 'bg-mk-danger-soft text-mk-danger'}`}>
                  <span className={`size-1.5 rounded-full ${product.status === 'Active' ? 'bg-mk-admin' : 'bg-mk-danger'}`} />

                  {product.status}
                </span>
              </div>

              {/* BEST SELLING */}
              {product.homeSection === 'BestSelling' && <span className="mt-3 inline-flex rounded-full bg-mk-surface px-3 py-1 text-xs font-semibold text-mk-admin">Best Selling</span>}
            </div>

            {/* PRICE */}
            <div className="border-b border-mk-border-admin py-5">
              <div className="flex items-end gap-3">
                <p className="text-3xl font-bold text-mk-ink-admin">₹{Number(product.discountPrice || product.price).toLocaleString('en-IN')}</p>

                {product.discount > 0 && (
                  <>
                    <p className="pb-1 text-sm text-mk-subtle line-through">₹{Number(product.price).toLocaleString('en-IN')}</p>

                    <span className="mb-1 rounded-md bg-mk-surface px-2 py-1 text-xs font-bold text-mk-admin-hover">{product.discount}% OFF</span>
                  </>
                )}
              </div>
            </div>

            {/* QUICK INFO */}
            <div className="grid grid-cols-2 gap-3 py-5 sm:grid-cols-4">
              <div className="rounded-xl bg-mk-surface p-3">
                <p className="text-[11px] text-mk-subtle">Stock</p>

                <p className="mt-1 text-base font-bold text-mk-ink-admin">{product.stock}</p>
              </div>

              <div className="rounded-xl bg-mk-surface p-3">
                <p className="text-[11px] text-mk-subtle">Rating</p>

                <p className="mt-1 text-base font-bold text-mk-ink-admin">⭐ {product.rating}</p>
              </div>

              <div className="rounded-xl bg-mk-surface p-3">
                <p className="text-[11px] text-mk-subtle">Sold</p>

                <p className="mt-1 text-base font-bold text-mk-ink-admin">{product.soldCount}</p>
              </div>

              <div className="rounded-xl bg-mk-surface p-3">
                <p className="text-[11px] text-mk-subtle">Discount</p>

                <p className="mt-1 text-base font-bold text-mk-ink-admin">{product.discount}%</p>
              </div>
            </div>

            {/* CATEGORY */}
            <div className="border-t border-mk-border-admin pt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-[11px] text-mk-subtle">Category</p>

                  <p className="mt-1 text-sm font-semibold text-mk-ink-admin">{product.category?.categoryName || '-'}</p>
                </div>

                <div>
                  <p className="text-[11px] text-mk-subtle">SubCategory</p>

                  <p className="mt-1 text-sm font-semibold text-mk-ink-admin">{product.subCategory?.subCategoryName || '-'}</p>
                </div>

                <div>
                  <p className="text-[11px] text-mk-subtle">Brand</p>

                  <p className="mt-1 text-sm font-semibold text-mk-ink-admin">{product.brand?.brandName || '-'}</p>
                </div>
              </div>
            </div>

            {/* SIZES */}
            <div className="mt-5 border-t border-mk-border-admin pt-5">
              <p className="text-[11px] text-mk-subtle">Available Sizes</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes?.length > 0 ? (
                  product.sizes.map((size) => (
                    <span key={size} className="rounded-lg border border-mk-border-admin bg-mk-bg-admin px-3 py-1.5 text-xs font-semibold text-mk-admin">
                      {size}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-mk-muted-admin">No sizes</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="rounded-2xl border border-mk-border-admin bg-white p-5">
        <div className="border-b border-mk-border-admin pb-4">
          <h3 className="text-base font-bold text-mk-ink-admin">Product Description</h3>
        </div>

        <p className="pt-4 text-sm leading-7 text-mk-muted-admin">{product.description || 'No description available.'}</p>
      </div>

      {/* WARRANTY & RETURN */}
      <div className="rounded-2xl border border-mk-border-admin bg-white p-5">
        <div className="border-b border-mk-border-admin pb-4">
          <h3 className="text-base font-bold text-mk-ink-admin">Warranty & Return</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-mk-border-admin bg-mk-bg-admin p-4">
            <p className="text-[11px] text-mk-subtle">Warranty</p>

            <p className="mt-1 text-sm font-semibold text-mk-ink-admin">{product.warranty || '-'}</p>
          </div>

          <div className="rounded-xl border border-mk-border-admin bg-mk-bg-admin p-4">
            <p className="text-[11px] text-mk-subtle">Duration</p>

            <p className="mt-1 text-sm font-semibold text-mk-ink-admin">{product.warrantyDuration || '-'}</p>
          </div>

          <div className="rounded-xl border border-mk-border-admin bg-mk-bg-admin p-4">
            <p className="text-[11px] text-mk-subtle">Warranty Type</p>

            <p className="mt-1 text-sm font-semibold text-mk-ink-admin">{product.warrantyType || '-'}</p>
          </div>

          <div className="rounded-xl border border-mk-border-admin bg-mk-bg-admin p-4">
            <p className="text-[11px] text-mk-subtle">Return Policy</p>

            <p className="mt-1 text-sm font-semibold text-mk-ink-admin">{product.returnPolicy || '-'}</p>
          </div>
        </div>

        {/* DELIVERY */}
        <div className="mt-4 rounded-xl bg-mk-surface p-4">
          <p className="text-[11px] text-mk-subtle">Delivery Information</p>

          <p className="mt-1 text-sm font-medium text-mk-ink-admin">{product.deliveryInfo || '-'}</p>
        </div>
      </div>
    </div>
  )
}
