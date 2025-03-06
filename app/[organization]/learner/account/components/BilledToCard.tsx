import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'

function BillingInfoSection() {
  return (
    <section className='text-sm text-neutral-gray-600 space-y-2'>
      <p>Hank McLean</p>
      <p>
        506 Durgan Landing, Kapitolyo, Pasig City, Metro Manila, Philippines
      </p>
      <p>hank_mclean@vaultec.com</p>
    </section>
  )
}

function EditInformationButton() {
  return (
    <Button variant='outline' className='lg:w-[200px] cursor-not-allowed'>
      Edit information
    </Button>
  )
}

function BilledToCard() {
  return (
    <Card className='flex flex-col lg:flex-row justify-between gap-6 p-4'>
      <div className='w-full space-y-2'>
        <h3 className='font-semibold text-lg'>Billed to</h3>

        <BillingInfoSection />
      </div>

      <footer className='w-full lg:w-auto grid'>
        <EditInformationButton />
      </footer>
    </Card>
  )
}

export default BilledToCard
