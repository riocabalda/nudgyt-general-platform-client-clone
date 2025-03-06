'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import userService, { roles } from '@/app/(shared)/services/userService'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function SignUpVerificationContent() {
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [verifyingError, setVerifyingError] = useState('')
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || ''
  const verificationToken = searchParams.get('verification_token') || ''
  const isApproved = searchParams.has('is_approved')

  useEffect(() => {
    const verify = async () => {
      try {
        const formdata = { verificationToken }
        await userService.verifyEmail(formdata)
        setIsVerified(true)
      } catch (error: any) {
        if (error.response?.status === 500) {
          setVerifyingError('An error occurred.')
        } else {
          setVerifyingError(
            error?.response?.data?.message || 'An error occurred.'
          )
        }
      } finally {
        setIsVerifying(false)
      }
    }
    verify()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const render = () => {
    if (verifyingError)
      return (
        <h1 className='p-4 text-2xl font-semibold lg:text-4xl'>
          {verifyingError}
        </h1>
      )
    if (isVerifying)
      return (
        <h1 className='p-4 text-2xl font-semibold lg:text-4xl'>Verifying...</h1>
      )
    if (isVerified)
      return (
        <Card className='mx-auto px-4 lg:mt-[60px] max-w-[560px] lg:px-[80px] pt-[178px] lg:py-[60px] border-none rounded-[10px] shadow-none lg:shadow-sm lg:border'>
          <h1 className='text-[24px] font-medium text-center lg:text-[32px]'>
            Verification Complete
          </h1>

          {role === roles.learner || isApproved ? (
            <p className='text-muted-foreground mt-4 lg:mt-[40px] text-sm lg:text-base text-center'>
              Success! Your account has been verified. You can now log in to
              your account.
            </p>
          ) : (
            <p className='text-muted-foreground mt-4 lg:mt-[40px] text-sm lg:text-base text-center'>
              An Admin is now approving your account. You will be sent an email
              once your account has been approved.
            </p>
          )}
          {role === roles.learner ? (
            <Button
              className='block w-full lg:w-[212px] mx-auto mt-[40px]'
              asChild
            >
              <Link
                href='/sign-in'
                className='flex items-center justify-center'
              >
                Login
              </Link>
            </Button>
          ) : (
            <Button
              className='block w-full lg:w-max mx-auto mt-[40px]'
              variant='link'
              asChild
            >
              <Link
                href='/sign-in'
                className='flex items-center justify-center'
              >
                Back to login
              </Link>
            </Button>
          )}
        </Card>
      )
    return null
  }

  return (
    <main className='flex lg:items-center lg:justify-center min-h-svh'>
      {render()}
    </main>
  )
}

function SignUpVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className='h-screen w-screen grid place-items-center'>
          <Loader className='w-4 h-4 mr-2 animate-spin' />
        </div>
      }
    >
      <SignUpVerificationContent />
    </Suspense>
  )
}

export default SignUpVerificationPage
