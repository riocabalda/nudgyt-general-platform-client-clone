'use client'

import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import characterService from '@/app/(shared)/services/trainer/characterService'

function useGetCharacter() {
  const { orgSlug } = useOrganization()
  const { characterId } = useParams()

  const {
    data: character,
    isLoading: isCharacterLoading,
    error: characterError
  } = useSWR(`${orgSlug}/trainer/characters/${characterId}`, () =>
    characterService
      .getCharacter(orgSlug, characterId as string)
      .then((res) => res.data)
  )

  const {
    data: voiceTypes,
    isLoading: isVoiceTypesLoading,
    error: voiceTypesError
  } = useSWR(`${orgSlug}/trainer/characters/voice-types`, () =>
    characterService.getCharacterVoiceTypes(orgSlug).then((res) => res.data)
  )

  return {
    character,
    voiceTypes,
    isCharacterLoading,
    characterError,
    isVoiceTypesLoading,
    voiceTypesError
  }
}

export default useGetCharacter
