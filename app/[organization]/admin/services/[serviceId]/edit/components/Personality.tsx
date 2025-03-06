'use client'
import React, { useEffect, useState } from 'react'
import PersonalityPicker from '@/app/(shared)/components/PersonalityPicker'
import {
  Personality as PersonalityType,
  useServiceStore
} from '../../../create/hooks/useServiceStore'

function Personality({
  personality,
  disabled = false
}: {
  personality?: PersonalityType
  disabled?: boolean
}) {
  const { setPersonality } = useServiceStore()

  const [newPersonality, setNewPersonality] = useState<PersonalityType>(
    personality || {
      openess: '2',
      meticulousness: '2',
      extraversion: '2',
      agreeableness: '2',
      sensitivity: '2'
    }
  )

  const handlePersonalityChange =
    (trait: keyof PersonalityType) => (value: string) => {
      setNewPersonality((prev) => ({ ...prev, [trait]: value }))
    }

  useEffect(() => {
    setPersonality(newPersonality)
  }, [newPersonality])

  return (
    <div className='mt-4 lg:mt-6 flex flex-col gap-8'>
      <PersonalityPicker
        personality='Openess'
        startLabel='Dislikes Changes'
        endLabel='Likes exploring'
        value={newPersonality.openess}
        onChange={handlePersonalityChange('openess')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Meticulousness'
        startLabel='Lets things happen'
        endLabel='Pays more attention to details'
        value={newPersonality.meticulousness}
        onChange={handlePersonalityChange('meticulousness')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Extraversion'
        startLabel='Introvert'
        endLabel='Extrovert'
        value={newPersonality.extraversion}
        onChange={handlePersonalityChange('extraversion')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Agreeableness'
        startLabel='Competitive'
        endLabel='Agreeable'
        value={newPersonality.agreeableness}
        onChange={handlePersonalityChange('agreeableness')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Sensitivity'
        startLabel='Rarely Emotional'
        endLabel='Highly Emotional'
        value={newPersonality.sensitivity}
        onChange={handlePersonalityChange('sensitivity')}
        disabled={disabled}
      />
    </div>
  )
}

export default Personality
