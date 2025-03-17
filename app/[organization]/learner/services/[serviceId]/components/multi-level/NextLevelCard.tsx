import { Card } from '@/app/(shared)/components/ui/card'
import NextLevelModal from './NextLevelModal'

function NextLevelCard({ nextLevelData }: { nextLevelData: any }) {
  return (
    <Card className='bg-primary-100 p-6 rounded-lg flex justify-between items-center'>
      <div className='flex flex-col gap-2'>
        <div className='text-brandcolora text-xs font-medium'>NEXT LEVEL</div>
        <p className='text-brandcolora font-semibold'>
          {nextLevelData.description}
        </p>
      </div>
      <NextLevelModal nextLevelData={nextLevelData} />
    </Card>
  )
}

export default NextLevelCard
