'use client'

import { useEffect } from 'react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import { Character } from '@/app/(shared)/services/learner/characterService'
import { Avatar, AvatarFallback } from '@/app/(shared)/components/ui/avatar'
import { cn, generateAvatarInitials, getFirstName } from '@/app/(shared)/utils'
import useCharacterStore from '../../hooks/useCharacterStore'
import StyledTooltip from '@/app/(shared)/components/StyledTooltip'

function CharacterButton(props: { character: Character }) {
  const {
    isSelectionEnabled,
    selectedPersonalityId,
    setSelectedPersonalityId
  } = useCharacterStore()

  const { character } = props

  const button = (
    <button
      disabled={!isSelectionEnabled}
      onClick={() => setSelectedPersonalityId(character.personality_id)}
      className='disabled:opacity-50 bg-white rounded-full'
    >
      <Avatar
        className={cn(
          'size-7 lg:size-8 border-2 border-white outline outline-2 outline-white',
          selectedPersonalityId === character.personality_id &&
            'outline-success'
        )}
      >
        <AvatarImage
          src={character.avatar.image_path ?? ''}
          alt={character.name}
          className='w-full h-full object-cover'
        />
        <AvatarFallback
          className={cn(
            'select-none',
            'text-white text-sm font-medium lg:font-semibold',
            'bg-brandcolora'
          )}
        >
          {generateAvatarInitials(getFirstName(character.name))}
        </AvatarFallback>
      </Avatar>
    </button>
  )

  return (
    <StyledTooltip
      contentSide='top'
      withArrow={false}
      trigger={button}
      content={character.name}
    />
  )
}

function CharacterSelector({
  serviceData,
  className
}: {
  serviceData: Service
  className?: string
}) {
  const characters = serviceData?.basic_level?.characters

  const { selectedPersonalityId, setSelectedPersonalityId } =
    useCharacterStore()

  useEffect(() => {
    if (selectedPersonalityId !== null) return
    if (characters === undefined) return
    if (characters.length < 1) return

    const firstChar = characters[0]
    setSelectedPersonalityId(firstChar.personality_id)
  }, [characters, selectedPersonalityId])

  return (
    <ol className={cn('flex gap-3 lg:gap-4 py-2', className)}>
      {characters?.map((character) => (
        <li key={character._id}>
          <CharacterButton character={character} />
        </li>
      ))}
    </ol>
  )
}

export default CharacterSelector
