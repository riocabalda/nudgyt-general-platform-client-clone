import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import Link from 'next/link'
import React from 'react'
import ResetPasswordForm from './components/ResetPasswordForm'

function ResetPage() {
  return (
    <main className='flex justify-center lg:items-center min-h-svh'>
      <Card className='flex flex-col min-h-[100svh] lg:min-h-max lg:h-auto w-full max-w-[560px] rounded-none lg:rounded-[10px] px-4 py-[60px] lg:px-[80px] shadow-none border-none lg:border lg:shadow-sm'>
        <h1 className='text-2xl font-semibold lg:text-4xl lg:whitespace-nowrap'>
          Reset your password
        </h1>
        <p className='text-muted-foreground mt-4 mb-[60px]'>
          Enter your new password.
        </p>
        <ResetPasswordForm />
        <Button variant='link' className='block w-full mt-4' asChild>
          <Link href='/sign-in' className='flex items-center justify-center'>
            Cancel
          </Link>
        </Button>
      </Card>
    </main>
  )
}

export default ResetPage
