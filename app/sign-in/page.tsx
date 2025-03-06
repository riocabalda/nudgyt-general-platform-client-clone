'use client'

import Image from 'next/image'
import Link from 'next/link'
import RedirectAuth from '../(shared)/components/helper/RedirectAuth'
import { Card } from '../(shared)/components/ui/card'
import SignInForm from './components/SignInForm'

function SignInPage() {
  return (
    <RedirectAuth>
      <main className='flex flex-col items-center lg:justify-center min-h-svh'>
        <Card className='flex flex-col min-h-[100svh] lg:min-h-max lg:h-auto lg:max-h-[552px] bg-transparent bg-white w-full max-w-[500px] rounded-none lg:rounded-[10px] px-4 py-[60px] lg:px-[60px] lg:py-[48px] shadow-none border-none lg:border lg:shadow-sm space-y-[60px] lg:space-y-12'>
          <Link href='/'>
            <Image
              src='/images/nudgyt-logo.png'
              alt='Nudgyt logo'
              height={65}
              width={228}
              quality={100}
              className='hidden lg:block object-contain mx-auto'
            />
            <Image
              src='/images/nudgyt-logo.png'
              alt='Nudgyt logo'
              height={100}
              width={200}
              quality={100}
              className='lg:hidden py-12 object-contain mx-auto'
            />
          </Link>
          <SignInForm />
        </Card>
      </main>
    </RedirectAuth>
  )
}

export default SignInPage
