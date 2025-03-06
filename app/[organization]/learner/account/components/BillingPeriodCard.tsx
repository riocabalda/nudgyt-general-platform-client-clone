import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'

function EditPeriodButton() {
  return (
    <Button variant='outline' className='lg:w-[200px] cursor-not-allowed'>
      Edit period
    </Button>
  )
}

function BillingPeriodCard() {
  return (
    <Card className='flex flex-col lg:flex-row justify-between gap-6 p-4'>
      <div className='w-full space-y-2'>
        <h3 className='font-semibold text-lg'>Billing period</h3>

        <p className='text-sm text-neutral-gray-600'>Yearly</p>
      </div>

      <footer className='w-full lg:w-auto grid'>
        <EditPeriodButton />
      </footer>
    </Card>
  )
}

export default BillingPeriodCard
