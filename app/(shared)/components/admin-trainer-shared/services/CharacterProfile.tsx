import React, { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/app/(shared)/components/ui/collapsible'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Languages,
  UserRound
} from 'lucide-react'
import { RichText } from '../../ui/rich-text'
import { formatAgeText, formatLanguages } from '@/app/(shared)/utils'
import { Button } from '@/app/(shared)/components/ui/button'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import Image from 'next/image'
import DOMPurify from 'dompurify'
import PreviewVoice from '../../PreviewVoice'
import Personality from './service-details/Personality'
import { VoiceType } from '@/app/(shared)/services/admin/characterService'
import { Template } from '@/app/(shared)/services/admin/templateService'

function CharacterProfile({
  serviceData,
  voiceTypes,
  isTemplate = false
}: {
  serviceData: Service | Template
  voiceTypes: VoiceType[]
  isTemplate?: boolean
}) {
  const [showPersonality, setShowPersonality] = useState(true)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)

  const characters = isTemplate
    ? (serviceData as Template).characters
    : (serviceData as Service).basic_level.characters || []
  const currentCharacter = characters[currentCharacterIndex]

  const voicePath =
    currentCharacter &&
    voiceTypes
      ?.find((voice) => voice.voice_value === currentCharacter.voice_type)
      ?.sample_link?.trim()

  const formattedCharacterLanguages = formatLanguages(
    Array.isArray(currentCharacter?.languages)
      ? currentCharacter?.languages
      : null
  )

  const characterSuffix = characters.length > 1 ? 's' : ''
  const characterDetails = `<strong>${currentCharacter?.name}</strong>, aged <strong>${currentCharacter?.age}</strong>, speak${currentCharacter?.languages?.length > 1 ? 's' : ''} <strong>${formattedCharacterLanguages}</strong>. ${currentCharacter?.backstory}\n${currentCharacter?.hidden_backstory}`

  const handlePrevCharacter = () => {
    setCurrentCharacterIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNextCharacter = () => {
    setCurrentCharacterIndex((prev) =>
      prev < characters.length - 1 ? prev + 1 : prev
    )
  }
  return (
    <div>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold'>{`Character${characterSuffix}`}</h3>
        {characters.length > 1 && (
          <div className='flex items-center gap-6'>
            <span className='text-sm'>
              {currentCharacterIndex + 1} of {characters.length}
            </span>
            <Button
              variant='ghost'
              size='icon'
              onClick={handlePrevCharacter}
              disabled={currentCharacterIndex === 0}
              className='h-6 w-6 disabled:bg-transparent disabled:text-muted-foreground'
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>

            <Button
              variant='ghost'
              size='icon'
              onClick={handleNextCharacter}
              disabled={currentCharacterIndex === characters.length - 1}
              className='h-6 w-6 disabled:bg-transparent disabled:text-muted-foreground'
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
          </div>
        )}
      </div>

      <div className='w-full flex flex-col gap-6 mt-4'>
        {currentCharacter ? (
          <>
            <div className='flex items-start justify-between'>
              <div className='flex gap-6'>
                <div className='shrink-0 size-[60px] lg:size-[72px] overflow-hidden bg-muted rounded-full'>
                  <Image
                    src={currentCharacter?.avatar.image_path ?? ''}
                    height='72'
                    width='72'
                    alt={currentCharacter?.name}
                    quality='100'
                    className='w-full h-full object-cover'
                  />
                </div>

                <div className='flex flex-col justify-center'>
                  <p className='text-lg font-semibold'>
                    {currentCharacter?.name || (
                      <span className='text-destructive text-lg'>
                        No character name
                      </span>
                    )}
                  </p>
                  <p className='text-sm mt-2'>
                    {currentCharacter.age ? (
                      formatAgeText(currentCharacter?.age)
                    ) : (
                      <span className='text-destructive text-sm'>
                        No character age
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex items-center gap-3 text-muted-foreground'>
                <UserRound className='size-4' />
                <p className='text-xs lg:text-sm'>
                  {currentCharacter.avatar.gender ? (
                    currentCharacter.avatar?.gender
                  ) : (
                    <span className='text-destructive text-xs lg:text-sm'>
                      No character gender
                    </span>
                  )}
                </p>
              </div>

              {voicePath ? (
                <PreviewVoice path={voicePath} />
              ) : (
                // Placeholder div to maintain grid layout when voicePath is not available
                <div className='h-9' />
              )}

              <div className='flex items-center gap-3 text-muted-foreground'>
                <Languages className='size-4' />
                <p className='text-xs lg:text-sm'>
                  {Array.isArray(currentCharacter?.languages) ? (
                    currentCharacter?.languages?.join(', ')
                  ) : (
                    <span className='text-destructive text-xs lg:text-sm'>
                      No character languages
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className='service-details-rtk'>
              {currentCharacter ? (
                <RichText
                  readOnly={true}
                  value={DOMPurify.sanitize(characterDetails)}
                />
              ) : (
                <span className='text-destructive text-xs lg:text-sm'>
                  No character details
                </span>
              )}
            </div>
          </>
        ) : (
          <span className='text-destructive text-sm'>
            No character selected
          </span>
        )}

        {currentCharacter && (
          <Collapsible
            open={showPersonality}
            onOpenChange={setShowPersonality}
            className='w-full space-y-2'
          >
            <div className='flex items-center justify-between space-x-4'>
              <h4 className='text-sm font-semibold'>Personality</h4>
              <CollapsibleTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='p-0 text-foreground'
                >
                  {showPersonality ? (
                    <ChevronUp className='size-6' strokeWidth='1.5' />
                  ) : (
                    <ChevronDown className='size-6' strokeWidth='1.5' />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className='space-y-2 cursor-not-allowed'>
              <Personality
                personality={currentCharacter.personality}
                disabled={true}
              />
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  )
}

export default CharacterProfile
