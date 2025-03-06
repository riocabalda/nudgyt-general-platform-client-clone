'use client'

import { Loader, UserSquareIcon } from 'lucide-react'
import ServiceHeadline from './ServiceHeadline'
import NextAttemptLink from './NextAttemptLink'
import PreviousAttemptLink from './PreviousAttemptLink'
import SimulationLinksDropdown from './SimulationLinksDropdown'
import InfoTabs from './InfoTabs'
import ServiceDetailsTab from './tabs/ServiceDetailsTab'
import ScoreSummaryTab from './tabs/ScoreSummaryTab'
import SoftSkillsTab from './tabs/SoftSkillsTab'
import TranscriptTab from './tabs/TranscriptTab'
import useGetSimulationResults from '../hooks/useGetSimulationResults'
import FetchError from '@/app/(shared)/components/FetchError'
import UserProfileHeadline from './UserProfileHeadline'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { roles } from '@/app/(shared)/services/userService'
import { useSearchParams } from 'next/navigation'
function ResultContainer() {
  const searchParams = useSearchParams()
  const isNotTrialResults = searchParams.get('is_trial_results') !== 'true'

  const {
    details,
    isSimulationDetailsLoading,
    isTranscriptsLoading,
    isSoftSkillsLoading,
    isSimulationDetailsError,
    isTranscriptsError,
    isSoftSkillsError,
    simulationServiceDetails,
    isSimulationDatesLoading
  } = useGetSimulationResults()
  const { membership } = useOrganization()
  const role = membership?.roles[0]
  return (
    <div className='space-y-6 p-4 lg:px-10 lg:py-0'>
      {isSimulationDetailsLoading ||
      isTranscriptsLoading ||
      isSoftSkillsLoading ||
      isSimulationDatesLoading ? (
        <div className='grid place-items-center p-4 col-span-full'>
          <Loader className='w-4 h-4 mr-2 animate-spin' />
        </div>
      ) : (
        <>
          <div className='space-y-6'>
            <div className='flex items-center gap-2'>
              <UserSquareIcon
                size={20}
                strokeWidth={1.5}
                className='text-gray-800'
              />
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
          </div>
          <InfoTabs
            tabs={[
              {
                value: 'details',
                name: 'Details',
                content: (
                  <div className='p-4 lg:p-10 max-w-[712px] mx-auto'>
                    {isSimulationDetailsError && (
                      <div className='grid place-items-center p-4 col-span-full'>
                        <FetchError
                          errorMessage={isSimulationDetailsError.message}
                        />
                      </div>
                    )}
                    {!isSimulationDetailsError &&
                      !isSimulationDetailsLoading && <ServiceDetailsTab />}
                  </div>
                )
              },
              {
                value: 'score-summary',
                name: 'Score Summary',
                content: (
                  <div className='p-4 lg:p-10'>
                    {!details?.hasFormQuestions &&
                      !isSimulationDetailsError && (
                        <div className='grid place-items-center col-span-full'>
                          <p className='text-neutral-gray-600 text-center'>
                            Form questions are not available for this service
                          </p>
                        </div>
                      )}
                    {isSimulationDetailsError && (
                      <div className='grid place-items-center p-4 col-span-full'>
                        <FetchError
                          errorMessage={isSimulationDetailsError.message}
                        />
                      </div>
                    )}
                    {!isSimulationDetailsError &&
                      !isSimulationDetailsLoading &&
                      details?.hasFormQuestions && <ScoreSummaryTab />}
                  </div>
                )
              },
              {
                value: 'transcript',
                name: 'Transcript',
                content: (
                  <div className='p-4 lg:p-10 max-w-[712px] mx-auto'>
                    {isTranscriptsError && (
                      <div className='grid place-items-center p-4 col-span-full'>
                        <FetchError errorMessage={isTranscriptsError.message} />
                      </div>
                    )}
                    {!isTranscriptsError && !isTranscriptsLoading && (
                      <TranscriptTab />
                    )}
                  </div>
                )
              },
              {
                value: 'soft-skills',
                name: 'Soft Skills',
                content: (
                  <div className='p-4 lg:p-10 max-w-[712px] mx-auto'>
                    {isSoftSkillsError && (
                      <div className='grid place-items-center p-4 col-span-full'>
                        <FetchError errorMessage={isSoftSkillsError.message} />
                      </div>
                    )}
                    {!isSoftSkillsError && !isSoftSkillsLoading && (
                      <SoftSkillsTab />
                    )}
                  </div>
                )
              }
            ]}
          />
        </>
      )}
    </div>
  )
}

export default ResultContainer
