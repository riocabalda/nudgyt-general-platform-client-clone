import React from 'react'
import { Progress } from '@/app/(shared)/components/ui/progress'
import useSimulationFormStore from '../../hooks/useSimulationFormStore'

function FormQuestionsProgressBar() {
  const { questionsProgress } = useSimulationFormStore()

  return (
    <div>
      <Progress
        value={questionsProgress}
        className='h-[5px] w-full rounded-none bg-gray-300 border-none'
        indicatorColor='bg-success'
      />
    </div>
  )
}

export default FormQuestionsProgressBar
