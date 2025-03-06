import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import { Button } from '@/app/(shared)/components/ui/button'
import { useGetSimulation } from '../hooks/useGetSimulation'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import simulationService from '@/app/(shared)/services/learner/simulationService'
import useSimulationFormStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationFormStore'

function EndSimulationBtn({
  btnText,
  setIsLoading
}: {
  btnText?: string
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const router = useRouter()
  const { orgSlug } = useOrganization()
  const { simulationId } = useParams()

  const { mutate } = useGetSimulation(orgSlug, String(simulationId))

  const { formAnswers, resetFormState } = useSimulationFormStore()

  const handleEndSimulation = async () => {
    setIsSubmitting(true)
    setIsLoading?.(true)

    try {
      const payload = { formAnswers: formAnswers }
      await simulationService.stopSimulation(
        orgSlug,
        String(simulationId),
        payload
      )
      mutate()
      params.delete('panel')
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.replace(newUrl)
    } catch (err) {
      console.log(err)
    } finally {
      resetFormState()
    }
  }

  return (
    <Button
      disabled={isSubmitting}
      variant='default'
      className='w-full lg:w-fit'
      onClick={handleEndSimulation}
    >
      {isSubmitting ? (
        <>
          <Loader className='w-4 h-4 mr-2 animate-spin' /> Ending Simulation
        </>
      ) : (
        btnText || 'End Simulation'
      )}
    </Button>
  )
}

export default EndSimulationBtn
