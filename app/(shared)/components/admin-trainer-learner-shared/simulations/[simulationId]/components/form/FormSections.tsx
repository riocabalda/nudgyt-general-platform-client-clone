import React from 'react'
import {
  calculateSectionPercentage,
  getSectionLetterDescription
} from '../../utils/formUtils'
import { cn } from '@/app/(shared)/utils'
import { TransformedSection } from '../../types/simulationFormTypes'
import { FormAnswersObjectType } from '@/app/(shared)/services/learner/simulationService'
import CircularProgressBar from './CircularProgressBar'
import useSimulationFormStore from '../../hooks/useSimulationFormStore'

type FormSectionsPropType = {
  selectedSection: string
  setSelectedSection: React.Dispatch<React.SetStateAction<string>>
}

function FormSections({
  selectedSection,
  setSelectedSection
}: FormSectionsPropType) {
  const { formAnswers, formattedFormData } = useSimulationFormStore() as {
    formAnswers: FormAnswersObjectType
    formattedFormData: TransformedSection[]
  }

  const { setIsOpenSection } = useSimulationFormStore()

  const sectionFunction = (data: TransformedSection) => {
    const sectionProgress = calculateSectionPercentage(
      formAnswers,
      data.section
    )

    const showSelectedSection = data.section === selectedSection

    const hasQuestions = data.questions.filter(
      (item) => item.question_no !== 'Notes'
    ).length

    return { sectionProgress, showSelectedSection, hasQuestions }
  }
  const handleSelectSection = (data: TransformedSection) => {
    setSelectedSection(data.section)
    setIsOpenSection(true)
  }
  return (
    <div>
      {formattedFormData.map((data) => {
        const { hasQuestions, sectionProgress, showSelectedSection } =
          sectionFunction(data)
        return (
          <div key={data.section}>
            <button
              onClick={() => handleSelectSection(data)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-4 border-b border-b-gray-100 hover:bg-muted/40 duration-150',
                showSelectedSection && 'bg-muted hover:bg-muted'
              )}
            >
              <div className='flex-1'>
                <p
                  className={cn(
                    'text-left text-muted-foreground text-xs',
                    showSelectedSection && 'text-brandcolorf'
                  )}
                >
                  {`SECTION ${getSectionLetterDescription(data.section).letter}`}
                </p>
                <h3
                  className={cn(
                    'text-left mt-1 text-base text-foreground-800 font-medium',
                    showSelectedSection && 'text-brandcolorf'
                  )}
                >
                  {getSectionLetterDescription(data.section).description}
                </h3>
              </div>
              <div>
                {hasQuestions ? (
                  <CircularProgressBar value={sectionProgress || 0} />
                ) : null}
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default FormSections
