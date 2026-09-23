import React, { useCallback, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'

export default function AdminTrashBox({
  isOpen,
  onClose,
  title = 'Delete Product',
  message = 'Are you sure you want to delete this product?',
  actionButtonText = 'Delete Product',
  cancelButtonText = 'Cancel',
  onAction,
  isProcessing = false,
}) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Escape key
  const handleEscapeKey = useCallback(
    (event) => {
      if (
        event.key === 'Escape' &&
        isOpen &&
        !isProcessing
      ) {
        onClose()
      }
    },
    [isOpen, onClose, isProcessing],
  )

  useEffect(() => {
    if (!isOpen) return

    document.addEventListener(
      'keydown',
      handleEscapeKey,
    )

    setIsAnimating(true)

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscapeKey,
      )
    }
  }, [isOpen, handleEscapeKey])


  

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#292725]/30 backdrop-blur-[2px]"
        onClick={!isProcessing ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-sm overflow-visible rounded-2xl border border-[#E3DED6] border-t-[6px] border-t-[#A44A3F] bg-white shadow-2xl ${
          isAnimating
            ? 'animate-in zoom-in-75 duration-300 ease-out'
            : ''
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        {/* Content */}
        <div className="flex flex-col items-center px-6 pb-6 pt-3">

          {/* Delete Icon */}
          <div className="-mt-9 mb-3">
            <div className="flex size-16 items-center justify-center rounded-full border-4 border-white bg-[#A44A3F] shadow-lg">
              <Trash2
                size={30}
                strokeWidth={2.2}
                className="text-white"
              />
            </div>
          </div>

          {/* Title */}
          <h3
            id="delete-modal-title"
            className="mt-1 text-center text-xl font-semibold leading-tight text-[#A44A3F]"
          >
            {title}
          </h3>

          {/* Message */}
          <div className="mt-4 w-full text-center">
            <p className="text-sm leading-relaxed text-[#6F6A64]">
              {message}
            </p>

            <p className="mt-2 text-xs font-medium text-[#A44A3F]">
              This action cannot be undone.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex w-full justify-center gap-3">

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="h-10 min-w-28 rounded-lg border border-[#E3DED6] bg-white px-5 text-sm font-semibold text-[#6F6A64] shadow-sm transition duration-200 hover:bg-[#F8F6F2] hover:text-[#292725] focus:outline-none focus:ring-2 focus:ring-[#E3DED6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelButtonText}
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={onAction}
              disabled={isProcessing}
              className="h-10 min-w-32 rounded-lg bg-[#A44A3F] px-5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#913C33] focus:outline-none focus:ring-2 focus:ring-[#A44A3F]/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing
                ? 'Deleting...'
                : actionButtonText}
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}