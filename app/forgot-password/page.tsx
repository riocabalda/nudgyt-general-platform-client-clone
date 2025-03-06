import { Card } from '@/app/(shared)/components/ui/card'
import Link from 'next/link'
import { Button } from '../(shared)/components/ui/button'
import ForgotPasswordForm from './components/ForgotPasswordForm'

function ForgotPasswordPage() {
  return (
    <main className='flex flex-col items-center lg:py-[60px] lg:justify-center min-h-svh'>
      <Card className='flex flex-col min-h-[100svh] lg:min-h-max lg:h-auto w-full max-w-[500px] rounded-none lg:rounded-[10px] px-4 py-[60px] lg:p-[60px] lg:pb-[48px] shadow-none border-none lg:border lg:shadow-sm'>
        <h1 className='text-2xl font-semibold lg:text-4xl lg:whitespace-nowrap'>
          Forgot password?
        </h1>
        <p className='mt-4 text-muted-foreground mb-[60px]'>
          No worries, we&apos;ll send you reset instructions.
        </p>
        <ForgotPasswordForm />
        <Button
          variant='link'
          className='block w-full mx-auto mt-4 lg:w-max'
          asChild
        >
          <Link href='/sign-in' className='flex items-center justify-center'>
            Back to login
          </Link>
        </Button>
      </Card>
    </main>
  )
}

export default ForgotPasswordPage
