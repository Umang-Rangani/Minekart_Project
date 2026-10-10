import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronDown, ChevronRight, Filter, Package, Search, ShoppingCart, SlidersHorizontal, Sparkles, Star, X } from 'lucide-react'

import { axiosInstance } from '../config/axiosConfig'
import { getImageUrl } from '../utils/imageUrl'
import BreadCrumb from './BreadCrumb'
import ProductsShimmer from '../userShimmer/ProductsShimmer'
import { FilterListShimmer, PriceFilterShimmer, ProductsGridShimmer } from '../userShimmer/ProductsPageShimmer'

const SEARCH_STORAGE_KEY = 'minekart_products_search'
const FILTER_STORAGE_KEY = 'minekart_products_filters'

const getSavedFilters = () => {
  try {
    const saved = sessionStorage.getItem(FILTER_STORAGE_KEY)

    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Get saved filters error:', error)
  }

  return {
    selectedCategory: 'All',
    selectedBrand: 'All',
    selectedRating: 'All',
    stockOnly: false,
    sortBy: 'latest',
    priceLimit: null,
  }
}

export default function Products() {
  const savedFilters = getSavedFilters()

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)

  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [brandsLoading, setBrandsLoading] = useState(true)

  const [search, setSearch] = useState(() => {
    try {
      return localStorage.getItem(SEARCH_STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })

  const [selectedCategory, setSelectedCategory] = useState(savedFilters.selectedCategory || 'All')

  const [selectedBrand, setSelectedBrand] = useState(savedFilters.selectedBrand || 'All')

  const [selectedRating, setSelectedRating] = useState(savedFilters.selectedRating || 'All')

  const [stockOnly, setStockOnly] = useState(savedFilters.stockOnly || false)

  const [sortBy, setSortBy] = useState(savedFilters.sortBy || 'latest')

  const [maxPrice, setMaxPrice] = useState(0)

  const [priceLimit, setPriceLimit] = useState(savedFilters.priceLimit ?? 0)

  const [categories, setCategories] = useState([
    {
      id: 'All',
      name: 'All',
    },
  ])

  const [brands, setBrands] = useState([
    {
      id: 'All',
      name: 'All',
    },
  ])

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const initialFetchStartedRef = useRef(false)
  const firstFilterEffectRef = useRef(true)
  const skipFilterRef = useRef(false)
  const initialFetchDoneRef = useRef(false)

  const categoryInitialLoadRef = useRef(true)

  // Save search in localStorage

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    try {
      if (search.trim()) {
        localStorage.setItem(SEARCH_STORAGE_KEY, search)
      } else {
        localStorage.removeItem(SEARCH_STORAGE_KEY)
      }
    } catch (error) {
      console.error('Save search error:', error)
    }
  }, [search])

  // Save filters in sessionStorage

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    try {
      const filters = {
        selectedCategory,
        selectedBrand,
        selectedRating,
        stockOnly,
        sortBy,
        priceLimit,
      }

      sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters))
    } catch (error) {
      console.error('Save filters error:', error)
    }
  }, [selectedCategory, selectedBrand, selectedRating, stockOnly, sortBy, priceLimit])

  // GET CATEGORIES

  const getCategories = async () => {
    try {
      setCategoriesLoading(true)

      const res = await axiosInstance.get('/category')

      const data = res.data?.data || []

      const activeCategories = data
        .filter((category) => category.status === 'Active')
        .map((category) => ({
          id: category._id,
          name: category.categoryName,
        }))

      setCategories([
        {
          id: 'All',
          name: 'All',
        },
        ...activeCategories,
      ])
    } catch (error) {
      console.error('Get Categories Error:', error.response?.data || error.message)

      setCategories([
        {
          id: 'All',
          name: 'All',
        },
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }

  // GET BRANDS

  const getBrands = async (categoryId = 'All') => {
    try {
      setBrandsLoading(true)

      const params = {}

      if (categoryId !== 'All') {
        params.category = categoryId
      }

      const res = await axiosInstance.get('/brand', {
        params,
      })

      const data = res.data?.data || []

      const activeBrands = data.map((brand) => ({
        id: brand._id,
        name: brand.brandName,
      }))

      setBrands([
        {
          id: 'All',
          name: 'All',
        },
        ...activeBrands,
      ])
    } catch (error) {
      console.error('Get Brands Error:', error.response?.data || error.message)

      setBrands([
        {
          id: 'All',
          name: 'All',
        },
      ])
    } finally {
      setBrandsLoading(false)
    }
  }

  // GET PRODUCTS

  const fetchProducts = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true)
      } else {
        setProductsLoading(true)
      }

      const params = {
        sort: sortBy,
      }

      // Search

      if (search.trim()) {
        params.search = search.trim()
      }

      // Category

      if (selectedCategory !== 'All') {
        params.category = selectedCategory
      }

      // Brand

      if (selectedBrand !== 'All') {
        params.brand = selectedBrand
      }

      // Rating

      if (selectedRating !== 'All') {
        params.rating = selectedRating
      }

      // Stock

      if (stockOnly) {
        params.stock = 'true'
      }

      // Maximum price

      if (maxPrice > 0 && priceLimit >= 0 && priceLimit < maxPrice) {
        params.maxPrice = priceLimit
      }

      const res = await axiosInstance.get('/product/filter', {
        params,
      })

      const data = res.data?.data || []

      setProducts(data)

      // Initial API response mathi maximum effective price calculate karishu.

      if (isInitialLoad) {
        let highestPrice = 0

        data.forEach((product) => {
          const originalPrice = Number(product.price || 0)

          const discountPrice = Number(product.discountPrice || 0)

          const effectivePrice = discountPrice > 0 ? discountPrice : originalPrice

          if (effectivePrice > highestPrice) {
            highestPrice = effectivePrice
          }
        })

        setMaxPrice(highestPrice)

        const savedPriceLimit = savedFilters.priceLimit

        const finalPriceLimit = savedPriceLimit !== null && savedPriceLimit >= 0 ? Math.min(savedPriceLimit, highestPrice) : highestPrice

        // Saved price maximum hoy to extra API avoid karo.

        if (finalPriceLimit === highestPrice) {
          skipFilterRef.current = true
        } else {
          skipFilterRef.current = false
        }

        setPriceLimit(finalPriceLimit)
      }
    } catch (error) {
      console.error('Get filtered products error:', error.response?.data || error.message)

      setProducts([])

      if (isInitialLoad) {
        setMaxPrice(0)
        setPriceLimit(0)
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      } else {
        setProductsLoading(false)
      }
    }
  }

  // CATEGORY API

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    document.title = `Products | MineKart`

    getCategories()
  }, [])

  // CATEGORY + BRAND API

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    getBrands(selectedCategory)

    // Initial load par saved brand preserve karvo.

    if (categoryInitialLoadRef.current) {
      categoryInitialLoadRef.current = false

      return
    }

    // User manually category change kare to brand reset.

    setSelectedBrand('All')
  }, [selectedCategory])

  // INITIAL PRODUCTS API

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    if (initialFetchStartedRef.current) {
      return
    }

    initialFetchStartedRef.current = true

    const loadInitialProducts = async () => {
      await fetchProducts(true)

      initialFetchDoneRef.current = true
    }

    loadInitialProducts()
  }, [])

  // Every search/filter/sort change backend API par jase.

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })

    if (firstFilterEffectRef.current) {
      firstFilterEffectRef.current = false

      return
    }

    if (!initialFetchDoneRef.current) {
      return
    }

    if (skipFilterRef.current) {
      skipFilterRef.current = false

      return
    }

    const timer = setTimeout(() => {
      fetchProducts(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, selectedCategory, selectedBrand, selectedRating, stockOnly, priceLimit, sortBy])

  // CLEAR FILTERS

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('All')
    setSelectedBrand('All')
    setSelectedRating('All')
    setStockOnly(false)
    setPriceLimit(maxPrice)
    setSortBy('latest')

    try {
      localStorage.removeItem(SEARCH_STORAGE_KEY)

      sessionStorage.removeItem(FILTER_STORAGE_KEY)
    } catch (error) {
      console.error('Clear storage error:', error)
    }
  }

  // CHECK ACTIVE FILTERS

  const hasFilters = Boolean(search.trim()) || selectedCategory !== 'All' || selectedBrand !== 'All' || selectedRating !== 'All' || stockOnly || priceLimit < maxPrice || sortBy !== 'latest'

  // SORT OPTIONS

  const sortOptions = [
    {
      value: 'latest',
      label: 'Latest',
    },
    {
      value: 'priceLow',
      label: 'Price: Low to High',
    },
    {
      value: 'priceHigh',
      label: 'Price: High to Low',
    },
    {
      value: 'rating',
      label: 'Top Rated',
    },
    {
      value: 'sold',
      label: 'Most Sold',
    },
  ]

  const currentSortLabel = sortOptions.find((item) => item.value === sortBy)?.label || 'Latest'

  const items = [
    {
      title: 'Products',
      link: null,
    },
  ]

  // INITIAL LOADING

  if (loading) {
    return <ProductsShimmer items={items} />
  }

  return (
    <section className="w-full pb-8 sm:pb-10">
      <BreadCrumb items={items} />

      <div className="mx-auto w-full pt-2.5 sm:pt-4">
        {/* Header */}

        <div className="mb-3 flex h-auto min-h-14 flex-col gap-2 overflow-visible rounded-lg border border-[#E8DDD4] bg-[#FFFDFC] px-2 py-2 shadow-[0_2px_10px_rgba(73,54,49,0.05)] sm:mb-4 sm:h-15 sm:flex-row sm:items-center sm:gap-4 sm:px-3.5 sm:py-0">
          {/* Title */}

          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-[#7D171C] to-[#A51D26] text-white shadow-[0_3px_10px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <Sparkles size={16} strokeWidth={1.8} className="relative z-10 sm:h-4.5 sm:w-4.5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-[#351C18] sm:text-base">All Products</h1>

              <p className="mt-0.5 truncate text-[8px] text-[#806C63] sm:text-[9px]">Explore our complete product collection</p>
            </div>
          </div>

          {/* Search + Sort */}

          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            {/* Search */}

            <div className="relative min-w-0 flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9A857B] sm:left-3 sm:h-3.5 sm:w-3.5" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  selectedCategory !== 'All' && selectedBrand !== 'All'
                    ? `Search ${categories.find((cat) => cat.id === selectedCategory)?.name || 'category'} & ${brands.find((brand) => brand.id === selectedBrand)?.name || 'brand'}...`
                    : selectedCategory !== 'All'
                      ? `Search products in ${categories.find((cat) => cat.id === selectedCategory)?.name || 'category'}...`
                      : selectedBrand !== 'All'
                        ? `Search products in ${brands.find((brand) => brand.id === selectedBrand)?.name || 'brand'}...`
                        : selectedRating !== 'All'
                          ? `Search products with ${selectedRating}★+ rating...`
                          : priceLimit > 0
                            ? `Search products under ₹${priceLimit.toLocaleString('en-IN')}...`
                            : 'Search products from categories & brands...'
                }
                className="h-8 w-full rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] pl-8 pr-8 text-[10px] text-[#351C18] outline-none transition placeholder:text-[#AA9991] focus:border-[#B98578] focus:ring-2 focus:ring-[#8E181F]/10 sm:h-9 sm:pl-9 sm:pr-9 sm:text-xs"
              />

              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A857B] transition-colors hover:text-[#8E181F]">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort */}

            <div className="relative z-40 shrink-0">
              <button
                type="button"
                onClick={() => setSortOpen((prev) => !prev)}
                className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-[#E2D5CC] bg-white px-2 text-[9px] font-semibold text-[#66544D] transition hover:bg-[#F8EEE8] sm:h-9 sm:px-2.5 sm:text-[10px]"
              >
                <span className="hidden sm:inline">Sort:</span>

                <span className="max-w-17.5 truncate sm:max-w-none">{currentSortLabel}</span>

                <ChevronDown size={11} className={`shrink-0 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>

              {sortOpen && (
                <>
                  {/* Overlay */}

                  <button type="button" aria-label="Close sort menu" className="fixed inset-0 z-55 cursor-default bg-transparent" onClick={() => setSortOpen(false)} />

                  {/* Desktop Sort Dropdown */}

                  <div className="absolute right-0 top-full z-60 mt-1 hidden w-44 overflow-hidden rounded-lg border border-[#E8DDD4] bg-white p-1 shadow-[0_10px_25px_rgba(73,54,49,0.14)] sm:block">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value)
                          setSortOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[10px] font-semibold transition ${sortBy === option.value ? 'bg-[#F7EEE7] text-[#8E181F]' : 'text-[#66544D] hover:bg-[#FBF5F1]'}`}
                      >
                        <span>{option.label}</span>

                        {sortBy === option.value && <Check size={12} />}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Sort Menu */}

                  <div className="fixed bottom-2 left-2 right-2 z-60 overflow-hidden rounded-xl border border-[#E8DDD4] bg-white p-1.5 shadow-[0_12px_35px_rgba(73,54,49,0.18)] sm:hidden">
                    <div className="mb-0.5 flex items-center justify-between px-2 py-1.5">
                      <span className="text-[11px] font-extrabold text-[#351C18]">Sort Products</span>

                      <button type="button" onClick={() => setSortOpen(false)} className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F7EEE7] text-[#8E181F]">
                        <X size={12} />
                      </button>
                    </div>

                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value)
                          setSortOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[10px] font-semibold transition ${sortBy === option.value ? 'bg-[#F7EEE7] text-[#8E181F]' : 'text-[#66544D] hover:bg-[#FBF5F1]'}`}
                      >
                        <span>{option.label}</span>

                        {sortBy === option.value && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}

        <div className="mb-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-[#E2D5CC] bg-[#FFFDFC] px-3 text-[10px] font-bold text-[#351C18] transition hover:border-[#CDAFA4] hover:bg-[#F8EEE8]"
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>
        </div>

        <div className="flex gap-4">
          {/* Desktop Filters */}

          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-4 rounded-xl border border-[#E8DDD4] bg-[#FFFDFC] p-3 shadow-[0_3px_14px_rgba(73,54,49,0.05)]">
              {/* Filter Header */}

              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Filter size={13} className="text-[#8E181F]" />

                  <h2 className="text-xs font-extrabold text-[#351C18]">Filters</h2>
                </div>

                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="text-[9px] font-bold text-[#8E181F] hover:underline">
                    Clear
                  </button>
                )}
              </div>

              {/* Category */}

              <div className="border-t border-[#EEE5DF] pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Category</p>

                {categoriesLoading ? (
                  <FilterListShimmer count={6} />
                ) : (
                  <div className="space-y-0.5">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[10px] font-semibold transition ${
                          selectedCategory === category.id ? 'bg-[#F7EEE7] text-[#8E181F]' : 'text-[#66544D] hover:bg-[#FBF5F1]'
                        }`}
                      >
                        <span className="truncate">{category.name}</span>

                        {selectedCategory === category.id && <Check size={12} className="shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand */}

              <div className="mt-3 border-t border-[#EEE5DF] pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Brand</p>

                {brandsLoading ? (
                  <FilterListShimmer count={5} />
                ) : (
                  <div className="max-h-40 space-y-0.5 overflow-y-auto pr-0.5">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[10px] font-semibold transition ${selectedBrand === brand.id ? 'bg-[#F7EEE7] text-[#8E181F]' : 'text-[#66544D] hover:bg-[#FBF5F1]'}`}
                      >
                        <span className="truncate">{brand.name}</span>

                        {selectedBrand === brand.id && <Check size={12} className="shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}

              <div className="mt-3 border-t border-[#EEE5DF] pt-3">
                {maxPrice <= 0 ? (
                  <PriceFilterShimmer />
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Max Price</p>

                      <span className="text-[9px] font-bold text-[#8E181F]">₹{priceLimit.toLocaleString('en-IN')}</span>
                    </div>

                    <input type="range" min="0" max={maxPrice || 1} value={priceLimit} onChange={(e) => setPriceLimit(Number(e.target.value))} className="h-1.5 w-full accent-[#8E181F]" />

                    <div className="mt-1 flex justify-between text-[8px] text-[#9A857B]">
                      <span>₹0</span>

                      <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Rating */}

              <div className="mt-3 border-t border-[#EEE5DF] pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Rating</p>

                {[4, 3, 2].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(selectedRating === String(rating) ? 'All' : String(rating))}
                    className={`mb-0.5 flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-semibold transition ${selectedRating === String(rating) ? 'bg-[#F7EEE7] text-[#8E181F]' : 'text-[#66544D] hover:bg-[#FBF5F1]'}`}
                  >
                    <Star size={10} fill="currentColor" />
                    {rating} & above
                  </button>
                ))}
              </div>

              {/* Stock */}

              <div className="mt-3 border-t border-[#EEE5DF] pt-3">
                <button type="button" onClick={() => setStockOnly((prev) => !prev)} className="flex w-full items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#66544D]">In Stock Only</span>

                  <span className={`flex h-4.5 w-8 items-center rounded-full p-0.5 transition ${stockOnly ? 'bg-[#8E181F]' : 'bg-[#D9CEC8]'}`}>
                    <span className={`h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${stockOnly ? 'translate-x-3.5' : 'translate-x-0'}`} />
                  </span>
                </button>
              </div>
            </div>
          </aside>

          {/* Products Area */}

          <div className="min-w-0 flex-1">
            {productsLoading ? (
              <ProductsGridShimmer count={10} />
            ) : products.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[#D8C9C0] bg-[#FFFDFC] px-4 text-center sm:min-h-72 sm:rounded-2xl sm:px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F7EEE7] text-[#8E181F] sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Package size={24} strokeWidth={1.5} />
                </div>

                <h3 className="mt-3 text-xs font-extrabold text-[#351C18] sm:mt-4 sm:text-base">No Products Found</h3>

                <p className="mt-1 max-w-sm text-[9px] text-[#806C63] sm:text-xs">We couldn't find any products matching your current filters.</p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] px-3.5 py-2 text-[9px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:mt-4 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5 xl:gap-4">
                {products.map((product) => {
                  const isInactive = product.status !== 'Active'
                  const isCategoryInactive = product.category?.status !== 'Active'
                  const isOutOfStock = Number(product.stock || 0) <= 0

                  const isDisabled = isInactive || isCategoryInactive || isOutOfStock

                  const unavailableLabel = isInactive || isCategoryInactive ? 'Currently Unavailable' : isOutOfStock ? 'Out of Stock' : ''

                  const isLowStock = !isDisabled && Number(product.stock || 0) <= 5

                  const displayPrice = Number(product.discountPrice || 0) > 0 ? Number(product.discountPrice) : Number(product.price || 0)

                  return (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className={`group relative overflow-hidden rounded-lg border transition-all duration-300 sm:rounded-xl ${
                        isDisabled ? 'cursor-pointer border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#E8DDD4] bg-[#FFFDFC] shadow-[0_2px_8px_rgba(73,54,49,0.05)] hover:-translate-y-1 hover:border-[#CDAFA4] hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)]'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white p-2 sm:p-3">
                        {!isDisabled && <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#A51D26]/5 transition-transform duration-500 group-hover:scale-150 sm:-right-8 sm:-top-8 sm:h-24 sm:w-24" />}

                        {product.discount > 0 && (
                          <span
                            className={`absolute left-1.5 top-1.5 z-20 rounded-md px-1.5 py-0.5 text-[6.5px] font-extrabold text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px] ${
                              isDisabled ? 'bg-linear-to-r from-[#777] to-[#999]' : 'bg-linear-to-r from-[#7D171C] to-[#A51D26]'
                            }`}
                          >
                            {product.discount}% OFF
                          </span>
                        )}

                        {isDisabled ? (
                          <span
                            className={`absolute right-1.5 top-1.5 z-20 rounded-md px-1.5 py-0.5 text-[6.5px] font-bold sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px] ${
                              isInactive || isCategoryInactive || isOutOfStock ? 'border border-[#E8D5CB] bg-[#FFF8F3] text-[#8E181F]' : 'bg-[#E5E5E5] text-[#888]'
                            }`}
                          >
                            {unavailableLabel}
                          </span>
                        ) : isLowStock ? (
                          <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-[#FFF5E7] px-1.5 py-0.5 text-[6.5px] font-bold text-[#B87935] sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Only {product.stock} left</span>
                        ) : null}

                        {product.images?.length > 0 ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.productName}
                            className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-500 group-hover:scale-105'}`}
                          />
                        ) : (
                          <div className={`relative z-10 flex flex-col items-center gap-1 ${isDisabled ? 'text-[#999]' : 'text-[#9A857B]'}`}>
                            <ShoppingCart size={22} strokeWidth={1.5} className="sm:h-6 sm:w-6" />

                            <span className="text-[7px] sm:text-[8px]">No Image</span>
                          </div>
                        )}

                        {!isDisabled && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-[#351C18]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-14" />}
                      </div>

                      {/* Info */}

                      <div className={`border-t px-1.5 py-1.5 sm:px-2.5 sm:py-2.5 ${isDisabled ? 'border-[#D9D9D9] bg-[#F3F3F3]' : 'border-[#EEE5DF] bg-[#FFFCFA] transition-colors duration-300 group-hover:bg-[#FBF5F1]'}`}>
                        <p className={`truncate text-[6.5px] font-bold uppercase tracking-wider sm:text-[8px] ${isDisabled ? 'text-[#999]' : 'text-[#9A857B]'}`}>{product.category?.categoryName || 'Product'}</p>

                        <h3 className={`mt-1 line-clamp-2 min-h-8 text-[10px] font-bold leading-4 sm:min-h-10 sm:text-[12px] sm:leading-5 ${isDisabled ? 'text-[#777]' : 'text-[#351C18] transition-colors duration-300 group-hover:text-[#8E181F]'}`}>
                          {product.productName}
                        </h3>

                        {/* Rating */}

                        <div className="mt-1 flex items-center gap-1 sm:mt-1.5 sm:gap-1">
                          <span className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[7px] font-bold sm:px-1.5 sm:text-[8px] ${isDisabled ? 'bg-[#E5E5E5] text-[#888]' : 'bg-[#3E8B62] text-white'}`}>
                            {Number(product.rating || 0).toFixed(1)}

                            <Star size={6} fill="currentColor" strokeWidth={2} className="sm:h-1.75 sm:w-1.75" />
                          </span>

                          {Number(product.soldCount || 0) > 0 && (
                            <>
                              <span className={`h-0.5 w-0.5 rounded-full ${isDisabled ? 'bg-[#BDBDBD]' : 'bg-[#C9B8AF]'}`} />

                              <span className={`truncate text-[6.5px] font-medium sm:text-[8px] ${isDisabled ? 'text-[#999]' : 'text-[#806C63]'}`}>{product.soldCount}+ sold</span>
                            </>
                          )}
                        </div>

                        {/* Price */}

                        <div className="mt-1 flex items-baseline gap-1 sm:mt-1.5 sm:gap-1">
                          <span className={`text-[12px] font-extrabold tracking-tight sm:text-[14px] ${isDisabled ? 'text-[#777]' : 'text-[#351C18]'}`}>₹{displayPrice.toLocaleString('en-IN')}</span>

                          {Number(product.price || 0) > displayPrice && (
                            <>
                              <span className={`text-[7px] line-through sm:text-[9px] ${isDisabled ? 'text-[#AAA]' : 'text-[#9A857B]'}`}>₹{Number(product.price).toLocaleString('en-IN')}</span>

                              {!isDisabled && <span className="text-[6.5px] font-bold text-[#3E8B62] sm:text-[8px]">{product.discount}% off</span>}
                            </>
                          )}
                        </div>

                        {/* Bottom */}

                        <div className={`mt-1 flex items-center justify-between border-t pt-1 sm:mt-1.5 sm:pt-1.5 ${isDisabled ? 'border-[#D9D9D9]' : 'border-[#EFE5DF]'}`}>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${isDisabled ? 'bg-[#999]' : isLowStock ? 'bg-[#B87935]' : 'bg-[#3E8B62]'}`} />

                            <span className={`text-[6.5px] font-bold sm:text-[8px] ${isDisabled ? 'text-[#888]' : isLowStock ? 'text-[#B87935]' : 'text-[#3E8B62]'}`}>
                              {isInactive || isCategoryInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}
                            </span>
                          </div>
                          <span className={`flex items-center gap-0.5 text-[7px] font-bold transition-all duration-300 sm:text-[9px] ${isDisabled ? 'text-[#999]' : 'text-[#8E181F] group-hover:gap-1'}`}>
                            View
                            <ChevronRight size={9} className={`transition-transform duration-300 sm:h-2.5 sm:w-2.5 ${isDisabled ? '' : 'group-hover:translate-x-0.5'}`} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter */}

        {mobileFilterOpen && (
          <div className="fixed inset-0 z-100 lg:hidden">
            {/* Overlay */}

            <div className="absolute inset-0 bg-[#351C18]/40 backdrop-blur-[2px]" onClick={() => setMobileFilterOpen(false)} />

            {/* Bottom Sheet */}

            <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-2xl bg-[#FFFDFC] p-4 shadow-[0_-12px_40px_rgba(53,28,24,0.18)] sm:rounded-t-3xl sm:p-5">
              {/* Header */}

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F7EEE7] text-[#8E181F]">
                    <Filter size={13} />
                  </span>

                  <h2 className="text-sm font-extrabold text-[#351C18]">Filters</h2>
                </div>

                <button type="button" onClick={() => setMobileFilterOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-[#F7EEE7] text-[#8E181F]">
                  <X size={14} />
                </button>
              </div>

              {/* Category */}

              <div className="border-t border-[#EEE5DF] pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Category</p>

                {categoriesLoading ? (
                  <FilterListShimmer count={6} rounded />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-full border px-2.5 py-1.5 text-[9px] font-bold transition ${selectedCategory === category.id ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#E2D5CC] bg-white text-[#66544D]'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand */}

              <div className="mt-4 border-t border-[#EEE5DF] pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Brand</p>

                {brandsLoading ? (
                  <FilterListShimmer count={5} rounded />
                ) : (
                  <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`rounded-full border px-2.5 py-1.5 text-[9px] font-bold transition ${selectedBrand === brand.id ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#E2D5CC] bg-white text-[#66544D]'}`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}

              <div className="mt-4 border-t border-[#EEE5DF] pt-3">
                {maxPrice <= 0 ? (
                  <PriceFilterShimmer />
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Maximum Price</p>

                      <span className="text-[11px] font-extrabold text-[#8E181F]">₹{priceLimit.toLocaleString('en-IN')}</span>
                    </div>

                    <input type="range" min="0" max={maxPrice || 1} value={priceLimit} onChange={(e) => setPriceLimit(Number(e.target.value))} className="h-1.5 w-full accent-[#8E181F]" />

                    <div className="mt-1 flex justify-between text-[8px] text-[#9A857B]">
                      <span>₹0</span>

                      <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Rating */}

              <div className="mt-4 border-t border-[#EEE5DF] pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-[#806C63]">Rating</p>

                <div className="flex gap-1.5">
                  {[4, 3, 2].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelectedRating(selectedRating === String(rating) ? 'All' : String(rating))}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[9px] font-bold transition ${selectedRating === String(rating) ? 'border-[#8E181F] bg-[#8E181F] text-white' : 'border-[#E2D5CC] text-[#66544D]'}`}
                    >
                      <Star size={9} fill="currentColor" />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}

              <div className="mt-4 border-t border-[#EEE5DF] pt-3">
                <button type="button" onClick={() => setStockOnly((prev) => !prev)} className="flex w-full items-center justify-between">
                  <span className="text-[10px] font-bold text-[#66544D]">In Stock Only</span>

                  <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${stockOnly ? 'bg-[#8E181F]' : 'bg-[#D9CEC8]'}`}>
                    <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${stockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                  </span>
                </button>
              </div>

              {/* Bottom Buttons */}

              <div className="mt-5 flex gap-2">
                <button type="button" onClick={clearFilters} className="flex-1 rounded-lg border border-[#E2D5CC] py-2.5 text-[10px] font-bold text-[#8E181F] transition hover:bg-[#F8EEE8]">
                  Clear All
                </button>

                <button type="button" onClick={() => setMobileFilterOpen(false)} className="flex-1 rounded-lg bg-linear-to-r from-[#7D171C] to-[#A51D26] py-2.5 text-[10px] font-bold text-white shadow-sm">
                  Show {products.length} Products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
