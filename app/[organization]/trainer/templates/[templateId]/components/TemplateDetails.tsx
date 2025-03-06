'use client'

import FetchError from '@/app/(shared)/components/FetchError'
import { Card } from '@/app/(shared)/components/ui/card'
import { BookCopy, Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useTemplateStore } from '../../create/hooks/useTemplateStore'
import useGetTemplate from '../hooks/useGetTemplate'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import Tabs from './Tabs'
import CharacterProfile from '@/app/(shared)/components/admin-trainer-shared/services/CharacterProfile'
import { Template } from '@/app/(shared)/services/trainer/templateService'
import Environment from '@/app/(shared)/components/admin-trainer-shared/services/Environment'
import useSWR from 'swr'
import characterService from '@/app/(shared)/services/trainer/characterService'

function TemplateDetails() {
  const { templateId } = useParams()
  const { orgSlug } = useOrganization()

  const { isShared, reset } = useTemplateStore()

  const {
    data: templateData,
    isLoading,
    error
  } = useGetTemplate(String(orgSlug), String(templateId))

  const { data } = useSWR(`${orgSlug}/trainer/characters/voice-types`, () =>
    characterService.getCharacterVoiceTypes(orgSlug).then((res) => res.data)
  )

  const voiceTypes = Array.isArray(data?.data) ? data?.data : []

  useEffect(() => {
    reset()
  }, [])

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

  return (
    <>
      <div className='px-4 lg:px-[40px] py-[40px] max-w-[712px] mx-auto space-y-[24px]'>
        <div className='flex items-center gap-[12px] text-muted-foreground'>
          <p className='text-xs lg:text-sm'>
            {!isShared && templateData?.data.is_master_template && (
              <div className='flex items-center gap-[12px] text-neutral-gray-800'>
                <BookCopy className='size-4' />
                <span className='text-xs lg:text-sm'>Master Template</span>
              </div>
            )}
          </p>
        </div>

        <div className='flex items-center justify-between pr-[24px]'>
          <h2 className='text-[24px] font-semibold'>
            {templateData?.data.title ? (
              templateData?.data.title
            ) : (
              <span className='text-destructive'>No service title</span>
            )}
          </h2>
        </div>

        <Card className='flex flex-col gap-6 rounded-[8px] p-4 lg:p-[24px]'>
          <div>
            <div className='flex items-start justify-between'>
              <h2 className='text-lg font-semibold'>Description</h2>
            </div>
            <p className='mt-[24px] text-sm text-muted-foreground'>
              {templateData?.data.description ? (
                templateData.data.description
              ) : (
                <span className='text-destructive'>No service description</span>
              )}
            </p>
          </div>
          <hr className='border-t border-neutral-gray-400' />
          <CharacterProfile
            serviceData={templateData?.data as Template}
            voiceTypes={voiceTypes}
            isTemplate={true}
          />
          <hr className='border-t border-neutral-gray-400' />
          <Environment
            serviceData={templateData?.data as Template}
            isTemplate={true}
          />
        </Card>
      </div>
      <Tabs
        isFormAnswersVisible={templateData?.data.form_questions.length > 0}
        isRubricsVisible={templateData?.data.rubrics?.rubric_items.length > 0}
      />
    </>
  )
}

export default TemplateDetails
