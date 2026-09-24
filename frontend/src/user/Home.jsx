import BrandList from './BrandList'
import CategoryList from './CategoryList'
import ProductList from './ProductList'
import ProductOfferList from './ProductOfferList'

export default function Home() {
  return (
    <div className="w-full">
      {/* Category Section */}
      <section className="w-full">
        <CategoryList />
      </section>

      {/* Main Shopping Sections */}
      <div className="space-y-15 pt-2 sm:pt-15 lg:pt-18">
        {/* Brands */}
        <section className="w-full">
          <BrandList />
        </section>

        {/* Products */}
        <section className="w-full">
          <ProductOfferList />
        </section>

        {/* Products */}
        <section className="w-full">
          <ProductList />
        </section>
      </div>
    </div>
  )
}
