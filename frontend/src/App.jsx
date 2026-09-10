import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './user/Home'
import Products from './user/Products'
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

        <Route path="/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        {/*  AUTH  */}

        <Route path="/register" element={<Register />} />

        {/* <Route path="/login" element={<Login />} /> */}

        {/*  ADMIN  */}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route path="products" element={<AdminProducts />} />

          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Routes>

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </BrowserRouter>
  )
}
