import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/userProvider.jsx'
import { CartProvider } from './context/CartProvider.jsx'
import { NotificationProvider } from './context/NotificationProvider.jsx'
import { AdminNotificationProvider } from './context/AdminNotificationProvider.jsx'
import MineKartToaster from './common/MineKartToaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <CartProvider>
        <NotificationProvider>
          <AdminNotificationProvider>
            <App />

            <MineKartToaster />
          </AdminNotificationProvider>
        </NotificationProvider>
      </CartProvider>
    </UserProvider>
  </StrictMode>,
)
