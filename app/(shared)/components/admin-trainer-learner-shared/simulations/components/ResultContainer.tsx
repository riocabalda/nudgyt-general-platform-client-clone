'use client'

import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { roles } from '@/app/(shared)/services/userService'
import { Loader, UserSquareIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { StyledTabItem, StyledTabs } from '../../../StyledTabs'
import useGetSimulationResults from '../hooks/useGetSimulationResults'
import NextAttemptLink from './NextAttemptLink'
import PreviousAttemptLink from './PreviousAttemptLink'
import ServiceHeadline from './ServiceHeadline'
import SimulationLinksDropdown from './SimulationLinksDropdown'
import ScoreSummaryTab from './tabs/ScoreSummaryTab'
import ServiceDetailsTab from './tabs/ServiceDetailsTab'
import SoftSkillsTab from './tabs/SoftSkillsTab'
import TranscriptTab from './tabs/TranscriptTab'
import UserProfileHeadline from './UserProfileHeadline'

function SimulationResultsTabs() {
  const {
    details,
    isSimulationDetailsLoading,
    isTranscriptsLoading,
    isSoftSkillsLoading,
    isSimulationDetailsError,
    isTranscriptsError,
    isSoftSkillsError
  } = useGetSimulationResults()

  return (
    <div className='overflow-x-hidden w-full'>
      <StyledTabs>
        <StyledTabItem name='Details' value='details'>
          <div className='p-4 lg:p-10 max-w-[712px] mx-auto'>
            {isSimulationDetailsError && (
              <div className='grid place-items-center p-4 col-span-full'>
                <FetchError errorMessage={isSimulationDetailsError.message} />
              </div>
            )}
            {!isSimulationDetailsError && !isSimulationDetailsLoading && (
              <ServiceDetailsTab />
            )}
          </div>
        </StyledTabItem>

        <StyledTabItem name='Score Summary' value='score-summary'>
          <div className='p-4 lg:p-10'>
            {!details?.hasFormQuestions && !isSimulationDetailsError && (
              <div className='grid place-items-center col-span-full'>
                <p className='text-neutral-gray-600 text-center'>
                  Form questions are not available for this service
                </p>
              </div>
            )}
            {isSimulationDetailsError && (
              <div className='grid place-items-center p-4 col-span-full'>
                <FetchError errorMessage={isSimulationDetailsError.message} />
              </div>
            )}
            {!isSimulationDetailsError &&
              !isSimulationDetailsLoading &&
              details?.hasFormQuestions && <ScoreSummaryTab />}
          </div>
        </StyledTabItem>

        <StyledTabItem name='Transcript' value='transcript'>
          <div className='p-4 lg:p-10 max-w-[712px] mx-auto'>
            {isTranscriptsError && (
              <div className='grid place-items-center p-4 col-span-full'>
                <FetchError errorMessage={isTranscriptsError.message} />
              </div>
            )}
            {!isTranscriptsError && !isTranscriptsLoading && <TranscriptTab />}
          </div>
        </StyledTabItem>

        <StyledTabItem name='Soft Skills' value='soft-skills'>
          <div className='p-4 lg:p-10 max-w-[712px] mx-auto'>
            {isSoftSkillsError && (
              <div className='grid place-items-center p-4 col-span-full'>
                <FetchError errorMessage={isSoftSkillsError.message} />
              </div>
            )}
            {!isSoftSkillsError && !isSoftSkillsLoading && <SoftSkillsTab />}
          </div>
        </StyledTabItem>
      </StyledTabs>
    </div>
  )
}

function SimulationResultsHeader() {
  const searchParams = useSearchParams()
  const { membership } = useOrganization()

  const { simulationServiceDetails } = useGetSimulationResults()

  const isNotTrialResults = searchParams.get('is_trial_results') !== 'true'
  const role = membership?.roles[0]

  return (
    <header className='lg:container space-y-6'>
      <div className='flex items-center gap-2'>
        <UserSquareIcon size={20} strokeWidth={1.5} className='text-gray-800' />
        <p>{simulationServiceDetails?.data?.serviceType} Service</p>
      </div>

      <ServiceHeadline />

      {isNotTrialResults && (
        <>
          {(role === roles.trainer ||
            role === roles.admin ||
            role === roles.superadmin) && <UserProfileHeadline />}
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2'>
              <PreviousAttemptLink />
              <NextAttemptLink />
            </div>
            <SimulationLinksDropdown />
          </div>
        </>
      )}
    </header>
  )
}

function ResultContainer() {
  const {
    isSimulationDetailsLoading,
    isTranscriptsLoading,
    isSoftSkillsLoading,
    isSimulationDatesLoading
  } = useGetSimulationResults()

  if (
    isSimulationDetailsLoading ||
    isTranscriptsLoading ||
    isSoftSkillsLoading ||
    isSimulationDatesLoading
  ) {
    return (
      <div className='grid place-items-center p-4 col-span-full'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <SimulationResultsHeader />
      <SimulationResultsTabs />
    </div>
  )
}

export default ResultContainer
