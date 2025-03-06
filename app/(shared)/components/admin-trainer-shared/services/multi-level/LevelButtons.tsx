import React from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import { cn } from '@/app/(shared)/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function LevelButtons() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const level = searchParams.get('level') || '1'

  const levels = ['1', '2', '3']

  const handleLevelClick = (level: string) => {
    const currentTab = searchParams.get('tab') || 'learners'
    router.replace(`${pathname}?tab=${currentTab}&level=${level}`)
  }
  return (
    <Card className='flex w-full lg:w-[200px] h-fit lg:h-[592px] mr-6 overflow-hidden flex-row lg:flex-col mb-6 lg:mb-0'>
      {levels.map((num) => (
        <Button
          variant='ghost'
          key={num}
          onClick={() => handleLevelClick(num)}
          className={cn(
            'w-full px-4 py-2 text-neutral-gray-600 font-medium rounded-none hover:text-neutral-gray-600 hover:bg-neutral-gray-100 [&:not(:last-child)]:border-r-[1px] lg:border-b-[1px] lg:border-neutral-gray-200',
            level === num && 'bg-neutral-gray-200 hover:bg-neutral-gray-200'
          )}
        >
          Level {num}
        </Button>
      ))}
    </Card>
  )
}

export default LevelButtons
