import React from 'react'
import SignUpForm from './components/SignUpForm'
import RedirectAuth from '../(shared)/components/helper/RedirectAuth'
import { Card } from '../(shared)/components/ui/card'

function SignUpPage() {
  return (
    <RedirectAuth>
      <main className='flex flex-col items-center lg:py-[60px] lg:justify-center min-h-svh'>
        <Card className='flex flex-col min-h-[100svh] lg:min-h-max lg:h-auto bg-transparent bg-white w-full max-w-[600px] rounded-none lg:rounded-[10px] px-0 py-[60px] lg:px-[80px] shadow-none border-none lg:border lg:shadow-sm'>
          <SignUpForm />
        </Card>
      </main>
    </RedirectAuth>
  )
}

export default SignUpPage
