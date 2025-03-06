import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'

function EditMethodButton() {
  return (
    <Button variant='outline' className='lg:w-[200px] cursor-not-allowed'>
      Edit method
    </Button>
  )
}

function PaymentMethodCard() {
  return (
    <Card className='flex flex-col lg:flex-row justify-between gap-6 p-4'>
      <div className='w-full space-y-2'>
        <h3 className='font-semibold text-lg'>Payment method</h3>

        <div className='flex items-center justify-between gap-1 lg:gap-2'>
          <p className='text-sm text-neutral-gray-600'>Credit Card</p>
          <p className='text-sm text-neutral-gray-600'>
            MasterCard ending in 1801
          </p>
        </div>
      </div>

      <footer className='w-full lg:w-auto grid'>
        <EditMethodButton />
      </footer>
    </Card>
  )
}

export default PaymentMethodCard
