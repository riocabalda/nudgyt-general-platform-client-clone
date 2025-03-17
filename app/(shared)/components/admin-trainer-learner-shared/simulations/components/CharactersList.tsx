'use client'
import { CharacterType } from '@/app/(shared)/types'
import DOMPurify from 'dompurify'
import { ChevronLeft, ChevronRight, Languages, UserRound } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import PreviewVoice from '../../../PreviewVoice'
import { Button } from '../../../ui/button'
import useGetSimulationResults from '../hooks/useGetSimulationResults'

function CharactersList() {
  const { details, voiceTypes } = useGetSimulationResults()
  const [currentCharacter, setCurrentCharacter] =
    useState<CharacterType | null>(null)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
  const characters = details?.characters || []

  const handleNextCharacter = () => {
    if (currentCharacterIndex < characters.length - 1) {
      setCurrentCharacterIndex((prev) => prev + 1)
      setCurrentCharacter(characters[currentCharacterIndex + 1])
    }
  }

  const handlePrevCharacter = () => {
    if (currentCharacterIndex > 0) {
      setCurrentCharacterIndex((prev) => prev - 1)
      setCurrentCharacter(characters[currentCharacterIndex - 1])
    }
  }

  // Initialize current character when details load
  useEffect(() => {
    if (characters.length > 0 && !currentCharacter) {
      setCurrentCharacter(characters[0])
    }
  }, [characters, currentCharacter])

  const path = voiceTypes?.data?.find(
    (voice: any) => voice.voice_value === currentCharacter?.voice_type
  )?.sample_link

  return (
    <div>
      {characters.length > 0 && currentCharacter ? (
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between'>
            <h4 className='text-lg font-semibold'>{`Character${characters.length > 1 ? 's' : ''}`}</h4>
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
          <div className='flex items-start justify-between'>
            <div className='flex gap-[24px]'>
              <div className='shrink-0 size-[60px] lg:size-[72px] overflow-hidden bg-muted rounded-full'>
                <Image
                  src={currentCharacter?.avatar.image_path ?? ''}
                  height='72'
                  width='72'
                  alt={currentCharacter?.name || ''}
                  quality='100'
                  className='w-full h-full object-cover'
                />
              </div>

              <div className='flex flex-col justify-center'>
                <p className='text-lg font-semibold'>
                  {currentCharacter?.name ? (
                    currentCharacter.name
                  ) : (
                    <span className='text-destructive text-lg'>
                      No character name
                    </span>
                  )}
                </p>
                <p className='text-sm mt-[8px]'>
                  {currentCharacter?.age && currentCharacter.age !== 'null' ? (
                    currentCharacter.age +
                    ' ' +
                    (currentCharacter.age && Number(currentCharacter.age) <= 1
                      ? 'year'
                      : 'years') +
                    ' old'
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
            <div className='flex items-center gap-[12px] text-muted-foreground'>
              <UserRound className='size-4' />
              <p className='text-xs lg:text-sm'>{currentCharacter?.gender}</p>
            </div>
            <PreviewVoice path={path || ''} />
            <div className='flex items-center gap-[12px] text-muted-foreground'>
              <Languages className='size-4' />
              <p className='text-xs lg:text-sm'>
                {currentCharacter?.languages &&
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

          <div className='case-details-rtk'>
            <ReactQuill
              className='quillReadOnly text-muted-foreground'
              theme='bubble'
              readOnly={true}
              value={DOMPurify.sanitize(currentCharacter?.backstory || '')}
            />
          </div>
        </div>
      ) : (
        <span className='text-destructive text-sm'>No character selected</span>
      )}
    </div>
  )
}

export default CharactersList
