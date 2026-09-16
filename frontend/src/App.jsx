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

export default function App() {
  const { user, loading, showLogin, setShowLogin } = useUser()

  useEffect(() => {
    if (!loading && !user) {
      setShowLogin(true)
    }
  }, [loading, user, setShowLogin])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/*  USER  */}

        <Route path="/" element={<UserLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="product/:id" element={<ProductDetail />} />

          <Route path="/category" element={<Categories />} />
          <Route path="/category/:id/products" element={<CategoryProducts />} />

          <Route path="/brand" element={<Brands />} />
          <Route path="/brand/:id/products" element={<BrandProducts />} />

          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/" replace />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/profile" element={<Profile />} />
        </Route>

        {/*  AUTH  */}
        <Route path="/register" element={<Register />} />
        {/* <Route path="/login" element={<Login />} /> */}

        {/*  ADMIN  */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="category" element={<AdminCategory />} />
          <Route path="subcategory" element={<AdminSubCategory />} />
          <Route path="brand" element={<AdminBrand />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<AdminUsers />} />

          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </BrowserRouter>
  )
}
