import BrandList from './BrandList'
import CategoryList from './CategoryList'
import LocationHeading from './LocationHeading'
import ProductList from './ProductList'

export default function Home() {
  return (
    <div>
      <LocationHeading />
      <div className="space-y-8">
      <CategoryList />
        <BrandList />
        <ProductList />
      </div>
    </div>
  )
}
