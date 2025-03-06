import React from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { Service } from '@/app/(shared)/services/learner/serviceService'
import MultiLevelCard from './MultiLevelCard'
import NextLevelCard from './NextLevelCard'
import PreviousAttemptCard from '../PreviousAttemptCard'
function MultiLevel({ serviceData }: { serviceData: Service }) {
  return (
    <div className='flex flex-col gap-6 max-w-[776px] mx-auto pt-10'>
      {serviceData.multi_level.length !== 1 && (
        <NextLevelCard nextLevelData={[]} />
      )}
      <PreviousAttemptCard />
      <Card className='flex flex-col gap-4 p-4'>
        <h2 className='text-lg font-semibold'>Description</h2>
        <p className='text-sm text-muted-foreground'>
          {serviceData.description}
        </p>
      </Card>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6'>
        {serviceData.multi_level.map((data, i) => (
          <MultiLevelCard
            key={data._id}
            multiLevelData={data}
            level={String(i + 1)}
          />
        ))}
      </div>
    </div>
  )
}

export default MultiLevel
