'use client'

import FetchError from '@/app/(shared)/components/FetchError'
import PersonalityPicker from '@/app/(shared)/components/PersonalityPicker'
import PreviewVoice from '@/app/(shared)/components/PreviewVoice'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/(shared)/components/ui/avatar'
import { Card } from '@/app/(shared)/components/ui/card'
import { generateAvatarInitials } from '@/app/(shared)/utils'
import { LanguagesIcon, Loader, SearchX } from 'lucide-react'
import useGetCharacter from '../hooks/useGetCharacter'
import CharacterOptionMenu from './CharacterOptionMenu'
import ServiceCard from '@/app/(shared)/components/ServiceCard'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function CharacterDetails() {
  const {
    character,
    isCharacterLoading,
    characterError,
    voiceTypes,
    isVoiceTypesLoading,
    voiceTypesError
  } = useGetCharacter()
  const { orgSlug } = useOrganization()

  const voicePathLink =
    voiceTypes?.data?.find(
      (voice: any) => voice.voice_value === character?.data?.details?.voice_type
    )?.sample_link ?? ''

  if (isCharacterLoading || isVoiceTypesLoading) {
    return (
      <div className='grid place-items-center p-4 col-span-full'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )
  }

  if (characterError || voiceTypesError) {
    return (
      <div className='grid place-items-center p-4 col-span-full'>
        <FetchError
          errorMessage={characterError?.message || voiceTypesError?.message}
        />
      </div>
    )
  }

  return (
    <main className='space-y-6 max-w-[712px] mx-auto'>
      <section className='flex justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <Avatar className='size-[80px]'>
            <AvatarImage
              src={character?.data?.details.avatar.image_path}
              className='size-[80px] object-cover bg-muted'
            />
            <AvatarFallback>
              {generateAvatarInitials(character?.data?.details?.name || '')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className='text-xl font-semibold leading-[32px]'>
              {character?.data?.details?.name}
            </p>
            <span className='text-sm mt-[8px]'>
              {character?.data?.details?.age}
              {character?.data?.details?.age &&
              Number(character?.data?.details?.age) <= 1
                ? ' year '
                : ' years '}
              old
            </span>
          </div>
        </div>
        <div className='block lg:hidden'>
          <CharacterOptionMenu />
        </div>
      </section>
      <section>
        <Card className='p-6 grid grid-cols-2'>
          <div className='flex items-center text-muted-foreground gap-3'>
            <LanguagesIcon className='size-[14px]' strokeWidth={1.5} />
            <span className='text-sm font-normal'>
              {character?.data?.details?.languages.join(', ')}
            </span>
          </div>
          <PreviewVoice path={voicePathLink} />
        </Card>
      </section>
      <section>
        <Card className='p-6'>
          <h5 className='text-lg font-bold mb-4'>Back Story</h5>
          <p className='text-base text-neutral-600'>
            {character?.data?.details?.backstory}
          </p>
        </Card>
      </section>
      <section>
        <Card className='p-6'>
          <h5 className='text-lg font-bold mb-4'>Hidden Story</h5>
          <p className='text-base text-neutral-600'>
            {character?.data?.details?.hidden_backstory}
          </p>
        </Card>
      </section>
      <section>
        <Card className='p-6'>
          <h5 className='text-lg font-bold mb-4'>Personality</h5>
          <div className='mt-4 lg:mt-6 flex flex-col gap-8'>
            <PersonalityPicker
              personality='Openess'
              startLabel='Dislikes Changes'
              endLabel='Likes exploring'
              value={character?.data?.details?.personality.openess}
              disabled={true}
            />
            <PersonalityPicker
              personality='Meticulousness'
              startLabel='Lets things happen'
              endLabel='More attention to details'
              value={character?.data?.details?.personality.meticulousness}
              disabled={true}
            />
            <PersonalityPicker
              personality='Extraversion'
              startLabel='Introvert'
              endLabel='Extrovert'
              value={character?.data?.details?.personality.extraversion}
              disabled={true}
            />
            <PersonalityPicker
              personality='Agreeableness'
              startLabel='Competitive'
              endLabel='Agreeable'
              value={character?.data?.details?.personality.agreeableness}
              disabled={true}
            />
            <PersonalityPicker
              personality='Sensitivity'
              startLabel='Rarely Emotional'
              endLabel='Highly Emotional'
              value={character?.data?.details?.personality.sensitivity}
              disabled={true}
            />
          </div>
        </Card>
      </section>
      <section>
        <Card className='p-6'>
          <h5 className='text-lg font-bold mb-4'>Services</h5>
          <div className='grid grid-cols-2 gap-4'>
            {character?.data?.services?.length ? (
              character?.data?.services.map((serviceLevel: any) => (
                <ServiceCard
                  key={serviceLevel.id}
                  serviceData={serviceLevel}
                  link={`/${orgSlug}/admin/services/${serviceLevel.id}`}
                  type={'admin'}
                />
              ))
            ) : (
              <div className='flex flex-col items-center col-span-full p-4'>
                <SearchX className='text-neutral-gray-300 text-muted-foreground' />
                <p className='text-[14px] font-[400] text-muted-foreground mt-2'>
                  No related services
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>
    </main>
  )
}

export default CharacterDetails
