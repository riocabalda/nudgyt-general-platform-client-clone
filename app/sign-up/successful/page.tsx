'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import { maskEmail } from '@/app/(shared)/utils'
import { Loader } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ResendVerificationButton from './components/ResendVerificationButton'

function SignUpSuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  return (
    <main className='flex justify-center lg:items-center min-h-svh'>
      <Card className='max-w-xl px-4 lg:mt-0 lg:px-[80px] py-[60px] border-none  shadow-none lg:shadow-sm lg:border'>
        <h1 className='font-medium text-[32px] font-inter leading-[40px]'>
          You have successfully signed up!
        </h1>

        <p className='text-muted-foreground mt-[40px] text-sm lg:text-base'>
          To complete your registration, verify your account by clicking the
          link we have sent to your email <span>{maskEmail(email)}</span>
          .<br />
          <br />
          If you didn’t receive the mail, you can resend the confirmation email
          by clicking the button below.
        </p>
        <ResendVerificationButton />
        <Button variant='link' className='block w-full mt-4' asChild>
          <Link
            href='/sign-in'
            className='flex items-center justify-center text-brandcolora'
          >
            Log in
          </Link>
        </Button>
      </Card>
    </main>
  )
}

function SignUpSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className='h-screen w-screen grid place-items-center'>
          <Loader className='w-4 h-4 mr-2 animate-spin' />
        </div>
      }
    >
      <SignUpSuccessContent />
    </Suspense>
  )
}

export default SignUpSuccessPage
