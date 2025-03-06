import InputGroup from '@/app/(shared)/components/form/InputGroup'
import { Card } from '@/app/(shared)/components/ui/card'
import { Input } from '@/app/(shared)/components/ui/input'
import { Label } from '@/app/(shared)/components/ui/label'
import Image from 'next/image'
import { useTemplateStore } from '../hooks/useTemplateStore'
import { Textarea } from '@/app/(shared)/components/ui/textarea'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

import FetchError from '@/app/(shared)/components/FetchError'
import { Loader, SearchX } from 'lucide-react'
import Personality from './Personality'
import avatarService from '@/app/(shared)/services/trainer/avatarService'

const CharacterDetails = () => {
  const { orgSlug } = useOrganization()

  const {
    characterName,
    characterAge,
    backstory,
    hiddenBackstory,
    personality,
    avatarId,
    setCharacterName,
    setCharacterAge,
    setBackstory,
    setHiddenBackstory
  } = useTemplateStore()

  const {
    data: avatarData,
    isLoading,
    error
  } = useSWR(avatarId ? `${orgSlug}/trainer/avatars/${avatarId}` : null, () =>
    avatarService.getAvatarById(avatarId ?? '', orgSlug).then((res) => res.data)
  )

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
      <Card className='p-[24px] w-full flex flex-col gap-[24px] overflow-y-auto'>
        <div className='flex gap-6'>
          <div className='h-16 w-16 overflow-hidden bg-muted rounded-full relative shrink-0'>
            <Image
              src={avatarData?.data?.image_path ?? ''}
              height={64}
              width={64}
              alt={avatarData?.data?.name}
              className='absolute w-full h-full top-0 left-0 object-cover'
              quality={100}
            />
          </div>
          <div className='flex-1 space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                type='text'
                placeholder='Character Name'
                value={characterName || ''}
                onChange={(e) => setCharacterName(e.target.value)}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='age'>Age</Label>
              <Input
                id='age'
                type='number'
                min='0'
                onKeyDown={(e) => {
                  if (
                    e.key === 'e' ||
                    e.key === 'E' ||
                    e.key === '-' ||
                    e.key === '+'
                  ) {
                    e.preventDefault()
                  }
                }}
                placeholder='Character Age'
                value={characterAge || ''}
                onChange={(e) => {
                  const value = Math.max(0, Number(e.target.value))
                  setCharacterAge(value.toString())
                }}
              />
            </div>
          </div>
        </div>
      </Card>
      <Card className='p-[24px] w-full flex flex-col gap-[24px] overflow-y-auto'>
        <InputGroup>
          <Label htmlFor='backstory'>Character Backstory</Label>
          <Textarea
            id='backstory'
            placeholder='Describe your character`s background'
            value={backstory || ''}
            onChange={(input) => setBackstory(input.target.value)}
          />
          <p className='text-sm text-muted-foreground/50'>
            A visible foundation that defines personality, tone, and behavior in
            interactions. This ensures consistency in how your character
            communicates and responds.
          </p>
        </InputGroup>
        <InputGroup>
          <Label htmlFor='hiddenBackstory'>Hidden Story</Label>
          <Textarea
            id='hiddenBackstory'
            placeholder='Give your character more context'
            value={hiddenBackstory || ''}
            onChange={(input) => setHiddenBackstory(input.target.value)}
          />
          <p className='text-sm text-muted-foreground/50'>
            A subtle layer of context shaping your character`s deeper
            motivations and nuances. This influences responses without being
            directly revealed to users.
          </p>
        </InputGroup>
      </Card>
      <Card className='p-[24px]'>
        <Label>Personality</Label>
        <Personality personality={personality ?? undefined} />
      </Card>
    </div>
  )
}

export default CharacterDetails
