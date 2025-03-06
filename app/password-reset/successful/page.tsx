'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import Link from 'next/link'

function SuccessfulPage() {
  return (
    <main className='flex justify-center lg:items-center min-h-svh'>
      <Card className='px-4 lg:mt-[60px] max-w-[560px] lg:px-[80px] pt-[178px] lg:py-[60px] border-none rounded-[10px] shadow-none lg:shadow-sm lg:border'>
        <h1 className='text-[24px] font-medium text-center lg:text-[32px]'>
          Password reset successful!
        </h1>

        <p className='text-muted-foreground mt-4 lg:mt-[40px] text-sm lg:text-base text-center'>
          You can now log in with your new password.
        </p>

        <Button asChild className='block w-full lg:w-[212px] mx-auto mt-[40px]'>
          <Link href='/sign-in' className='flex items-center justify-center'>
            Login
          </Link>
        </Button>
      </Card>
    </main>
  )
}

export default SuccessfulPage
