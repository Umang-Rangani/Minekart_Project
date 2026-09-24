import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useUser } from './userProvider'
import { axiosInstance } from '../config/axiosConfig'
import toast from 'react-hot-toast'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useUser()

  const [cart, setCart] = useState(null)
  const [cartLoading, setCartLoading] = useState(false)

  // ! new user mate first time add to cart krta
  const cartRequestId = useRef(0)

  // ! Get Cart
  // const getCart = async () => {
  //   if (!user) {
  //     setCart(null)
  //     return
  //   }

  //   try {
  //     setCartLoading(true)

  //     const res = await axiosInstance.get('/cart')

  //     if (res.data.success) {
  //       setCart(res.data.data)
  //     }
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Unable to load cart')
  //   } finally {
  //     setCartLoading(false)
  //   }
  // }

  const getCart = async () => {
    if (!user) {
      setCart(null)
      return
    }

    const requestId = ++cartRequestId.current

    try {
      setCartLoading(true)

      const res = await axiosInstance.get('/cart')

      // Ignore old/stale request response
      if (requestId !== cartRequestId.current) {
        return
      }

      if (res.data.success) {
        setCart(res.data.data)
      }
    } catch (error) {
      if (requestId !== cartRequestId.current) {
        return
      }

      toast.error(error.response?.data?.message || 'Unable to load cart')
    } finally {
      if (requestId === cartRequestId.current) {
        setCartLoading(false)
      }
    }
  }

  // ! Add Product To Cart
  const addToCart = async ({ productId, quantity = 1, size = null }) => {
    if (!user) {
      toast.error('Please login first')

      return {
        success: false,
        message: 'Please login first',
      }
    }

    try {
      // Invalidate any previous cart GET request
      ++cartRequestId.current

      const res = await axiosInstance.post('/cart', {
        productId,
        quantity,
        size,
      })

      if (res.data.success) {
        setCart(res.data.data)

        toast.success('Product added to cart')
      }

      return res.data
    } catch (error) {
      console.log('Add To Cart Error:', error.response?.data || error.message)

      const message = error.response?.data?.message || 'Something went wrong'

      toast.error(message)

      return {
        success: false,
        message,
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
      setCart(oldCart)

      const message = error.response?.data?.message || 'Unable to increase quantity'

      toast.error(message)

      return {
        success: false,
        message,
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
      setCart(oldCart)

      const message = error.response?.data?.message || 'Unable to decrease quantity'

      toast.error(message)

      return {
        success: false,
        message,
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

        toast.success('Product removed from cart')
      }

      return res.data
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to remove product'

      toast.error(message)
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

        toast.success('Cart cleared successfully')
      }

      return res.data
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to clear cart'

      toast.error(message)
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
