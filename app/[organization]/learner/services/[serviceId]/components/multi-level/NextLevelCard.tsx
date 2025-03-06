import React from 'react'
import NextLevelModal from './NextLevelModal'
import { Card } from '@/app/(shared)/components/ui/card'

function NextLevelCard({ nextLevelData }: { nextLevelData: any }) {
  return (
    <Card className='bg-primary-100 p-6 rounded-lg flex justify-between items-center'>
      <div className='flex flex-col gap-2'>
        <div className='text-primary-500 text-xs font-medium'>NEXT LEVEL</div>
        <p className='text-primary-500 font-semibold'>
          {nextLevelData.description}
        </p>
      </div>
      <NextLevelModal nextLevelData={nextLevelData} />
    </Card>
  )
}

export default NextLevelCard
