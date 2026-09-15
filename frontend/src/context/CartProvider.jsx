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

      if (res.data.success) {
        setCart(res.data.data)
      }
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
        await getCart()
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

  // ! Update Cart Item Quantity
  const updateCartItem = async ({ productId, size = null, quantity }) => {
    if (!user) {
      return {
        success: false,
        message: 'Please login first',
      }
    }

    // ! Save old cart for rollback
    const oldCart = cart

    // ! Optimistic UI Update
    if (cart) {
      const updatedItems = cart.items.map((item) => {
        if (item.productId?._id?.toString() === productId?.toString() && item.size === size) {
          return {
            ...item,
            quantity,
            totalPrice: (item.discountPrice || item.price) * quantity,
          }
        }

        return item
      })

      const updatedSubtotal = updatedItems.reduce((total, item) => total + item.totalPrice, 0)

      const updatedTotalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0)

      setCart({
        ...cart,
        items: updatedItems,
        totalQuantity: updatedTotalQuantity,
        subtotal: updatedSubtotal,
        totalAmount: updatedSubtotal + (cart.tax || 0),
      })
    }

    try {
      // ! API call
      const res = await axiosInstance.patch('/cart/item', {
        productId,
        size,
        quantity,
      })

      // ! API success
      if (res.data.success) {
        return res.data
      }

      // ! API failed
      setCart(oldCart)

      return res.data
    } catch (error) {
      console.log('Update Cart Item Error:', error.response?.data || error.message)

      // ! Rollback UI
      setCart(oldCart)

      return {
        success: false,
        message: error.response?.data?.message || 'Something went wrong',
      }
    }
  }

  // ! Remove Cart Item
  const removeCartItem = async ({ productId, size = null }) => {
    if (!user) {
      return {
        success: false,
        message: 'Please login first',
      }
    }

    try {
      const res = await axiosInstance.delete('/cart/item', {
        data: {
          productId,
          size,
        },
      })

      if (res.data.success) {
        await getCart()
      }

      return res.data
    } catch (error) {
      console.log('Remove Cart Item Error:', error.response?.data || error.message)

      return {
        success: false,
        message: error.response?.data?.message || 'Something went wrong',
      }
    }
  }

  // ! Clear Complete Cart
  const clearCart = async () => {
    if (!user) {
      return {
        success: false,
        message: 'Please login first',
      }
    }

    try {
      const res = await axiosInstance.delete('/cart')

      if (res.data.success) {
        await getCart()
      }

      return res.data
    } catch (error) {
      console.log('Clear Cart Error:', error.response?.data || error.message)

      return {
        success: false,
        message: error.response?.data?.message || 'Something went wrong',
      }
    }
  }

  // ! Merge Guest Cart
  const mergeGuestCart = async () => {
    if (!user) {
      return {
        success: false,
        message: 'Please login first',
      }
    }

    try {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')

      if (guestCart.length === 0) {
        return {
          success: true,
          message: 'Guest cart is empty',
        }
      }

      const res = await axiosInstance.post('/cart/merge', {
        items: guestCart,
      })

      if (res.data.success) {
        await getCart()
        localStorage.removeItem('guest_cart')
      }

      return res.data
    } catch (error) {
      console.log('Merge Guest Cart Error:', error.response?.data || error.message)

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
        updateCartItem,
        removeCartItem,
        clearCart,
        mergeGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
