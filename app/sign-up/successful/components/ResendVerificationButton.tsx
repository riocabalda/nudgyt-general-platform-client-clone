'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import userService from '@/app/(shared)/services/userService'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const COUNTDOWN_TIME = 60

function ResendVerificationButton() {
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const searchParams = useSearchParams()

  const handleResendClick = async () => {
    const email = searchParams.get('email') || ''
    setIsResending(true)
    try {
      const formdata = { email }
      await userService.resendVerificationEmail(formdata)
      toast.success('Verification email sent!')
      setCountdown(COUNTDOWN_TIME)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'An error occurred.')
    } finally {
      setIsResending(false)
    }
  }

  useEffect(() => {
    if (countdown > 0) {
      setTimeout(() => {
        setCountdown((prevState) => prevState - 1)
      }, 1000)
    }
  }, [countdown])

  const renderText = () => {
    if (isResending) return 'Resending...'
    if (countdown < COUNTDOWN_TIME && countdown !== 0)
      return `Resend in ${countdown}s`
    return 'Resend confirmation'
  }

  return (
    <Button
      className='block w-full mt-[40px] lg:w-[212px] mx-auto'
      onClick={handleResendClick}
      disabled={isResending || countdown !== 0}
    >
      {renderText()}
    </Button>
  )
}

export default ResendVerificationButton
