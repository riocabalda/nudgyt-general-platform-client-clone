import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CharacterNavigationProps {
  currentIndex: number
  totalCount: number
  onPrevious: () => void
  onNext: () => void
}

const CharacterNavigation = ({
  currentIndex,
  totalCount,
  onPrevious,
  onNext
}: CharacterNavigationProps) => {
  if (totalCount <= 1) return null

  return (
    <div className='flex items-center gap-3'>
      <span className='text-sm text-gray-600'>
        {currentIndex + 1} of {totalCount}
      </span>
      <div className='flex gap-2'>
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className='p-1 rounded hover:bg-gray-100 disabled:opacity-50'
          aria-label='Previous character'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === totalCount - 1}
          className='p-1 rounded hover:bg-gray-100 disabled:opacity-50'
          aria-label='Next character'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}

export default CharacterNavigation
