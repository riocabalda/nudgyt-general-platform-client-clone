import { Card } from '@/app/(shared)/components/ui/card'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'
import { cleanTotalCompletedTime } from '@/app/(shared)/utils'

function CompletedTimeCard() {
  const { details } = useGetSimulationResults()
  if (!details?.totalCompletedTime) return null

  return (
    <Card className='shadow-sm rounded-[8px] p-4 lg:p-6 grid gap-6'>
      <header className='grid gap-3 lg:gap-6'>
        <h3 className='text-lg font-semibold'>Completed Time</h3>
        <p className='text-neutral-gray-600 text-2xl font-medium'>
          {cleanTotalCompletedTime(details.totalCompletedTime)}
        </p>
      </header>
    </Card>
  )
}

export default CompletedTimeCard
