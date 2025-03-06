import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'

function PaymentMethod() {
  return (
    <Card className='shadow-sm rounded-none lg:rounded-[8px] p-4 flex justify-between items-center w-full lg:max-w-[600px] gap-6'>
      <div className='flex flex-col gap-2 w-full'>
        <h1 className='text-lg font-semibold'>Payment method</h1>
        <div className='flex justify-between'>
          <p className='text-sm text-neutral-600'>Credit Card</p>
          <p className='text-sm text-neutral-600'>MasterCard ending in 1801</p>
        </div>
      </div>
      <Button variant='outline' className='min-w-[200px]'>
        Edit method
      </Button>
    </Card>
  )
}

export default PaymentMethod
