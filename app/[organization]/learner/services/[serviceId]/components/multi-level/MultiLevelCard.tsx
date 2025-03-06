import React from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { ServiceLevel } from '@/app/(shared)/services/learner/serviceService'
import { formatDateTime } from '@/app/(shared)/utils'
import Image from 'next/image'

function MultiLevelCard({
  multiLevelData,
  level
}: {
  multiLevelData: ServiceLevel
  level: string
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLevelClick = (level: string) => {
    router.push(`${pathname}?level=${level}`)
  }
  return (
    <Card
      className='flex flex-col gap-4 p-4 cursor-pointer'
      onClick={() => handleLevelClick(level)}
    >
      <h3 className='text-sm font-semibold'>Level {level}</h3>
      <div>
        <div className='relative w-full aspect-[344/110] bg-neutral-400 rounded-t-[8px]'>
          {multiLevelData?.characters[0]?.avatar && (
            <Image
              src={multiLevelData.characters[0].avatar.image_path ?? ''}
              fill
              alt={multiLevelData.characters[0].name ?? ''}
              className='absolute object-cover z-[2] !w-1/2 !left-[10%]'
            />
          )}
          {multiLevelData?.environment?.image ? (
            <Image
              src={multiLevelData.environment.image ?? ''}
              fill
              alt={multiLevelData.environment.location ?? ''}
              className='absolute object-cover brightness-[.6]'
            />
          ) : (
            <div className='bg-muted w-full h-full absolute' />
          )}
        </div>
        <div className='p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-semibold'>{multiLevelData.title}</h2>
            <ChevronRight
              className='text-neutral-gray-600 shrink-0'
              size={24}
              strokeWidth={1.5}
            />
          </div>
          <div className='mt-4'>
            <p className='text-xs font-medium text-neutral-gray-800 uppercase'>
              Created
            </p>
            <p className='text-sm text-neutral-gray-600'>
              {formatDateTime(multiLevelData.created_at)}
            </p>
            <p className='text-sm text-neutral-gray-600'>
              by {multiLevelData.creator.full_name}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MultiLevelCard
