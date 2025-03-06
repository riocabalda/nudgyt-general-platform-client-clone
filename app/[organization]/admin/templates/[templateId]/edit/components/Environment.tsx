'use client'

import FetchError from '@/app/(shared)/components/FetchError'
import { Card, CardContent } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import environmentService from '@/app/(shared)/services/admin/environmentService'
import { cn } from '@/app/(shared)/utils'
import { Image as ImageIcon, Loader, SearchX, UsersRound } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import useSWR from 'swr'
import { useTemplateStore } from '../../../create/hooks/useTemplateStore'
import NextStepButton from './NextStepButton'
import PrevStepButton from './PrevStepButton'

const Environment = () => {
  const { orgSlug } = useOrganization()
  const { environmentId, setEnvironmentId } = useTemplateStore()

  const {
    data: environmentData,
    isLoading,
    error
  } = useSWR(`${orgSlug}/admin/environments`, () =>
    environmentService.getEnvironments(orgSlug).then((res) => res.data)
  )

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  if (!environmentData?.data || environmentData.data.length === 0)
    return (
      <div className='h-[500px] flex flex-col items-center justify-center'>
        <SearchX className='text-neutral-gray-300 size-[24px]' />
        <p className='text-sm text-muted-foreground mt-[10px]'>
          No environment available
        </p>
      </div>
    )

  const selectedEnvironment =
    environmentData.data?.length && environmentId
      ? environmentData.data.find(
          (environment) => environment._id === environmentId
        )
      : null

  return (
    <div className='px-4 lg:px-0 pt-0 lg:py-10 max-w-[712px] mx-auto'>
      <h2 className='text-base font-semibold lg:text-[24px] lg:font-semibold'>
        Select Environment
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-[40px]'>
        <Card className='space-y-4 p-[24px] max-h-[440px] overflow-auto scrollbar-thin'>
          {environmentData.data.map((env) => (
            <Card
              key={env._id}
              className={cn(
                'cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary',
                environmentId === env._id ? 'ring-2 ring-brandcolorf' : ''
              )}
              onClick={() => setEnvironmentId(env._id)}
            >
              <CardContent className='p-0 relative h-[100px] w-full'>
                <Image
                  src={env.image ?? ''}
                  alt={env.location}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-lg'
                />
              </CardContent>
            </Card>
          ))}
        </Card>

        <Card className='hidden md:flex p-[24px] rounded-lg min-w-[470px] max-h-[440px] overflow-auto'>
          {selectedEnvironment ? (
            <div className='space-y-4'>
              <Image
                src={selectedEnvironment.image ?? ''}
                alt='Selected environment'
                width={420}
                height={180}
                objectFit='contain'
              />
              <p className='font-semibold text-[18px] text-neutral-black'>
                {selectedEnvironment.location}
              </p>
              <div className='flex gap-2 items-center'>
                <UsersRound className='size-[14px] text-neutral-gray-600' />
                <p className='text-[14px] text-neutral-gray-600'>
                  {selectedEnvironment.maximum_characters}
                  {selectedEnvironment.maximum_characters === 1
                    ? ' character maximum'
                    : ' characters maximum'}
                </p>
              </div>
              <p className='text-[14px] text-neutral-gray-600'>
                {selectedEnvironment.description}
              </p>
            </div>
          ) : (
            <div className='flex items-center justify-center mx-auto'>
              <div className='text-center text-gray-500'>
                <ImageIcon className='mx-auto text-muted-foreground' />
                <p className='mt-2 text-sm text-muted-foreground font-regular'>
                  Select environment
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <div className='mt-[24px] flex items-center justify-between w-full'>
        <PrevStepButton prevStep={1} />
        <NextStepButton nextStep={3} />
      </div>
    </div>
  )
}

export default Environment
