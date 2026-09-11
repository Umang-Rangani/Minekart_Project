import BrandList from './BrandList'
import CategoryList from './CategoryList'
import ProductList from './ProductList'

export default function Home() {
  return (
    <div className="space-y-8">
      <CategoryList />
      <BrandList />
      <ProductList />
    </div>
  )
}
