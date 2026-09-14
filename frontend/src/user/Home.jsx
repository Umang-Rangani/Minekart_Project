import BrandList from './BrandList'
import CategoryList from './CategoryList'
import ProductList from './ProductList'

export default function Home() {
  return (
    <div className="">
      <CategoryList />
      <div className='pt-25 space-y-8'>
        <BrandList />
        <ProductList />
      </div>
    </div>
  )
}
