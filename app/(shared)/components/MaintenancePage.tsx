import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { Card } from './ui/card'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

function MaintenancePage() {
  return (
    <html lang='en'>
      <body className={`${inter.variable} font-inter`}>
        <div className='flex flex-col items-center justify-center min-h-screen gap-[60px]'>
          <Image
            src='/images/placeholder.jpg'
            alt='Company logo'
            height={60}
            width={235}
            className='hidden sm:block h-[80px] object-contain mx-auto mb-4'
          />
          <Card className='flex flex-col mx-4 md:mx-2 bg-transparent border-none shadow-none md:bg-white gap-10 md:max-w-[690px] md:rounded-[10px] md:px-4 md:py-6 lg:px-[80px] lg:py-[60px] md:shadow-sm my-4 items-center justify-center'>
            <div className='flex flex-col items-center justify-center'>
              <Image
                src='/images/placeholder.jpg'
                alt='Company logo'
                height={60}
                width={235}
                className='block sm:hidden h-[80px] object-contain mx-auto mb-12'
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='81'
                height='80'
                viewBox='0 0 81 80'
                fill='none'
              >
                <path
                  d='M57.166 46.6667V70M23.8327 46.6667V70M57.166 10V20M23.8327 10V20M33.8328 46.6668L8.16618 21.0002M47.166 20L72.8327 45.6667M27.166 20L53.8327 46.6667M10.4993 20H70.4994C72.3403 20 73.8327 21.4924 73.8327 23.3333V43.3333C73.8327 45.1743 72.3403 46.6667 70.4994 46.6667H10.4993C8.6584 46.6667 7.16602 45.1743 7.16602 43.3333V23.3333C7.16602 21.4924 8.6584 20 10.4993 20Z'
                  stroke='#1A4595'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </div>
            <div className='flex flex-col gap-4 items-center'>
              <h1 className='text-2xl font-semibold text-center lg:text-4xl'>
                We&apos;re currently performing website maintenance.
              </h1>
              <p className='text-muted-foreground'>
                Please check back again soon.
              </p>
            </div>
            <Button variant='outline' className='block my-3 lg:w-max mx-auto'>
              <Link
                href='mailto:info@nudgyt.com'
                className='flex items-center justify-center'
              >
                Contact Us
              </Link>
            </Button>
          </Card>
        </div>
      </body>
    </html>
  )
}

export default MaintenancePage
