import React, { useMemo } from 'react'
import FormQuestionsTable, {
  TableData
} from '@/app/(shared)/components/admin/FormQuestionsTable'
import { useParams } from 'next/navigation'
import { generateColumns } from '@/app/(shared)/utils'
import { CSVColumns } from '@/app/(shared)/types'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetService from '../hooks/useGetService'

function TabsRubrics() {
  const { orgSlug } = useOrganization()
  const { serviceId } = useParams()

  const { serviceData } = useGetService(orgSlug, String(serviceId))

  const rubricsData = useMemo(() => {
    return serviceData?.basic_level?.rubrics?.rubric_items || []
  }, [serviceData])

  const formattedQuestions = {
    ...serviceData?.basic_level?.rubrics?.rubric_items[0]
  }

  const columns = generateColumns(formattedQuestions as unknown as CSVColumns)
  return (
    <>
      <FormQuestionsTable
        title='Preparation'
        data={rubricsData as unknown as TableData[]}
        columns={columns}
        isRubricTable={true}
      />
    </>
  )
}

export default TabsRubrics
