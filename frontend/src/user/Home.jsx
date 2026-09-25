import { useEffect } from 'react'
import BrandList from './BrandList'
import CategoryList from './CategoryList'
import ProductList from './ProductList'
import ProductOfferList from './ProductOfferList'

export default function Home() {
  useEffect(() => {
    document.title = 'Home | MineKart'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#FFFCFA]">
      {/* Category Navigation */}
      <section className="w-full">
        <CategoryList />
      </section>

      {/* Home Content */}
      <main className="w-full pt-2 sm:pt-15 lg:pt-18">
        {/* Top Brands */}
        <section className="w-full border-b border-[#F0E7E1]">
          <div className="py-7 sm:py-9  lg:py-10">
            <BrandList />
          </div>
        </section>

        {/* Best Offers */}
        <section className="w-full border-b border-[#F0E7E1] bg-[#FBF7F2]">
          <div className="py-7 sm:py-9  lg:py-10">
            <ProductOfferList />
          </div>
        </section>

        {/* All Products */}
        <section className="w-full">
          <div className="py-7 sm:py-9  lg:py-10">
            <ProductList />
          </div>
        </section>
      </main>
    </div>
  )
}
