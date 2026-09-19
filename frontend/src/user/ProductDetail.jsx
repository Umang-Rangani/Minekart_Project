import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../config/axiosConfig'
import { ShoppingCart, Star, Minus, Plus, Trash2, Heart, Truck, ShieldCheck, RotateCcw, BadgeCheck, Info, IndianRupee } from 'lucide-react'
import { useUser } from '../context/userProvider'
import { useCart } from '../context/CartProvider'
import BreadCrumb from './BreadCrumb'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, setShowLogin } = useUser()
  const { cart, addToCart, updateCartItem, removeCartItem } = useCart()
  // para Id
  const [product, setProduct] = useState(null)

  // img ne select krin show krvamate
  const [selectedImage, setSelectedImage] = useState('')

  // add to cart

  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(0)

  // ! 1. product loop mate
  const [relatedProducts, setRelatedProducts] = useState([])

  // ! 2. product loop mate
  const getRelatedProducts = async (subCategoryId) => {
    try {
      const res = await axiosInstance.get('/product')

      const products = res.data.data || []

      const filteredProducts = products.filter((item) => item.subCategory?._id === subCategoryId && item._id !== id)

      setRelatedProducts(filteredProducts)
    } catch (error) {
      console.error('Get related products error:', error.response?.data || error.message)
    }
  }

  // ! Get Product
  const getProduct = async () => {
    try {
      const res = await axiosInstance.get(`/product/${id}`)

      const data = res.data.data

      setProduct(data)

      if (data.images?.length > 0) {
        setSelectedImage(data.images[0])
      }

      if (data.subCategory?._id) {
        getRelatedProducts(data.subCategory._id)
      }
    } catch (error) {
      console.error('Get product error:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    getProduct()
  }, [id, cart])

  useEffect(() => {
    if (!cart?.items || !product) return

    const cartItem = cart.items.find((item) => item.productId?._id?.toString() === product._id?.toString() && item.size === (selectedSize || null))

    if (cartItem) {
      setQuantity(cartItem.quantity)
    } else {
      setQuantity(0)
    }
  }, [cart, product, selectedSize])

  // ! addtocart button
  const addProductToCart = async () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      return
    }

    const res = await addToCart({
      productId: product._id,
      quantity: 1,
      size: selectedSize || null,
    })

    if (res.success) {
      setQuantity(1)
    } else {
      console.log('Add to cart error:', res.message)
    }
  }

  const increaseQuantity = async () => {
    if (quantity >= product.stock) {
      return
    }

    const newQuantity = quantity + 1

    const res = await updateCartItem({
      productId: product._id,
      size: selectedSize || null,
      quantity: newQuantity,
    })

    if (res.success) {
      setQuantity(newQuantity)
    } else {
      console.log('Increase quantity error:', res.message)
    }
  }

  const decreaseQuantity = async () => {
    if (quantity === 1) {
      const res = await removeCartItem({
        productId: product._id,
        size: selectedSize || null,
      })

      if (res.success) {
        setQuantity(0)
      } else {
        console.log('Remove cart error:', res.message)
      }

      return
    }

    const newQuantity = quantity - 1

    const res = await updateCartItem({
      productId: product._id,
      size: selectedSize || null,
      quantity: newQuantity,
    })

    if (res.success) {
      setQuantity(newQuantity)
    } else {
      console.log('Decrease quantity error:', res.message)
    }
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-[#64748B]">Loading product...</p>
      </div>
    )
  }

  console.log('quantity', quantity)

  // ! BreadCrumb
  const items = [
    { title: `${product.category?.categoryName}`, link: `/category/${product?.category?._id}/products` },
    { title: `${product.subCategory?.subCategoryName}`, link: null },
  ]

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <BreadCrumb items={items} />

      {/* Product Section */}
      <div className="mx-auto pt-5">
        {/*  main product */}
        <div className="rounded-[14px] ">
          <div className="grid grid-cols-1 lg:grid-cols-[53%_47%] gap-5 ">
            {/* leftside */}
            <div className=" self-start border border-[#E2E8F0]   lg:sticky lg:top-25  rounded-2xl overflow-hidden ">
              {/* Image Area */}
              <div className=" bg-white p-3 shadow-sm sm:p-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* map img */}
                  <div className="order-2 flex gap-5 overflow-x-auto sm:order-1 sm:w-19 sm:flex-col sm:overflow-visible">
                    {product.images?.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onMouseEnter={() => setSelectedImage(image)}
                        className={`group relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border bg-white p-2 transition-all duration-200 ${
                          selectedImage === image ? 'border-[#1D4ED8] bg-[#EFF6FF] shadow-md ring-2 ring-[#DBEAFE]' : 'border-[#E2E8F0] hover:-translate-y-0.5 hover:border-[#93C5FD] hover:shadow-sm'
                        }`}
                      >
                        <img src={`http://localhost:3000${image}`} alt={`${product.productName} ${index + 1}`} className="h-full w-full object-contain transition duration-200 group-hover:scale-105" />
                      </button>
                    ))}
                  </div>

                  {/* main img */}
                  <div className="relative order-1 flex min-h-95 flex-1 items-center justify-center overflow-hidden rounded-[20px] bg-linear-to-br from-[#F8FAFC] via-white to-[#EFF6FF] p-6 sm:min-h-125">
                    {selectedImage ? (
                      <img src={`http://localhost:3000${selectedImage}`} alt={product.productName} className="relative z-10 max-h-117 w-full object-contain transition duration-500 hover:scale-[1.03]" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#64748B]">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F9]">
                          <Info size={24} />
                        </div>

                        <p className="text-sm font-medium">No image available</p>
                      </div>
                    )}

                    {/* Image Counter */}
                    {product.images?.length > 0 && (
                      <div className="absolute bottom-4 right-4 z-20 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#475569] shadow-sm backdrop-blur">
                        {product.images.findIndex((image) => image === selectedImage) + 1} / {product.images.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* right side */}
            <div className="bg-white p-5 sm:p-6 lg:p-7 rounded-2xl border border-[#E2E8F0] overflow-hidden">
              {/* product header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-md bg-[#FFF7ED] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#B45309]">{product.category?.categoryName}</span>

                  <h1 className="mt-2.5 text-xl font-bold leading-7 tracking-tight text-[#292725] sm:text-2xl">{product.productName}</h1>
                </div>

                {/* Wishlist */}
                {/* <button
                  type="button"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E3DED6] bg-white text-[#6F6A64] shadow-sm transition-all duration-200 hover:border-[#F9A8D4] hover:bg-[#FDF2F8] hover:text-[#DB2777]"
                >
                  <Heart size={19} strokeWidth={2} className="transition-transform duration-200 group-hover:scale-110" />
                </button> */}
              </div>

              {/* brand */}
              {product.brand?.brandName && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FFF7ED]">
                    <BadgeCheck size={14} className="text-[#D97706]" />
                  </div>

                  <p className="text-xs text-[#6F6A64]">
                    Brand: <span className="font-semibold text-[#292725]">{product.brand.brandName}</span>
                  </p>
                </div>
              )}

              {/* rating */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 rounded-md bg-[#16A34A] px-2.5 py-1 text-xs font-bold text-white">
                  <Star size={13} fill="currentColor" strokeWidth={2} />

                  <span>{product.rating}</span>
                </div>

                <span className="text-xs text-[#6F6A64]">Customer Rating</span>

                {product.soldCount > 0 && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#CBD5E1]" />

                    <span className="text-xs font-medium text-[#6F6A64]">{product.soldCount}+ sold</span>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-[#E3DED6]" />

              {/* price */}
              <div className="rounded-xl border border-[#E3DED6] bg-[#FFFBF5] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-extrabold tracking-tight text-[#292725]">₹{product.discountPrice}</span>

                  {product.price > product.discountPrice && (
                    <>
                      <span className="text-sm text-[#99938B] line-through">₹{product.price}</span>

                      <span className="rounded-md bg-[#FEF3C7] px-2 py-1 text-[10px] font-bold text-[#B45309]">{product.discount}% OFF</span>
                    </>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />

                  <p className="text-[11px] text-[#6F6A64]">Inclusive of all taxes</p>
                </div>
              </div>

              {/* description */}
              <div className="mt-6">
                <div className="mb-2.5 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#FFF7ED]">
                    <Info size={15} strokeWidth={2} className="text-[#D97706]" />
                  </div>

                  <h2 className="text-sm font-bold text-[#292725]">About this product</h2>
                </div>

                <div className="rounded-lg bg-[#F8F6F2] p-3">
                  <p className="text-xs leading-5 text-[#6F6A64]">{product.description || 'No description available.'}</p>
                </div>
              </div>

              {/* size */}
              {product.sizes?.length > 0 && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-[#292725]">Select Size</h2>

                      <p className="mt-0.5 text-[11px] text-[#6F6A64]">Choose your preferred size</p>
                    </div>

                    <button type="button" className="rounded-md px-2 py-1 text-[11px] font-semibold text-[#B45309] transition hover:bg-[#FFF7ED]">
                      Size Guide
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {product.sizes.map((size) => {
                      const selected = selectedSize === size

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            setSelectedSize(size)
                          }}
                          className={`flex h-10 min-w-14 items-center justify-center rounded-lg border px-4 text-xs font-bold transition-all duration-200 ${
                            selected ? 'border-[#D97706] bg-[#F59E0B] text-white shadow-sm' : 'border-[#E3DED6] bg-white text-[#292725] hover:border-[#F59E0B] hover:bg-[#FFF7ED] hover:text-[#B45309]'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>

                  {/* No Size */}
                  {!selectedSize && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#FFFBEB] px-3 py-2">
                      <Info size={13} className="shrink-0 text-[#D97706]" />

                      <p className="text-[11px] text-[#92400E]">Please select a size before adding to cart.</p>
                    </div>
                  )}

                  {/* Selected Size */}
                  {selectedSize && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-[#FFFBEB] px-3 py-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F59E0B] text-[9px] font-bold text-white">✓</div>

                      <p className="text-[11px] font-medium text-[#92400E]">
                        Selected Size: <span className="font-bold">{selectedSize}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* delivery */}
              <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] p-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Truck size={18} strokeWidth={2} className="text-[#D97706]" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-[#292725]">Delivery available</p>

                    <span className="rounded-full bg-[#DCFCE7] px-1.5 py-0.5 text-[9px] font-bold text-[#16A34A]">AVAILABLE</span>
                  </div>

                  <p className="mt-0.5 text-[11px] leading-4 text-[#6F6A64]">{product.deliveryInfo || 'Fast and reliable delivery available.'}</p>
                </div>
              </div>

              {/* wraranty */}
              {product.warrantyType !== 'No Warranty' && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#E3DED6] bg-[#F8F6F2] px-3.5 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                    <ShieldCheck size={17} strokeWidth={2} className="text-[#7C3AED]" />
                  </div>

                  <div>
                    <p className="text-[11px] text-[#6F6A64]">Warranty</p>

                    <p className="mt-0.5 text-xs font-bold text-[#292725]">
                      {product.warrantyType}

                      {product.warrantyDuration && ` • ${product.warrantyDuration}`}
                    </p>
                  </div>
                </div>
              )}

              {/* add to cartx */}
              <div className="mt-6 w-80 mx-auto">
                {quantity === 0 ? (
                  // Add To Cart
                  <button
                    type="button"
                    onClick={addProductToCart}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#FCD200] bg-[#FFD814] px-5 text-sm font-semibold text-[#0F1111] shadow-sm transition hover:bg-[#F7CA00] hover:shadow-md active:scale-[0.99]"
                  >
                    <ShoppingCart size={18} strokeWidth={2.2} />

                    <span>Add to cart</span>
                  </button>
                ) : (
                  // Quantity Control
                  <div className="flex h-11 w-full items-center  overflow-hidden rounded-xl border border-[#FCD200] bg-white shadow-sm">
                    {/* Left - Trash / Minus */}
                    <button type="button" onClick={decreaseQuantity} className="flex h-full w-12 shrink-0 items-center justify-center text-[#0F1111] transition hover:bg-[#F7CA00] border-x border-[#FCD200]">
                      {quantity === 1 ? <Trash2 size={18} strokeWidth={2.3} /> : <Minus size={19} strokeWidth={2.5} />}
                    </button>

                    {/* Quantity */}
                    <div className="flex h-full flex-1 items-center justify-center ">
                      <span className="text-sm font-bold text-[#0F1111]">{quantity} in cart</span>
                    </div>

                    {/* Plus */}
                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= product.stock}
                      className="flex h-full w-12 shrink-0 items-center justify-center text-[#0F1111] transition hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-40 border-x border-[#FCD200]"
                    >
                      <Plus size={19} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

                {/* Stock */}
                <p className="mt-2 text-[11px] text-[#565959]">{product.stock} items available</p>
              </div>

              {/* benefits */}
              <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-[#E3DED6] bg-white">
                {/* Returns */}
                <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF7ED]">
                    <RotateCcw size={15} strokeWidth={2} className="text-[#D97706]" />
                  </div>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#6F6A64]">Easy Returns</p>
                </div>

                {/* Payment */}
                <div className="flex flex-col items-center justify-center border-x border-[#E3DED6] px-2 py-3.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F3FF]">
                    <ShieldCheck size={15} strokeWidth={2} className="text-[#7C3AED]" />
                  </div>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#6F6A64]">Secure Payment</p>
                </div>

                {/* Genuine */}
                <div className="flex flex-col items-center justify-center px-2 py-3.5 text-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF5]">
                    <BadgeCheck size={15} strokeWidth={2} className="text-[#16A34A]" />
                  </div>

                  <p className="mt-1.5 text-[10px] font-semibold text-[#6F6A64]">Genuine Product</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* products map */}
      {relatedProducts.length > 0 && (
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-[#172033]">More from {product.subCategory?.subCategoryName}</h2>

            <p className="mt-1 text-sm text-[#64748B]">Explore more products from this category</p>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_8px_25px_rgba(29,78,216,0.10)]"
              >
                {/* Product Image */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#F8FAFC] p-4">
                  {item.images?.length > 0 ? (
                    <img src={`http://localhost:3000${item.images[0]}`} alt={item.productName} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <span className="text-sm text-[#94A3B8]">No Image</span>
                  )}

                  {/* Discount */}
                  {item.price > item.discountPrice && <span className="absolute left-3 top-3 rounded-md bg-[#16A34A] px-2 py-1 text-[10px] font-bold text-white">{item.discount}% OFF</span>}
                </div>

                {/* Product Info */}
                <div className="border-t border-[#E2E8F0] p-4">
                  {/* Name */}
                  <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-[#172033] transition-colors group-hover:text-[#1D4ED8]">{item.productName}</h3>

                  {/* Price */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-extrabold text-[#172033]">₹{item.discountPrice.toLocaleString('en-IN')}</span>

                    {item.price > item.discountPrice && <span className="text-xs font-medium text-[#94A3B8] line-through">₹{item.price.toLocaleString('en-IN')}</span>}
                  </div>

                  {/* Rating */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-md bg-[#16A34A] px-2 py-1 text-xs font-bold text-white">
                      {item.rating}

                      <Star size={11} fill="currentColor" strokeWidth={2} />
                    </span>

                    <span className="text-[11px] font-medium text-[#64748B]">Rating</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
