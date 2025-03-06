import { useEffect } from 'react'
import {
  convertFormAnswersToObject,
  formatFormData,
  hasFormAnswers
} from '../utils/formUtils'
import { TransformedSection } from '../types/simulationFormTypes'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import { Simulation } from '@/app/(shared)/services/learner/simulationService'
import useSimulationFormStore from './useSimulationFormStore'

function useInitializeSimulationData(
  serviceData?: Service,
  simulationData?: Simulation
) {
  const { setFormAnswers, setFormattedFormData, setDisableBtn } =
    useSimulationFormStore()

  useEffect(() => {
    if (!serviceData || !simulationData) {
      return
    }

    const formAnswersInObject = convertFormAnswersToObject(
      simulationData as Simulation
    )

    // Get form answers for each section (including prefilled values) and any additional rows that were added
    const updatedServiceData = serviceData?.basic_level.form_questions || []

    // Enable end simulation button if form has at least one answer filled out
    if (hasFormAnswers(formAnswersInObject)) setDisableBtn(false)

    // This will format the data used to populate in form section
    const newServiceData = formatFormData(updatedServiceData)

    setFormattedFormData(newServiceData as TransformedSection[])

    // This will set formAnswers after initializing the needed data
    setFormAnswers(formAnswersInObject)
  }, [serviceData?.basic_level.form_questions, simulationData?.form_answers])
}

export default useInitializeSimulationData
