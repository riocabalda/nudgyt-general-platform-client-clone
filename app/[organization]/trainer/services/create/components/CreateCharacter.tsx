'use client'

import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Loader, SearchX, Sparkles } from 'lucide-react'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import FetchError from '@/app/(shared)/components/FetchError'
import avatarService from '@/app/(shared)/services/trainer/avatarService'
import { Button } from '@/app/(shared)/components/ui/button'
import { useServiceStore } from '../hooks/useServiceStore'
import characterService from '@/app/(shared)/services/trainer/characterService'
import CharacterDetails from './CharacterDetails'
import Avatars from './Avatars'
import { useGetCharacters } from '../hooks/useGetCharacters'
import { useSearchParams } from 'next/navigation'
import useAlertStore from '@/app/(shared)/components/alert/useAlertStore'

const CreateCharacter = () => {
  const { orgSlug } = useOrganization()
  const searchParams = useSearchParams()
  const { showAlert } = useAlertStore()

  const {
    avatarId,
    characterName,
    characterAge,
    backstory,
    hiddenBackstory,
    languages,
    voiceType,
    personality,
    isSubmitting,
    setIsCreatingCharacter,
    setIsSubmitting,
    resetCharacterData
  } = useServiceStore()

  const [showCharacterDetails, setShowCharacterDetails] = useState(false)

  const {
    data: avatarData,
    isLoading,
    error
  } = useSWR(`${orgSlug}/trainer/avatars`, () =>
    avatarService.getAvatars(orgSlug).then((res) => res.data)
  )

  const { mutate } = useGetCharacters(orgSlug, searchParams.toString())

  const toggleCharacterDetails = () => {
    setShowCharacterDetails(!showCharacterDetails)
  }

  const handleBack = () => {
    if (!showCharacterDetails) {
      setIsCreatingCharacter(false)
    } else {
      setShowCharacterDetails(false)
    }
  }

  const handleCreateCharacter = async () => {
    setIsSubmitting(true)
    const payload = {
      avatar: avatarId,
      name: characterName,
      age: characterAge,
      hidden_backstory: hiddenBackstory,
      voice_type: voiceType,
      backstory,
      languages: languages && languages.map((lang) => lang.value),
      personality
    }

    try {
      await characterService.createCharacter(orgSlug, payload)

      showAlert({
        message: 'Character created',
        variant: 'success'
      })

      mutate()
      resetCharacterData()
      setShowCharacterDetails(false)
      setIsCreatingCharacter(false)
      setIsSubmitting(false)
    } catch (error) {
      showAlert({
        message: 'Failed to create character, please try again later.',
        variant: 'error'
      })
      setIsSubmitting(false)
    }
  }

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

  if (!avatarData.data || avatarData.data.length === 0)
    return (
      <div className='h-[500px] flex flex-col items-center justify-center'>
        <SearchX className='text-neutral-gray-300 size-[24px]' />
        <p className='text-sm text-muted-foreground mt-[10px]'>
          No avatar available
        </p>
      </div>
    )

  return (
    <div className='px-4 lg:px-0 pt-0 lg:py-10 max-w-[712px] mx-auto'>
      <h2 className='text-base font-normal lg:text-2xl lg:font-semibold'>
        Create new character
      </h2>
      {showCharacterDetails ? <CharacterDetails /> : <Avatars />}
      <div className='mt-[24px] flex items-center justify-between gap-2'>
        <Button
          onClick={handleBack}
          variant='outline'
          className='flex justify-center lg:justify-between bg-white gap-[10px] w-full lg:w-[161px]'
        >
          <ArrowLeft className='hidden lg:block size-[20px]' />
          <span className='px-4'>Back</span>
        </Button>
        <div className='flex gap-2'>
          {!showCharacterDetails ? (
            <>
              <Button
                onClick={toggleCharacterDetails}
                className='flex justify-center lg:justify-between gap-[10px] w-full lg:w-[161px]'
                disabled={!avatarId || languages?.length === 0 || !voiceType}
              >
                <span className='px-4'>Next</span>
                <ArrowRight className='hidden lg:block size-[20px]' />
              </Button>
              <Button
                variant='default'
                className='flex items-center gap-2'
                disabled
              >
                <Sparkles className='size-[16px]' />
                <p>Create with AI</p>
              </Button>
            </>
          ) : (
            <Button
              onClick={handleCreateCharacter}
              variant='default'
              className='flex justify-center lg:justify-between gap-[10px] w-full lg:w-[161px]'
              disabled={
                !characterName ||
                !characterAge ||
                !backstory ||
                !hiddenBackstory ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <span>Creating</span>
                  <Loader className='hidden lg:block size-[20px] animate-spin' />
                </>
              ) : (
                <>
                  <span className='px-2'>Create</span>
                  <ArrowRight className='hidden lg:block size-[20px]' />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateCharacter
