'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { generateColumns } from '@/app/(shared)/utils'
import { CSVColumns } from '@/app/(shared)/types'
import useGetTemplate from '../hooks/useGetTemplate'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import FormQuestionsTable from '@/app/(shared)/components/admin/FormQuestionsTable'
import { SearchX } from 'lucide-react'

export function TabRubrics() {
  const { orgSlug } = useOrganization()
  const { templateId } = useParams()
  const { data: templateData } = useGetTemplate(
    String(orgSlug),
    String(templateId)
  )

  const columns = generateColumns(
    templateData?.data.rubrics?.rubric_items[0] as unknown as CSVColumns
  )

  if (!templateData?.data.rubrics?.rubric_items.length)
    return (
      <div className='h-[500px] flex flex-col items-center justify-center'>
        <SearchX className='text-neutral-gray-300 size-[24px]' />
        <p className='text-sm text-muted-foreground mt-[10px]'>No rubrics</p>
      </div>
    )

  return (
    templateData?.data.rubrics?.rubric_items.length > 0 && (
      <FormQuestionsTable
        title='Preparation'
        data={templateData?.data.rubrics?.rubric_items}
        columns={columns}
        isRubricTable={true}
      />
    )
  )
}
