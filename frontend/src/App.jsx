import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './user/Home'
import Cart from './user/Cart'
import Checkout from './user/Checkout'
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

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/*  AUTH  */}

        <Route path="/register" element={<Register />} />

        {/* <Route path="/login" element={<Login />} /> */}

        {/*  ADMIN  */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="products" element={<AdminProducts />} />
          <Route path="category" element={<AdminCategory />} />
          <Route path="brand" element={<AdminBrand />} />

          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </BrowserRouter>
  )
}
