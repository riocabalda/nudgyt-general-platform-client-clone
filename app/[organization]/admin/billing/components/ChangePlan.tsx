import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'

function ChangePlan() {
  return (
    <Card className='shadow-sm rounded-none lg:rounded-[8px] py-10 px-4 lg:px-20 flex flex-col gap-6 items-center w-full lg:max-w-[600px]'>
      <div className='text-xl font-semibold text-neutral-800 flex flex-col items-center'>
        <span>This workspace is on the</span>
        <span>Organization Tier</span>
      </div>
      <ul className='text-sm space-y-2 list-disc pl-5 text-neutral-600'>
        <li className='pl-2'>
          Access to Course Documents of <strong>completed</strong> Trainings
        </li>
        <li className='pl-2'>
          Access to <strong>all</strong> Simulations
        </li>
        <li className='pl-2'>
          <strong>360 minutes</strong> (6 hours) of Simulation time per month
        </li>
      </ul>
      <Button variant='outline' className='w-full'>
        Change plan
      </Button>
    </Card>
  )
}

export default ChangePlan
