import { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from './userProvider'
import { axiosInstance } from '../config/axiosConfig'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useUser()

  const [cart, setCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)

  // ! Get Cart
  const getCart = async () => {
    if (!user) {
      setCart(null)
      return
    }

    try {
      setCartLoading(true)

      const res = await axiosInstance.get('/cart')

      setCart(res.data.data)
    } catch (error) {
      console.log('Get Cart Error:', error.response?.data || error.message)
    } finally {
      setCartLoading(false)
    }
  }

  // ! Add Product To Cart
  const addToCart = async ({ productId, quantity = 1, size = null }) => {
    if (!user) {
      return {
        success: false,
        message: 'Please login first',
      }
    }

    try {
      const res = await axiosInstance.post('/cart', {
        productId,
        quantity,
        size,
      })

      if (res.data.success) {
        setCart(res.data.data)
      }

      return res.data
    } catch (error) {
      console.log('Add To Cart Error:', error.response?.data || error.message)

      return {
        success: false,
        message: error.response?.data?.message || 'Something went wrong',
      }
    }
  }

  // ! Get Cart when user changes
  useEffect(() => {
    getCart()
  }, [user])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartLoading,
        getCart,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
