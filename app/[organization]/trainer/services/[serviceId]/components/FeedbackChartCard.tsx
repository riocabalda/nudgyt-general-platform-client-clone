'use client'

import { ComponentProps } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/app/(shared)/components/ui/card'
import FeedbackChart from '@/app/(shared)/components/FeedbackChart'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetSurveyAverage from '../hooks/useGetSurveyAverage'

function FeedbackChartCard() {
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()

  const { averageRating } = useGetSurveyAverage(orgSlug, String(serviceId))

  if (averageRating === null) {
    return null
  }

  /** Database property names might change? */
  const chartData: ComponentProps<typeof FeedbackChart>['data'] = [
    {
      label: 'Platform usefulness',
      value: averageRating?.useful ?? 1
    },
    {
      label: 'Ease of use',
      value: averageRating?.easy ?? 1
    },
    {
      label: 'Learner confidence',
      value: averageRating?.confident ?? 1
    }
  ]

  return (
    <Card className='grid gap-4 lg:gap-6 p-4 lg:p-6 pt-0 lg:pt-2'>
      <FeedbackChart data={chartData} />
    </Card>
  )
}

export default FeedbackChartCard
