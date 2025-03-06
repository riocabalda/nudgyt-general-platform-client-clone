'use client'

import React from 'react'
import { Button } from './ui/button'
import { ArrowLeft, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

function BackButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onClick) {
      onClick()
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={handleClick}
      className='-translate-x-[8px] lg:translate-x-0 lg:mr-[24px]'
    >
      <ArrowLeft className='hidden lg:block lg:size-[40px]' />
      <ChevronLeft className='size-[32px] lg:hidden' strokeWidth='1.5' />
    </Button>
  )
}

export default BackButton
