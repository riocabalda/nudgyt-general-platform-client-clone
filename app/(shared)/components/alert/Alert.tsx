'use client'

import React, { ReactNode, useEffect } from 'react'
import useAlertStore from './useAlertStore'
import { cn } from '../../utils'
import { X } from 'lucide-react'

function AlertUI({
  message,
  variant,
  onClose
}: {
  message: string | ReactNode
  variant: string
  onClose: () => void
}) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timeoutId)
  }, [])
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 w-full z-1 flex items-center justify-center h-[48px] bg-success bg-white text-foreground',
        variant === 'success' && 'bg-success text-success-foreground',
        variant === 'error' && 'bg-destructive text-destructive-foreground'
      )}
    >
      {message}
      <button
        onClick={onClose}
        className='absolute right-[24px] top-1/2 -translate-y-1/2'
      >
        <X className='size-[24px]' />
      </button>
    </div>
  )
}
function Alert() {
  const { isOpen, variant, message, closeAlert } = useAlertStore()

  if (isOpen)
    return <AlertUI variant={variant} message={message} onClose={closeAlert} />
  return null
}

export default Alert
