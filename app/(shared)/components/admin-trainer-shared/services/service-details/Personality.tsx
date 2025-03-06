'use client'
import React, { useState, useEffect } from 'react'
import PersonalityPicker from '@/app/(shared)/components/PersonalityPicker'
import { useServiceStore } from '@/app/[organization]/admin/services/create/hooks/useServiceStore'

function Personality({
  personality,
  disabled = false
}: {
  personality?: any
  disabled?: boolean
}) {
  const { setPersonality } = useServiceStore()

  const [newPersonality, setNewPersonality] = useState<any>(
    personality || {
      difficulty: '0',
      openess: '0',
      meticulousness: '0',
      extraversion: '0',
      agreeableness: '0',
      sensitivity: '0'
    }
  )

  const handlePersonalityChange = (trait: keyof any) => (value: string) => {
    setNewPersonality((prev: any) => ({ ...prev, [trait]: value }))
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
