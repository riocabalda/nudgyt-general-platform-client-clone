'use client'
import React, { useEffect, useState } from 'react'
import PersonalityPicker from '@/app/(shared)/components/PersonalityPicker'
import {
  Personality as PersonalityType,
  useTemplateStore
} from '../../../create/hooks/useTemplateStore'

function Personality({
  personality,
  disabled = false
}: {
  personality?: PersonalityType
  disabled?: boolean
}) {
  const { setPersonality } = useTemplateStore()

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
        startLabel='Likes exploring'
        endLabel='Dislikes Changes'
        value={newPersonality.openess}
        onChange={handlePersonalityChange('openess')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Meticulousness'
        startLabel='More attention to details'
        endLabel='Lets things happen'
        value={newPersonality.meticulousness}
        onChange={handlePersonalityChange('meticulousness')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Extraversion'
        startLabel='Extrovert'
        endLabel='Introvert'
        value={newPersonality.extraversion}
        onChange={handlePersonalityChange('extraversion')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Agreeableness'
        startLabel='Agreeable'
        endLabel='Competitive'
        value={newPersonality.agreeableness}
        onChange={handlePersonalityChange('agreeableness')}
        disabled={disabled}
      />
      <PersonalityPicker
        personality='Sensitivity'
        startLabel='Highly Emotional'
        endLabel='Rarely Emotional'
        value={newPersonality.sensitivity}
        onChange={handlePersonalityChange('sensitivity')}
        disabled={disabled}
      />
    </div>
  )
}

export default Personality
