import { useEffect } from 'react'
import simulationService, {
  FormAnswersObjectType,
  FormPayloadSectionType
} from '@/app/(shared)/services/admin/simulationService'
import { useDebounceValue } from 'usehooks-ts'
import { useGetSimulation } from './useGetSimulation'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function useUpdateFormAnswers(simulationId: string) {
  // This line uses a debounced value to prevent excessive requests to save formAnswers to the database
  // when the user is typing. It introduces a delay of 2000ms before updating the formAnswers.
  const [debouncedFormAnswers, setFormAnswersToDb] =
    useDebounceValue<FormAnswersObjectType | null>(null, 2000)
  const { orgSlug } = useOrganization()

  const { mutate } = useGetSimulation(orgSlug, String(simulationId))

  useEffect(() => {
    if (debouncedFormAnswers) {
      updateFormAnswers(simulationId, debouncedFormAnswers)
    }
  }, [debouncedFormAnswers])

  // Update form answers progress in the database
  const updateFormAnswers = async (
    simulationId: string,
    formAnswers: FormPayloadSectionType
  ) => {
    try {
      await simulationService.updateFormAnswers(orgSlug, simulationId, {
        formAnswers
      })
    } catch (err) {
      console.error(err)
    } finally {
      mutate()
      setFormAnswersToDb(null)
    }
  }

  // This function is used to save form answers to the database without any delay.
  const setFormAnswersToDbNoDelay = (formAnswers: FormAnswersObjectType) =>
    updateFormAnswers(simulationId, formAnswers)

  // This function is used to save form answers to the database with delay.
  const setFormAnswersWithDelay = (formAnswers: FormAnswersObjectType) =>
    setFormAnswersToDb(formAnswers)

  return {
    debouncedFormAnswers,
    setFormAnswersWithDelay,
    setFormAnswersToDbNoDelay
  }
}
export default useUpdateFormAnswers
