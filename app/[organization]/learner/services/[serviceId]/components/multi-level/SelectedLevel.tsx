import React from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ServiceLevel } from '@/app/(shared)/services/learner/serviceService'
import Environment from '../Environment'
import CharacterProfile from '../CharacterProfile'

// Calculate the new index based on the current level and direction
function getNewIndex(currentLevel: number, direction: number): number {
  return currentLevel + direction
}

function SelectedLevel({
  selectedLevelData,
  levelArray
}: {
  selectedLevelData: ServiceLevel
  levelArray: string[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const levelParams = searchParams.get('level')

  const isLock = false

  const currentLevel = levelParams ? parseInt(levelParams) : 1

  const handleNextLevel = (direction: number) => {
    if (
      (direction === -1 && currentLevel === 1) ||
      (direction === 1 && currentLevel === levelArray.length)
    )
      return

    const newIndex = getNewIndex(currentLevel, direction)
    router.push(`${pathname}?level=${levelArray[newIndex - 1]}`)
  }

  return (
    <Card className='flex flex-col gap-6 p-4 lg:p-6 max-w-[712px] mx-auto mt-10'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium'>Level {levelParams}</h3>
        <div className='flex items-center gap-6'>
          <span className='text-sm font-medium'>
            {currentLevel} / {levelArray.length}
          </span>
          <button
            onClick={() => handleNextLevel(-1)}
            disabled={currentLevel === 1}
            className='disabled:text-neutral-gray-500'
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleNextLevel(1)}
            disabled={currentLevel === levelArray.length}
            className='disabled:text-neutral-gray-500'
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <h2 className='text-2xl font-semibold'>{selectedLevelData.title}</h2>
      {!isLock ? (
        <>
          <div>
            <h2 className='text-lg font-semibold'>Description</h2>
            <p className='mt-4 text-sm text-muted-foreground'>
              {selectedLevelData.description}
            </p>
          </div>

          <hr className='border-t border-neutral-gray-400' />

          <CharacterProfile characters={selectedLevelData.characters} />

          <hr className='border-t border-neutral-gray-400' />

          <Environment serviceEnvironmentData={selectedLevelData.environment} />
        </>
      ) : (
        <div className='flex flex-col items-center justify-center h-[250px] gap-[10px]'>
          <Lock size={24} className='text-neutral-gray-300' />
          <p className='text-sm text-neutral-gray-600'>
            This service is locked
          </p>
        </div>
      )}
    </Card>
  )
}

export default SelectedLevel
