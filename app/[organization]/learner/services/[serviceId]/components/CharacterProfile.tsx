import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Languages, UserRound } from 'lucide-react'
import { RichText } from '@/app/(shared)/components/ui/rich-text'
import { formatAgeText, formatLanguages } from '@/app/(shared)/utils'
import { Character } from '@/app/(shared)/services/learner/characterService'
import useSWR from 'swr'
import Image from 'next/image'
import DOMPurify from 'dompurify'
import PreviewVoice from '@/app/(shared)/components/PreviewVoice'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import characterService from '@/app/(shared)/services/learner/characterService'

const CharacterProfile = ({ characters }: { characters: Character[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { orgSlug } = useOrganization()

  const { data: voiceTypes } = useSWR(
    `${orgSlug}/learner/characters/voice-types`,
    () =>
      characterService.getCharacterVoiceTypes(orgSlug).then((res) => res.data)
  )
  const currentCharacter = characters[currentIndex]

  const voicePath =
    Array.isArray(voiceTypes?.data) &&
    currentCharacter &&
    voiceTypes?.data
      .find((voice) => voice.voice_value === currentCharacter.voice_type)
      ?.sample_link?.trim()

  const formattedCharacterLanguages = formatLanguages(
    Array.isArray(currentCharacter?.languages)
      ? currentCharacter?.languages
      : null
  )

  const characterSuffix = characters.length > 1 ? 's' : ''
  const characterDetails = `<strong>${currentCharacter?.name}</strong>, aged <strong>${currentCharacter?.age}</strong>, speaks <strong>${formattedCharacterLanguages}</strong>. ${currentCharacter?.backstory ?? ''}`

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < characters.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>{`Character${characterSuffix}`}</h2>
        {characters.length > 1 && (
          <div className='flex items-center gap-6'>
            <span className='text-sm font-medium'>
              {currentIndex + 1} / {characters.length}
            </span>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className='disabled:text-neutral-gray-500'
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === characters.length - 1}
              className='disabled:text-neutral-gray-500'
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {currentCharacter ? (
        <div>
          <div className='flex items-center gap-4'>
            <div className='shrink-0 size-[60px] lg:size-[72px] overflow-hidden bg-muted rounded-full'>
              <Image
                src={currentCharacter?.avatar?.image_path ?? ''}
                height='72'
                width='72'
                alt={currentCharacter?.name}
                quality='100'
                className='w-full h-full object-cover'
              />
            </div>
            <div>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-semibold'>
                  {currentCharacter?.name}
                </h3>
                <span className='text-xs font-medium capitalize rounded-sm bg-neutral-gray-100 p-[6px]'>
                  Discover
                </span>
              </div>
              <p className='text-sm mt-2'>
                {formatAgeText(currentCharacter?.age)}
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-6 mt-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-[12px] text-muted-foreground'>
                <UserRound className='size-4' />
                <p className='text-xs lg:text-sm'>
                  {currentCharacter?.avatar.gender}
                </p>
              </div>
              {voicePath ? (
                <PreviewVoice path={voicePath} />
              ) : (
                // Placeholder div to maintain grid layout when voicePath is not available
                <div className='h-9' />
              )}
              <div className='flex items-center gap-[12px] text-muted-foreground'>
                <Languages className='size-4' />
                <p className='text-xs lg:text-sm'>
                  {Array.isArray(currentCharacter?.languages) &&
                  currentCharacter?.languages.length > 0 ? (
                    currentCharacter?.languages.join(', ')
                  ) : (
                    <span className='text-destructive text-xs lg:text-sm'>
                      No character languages
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className='service-details-rtk'>
              <RichText
                readOnly={true}
                value={DOMPurify.sanitize(characterDetails || '')}
              />
            </div>
          </div>
        </div>
      ) : (
        <span className='text-destructive text-sm'>No character selected</span>
      )}
    </div>
  )
}

export default CharacterProfile
