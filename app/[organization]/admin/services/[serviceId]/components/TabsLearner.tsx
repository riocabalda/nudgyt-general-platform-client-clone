import { cn } from '@/app/(shared)/utils'
import { useParams } from 'next/navigation'
import { Loader, SearchX } from 'lucide-react'
import LearnerScoresCard from './LearnerScoresCard'
import FeedbackChartCard from './FeedbackChartCard'
import FetchError from '@/app/(shared)/components/FetchError'
import useGetLearnersScores from '../hooks/useGetLearnersScores'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetService from '../hooks/useGetService'

function TabsLearner({
  isMultiLevelService
}: {
  isMultiLevelService: boolean
}) {
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()

  const { serviceData } = useGetService(orgSlug, String(serviceId))

  const { learnersScores, error, isLoading } = useGetLearnersScores(
    orgSlug,
    String(serviceId)
  )

  const hasFormUploaded = !!(serviceData?.basic_level.form_questions.length > 0)

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

  if (!learnersScores || learnersScores.length === 0)
    return (
      <div className='h-[500px] flex flex-col items-center justify-center'>
        <SearchX className='text-neutral-gray-300 size-[24px]' />
        <p className='text-sm text-muted-foreground mt-[10px]'>No learners</p>
      </div>
    )

  return (
    <div
      className={cn(
        ' flex flex-col gap-4 mx-auto lg:mx-0',
        !isMultiLevelService && 'lg:mx-auto max-w-[712px]'
      )}
    >
      <LearnerScoresCard
        learnersScores={learnersScores}
        hasFormUploaded={hasFormUploaded}
      />
      <FeedbackChartCard />
    </div>
  )
}

export default TabsLearner
