// import { get } from '@vercel/edge-config'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import InitAuth from './(shared)/components/helper/InitAuth'
// import MaintenancePage from './(shared)/components/MaintenancePage'
import { Toaster } from './(shared)/components/ui/sonner'
import { cn } from './(shared)/utils'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'Nudgyt AI Simulator',
  description: ''
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1
}

// async function fetchMaintenanceMode() {
//   try {
//     return (await get<boolean>('isInMaintenanceMode')) || false
//   } catch (error) {
//     console.error('Error fetching maintenance mode status:', error)
//     return false
//   }
// }

export default async function RootLayout({
  children
}: {
  children: ReactNode
}) {
  // const isMaintenance = await fetchMaintenanceMode()

  // if (isMaintenance) return <MaintenancePage />

  return (
    <html lang='en'>
      <body
        className={cn(
          `${inter.variable} font-inter`,

          'scrollbar-thin', // Body overflow is what makes the page scrollable, not the main container

          /** Darker than default to contrast well with the page backgrounds */
          'scrollbar-thumb-slate-300/60 hover:scrollbar-thumb-slate-300/80 active:scrollbar-thumb-slate-300',
          'scrollbar-track-transparent scrollbar-thumb-rounded-full',

          /** Use different scrollbar styles in landing page */
          'has-[#home-page]:scrollbar-thumb-white/80 has-[#home-page]:hover:scrollbar-thumb-white/70 has-[#home-page]:active:scrollbar-thumb-white/80',
          'has-[#home-page]:scrollbar-track-violet-950'
        )}
      >
        <InitAuth>{children}</InitAuth>
        <Toaster position='top-center' closeButton />
      </body>
    </html>
  )
}
