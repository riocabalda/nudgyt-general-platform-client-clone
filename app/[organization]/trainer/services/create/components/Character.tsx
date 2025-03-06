'use client'

import CharacterEditModal from '@/app/(shared)/components/admin-trainer-shared/character/CharacterEditModal'
import FetchError from '@/app/(shared)/components/FetchError'
import PreviewVoice from '@/app/(shared)/components/PreviewVoice'
import Search from '@/app/(shared)/components/Search'
import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import { Label } from '@/app/(shared)/components/ui/label'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import characterService from '@/app/(shared)/services/trainer/characterService'
import { cn } from '@/app/(shared)/utils'
import { Languages, Loader, Plus, SquareUser, UserRound } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import useSWR from 'swr'
import useGetTemplate from '../../../templates/[templateId]/hooks/useGetTemplate'
import { useGetCharacters } from '../hooks/useGetCharacters'
import { useServiceStore } from '../hooks/useServiceStore'
import CharacterNavigation from './CharacterNavigation'
import CreateCharacter from './CreateCharacter'
import PrevStepButton from './PrevStepButton'
import { useGetEnvironmentById } from '../hooks/useGetEnvironmentById'

const Character = () => {
  const { orgSlug } = useOrganization()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const { data: templateData } = useGetTemplate(
    String(orgSlug),
    String(templateId)
  )

  const {
    characterIds,
    isCreatingCharacter,
    setCharacterIds,
    setIsCreatingCharacter,
    environmentId
  } = useServiceStore()

  const { data: environmentData } = useGetEnvironmentById(
    orgSlug,
    environmentId
  )

  const {
    data: characterData,
    isLoading,
    error
  } = useGetCharacters(orgSlug, searchParams.toString())

  useEffect(() => {
    if (templateData) {
      setCharacterIds(
        templateData.data.characters?.map((character: any) => character._id) ||
          []
      )
    }
  }, [templateData])

  useEffect(() => {
    if (templateData?.data?.characters && characterData?.data) {
      const templateCharacters = templateData.data.characters.filter(
        (templateChar: any) =>
          !characterData.data.some((char: any) => char._id === templateChar._id)
      )

      if (templateCharacters.length > 0) {
        characterData.data = [...templateCharacters, ...characterData.data]
      }
    }
  }, [templateData, characterData])

  const { data: voiceTypes } = useSWR(
    `${orgSlug}/trainer/characters/voice-types`,
    () =>
      characterService.getCharacterVoiceTypes(orgSlug).then((res) => res.data)
  )

  const [selectedCharacterIndex, setSelectedCharacterIndex] = React.useState(0)

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  const selectedCharacters = characterData?.data.filter((char: any) =>
    characterIds?.includes(char._id)
  )

  const availableCharacters =
    characterData?.data.filter((char: any) =>
      environmentData?.data?.available_characters?.includes(char.avatar.mesh_id)
    ) || []

  const currentSelectedCharacter = selectedCharacters[selectedCharacterIndex]

  const getVoiceSampleLink = (voiceType: string) => {
    const matchingVoice = voiceTypes?.data.find(
      (voice: any) => voice.voice_value === voiceType
    )
    return matchingVoice?.sample_link || null
  }

  return isCreatingCharacter ? (
    <CreateCharacter />
  ) : (
    <div className='px-4 lg:px-0 pt-0 lg:py-10 max-w-[712px] mx-auto'>
      <h2 className='text-base font-normal lg:text-2xl lg:font-semibold mb-6'>
        Select Character
      </h2>

      <Card className='max-w-5xl mx-auto p-4 mt-[40px]'>
        <div className='flex lg:grid grid-cols-3 gap-4 mb-4 items-center'>
          <div>
            <Search isRemovePageQueryOnSearch={false} />
          </div>
          <div className='hidden sm:block'>
            <CharacterNavigation
              currentIndex={selectedCharacterIndex}
              totalCount={selectedCharacters.length}
              onPrevious={() =>
                setSelectedCharacterIndex((prev) => Math.max(0, prev - 1))
              }
              onNext={() =>
                setSelectedCharacterIndex((prev) =>
                  Math.min(selectedCharacters.length - 1, prev + 1)
                )
              }
            />
          </div>

          <Button
            onClick={() => setIsCreatingCharacter(!isCreatingCharacter)}
            variant='outline'
            className='flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50 lg:h-[32px] w-max ml-auto'
          >
            <span className='lg:mr-2'>
              <Plus className='w-4 h-4' />
            </span>
            <span className='hidden sm:inline text-sm'>Create new</span>
          </Button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg gap-4'>
          <Card className='bg-gray-50 rounded-sm border border-neutral-gray-400 overflow-hidden'>
            <div className='divide-y overflow-auto max-h-[340px] scrollbar-thin'>
              {availableCharacters
                .sort((a: any, b: any) => {
                  const aIsTemplate = templateData?.data.characters?.some(
                    (char: any) => char._id === a._id
                  )
                    ? -1
                    : 1
                  const bIsTemplate = templateData?.data.characters?.some(
                    (char: any) => char._id === b._id
                  )
                    ? -1
                    : 1
                  return aIsTemplate - bIsTemplate
                })
                .map((character: any, index: number) => (
                  <Label
                    key={character._id}
                    className={cn(
                      'flex items-center p-3 cursor-pointer hover:bg-primary-100',
                      index % 2 === 0 ? 'bg-white' : 'bg-neutral-gray-100',
                      characterIds?.includes(character._id) && 'bg-primary-100',
                      !characterIds?.includes(character._id) &&
                        (characterIds?.length || 0) >=
                          (environmentData?.data?.maximum_characters ?? 0) &&
                        'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <Checkbox
                      className='mr-3'
                      checked={characterIds?.includes(character._id)}
                      disabled={
                        !characterIds?.includes(character._id) &&
                        (characterIds?.length || 0) >=
                          (environmentData?.data?.maximum_characters ?? 0)
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          if (
                            (characterIds?.length || 0) <
                            (environmentData?.data?.maximum_characters ?? 0)
                          ) {
                            setCharacterIds([
                              ...(characterIds || []),
                              character._id
                            ])
                          }
                        } else {
                          const newCharacterIds =
                            characterIds?.filter(
                              (id: string) => id !== character._id
                            ) || []
                          setCharacterIds(newCharacterIds)
                          if (
                            newCharacterIds.length <= selectedCharacterIndex
                          ) {
                            setSelectedCharacterIndex(
                              Math.max(0, newCharacterIds.length - 1)
                            )
                          }
                        }
                      }}
                    />
                    <span className='flex-1 text-sm font-medium'>
                      {character.name}
                    </span>
                    <Image
                      src={character.avatar.image_path ?? ''}
                      alt={character.name}
                      className='w-10 h-10 rounded-full object-cover'
                      width='40'
                      height='40'
                      quality='100'
                    />
                  </Label>
                ))}
            </div>
          </Card>

          <div className='col-span-1 sm:col-span-2'>
            <div className='flex justify-end sm:hidden'>
              <CharacterNavigation
                currentIndex={selectedCharacterIndex}
                totalCount={selectedCharacters.length}
                onPrevious={() =>
                  setSelectedCharacterIndex((prev) => Math.max(0, prev - 1))
                }
                onNext={() =>
                  setSelectedCharacterIndex((prev) =>
                    Math.min(selectedCharacters.length - 1, prev + 1)
                  )
                }
              />
            </div>

            <Card className='p-6 min-h-[340px] overflow-auto border border-neutral-gray-400 rounded-sm'>
              {selectedCharacters.length > 0 ? (
                <div className='space-y-6'>
                  <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='shrink-0 size-[60px] lg:size-[72px] overflow-hidden bg-muted rounded-full'>
                        <Image
                          src={currentSelectedCharacter.avatar.image_path ?? ''}
                          alt={currentSelectedCharacter.name}
                          className='object-cover h-full'
                          height='72'
                          width='72'
                          quality='100'
                        />
                      </div>
                      <div>
                        <h2 className='text-xl font-semibold'>
                          {currentSelectedCharacter.name}
                        </h2>
                        <p className='text-gray-600'>
                          {currentSelectedCharacter.age}
                          {Number(currentSelectedCharacter.age) <= 1
                            ? ' year '
                            : ' years '}
                          old
                        </p>
                      </div>
                    </div>
                    <CharacterEditModal
                      characterId={currentSelectedCharacter._id}
                    />
                  </div>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <UserRound className='w-4 h-4' />
                      <span className='text-sm text-gray-600'>
                        {currentSelectedCharacter.avatar.gender}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Languages className='w-4 h-4' />
                      <span className='text-sm text-gray-600'>
                        {currentSelectedCharacter.languages.join(', ')}
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      <PreviewVoice
                        path={getVoiceSampleLink(
                          currentSelectedCharacter?.voice_type
                        )}
                      />
                    </div>
                    <p className='text-sm text-gray-600 mt-4'>
                      {currentSelectedCharacter.backstory}
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center text-gray-500 h-[290px]'>
                  <div className='text-center'>
                    <SquareUser className='mx-auto text-muted-foreground' />
                    <p className='text-sm text-muted-foreground mt-[8px]'>
                      Select characters or create new
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Card>

      <div className='mt-[24px] flex items-center justify-between'>
        <PrevStepButton prevStep={2} />
      </div>
    </div>
  )
}

export default Character
