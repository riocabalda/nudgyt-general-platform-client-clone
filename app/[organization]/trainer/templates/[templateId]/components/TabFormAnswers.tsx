'use client'

import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'
import { flattenDeep } from 'lodash'

import { generateColumns } from '@/app/(shared)/utils'
import { CSVColumns } from '@/app/(shared)/types'
import useGetTemplate from '../hooks/useGetTemplate'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import FormQuestionsTable, {
  TableData
} from '@/app/(shared)/components/admin/FormQuestionsTable'
import { SearchX } from 'lucide-react'

export function TabFormAnswers() {
  const { orgSlug } = useOrganization()
  const { templateId } = useParams()
  const { data: templateData } = useGetTemplate(
    String(orgSlug),
    String(templateId)
  )

  const formQuestions = useMemo(() => {
    return flattenDeep(
      templateData?.data.form_questions.map((question: any) => {
        const { options, ...rest } = question
        return options.map((option: any) => ({ ...rest, ...option }))
      })
    )
  }, [templateData])

  const formattedQuestions = {
    ...templateData?.data.form_questions[0],
    ...templateData?.data.form_questions[0]?.options[0]
  }

  const columns = generateColumns(formattedQuestions as unknown as CSVColumns)

  if (!templateData?.data.form_questions.length)
    return (
      <div className='h-[500px] flex flex-col items-center justify-center'>
        <SearchX className='text-neutral-gray-300 size-[24px]' />
        <p className='text-sm text-muted-foreground mt-[10px]'>
          No form answers
        </p>
      </div>
    )

  return (
    templateData?.data.form_questions.length > 0 && (
      <FormQuestionsTable
        title=''
        data={formQuestions as unknown as TableData[]}
        columns={columns}
      />
    )
  )
}
