import React from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { cn, formatDateTime } from '@/app/(shared)/utils'
import { ChevronRight, Ellipsis } from 'lucide-react'
import { ServiceLevel } from '@/app/(shared)/services/admin/serviceService'
import Image from 'next/image'
// import { Checkbox } from '@/app/(shared)/components/ui/checkbox'

function MultiLevelCard({
  multiLevelData,
  isPublished,
  level
}: {
  multiLevelData: ServiceLevel
  isPublished: boolean
  level: number
}) {
  // const [isChecked, setIsChecked] = useState(false)
  return (
    <Card
      className={cn(
        'flex flex-col gap-4 p-4 border-[1px] border-neutral-gray-400',
        isPublished && 'max-w-[376px] mx-auto'
      )}
    >
      <div className='flex text-sm font-semibold'>
        <h3 className='flex-1'>Level {level}</h3>
        <Ellipsis size={24} strokeWidth={1.5} />
      </div>
      <div>
        <div className='relative w-full aspect-[344/110] bg-neutral-400 rounded-t-[8px]'>
          <Image
            src={multiLevelData.environment.image}
            fill
            alt={multiLevelData.title}
            quality='100'
            className='absolute object-cover'
          />
        </div>
        <div className='p-4'>
          <div className='flex justify-between items-center'>
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

      {/* TODO: Add this back in when we have the data */}

      {/* {multiLevelData.ended_at && !isPublished && (
        <Card className='flex justify-between items-center border-[2px] border-brandcolorf bg-purple-shade-lightest/40 px-4 py-3'>
          <div className='flex items-center gap-[10px]'>
            <Checkbox
              className='h-5 w-5'
              id={multiLevelData.ended_at}
              onCheckedChange={() => setIsChecked(!isChecked)}
              checked={isChecked}
            />
            <label
              htmlFor={multiLevelData.ended_at}
              className='font-medium text-neutral-gray-800 leading-none'
            >
              Carry data forward
            </label>
          </div>
          <ChevronDown size={20} strokeWidth={1.5} />
        </Card>
      )} */}
    </Card>
  )
}

export default MultiLevelCard
