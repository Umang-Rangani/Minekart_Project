import { Toaster } from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'

const toastConfig = {
  success: {
    icon: <CheckCircle2 size={20} strokeWidth={2.5} />,
    iconClass: 'text-[#8E181F]',
  },
  error: {
    icon: <XCircle size={20} strokeWidth={2.5} />,
    iconClass: 'text-[#A51D26]',
  },
  loading: {
    icon: <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8DDD4] border-t-[#8E181F]" />,
    iconClass: '',
  },
  blank: {
    icon: <Info size={20} strokeWidth={2.5} />,
    iconClass: 'text-[#6B5148]',
  },
}

export default function MineKartToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 3000,
        className: 'font-[Poppins,sans-serif] !rounded-2xl !border !border-[#E8DDD4] !bg-[#FFFDFC] !px-4 !py-3 !text-[#351C18] !shadow-[0_12px_35px_rgba(73,54,49,0.16)]',

        success: {
          icon: toastConfig.success.icon,
        },

        error: {
          icon: toastConfig.error.icon,
          duration: 4000,
        },
      }}
    />
  )
}
