'use client'

import React, { useMemo } from 'react'
import FormQuestionsTable, {
  TableData
} from '@/app/(shared)/components/admin/FormQuestionsTable'
import { CSVColumns } from '@/app/(shared)/types'
import { generateColumns } from '@/app/(shared)/utils'
import { useParams } from 'next/navigation'
import { flattenDeep } from 'lodash'
import { SearchX } from 'lucide-react'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetService from '../hooks/useGetService'

export function TabsFormQuestions() {
  const { orgSlug } = useOrganization()
  const { serviceId } = useParams()
  const { serviceData } = useGetService(orgSlug, String(serviceId))

  const formQuestions = useMemo(() => {
    return flattenDeep(
      serviceData?.basic_level?.form_questions?.map((question: any) => {
        const { options, ...rest } = question
        return options.map((option: any) => ({ ...rest, ...option }))
      })
    )
  }, [serviceData])

  const formattedQuestions = {
    ...serviceData?.basic_level?.form_questions[0],
    ...serviceData?.basic_level?.form_questions[0]?.options[0]
  }

  const columns = generateColumns(formattedQuestions as unknown as CSVColumns)

  if (!serviceData?.basic_level.form_questions.length)
    return (
      <div className='h-[500px] flex flex-col items-center justify-center'>
        <SearchX className='text-neutral-gray-300 size-[24px]' />
        <p className='text-sm text-muted-foreground mt-[10px]'>
          No form answers
        </p>
      </div>
    )
  return (
    <>
      <FormQuestionsTable
        title=''
        data={formQuestions as unknown as TableData[]}
        columns={columns}
      />
    </>
  )
}
