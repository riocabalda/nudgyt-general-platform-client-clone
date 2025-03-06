import React from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import { Plus } from 'lucide-react'

function CreateCharacterButton() {
  return (
    <Button
      variant='outline'
      className='text-sm mt-5 mx-auto w-[173px] bg-white h-[32px] py-[8px] px-[32px]'
    >
      Create New
      <Plus />
    </Button>
  )
}

export default CreateCharacterButton
