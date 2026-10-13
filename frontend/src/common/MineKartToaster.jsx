import { Toaster } from 'react-hot-toast'
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'

const toastClass =
  'font-[Poppins,sans-serif] !rounded-xl !border !border-[#E8DDD4] !bg-[#FFFCFA] !px-4 !py-3 !text-sm !text-[#351C18] !shadow-[0_12px_35px_rgba(53,28,24,0.18)] max-sm:!max-w-[calc(100vw-24px)] max-sm:!rounded-lg max-sm:!px-3 max-sm:!py-2 max-sm:!text-xs'

const toastConfig = {
  success: {
    icon: <CheckCircle2 size={18} strokeWidth={2.4} />,
  },
  error: {
    icon: <XCircle size={18} strokeWidth={2.4} />,
  },
  loading: {
    icon: <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#E8DDD4] border-t-[#A51D26] sm:h-5 sm:w-5" />,
  },
  blank: {
    icon: <Info size={18} strokeWidth={2.4} />,
  },
  custom: {
    icon: <AlertTriangle size={18} strokeWidth={2.4} />,
  },
}

export default function MineKartToaster() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 12,
        right: 12,
        left: 12,
      }}
      toastOptions={{
        duration: 2000,
        style: {
          maxWidth: '100%',
        },
        className: toastClass,

        success: {
          icon: toastConfig.success.icon,
          className: toastClass,
        },

        error: {
          icon: toastConfig.error.icon,
          duration: 3000,
          className: toastClass,
        },

        loading: {
          icon: toastConfig.loading.icon,
          className: toastClass,
        },

        blank: {
          icon: toastConfig.blank.icon,
          className: toastClass,
        },
      }}
    />
  )
}
