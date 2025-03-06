import React, { useEffect, useRef, useState } from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { Simulation } from '@/app/(shared)/services/admin/simulationService'
import { TransformedSection } from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/types/simulationFormTypes'
import {
  convertFormAnswersToObject,
  hasUnsavedFormData
} from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/utils/formUtils'
import FormSections from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/form/FormSections'
import FormSectionHeader from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/form/FormSectionHeader'
import FormSectionQuestions from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/form/FormSectionQuestions'
import FormQuestionsProgressBar from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/form/FormQuestionsProgressBar'
import useSimulationFormStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationFormStore'
import useUpdateFormAnswers from '../hooks/useUpdateFormAnswers'

function Form({ simulationData }: { simulationData: Simulation }) {
  const [selectedSection, setSelectedSection] = useState('')
  const scrollableContainerRef = useRef<HTMLDivElement>(null)

  const {
    formAnswers,
    formattedFormData,
    scrollToView,
    isOpenSection,
    setIsOpenSection
  } = useSimulationFormStore()
  const { setFormAnswersToDbNoDelay } = useUpdateFormAnswers(simulationData._id)

  const simulationFormAnswers = convertFormAnswersToObject(simulationData)
  // Check if there are any new/unsaved answers from the user.
  const hasUnsavedAnswers =
    hasUnsavedFormData(formAnswers, simulationFormAnswers) &&
    !!simulationData?.form_answers.length

  const formData = formattedFormData.find(
    (data) => data.section === selectedSection
  ) as TransformedSection

  useEffect(() => {
    setIsOpenSection(true)
    setSelectedSection(formattedFormData[0].section)
  }, [])

  useEffect(() => {
    if (scrollToView) {
      setSelectedSection(scrollToView.section)
      setIsOpenSection(true)
    }
  }, [scrollToView])

  useEffect(() => {
    if (scrollableContainerRef.current)
      scrollableContainerRef.current.scrollTop = 0

    // Update form answers in the database when there are new answers from users
    if (!isOpenSection && hasUnsavedAnswers)
      setFormAnswersToDbNoDelay(formAnswers)
  }, [isOpenSection])

  return (
    <>
      <FormSectionHeader formData={formData} />
      <FormQuestionsProgressBar />
      <Card
        ref={scrollableContainerRef}
        className='relative flex-1 w-full lg:w-full rounded-none lg:rounded-b-[8px] lg:border pb-[90px] lg:pb-0 overflow-y-auto scrollbar-thin'
      >
        {isOpenSection && selectedSection ? (
          <FormSectionQuestions
            formData={formData}
            useUpdateFormAnswers={useUpdateFormAnswers}
          />
        ) : (
          <FormSections
            selectedSection={formData?.section}
            setSelectedSection={setSelectedSection}
          />
        )}
      </Card>
    </>
  )
}

export default Form
