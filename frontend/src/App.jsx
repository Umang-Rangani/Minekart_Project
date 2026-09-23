import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './user/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminProducts from './admin/AdminProducts'
import AdminOrders from './admin/AdminOrders'
import { useUser } from './context/userProvider'
import { useEffect } from 'react'
import AdminCategory from './admin/AdminCategory'
import AdminBrand from './admin/AdminBrand'
import UserLayout from './user/UserLayout'
import AdminSubCategory from './admin/AdminSubCategory'
import AdminUsers from './admin/AdminUsers'
import ProductDetail from './user/ProductDetail'
import BrandProducts from './user/BrandProducts'
import CategoryProducts from './user/CategoryProducts'
import Cart from './user/Cart'
import Categories from './user/Categories'
import Brands from './user/Brands'
import Checkout from './user/Checkout'
import Profile from './user/Profile'
import OrderSuccess from './user/OrderSuccess'
import MyOrders from './user/MyOrders.jsx'
import OrderDetails from './user/OrderDetails.jsx'
import AdminOrderDetails from './admin/AdminOrderDetails.jsx'
import SearchProducts from './user/SearchProducts.jsx'
import AdminProductsForm from './admin/AdminProductsForm.jsx'
import AdminProductsView from './admin/AdminProductsView.jsx'
import AdminCategoryForm from './admin/AdminCategoryForm.jsx'
import AdminCategoryView from './admin/AdminCategoryView.jsx'
import AdminSubCategoryForm from './admin/AdminSubCategoryForm.jsx'
import AdminSubCategoryView from './admin/AdminSubCategoryView.jsx'
import AdminBrandView from './admin/AdminBrandView.jsx'
import AdminBrandForm from './admin/AdminBrandForm.jsx'
import AdminProtected from './admin/AdminProtected.jsx'
import { Toaster } from 'react-hot-toast'

export default function App() {
  const { user, loading, showLogin, setShowLogin } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      setShowLogin(true)
    }
  }, [loading, user, setShowLogin])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFDFC]">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#351C18]">
            Mine
            <span className="text-[#A51D26]">Kart</span>
          </h1>

          <p className="mt-2 text-[10px] font-semibold tracking-[0.25em] text-[#907A70]">SHOP MORE • LIVE BETTER</p>

          <div className="mx-auto mt-5 h-1 w-20 overflow-hidden rounded-full bg-[#E9DED6]">
            <div className="h-full w-1/2 animate-[loading_1s_ease-in-out_infinite] rounded-full bg-[#A51D26]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/*  USER  */}

        <Route path="/" element={<UserLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/category" element={<Categories />} />
          <Route path="/brand" element={<Brands />} />
          <Route path="product/:id" element={<ProductDetail />} />

          <Route path="/category/:id/products" element={<CategoryProducts />} />
          <Route path="/brand/:id/products" element={<BrandProducts />} />

          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/" replace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetails />} />

          <Route path="/search" element={<SearchProducts />} />
        </Route>

        {/*  AUTH  */}
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login />} /> */}

        {/*  ADMIN  */}
        <Route element={<AdminProtected />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            <Route path="category" element={<AdminCategory />} />
            <Route path="category/new" element={<AdminCategoryForm />} />
            <Route path="category/:id/update" element={<AdminCategoryForm />} />
            <Route path="category/:id" element={<AdminCategoryView />} />

            <Route path="subcategory" element={<AdminSubCategory />} />
            <Route path="subcategory/new" element={<AdminSubCategoryForm />} />
            <Route path="subcategory/:id/update" element={<AdminSubCategoryForm />} />
            <Route path="subcategory/:id" element={<AdminSubCategoryView />} />

            <Route path="brand" element={<AdminBrand />} />
            <Route path="brand/new" element={<AdminBrandForm />} />
            <Route path="brand/:id/update" element={<AdminBrandForm />} />
            <Route path="brand/:id" element={<AdminBrandView />} />

            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductsForm />} />
            <Route path="products/:id/update" element={<AdminProductsForm />} />
            <Route path="products/:id" element={<AdminProductsView />} />

            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />

            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </BrowserRouter>
  )
}
