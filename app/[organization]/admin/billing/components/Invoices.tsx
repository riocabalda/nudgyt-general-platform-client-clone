'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { cn } from '@/app/(shared)/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { INVOICES } from './data'

function Invoices() {
  const { orgSlug } = useOrganization()
  return (
    <div className='flex flex-col gap-6 w-full lg:max-w-[600px]'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Invoices</h1>
        <Button variant='link' size='sm' className='!px-0 no-underline'>
          <Link
            href={`/${orgSlug}/admin/billing/invoices`}
            className='flex items-center gap-[10px] '
          >
            <p className='text-brandcolora text-base font-medium'>See All</p>
            <ArrowRight className='size-4' />
          </Link>
        </Button>
      </div>
      <div className='shadow-sm rounded-none lg:rounded-[8px] w-full lg:max-w-[600px] bg-white mb-10'>
        {INVOICES.slice(0, 6).map((invoice, index) => (
          <div
            key={`invoice-${index}`}
            className={cn(
              'min-h-20 flex justify-between items-center gap-6 px-6',
              index % 2 !== 0 && 'bg-neutral-100'
            )}
          >
            <div className='w-full flex flex-col gap-2'>
              <p className='text-sm text-neutral-800'>{invoice.date}</p>
              {invoice.date !== 'Upcoming' && (
                <p className='text-sm text-neutral-600'>
                  {invoice.status} •{' '}
                  {invoice.status === 'Credited'
                    ? `(${invoice.currency} ${invoice.amount})`
                    : `${invoice.currency} ${invoice.amount}`}
                </p>
              )}
            </div>
            <Button variant='outline' size='sm' className='!py-2 !px-8'>
              View invoice
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Invoices
