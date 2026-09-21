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
        // Backend mathi updated cart mali rahyo che
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

  // ! Increase Cart Item
  const increaseCartItem = async ({ productId, size = null }) => {
    if (!user) {
      return {
        success: false,
        message: 'Please login first',
      }
    }

    // Instant UI Update
    const oldCart = cart

    if (cart) {
      const updatedItems = cart.items.map((item) => {
        if (item.productId?._id?.toString() === productId?.toString() && item.size === size) {
          const newQuantity = item.quantity + 1

          return {
            ...item,
            quantity: newQuantity,
            totalPrice: (item.discountPrice || item.price) * newQuantity,
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
      const res = await axiosInstance.patch('/cart/item/increase', {
        productId,
        size,
      })

      if (res.data.success) {
        return res.data
      }

      // API fail → rollback
      setCart(oldCart)

      return res.data
    } catch (error) {
      console.log('Increase Cart Item Error:', error.response?.data || error.message)

      // API fail → rollback
      setCart(oldCart)

      return {
        success: false,
        message: error.response?.data?.message || 'Something went wrong',
      }
    }
  }

  // ! Decrease Cart Item
  const decreaseCartItem = async ({ productId, size = null }) => {
    if (!user) {
      return {
        success: false,
        message: 'Please login first',
      }
    }

    // Save old cart for rollback
    const oldCart = cart

    // Instant UI Update
    if (cart) {
      const currentItem = cart.items.find((item) => item.productId?._id?.toString() === productId?.toString() && item.size === size)

      if (currentItem) {
        let updatedItems

        // Quantity 1 → item immediately remove from UI
        if (currentItem.quantity === 1) {
          updatedItems = cart.items.filter((item) => !(item.productId?._id?.toString() === productId?.toString() && item.size === size))
        } else {
          updatedItems = cart.items.map((item) => {
            if (item.productId?._id?.toString() === productId?.toString() && item.size === size) {
              const newQuantity = item.quantity - 1

              return {
                ...item,
                quantity: newQuantity,
                totalPrice: (item.discountPrice || item.price) * newQuantity,
              }
            }

            return item
          })
        }

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
    }

    try {
      const res = await axiosInstance.patch('/cart/item/decrease', {
        productId,
        size,
      })

      if (res.data.success) {
        return res.data
      }

      // API fail → rollback
      setCart(oldCart)

      return res.data
    } catch (error) {
      console.log('Decrease Cart Item Error:', error.response?.data || error.message)

      // API fail → rollback
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
        increaseCartItem,
        decreaseCartItem,
        removeCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
