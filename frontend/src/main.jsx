import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/userProvider.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
          containerStyle={{
            zIndex: 999999,
          }}
          toastOptions={{
            duration: 3000,
            style: {
              zIndex: 999999,
            },
          }}
        />
      </CartProvider>
    </UserProvider>
  </StrictMode>,
)
