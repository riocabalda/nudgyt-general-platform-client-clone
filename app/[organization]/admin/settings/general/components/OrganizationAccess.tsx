'use client'
import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

function OrganizationAccess() {
  const { orgSlug } = useOrganization()

  return (
    <Card className='shadow-sm rounded-lg w-full lg:max-w-[600px] px-[80px] py-[40px]'>
      <div className='space-y-6'>
        <div className='text-center'>
          <h2 className='text-[20px] font-semibold text-neutral-gray-800 mb-4'>
            You have Organization Access
          </h2>
          <div className='flex items-baseline gap-2'>
            <span className='text-[24px] font-semibold text-neutral-gray-800'>
              $1,500
            </span>
            <span className='text-neutral-gray-600 text-[20px]'>monthly</span>
          </div>
        </div>

        <ul className='list-disc pl-5 leading-[21px] text-[14px]'>
          <li className='text-neutral-gray-600'>
            Unlimited creation of{' '}
            <span className='font-bold'>draft Services</span>
          </li>
          <li className='text-neutral-gray-600'>
            Unlimited published{' '}
            <span className='font-bold'>
              unique Services for your Organization
            </span>
          </li>
          <li className='text-neutral-gray-600'>
            <span className='font-bold'>60 active user seats</span> maximum
            <ul className='list-disc pl-5'>
              <li className='text-neutral-gray-600'>
                $30 for each additional user seat
              </li>
            </ul>
          </li>
          <li className='text-neutral-gray-600'>
            Admin panel for{' '}
            <span className='font-bold'>accessing and managing users</span> in
            your Organization
          </li>
          <li className='text-neutral-gray-600'>User support</li>
        </ul>

        <div className='pt-2'>
          <Link href={`/${orgSlug}/admin/settings/general`}>
            <Button className='w-full text-base font-semibold text-neutral-gray-800 bg-white border border-neutral-gray-400 hover:bg-gray-50 rounded-lg py-3 px-4 flex items-center justify-center gap-2'>
              <span>Go to Billing</span>
              <ArrowRight className='w-5 h-5 ml-5' />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default OrganizationAccess
