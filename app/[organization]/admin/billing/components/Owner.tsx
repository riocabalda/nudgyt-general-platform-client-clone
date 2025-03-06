import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'

function Owner() {
  return (
    <Card className='shadow-sm rounded-none lg:rounded-[8px] p-4 flex justify-between items-center w-full lg:max-w-[600px] gap-6'>
      <div className='flex flex-col gap-2 w-full'>
        <h1 className='text-lg font-semibold'>Billed to</h1>
        <p className='text-sm text-neutral-600'>Hand McLean</p>
        <p className='text-sm text-neutral-600'>
          506 Durgan Landing, Kapitolyo, Pasig City, Metro Manila, Philippines
        </p>
        <p className='text-sm text-neutral-600'>hank_mclean@vaultec.com</p>
      </div>
      <Button variant='outline' className='min-w-[200px]'>
        Edit information
      </Button>
    </Card>
  )
}

export default Owner
