import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './user/Home'
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
import ProfileUpdate from './user/ProfileUpdate.jsx'
import HelpCenter from './components/CustomerService/HelpCenter.jsx'
import TrackOrder from './components/CustomerService/TrackOrder.jsx'
import ReturnsRefunds from './components/CustomerService/ReturnsRefunds.jsx'
import ContactUs from './components/CustomerService/ContactUs.jsx'
import AdminContactMessages from './admin/AdminContactMessages .jsx'
import AdminContactMessageView from './admin/AdminContactMessageView.jsx'
import AdminOrderView from './admin/AdminOrderView.jsx'
import MySupport from './components/CustomerService/MySupport.jsx'
import MySupportDetails from './components/CustomerService/MySupportDetails.jsx'
import Notifications from './pages/Notifications.jsx'
import AdminNotifications from './admin/AdminNotifications.jsx'
import HeroPage from './user/HeroPage.jsx'
import NotFoundPage from './user/NotFoundPage.jsx'
import Products from './user/Products.jsx'
import TicTacToe from './game/TicTacToe.jsx'
import Terms from './components/CustomerService/Terms.jsx'
import Privacy from './components/CustomerService/Privacy.jsx'
import Cookies from './components/CustomerService/Cookies.jsx'
import LogIn from './pages/LogIn.jsx'


export default function App() {
  const { user, loading, showLogin, setShowLogin } = useUser()


  useEffect(() => {
    if (!loading && !user) {
      const loginPopupClosed = sessionStorage.getItem('minekart_login_popup_closed')

      if (!loginPopupClosed) {
        setShowLogin(true)
      }
    }
  }, [loading, user, setShowLogin])



  const handleLoginClose = () => {
    sessionStorage.setItem('minekart_login_popup_closed', 'true')
    setShowLogin(false)
  }

  if (loading) {
    return <HeroPage />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* USER */}

        <Route path="/*" element={<NotFoundPage />} />

        <Route path="/" element={<UserLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/category" element={<Categories />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/products" element={<Products />} />

          <Route path="/category/:id/products" element={<CategoryProducts />} />

          <Route path="/brand/:id/products" element={<BrandProducts />} />

          <Route path="product/:id" element={<ProductDetail />} />

          <Route path="/cart" element={user ? <Cart /> : <Navigate to="/" replace />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/orders" element={<MyOrders />} />

          <Route path="orders/:id" element={<OrderDetails />} />

          <Route path="/search" element={<SearchProducts />} />

          <Route path="/profile" element={<Profile />} />

          <Route path="/profile/update" element={<ProfileUpdate />} />

          <Route path="/notifications" element={<Notifications />} />

          {/* FOOTER */}

          <Route path="/customer-help" element={<HelpCenter />} />

          <Route path="/track-order" element={<TrackOrder />} />

          <Route path="/returns" element={<ReturnsRefunds />} />

          <Route path="/contact" element={<ContactUs />} />

          <Route path="/my-support" element={<MySupport />} />

          <Route path="/my-support/:id" element={<MySupportDetails />} />

          <Route path="/terms" element={<Terms />} />

          <Route path="/privacy" element={<Privacy />} />

          <Route path="/cookies" element={<Cookies />} />

          <Route path="/tictactoe" element={<TicTacToe />} />
        </Route>

        {/* AUTH */}

        <Route path="/register" element={<Register />} />

        {/* <Route path="/login" element={<Login />} /> */}

        {/* ADMIN */}

        <Route element={<AdminProtected />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />

            {/* CATEGORY */}

            <Route path="category" element={<AdminCategory />} />

            <Route path="category/new" element={<AdminCategoryForm />} />

            <Route path="category/:id/update" element={<AdminCategoryForm />} />

            <Route path="category/:id" element={<AdminCategoryView />} />

            {/* SUB CATEGORY */}

            <Route path="subcategory" element={<AdminSubCategory />} />

            <Route path="subcategory/new" element={<AdminSubCategoryForm />} />

            <Route path="subcategory/:id/update" element={<AdminSubCategoryForm />} />

            <Route path="subcategory/:id" element={<AdminSubCategoryView />} />

            {/* BRAND */}

            <Route path="brand" element={<AdminBrand />} />

            <Route path="brand/new" element={<AdminBrandForm />} />

            <Route path="brand/:id/update" element={<AdminBrandForm />} />

            <Route path="brand/:id" element={<AdminBrandView />} />

            {/* PRODUCTS */}

            <Route path="products" element={<AdminProducts />} />

            <Route path="products/new" element={<AdminProductsForm />} />

            <Route path="products/:id/update" element={<AdminProductsForm />} />

            <Route path="products/:id" element={<AdminProductsView />} />

            {/* ORDERS */}

            <Route path="orders" element={<AdminOrders />} />

            <Route path="orders/:id" element={<AdminOrderView />} />

            {/* USERS */}

            <Route path="users" element={<AdminUsers />} />

            {/* NOTIFICATIONS */}

            <Route path="/admin/notifications" element={<AdminNotifications />} />

            {/* CONTACT MESSAGES */}

            <Route path="contact-messages" element={<AdminContactMessages />} />

            <Route path="contact-messages/:id" element={<AdminContactMessageView />} />
          </Route>
        </Route>
      </Routes>

      {/* LOGIN POPUP */}

      {showLogin && <LogIn onClose={handleLoginClose} />}
    </BrowserRouter>
  )
}
