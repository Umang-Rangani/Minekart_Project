import { Toaster } from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'

const toastConfig = {
  success: {
    icon: <CheckCircle2 size={20} strokeWidth={2.4} />,
  },

  error: {
    icon: <XCircle size={20} strokeWidth={2.4} />,
  },

  loading: {
    icon: <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#E8DDD4] border-t-[#A51D26]" />,
  },

  blank: {
    icon: <Info size={20} strokeWidth={2.4} />,
  },

  custom: {
    icon: <AlertTriangle size={20} strokeWidth={2.4} />,
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

        className: 'font-[Poppins,sans-serif] !rounded-xl !border !border-[#E8DDD4] !bg-[#FFFCFA] !px-4 !py-3 !text-[#351C18] !shadow-[0_12px_35px_rgba(53,28,24,0.18)]',

        success: {
          icon: toastConfig.success.icon,
          className: 'font-[Poppins,sans-serif] !rounded-xl !border !border-[#E8DDD4] !bg-[#FFFCFA] !px-4 !py-3 !text-[#351C18] !shadow-[0_12px_35px_rgba(53,28,24,0.18)]',
        },

        error: {
          icon: toastConfig.error.icon,
          duration: 4000,
          className: 'font-[Poppins,sans-serif] !rounded-xl !border !border-[#E8DDD4] !bg-[#FFFCFA] !px-4 !py-3 !text-[#351C18] !shadow-[0_12px_35px_rgba(53,28,24,0.18)]',
        },

        loading: {
          icon: toastConfig.loading.icon,
          className: 'font-[Poppins,sans-serif] !rounded-xl !border !border-[#E8DDD4] !bg-[#FFFCFA] !px-4 !py-3 !text-[#351C18] !shadow-[0_12px_35px_rgba(53,28,24,0.18)]',
        },

        blank: {
          icon: toastConfig.blank.icon,
          className: 'font-[Poppins,sans-serif] !rounded-xl !border !border-[#E8DDD4] !bg-[#FFFCFA] !px-4 !py-3 !text-[#351C18] !shadow-[0_12px_35px_rgba(53,28,24,0.18)]',
        },
      }}
    />
  )
}
