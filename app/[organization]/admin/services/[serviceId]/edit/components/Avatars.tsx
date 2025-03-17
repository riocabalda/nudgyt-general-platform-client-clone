'use client'

import React, { useMemo, useState } from 'react'
import { Loader, SearchX } from 'lucide-react'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import FetchError from '@/app/(shared)/components/FetchError'
import avatarService from '@/app/(shared)/services/admin/avatarService'
import { Card, CardContent } from '@/app/(shared)/components/ui/card'
import { Label } from '@/app/(shared)/components/ui/label'
import Image from 'next/image'
import MultipleSelect from '@/app/(shared)/components/ui/multiple-select'
import InputGroup from '@/app/(shared)/components/form/InputGroup'
import {
  LanguageType,
  OptionType,
  useServiceStore
} from '../../../create/hooks/useServiceStore'
import { MultiValue, PropsValue } from 'react-select'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import characterService, {
  AvailableLanguages,
  VoiceType
} from '@/app/(shared)/services/admin/characterService'
import PreviewVoice from '@/app/(shared)/components/PreviewVoice'
import { useGetEnvironmentById } from '../../../create/hooks/useGetEnvironmentById'
import { DEFAULT_VOICE_TYPES } from '@/app/(shared)/constants/defaultVoiceTypes'

const Avatars = () => {
  const { orgSlug } = useOrganization()
  const [previewVoice, setPreviewVoice] = useState<string | null>(null)

  const {
    avatarId,
    setAvatarId,
    languages,
    setLanguages,
    voiceType,
    setVoiceType,
    environmentId
  } = useServiceStore()

  const { data: environmentData } = useGetEnvironmentById(
    orgSlug,
    environmentId
  )

  const {
    data: avatarData,
    isLoading,
    error
  } = useSWR(`${orgSlug}/admin/avatars`, () =>
    avatarService.getAvatars(orgSlug).then((res) => res.data)
  )

  const availableAvatars = useMemo(() => {
    return avatarData?.data?.filter((avatar: any) =>
      environmentData?.data?.available_characters?.includes(avatar.mesh_id)
    )
  }, [avatarData, environmentData])

  const { data: voiceTypes } = useSWR(
    `${orgSlug}/admin/characters/voice-types`,
    () =>
      characterService.getCharacterVoiceTypes(orgSlug).then((res) => res.data)
  )

  const { data: availableLanguages } = useSWR(
    `${orgSlug}/admin/characters/available-languages`,
    () =>
      characterService
        .getCharacterAvailableLanguages(orgSlug)
        .then((res) => res.data)
  )

  const filteredAvailableLanguages = useMemo(() => {
    const availableLanguagesOptions = availableLanguages?.data.map(
      (language: AvailableLanguages) => ({
        value: language.lang_code,
        label: language.lang_name
      })
    )

    return availableLanguagesOptions
  }, [availableLanguages])

  const filteredVoiceTypes = useMemo(() => {
    const currentAvatarGender = avatarData?.data
      ?.find((avatar: any) => avatar._id === avatarId)
      ?.gender.toUpperCase()

    const voiceTypesOptions = voiceTypes?.data?.filter(
      (voice: any) =>
        voice.gender.toUpperCase() === currentAvatarGender?.toUpperCase()
    )

    let filteredVoiceTypes = voiceTypesOptions?.filter((voice: VoiceType) =>
      languages?.some((lang) => voice.lang_codes.includes(lang.value))
    )

    if (filteredVoiceTypes?.length === 0 && languages && languages.length > 0) {
      filteredVoiceTypes = DEFAULT_VOICE_TYPES.filter(
        (voice) =>
          voice.gender.toUpperCase() === currentAvatarGender?.toUpperCase()
      )
      setVoiceType(filteredVoiceTypes[0].voice_value)
      setPreviewVoice(filteredVoiceTypes[0].sample_link)
    }

    return filteredVoiceTypes
  }, [voiceTypes, avatarData, avatarId, languages])

  const handleSetAvatar = (id: string) => {
    setAvatarId(id)
  }

  const handleLanguageChange = (newValue: MultiValue<OptionType>) => {
    setLanguages(newValue as unknown as LanguageType[])
    setVoiceType('')
  }

  const handleVoiceChange = (newValue: string) => {
    setVoiceType(newValue)
    const path = voiceTypes?.data?.find(
      (voice: any) => voice.voice_value === newValue
    )?.sample_link
    setPreviewVoice(path)
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
    <div className='space-y-[24px] mt-[40px]'>
      <Card className='w-full mx-auto rounded-lg'>
        <CardContent className='p-[24px]'>
          <h2 className='text-[16px] font-medium text-neutral-gray-800 mb-6'>
            Select an avatar for your character.
          </h2>
          <div className='grid grid-cols-4 gap-4 md:grid-cols-8'>
            {availableAvatars?.map((avatar: any) => (
              <button
                key={avatar._id}
                onClick={() => {
                  handleSetAvatar(avatar._id)
                }}
                className={`relative rounded-full overflow-hidden w-[69px] h-[69px] ${
                  avatarId === avatar._id &&
                  'ring-4 ring-offset-0 ring-brandcolorf'
                }`}
              >
                <Image
                  src={avatar.image_path ?? ''}
                  alt={`Avatar option ${avatar.id + 1}`}
                  className='w-[69px] h-[69px] rounded-full object-cover border border-neutral-gray-200'
                  width='40'
                  height='40'
                  quality='100'
                />
                {avatarId === avatar._id && (
                  <div className='absolute inset-0 bg-[#1A4595] bg-opacity-20' />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className='p-[24px] space-y-[24px] rounded-lg'>
        <InputGroup>
          <Label htmlFor='languages'>Languages</Label>
          <MultipleSelect
            id='languages'
            placeholder='Select the language(s) your character speaks'
            value={languages as PropsValue<OptionType>}
            onChange={handleLanguageChange}
            options={filteredAvailableLanguages ?? []}
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor='voiceType'>Voice</Label>
          <Select
            value={voiceType ?? ''}
            onValueChange={handleVoiceChange}
            disabled={!avatarId || filteredVoiceTypes?.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select the voice for your character' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filteredVoiceTypes?.map((voiceType: any) => (
                  <SelectItem
                    key={voiceType.voice_value}
                    value={voiceType.voice_value}
                  >
                    {voiceType.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {previewVoice && (
            <div className='grid place-items-end mt-1'>
              <PreviewVoice path={previewVoice} />
            </div>
          )}
        </InputGroup>
      </Card>
    </div>
  )
}

export default Avatars
