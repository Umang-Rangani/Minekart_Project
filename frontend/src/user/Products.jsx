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
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   })

  //   if (initialFetchStartedRef.current) {
  //     return
  //   }

  //   initialFetchStartedRef.current = true

  //   const loadInitialProducts = async () => {
  //     await fetchProducts(true)

  //     initialFetchDoneRef.current = true
  //   }

  //   loadInitialProducts()
  // }, [])

  // INITIAL PRODUCTS API
  useEffect(() => {
    document.title = 'Products | MineKart'

    if (initialFetchStartedRef.current) return

    initialFetchStartedRef.current = true

    const loadInitialProducts = async () => {
      try {
        await fetchProducts(true)
      } finally {
        initialFetchDoneRef.current = true
      }
    }

    loadInitialProducts()
  }, [])

  // Every search/filter/sort change backend API par jase.
  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'smooth',
  //   })

  //   if (firstFilterEffectRef.current) {
  //     firstFilterEffectRef.current = false

  //     return
  //   }

  //   if (!initialFetchDoneRef.current) {
  //     return
  //   }

  //   if (skipFilterRef.current) {
  //     skipFilterRef.current = false

  //     return
  //   }

  //   const timer = setTimeout(() => {
  //     fetchProducts(false)
  //   }, 300)

  //   return () => clearTimeout(timer)
  // }, [search, selectedCategory, selectedBrand, selectedRating, stockOnly, priceLimit, sortBy])

  // FETCH PRODUCTS WHEN FILTERS CHANGE
  useEffect(() => {
    if (!initialFetchDoneRef.current) return

    const timer = setTimeout(() => {
      fetchProducts(false)
    }, 0)

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

        <div className="mb-3 flex h-auto min-h-14 flex-col gap-2 overflow-visible rounded-lg border border-mk-border bg-mk-card px-2 py-2 shadow-[0_2px_10px_rgba(73,54,49,0.05)] sm:mb-4 sm:h-15 sm:flex-row sm:items-center sm:gap-4 sm:px-3.5 sm:py-0">
          {/* Title */}

          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-mk-primary-deep to-mk-primary text-white shadow-[0_3px_10px_rgba(125,23,28,0.15)] sm:h-10 sm:w-10">
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10" />

              <Sparkles size={16} strokeWidth={1.8} className="relative z-10 sm:h-4.5 sm:w-4.5" />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-xs font-extrabold tracking-tight text-mk-ink sm:text-base">All Products</h1>

              <p className="mt-0.5 truncate text-[8px] text-mk-muted sm:text-[9px]">Explore our complete product collection</p>
            </div>
          </div>

          {/* Search + Sort */}

          <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
            {/* Search */}

            <div className="relative min-w-0 flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mk-muted sm:left-3 sm:h-3.5 sm:w-3.5" />

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
                className="h-8 w-full rounded-lg border border-mk-border bg-mk-card pl-8 pr-8 text-[10px] text-mk-ink outline-none transition placeholder:text-mk-subtle focus:border-mk-subtle focus:ring-2 focus:ring-mk-primary-hover/10 sm:h-9 sm:pl-9 sm:pr-9 sm:text-xs"
              />

              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mk-muted transition-colors hover:text-mk-primary-hover">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort */}

            <div className="relative z-40 shrink-0">
              <button
                type="button"
                onClick={() => setSortOpen((prev) => !prev)}
                className="flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-mk-border bg-white px-2 text-[9px] font-semibold text-mk-muted transition hover:bg-mk-primary-soft sm:h-9 sm:px-2.5 sm:text-[10px]"
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

                  <div className="absolute right-0 top-full z-60 mt-1 hidden w-44 overflow-hidden rounded-lg border border-mk-border bg-white p-1 shadow-[0_10px_25px_rgba(73,54,49,0.14)] sm:block">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value)
                          setSortOpen(false)
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[10px] font-semibold transition ${sortBy === option.value ? 'bg-mk-primary-soft text-mk-primary-hover' : 'text-mk-muted hover:bg-mk-bg'}`}
                      >
                        <span>{option.label}</span>

                        {sortBy === option.value && <Check size={12} />}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Sort Menu */}

                  <div className="fixed bottom-2 left-2 right-2 z-60 overflow-hidden rounded-xl border border-mk-border bg-white p-1.5 shadow-[0_12px_35px_rgba(73,54,49,0.18)] sm:hidden">
                    <div className="mb-0.5 flex items-center justify-between px-2 py-1.5">
                      <span className="text-[11px] font-extrabold text-mk-ink">Sort Products</span>

                      <button type="button" onClick={() => setSortOpen(false)} className="flex h-6 w-6 items-center justify-center rounded-full bg-mk-primary-soft text-mk-primary-hover">
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
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-[10px] font-semibold transition ${sortBy === option.value ? 'bg-mk-primary-soft text-mk-primary-hover' : 'text-mk-muted hover:bg-mk-bg'}`}
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
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-mk-border bg-mk-card px-3 text-[10px] font-bold text-mk-ink transition hover:border-mk-border hover:bg-mk-primary-soft"
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>
        </div>

        <div className="flex gap-4">
          {/* Desktop Filters */}

          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-4 rounded-xl border border-mk-border bg-mk-card p-3 shadow-[0_3px_14px_rgba(73,54,49,0.05)]">
              {/* Filter Header */}

              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Filter size={13} className="text-mk-primary-hover" />

                  <h2 className="text-xs font-extrabold text-mk-ink">Filters</h2>
                </div>

                {hasFilters && (
                  <button type="button" onClick={clearFilters} className="text-[9px] font-bold text-mk-primary-hover hover:underline">
                    Clear
                  </button>
                )}
              </div>

              {/* Category */}

              <div className="border-t border-mk-surface pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Category</p>

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
                          selectedCategory === category.id ? 'bg-mk-primary-soft text-mk-primary-hover' : 'text-mk-muted hover:bg-mk-bg'
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

              <div className="mt-3 border-t border-mk-surface pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Brand</p>

                {brandsLoading ? (
                  <FilterListShimmer count={5} />
                ) : (
                  <div className="max-h-40 space-y-0.5 overflow-y-auto pr-0.5">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[10px] font-semibold transition ${selectedBrand === brand.id ? 'bg-mk-primary-soft text-mk-primary-hover' : 'text-mk-muted hover:bg-mk-bg'}`}
                      >
                        <span className="truncate">{brand.name}</span>

                        {selectedBrand === brand.id && <Check size={12} className="shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>


              {/* Rating */}
              <div className="mt-3 border-t border-mk-surface pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Rating</p>

                {[4, 3, 2].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setSelectedRating(selectedRating === String(rating) ? 'All' : String(rating))}
                    className={`mb-0.5 flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-[10px] font-semibold transition ${selectedRating === String(rating) ? 'bg-mk-primary-soft text-mk-primary-hover' : 'text-mk-muted hover:bg-mk-bg'}`}
                  >
                    <Star size={10} fill="currentColor" />
                    {rating} & above
                  </button>
                ))}
              </div>

              {/* Stock */}

              <div className="mt-3 border-t border-mk-surface pt-3">
                <button type="button" onClick={() => setStockOnly((prev) => !prev)} className="flex w-full items-center justify-between">
                  <span className="text-[10px] font-semibold text-mk-muted">In Stock Only</span>

                  <span className={`flex h-4.5 w-8 items-center rounded-full p-0.5 transition ${stockOnly ? 'bg-mk-primary-hover' : 'bg-mk-border-admin'}`}>
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
              <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-mk-border bg-mk-card px-4 text-center sm:min-h-72 sm:rounded-2xl sm:px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mk-primary-soft text-mk-primary-hover sm:h-14 sm:w-14 sm:rounded-2xl">
                  <Package size={24} strokeWidth={1.5} />
                </div>

                <h3 className="mt-3 text-xs font-extrabold text-mk-ink sm:mt-4 sm:text-base">No Products Found</h3>

                <p className="mt-1 max-w-sm text-[9px] text-mk-muted sm:text-xs">We couldn't find any products matching your current filters.</p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-3 rounded-lg bg-linear-to-r from-mk-primary-deep to-mk-primary px-3.5 py-2 text-[9px] font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:mt-4 sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
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
                        isDisabled ? 'cursor-pointer border-mk-disabled-bg bg-mk-disabled-bg' : 'border-mk-border bg-mk-card shadow-[0_2px_8px_rgba(73,54,49,0.05)] hover:-translate-y-1 hover:border-mk-border hover:shadow-[0_14px_30px_rgba(73,54,49,0.13)]'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-white p-2 sm:p-3">
                        {!isDisabled && <div className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-mk-primary/5 transition-transform duration-500 group-hover:scale-150 sm:-right-8 sm:-top-8 sm:h-24 sm:w-24" />}

                        {product.discount > 0 && (
                          <span
                            className={`absolute left-1.5 top-1.5 z-20 rounded-md px-1.5 py-0.5 text-[6.5px] font-extrabold text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px] ${
                              isDisabled ? 'bg-linear-to-r from-[#777] to-[#999]' : 'bg-linear-to-r from-mk-primary-deep to-mk-primary'
                            }`}
                          >
                            {product.discount}% OFF
                          </span>
                        )}

                        {isDisabled ? (
                          <span
                            className={`absolute right-1.5 top-1.5 z-20 rounded-md px-1.5 py-0.5 text-[6.5px] font-bold sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px] ${
                              isInactive || isCategoryInactive || isOutOfStock ? 'border border-mk-border bg-mk-primary-soft text-mk-primary-hover' : 'bg-mk-disabled-bg text-[#888]'
                            }`}
                          >
                            {unavailableLabel}
                          </span>
                        ) : isLowStock ? (
                          <span className="absolute right-1.5 top-1.5 z-20 rounded-md bg-mk-primary-soft px-1.5 py-0.5 text-[6.5px] font-bold text-mk-accent sm:right-2.5 sm:top-2.5 sm:px-2 sm:py-0.5 sm:text-[8px]">Only {product.stock} left</span>
                        ) : null}

                        {product.images?.length > 0 ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.productName}
                            className={`relative z-10 h-full w-full object-contain ${isDisabled ? 'grayscale opacity-45' : 'transition-transform duration-500 group-hover:scale-105'}`}
                          />
                        ) : (
                          <div className={`relative z-10 flex flex-col items-center gap-1 ${isDisabled ? 'text-[#999]' : 'text-mk-muted'}`}>
                            <ShoppingCart size={22} strokeWidth={1.5} className="sm:h-6 sm:w-6" />

                            <span className="text-[7px] sm:text-[8px]">No Image</span>
                          </div>
                        )}

                        {!isDisabled && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-mk-ink/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-14" />}
                      </div>

                      {/* Info */}

                      <div className={`border-t px-1.5 py-1.5 sm:px-2.5 sm:py-2.5 ${isDisabled ? 'border-mk-disabled-bg bg-mk-disabled-bg' : 'border-mk-surface bg-mk-card transition-colors duration-300 group-hover:bg-mk-bg'}`}>
                        <p className={`truncate text-[6.5px] font-bold uppercase tracking-wider sm:text-[8px] ${isDisabled ? 'text-[#999]' : 'text-mk-muted'}`}>{product.category?.categoryName || 'Product'}</p>

                        <h3 className={`mt-1 line-clamp-2 min-h-8 text-[10px] font-bold leading-4 sm:min-h-10 sm:text-[12px] sm:leading-5 ${isDisabled ? 'text-[#777]' : 'text-mk-ink transition-colors duration-300 group-hover:text-mk-primary-hover'}`}>
                          {product.productName}
                        </h3>

                        {/* Rating */}

                        <div className="mt-1 flex items-center gap-1 sm:mt-1.5 sm:gap-1">
                          <span className={`flex items-center gap-0.5 rounded px-1 py-0.5 text-[7px] font-bold sm:px-1.5 sm:text-[8px] ${isDisabled ? 'bg-mk-disabled-bg text-[#888]' : 'bg-mk-success text-white'}`}>
                            {Number(product.rating || 0).toFixed(1)}

                            <Star size={6} fill="currentColor" strokeWidth={2} className="sm:h-1.75 sm:w-1.75" />
                          </span>

                          {Number(product.soldCount || 0) > 0 && (
                            <>
                              <span className={`h-0.5 w-0.5 rounded-full ${isDisabled ? 'bg-mk-border-admin' : 'bg-mk-border'}`} />

                              <span className={`truncate text-[6.5px] font-medium sm:text-[8px] ${isDisabled ? 'text-[#999]' : 'text-mk-muted'}`}>{product.soldCount}+ sold</span>
                            </>
                          )}
                        </div>

                        {/* Price */}

                        <div className="mt-1 flex items-baseline gap-1 sm:mt-1.5 sm:gap-1">
                          <span className={`text-[12px] font-extrabold tracking-tight sm:text-[14px] ${isDisabled ? 'text-[#777]' : 'text-mk-ink'}`}>₹{displayPrice.toLocaleString('en-IN')}</span>

                          {Number(product.price || 0) > displayPrice && (
                            <>
                              <span className={`text-[7px] line-through sm:text-[9px] ${isDisabled ? 'text-[#AAA]' : 'text-mk-muted'}`}>₹{Number(product.price).toLocaleString('en-IN')}</span>

                              {!isDisabled && <span className="text-[6.5px] font-bold text-mk-success sm:text-[8px]">{product.discount}% off</span>}
                            </>
                          )}
                        </div>

                        {/* Bottom */}

                        <div className={`mt-1 flex items-center justify-between border-t pt-1 sm:mt-1.5 sm:pt-1.5 ${isDisabled ? 'border-mk-disabled-bg' : 'border-mk-surface'}`}>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <span className={`h-1 w-1 rounded-full sm:h-1.5 sm:w-1.5 ${isDisabled ? 'bg-[#999]' : isLowStock ? 'bg-mk-accent' : 'bg-mk-success'}`} />

                            <span className={`text-[6.5px] font-bold sm:text-[8px] ${isDisabled ? 'text-[#888]' : isLowStock ? 'text-mk-accent' : 'text-mk-success'}`}>
                              {isInactive || isCategoryInactive ? 'Unavailable' : isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock' : 'In Stock'}
                            </span>
                          </div>
                          <span className={`flex items-center gap-0.5 text-[7px] font-bold transition-all duration-300 sm:text-[9px] ${isDisabled ? 'text-[#999]' : 'text-mk-primary-hover group-hover:gap-1'}`}>
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

            <div className="absolute inset-0 bg-mk-ink/40 backdrop-blur-[2px]" onClick={() => setMobileFilterOpen(false)} />

            {/* Bottom Sheet */}

            <div className="absolute bottom-0 left-0 right-0 max-h-[86vh] overflow-y-auto rounded-t-2xl bg-mk-card p-4 shadow-[0_-12px_40px_rgba(53,28,24,0.18)] sm:rounded-t-3xl sm:p-5">
              {/* Header */}

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mk-primary-soft text-mk-primary-hover">
                    <Filter size={13} />
                  </span>

                  <h2 className="text-sm font-extrabold text-mk-ink">Filters</h2>
                </div>

                <button type="button" onClick={() => setMobileFilterOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-full bg-mk-primary-soft text-mk-primary-hover">
                  <X size={14} />
                </button>
              </div>

              {/* Category */}

              <div className="border-t border-mk-surface pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Category</p>

                {categoriesLoading ? (
                  <FilterListShimmer count={6} rounded />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`rounded-full border px-2.5 py-1.5 text-[9px] font-bold transition ${selectedCategory === category.id ? 'border-mk-primary-hover bg-mk-primary-hover text-white' : 'border-mk-border bg-white text-mk-muted'}`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Brand */}

              <div className="mt-4 border-t border-mk-surface pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Brand</p>

                {brandsLoading ? (
                  <FilterListShimmer count={5} rounded />
                ) : (
                  <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => setSelectedBrand(brand.id)}
                        className={`rounded-full border px-2.5 py-1.5 text-[9px] font-bold transition ${selectedBrand === brand.id ? 'border-mk-primary-hover bg-mk-primary-hover text-white' : 'border-mk-border bg-white text-mk-muted'}`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}

              <div className="mt-4 border-t border-mk-surface pt-3">
                {maxPrice <= 0 ? (
                  <PriceFilterShimmer />
                ) : (
                  <>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Maximum Price</p>

                      <span className="text-[11px] font-extrabold text-mk-primary-hover">₹{priceLimit.toLocaleString('en-IN')}</span>
                    </div>

                    <input type="range" min="0" max={maxPrice || 1} value={priceLimit} onChange={(e) => setPriceLimit(Number(e.target.value))} className="h-1.5 w-full accent-mk-primary-hover" />

                    <div className="mt-1 flex justify-between text-[8px] text-mk-muted">
                      <span>₹0</span>

                      <span>₹{maxPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Rating */}

              <div className="mt-4 border-t border-mk-surface pt-3">
                <p className="mb-2 text-[9px] font-extrabold uppercase tracking-wider text-mk-muted">Rating</p>

                <div className="flex gap-1.5">
                  {[4, 3, 2].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setSelectedRating(selectedRating === String(rating) ? 'All' : String(rating))}
                      className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[9px] font-bold transition ${selectedRating === String(rating) ? 'border-mk-primary-hover bg-mk-primary-hover text-white' : 'border-mk-border text-mk-muted'}`}
                    >
                      <Star size={9} fill="currentColor" />
                      {rating}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}

              <div className="mt-4 border-t border-mk-surface pt-3">
                <button type="button" onClick={() => setStockOnly((prev) => !prev)} className="flex w-full items-center justify-between">
                  <span className="text-[10px] font-bold text-mk-muted">In Stock Only</span>

                  <span className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${stockOnly ? 'bg-mk-primary-hover' : 'bg-mk-border-admin'}`}>
                    <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${stockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                  </span>
                </button>
              </div>

              {/* Bottom Buttons */}

              <div className="mt-5 flex gap-2">
                <button type="button" onClick={clearFilters} className="flex-1 rounded-lg border border-mk-border py-2.5 text-[10px] font-bold text-mk-primary-hover transition hover:bg-mk-primary-soft">
                  Clear All
                </button>

                <button type="button" onClick={() => setMobileFilterOpen(false)} className="flex-1 rounded-lg bg-linear-to-r from-mk-primary-deep to-mk-primary py-2.5 text-[10px] font-bold text-white shadow-sm">
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
