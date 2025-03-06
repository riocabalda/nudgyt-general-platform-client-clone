import React, { useEffect, useState } from 'react'
import { Pause } from 'lucide-react'
import {
  Dialog,
  DialogDescription,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { useParams } from 'next/navigation'
import { cn, padStartTime } from '@/app/(shared)/utils'
import { Simulation } from '@/app/(shared)/services/learner/simulationService'
import {
  convertFormAnswersToObject,
  hasUnsavedFormData
} from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/utils/formUtils'
import { useSimulationTimer } from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationTimer'
import StopSimulationContent from './StopSimulationContent'
import useUpdateFormAnswers from '../hooks/useUpdateFormAnswers'
import StopSimulationSelectAction from './StopSimulationSelectAction'
import TimesUpModal from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/TimesUpModal'
import useSimulationFormStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationFormStore'

function StopwatchValueAndStopSimulationModal({
  simulationData,
  isSimulationValidating
}: {
  simulationData: Simulation
  isSimulationValidating: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isEndingSimulation, setIsEndingSimulation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { simulationId } = useParams()

  const { setFormAnswersToDbNoDelay } = useUpdateFormAnswers(
    String(simulationId)
  )

  const { formAnswers } = useSimulationFormStore()
  const simulationFormAnswers = convertFormAnswersToObject(
    simulationData as Simulation
  )

  // Check if there are any new/unsaved answers from the user.
  const hasUnsavedAnswers =
    hasUnsavedFormData(formAnswers, simulationFormAnswers) &&
    !!simulationData?.form_answers.length

  const { totalSeconds, seconds, minutes, hours, hasTimeLimit } =
    useSimulationTimer(simulationData as Simulation, isSimulationValidating)

  useEffect(() => {
    if (!open) setIsEndingSimulation(false)
    // Update form answers in the database when there are new answers from users.
    if (open && hasUnsavedAnswers) setFormAnswersToDbNoDelay(formAnswers)
  }, [open])

  const time = padStartTime(`${hours}:${minutes}:${seconds}`)

  const renderContent = () => {
    if (!isEndingSimulation)
      return (
        <StopSimulationSelectAction
          setIsEndingSimulation={setIsEndingSimulation}
        />
      )
    return (
      <StopSimulationContent
        isSubmitting={isSubmitting}
        open={open}
        setOpen={setOpen}
        setIsSubmitting={setIsSubmitting}
      />
    )
  }

  return (
    <Dialog open={!isSubmitting && open} onOpenChange={setOpen}>
      {hasTimeLimit && totalSeconds === 0 && <TimesUpModal />}
      <DialogTrigger asChild>
        <button className='flex items-center bg-white border-[1px] border-red-500 rounded-md px-[6px] z-10'>
          <div className='flex items-center justify-center w-8 h-8 bg-opacity-20 rounded-md'>
            <Pause fill='#F04C4B' size={20} className='text-red-500' />
          </div>
          <div className='h-[24px] w-0.5 mx-1 my-auto self-stretch bg-neutral-gray-400'></div>
          <span
            className={cn(
              'flex items-center w-[75px] h-[36px] p-0 pl-[8px] text-black text-sm font-semibold bg-transparent',
              hasTimeLimit && totalSeconds < 900 && 'text-destructive'
            )}
          >
            {time}
          </span>
        </button>
      </DialogTrigger>
      {/* fix Warning: Missing `Description`*/}
      {<DialogDescription hidden />}
      {renderContent()}
    </Dialog>
  )
}

export default StopwatchValueAndStopSimulationModal
