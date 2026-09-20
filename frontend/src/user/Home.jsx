import BrandList from './BrandList'
import CategoryList from './CategoryList'
import ProductList from './ProductList'

export default function Home() {
  return (
    <div className="w-full">
      {/* Category Section */}
      <section className="w-full">
        <CategoryList />
      </section>

      {/* Main Shopping Sections */}
      <div className="space-y-10 pt-8 sm:pt-10 lg:pt-12">
        {/* Brands */}
        <section className="w-full">
          <BrandList />
        </section>

        {/* Products */}
        <section className="w-full">
          <ProductList />
        </section>
      </div>
    </div>
  )
}
