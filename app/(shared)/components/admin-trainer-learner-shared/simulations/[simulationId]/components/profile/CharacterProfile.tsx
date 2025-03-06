import React, { useState } from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { RichText } from '@/app/(shared)/components/ui/rich-text'
import { formatAgeText, formatLanguages } from '@/app/(shared)/utils'
import { ChevronLeft, ChevronRight, Languages, User } from 'lucide-react'
import { Character } from '@/app/(shared)/services/admin/characterService'
import DOMPurify from 'dompurify'

function CharacterProfile({ characters }: { characters: Character[] }) {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)

  const currentCharacter = characters[currentCharacterIndex]
  const formattedCharacterLanguages = formatLanguages(
    Array.isArray(currentCharacter?.languages)
      ? currentCharacter?.languages
      : null
  )
  const characterDetails = `<strong>${currentCharacter?.name}</strong>, aged <strong>${currentCharacter?.age}</strong>, speaks <strong>${formattedCharacterLanguages}</strong>. ${currentCharacter?.backstory ?? ''}`

  const handlePrevCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextCharacter = () => {
    setCurrentCharacterIndex((prev) =>
      prev < characters.length - 1 ? prev + 1 : prev
    )
  }

  return (
    <Card className='flex-1 w-full p-4 pb-[90px] lg:p-6 rounded-[8px] lg:border overflow-y-auto scrollbar-thin'>
      <header>
        <div className='flex items-center justify-between'>
          <h1 className='text-lg text-foreground font-semibold'>
            {currentCharacter?.name}
          </h1>
          {characters.length > 1 && (
            <div className='flex items-center gap-6'>
              <span className='text-sm font-medium'>
                {currentCharacterIndex + 1} / {characters.length}
              </span>
              <button
                onClick={handlePrevCharacter}
                disabled={currentCharacterIndex === 0}
                className='disabled:text-neutral-gray-500'
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextCharacter}
                disabled={currentCharacterIndex === characters.length - 1}
                className='disabled:text-neutral-gray-500'
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <p className='text-sm text-muted-foreground lg:text-foreground mt-2'>
          {formatAgeText(currentCharacter?.age)}
        </p>
      </header>
      <div className='flex-1 hidden lg:flex flex-col gap-3 mt-6 text-muted-foreground text-sm'>
        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
          <User size={16} strokeWidth={1} />
          <span>{currentCharacter?.avatar?.gender}</span>
        </div>
        <div className='flex items-center gap-3 text-sm text-muted-foreground'>
          <div className='w-4 h-4'>
            <Languages size={16} strokeWidth={1} />
          </div>
          <div>
            <span>{currentCharacter?.languages.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className='service-details-rtk mt-6'>
        <RichText
          readOnly={true}
          value={DOMPurify.sanitize(characterDetails || '')}
        />
      </div>
    </Card>
  )
}

export default CharacterProfile
