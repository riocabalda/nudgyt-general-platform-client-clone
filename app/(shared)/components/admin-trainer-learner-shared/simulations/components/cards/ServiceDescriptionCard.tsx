'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import DOMPurify from 'dompurify'
import Image from 'next/image'
import ReactQuill from 'react-quill'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'
import CharactersList from '../CharactersList'

function ServiceDescriptionCard() {
  const { details, simulationServiceDetails } = useGetSimulationResults()

  return (
    <Card className='p-6'>
      <h3 className='text-lg font-semibold'>Service Description</h3>
      <p className='text-sm text-neutral-gray-600 mt-4'>
        {simulationServiceDetails?.data?.description}
      </p>

      <hr className='my-6' />

      <div className='flex flex-col gap-6'>
        <CharactersList />
      </div>

      <hr className='my-6' />

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-[24px] rounded-[8px] mt-4 lg:mt-[24px]'>
        {details?.environment ? (
          <>
            <div className='w-full  col-span-3 lg:col-span-2'>
              <Image
                src={details.environment.image ?? ''}
                height={200}
                width={200}
                alt={details.environment.location}
                quality='100'
                className='object-contain w-full'
              />
            </div>
            <div className='col-span-3'>
              <div className='flex items-start justify-between'>
                <p className='text-lg font-semibold'>
                  {details.environment.location}
                </p>
              </div>

              {/* <p className='mt-4 text-sm text-muted-foreground'>
              {environment?.location ? (
                environment.location
              ) : (
                <span className='text-destructive text-sm'>
                  No environment selected
                </span>
              )}
            </p> */}
              <div className='mt-4 text-muted-foreground case-details-rtk'>
                <ReactQuill
                  className='quillReadOnly'
                  theme='bubble'
                  readOnly={true}
                  value={
                    details.environment.description
                      ? DOMPurify.sanitize(details.environment.description)
                      : ''
                  }
                />
              </div>
            </div>
          </>
        ) : (
          <span className='text-destructive text-sm col-span-2'>
            No environment selected
          </span>
        )}
      </div>
    </Card>
  )
}

export default ServiceDescriptionCard
