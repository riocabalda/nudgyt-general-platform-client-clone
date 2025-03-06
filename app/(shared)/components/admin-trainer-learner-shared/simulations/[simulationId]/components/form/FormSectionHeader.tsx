import React from 'react'
import { getSectionLetterDescription } from '../../utils/formUtils'
import { truncateText } from '@/app/(shared)/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { TransformedSection } from '../../types/simulationFormTypes'
import useSimulationFormStore from '../../hooks/useSimulationFormStore'

function FormSectionHeader({
  formData
}: {
  formData: TransformedSection | null
}) {
  const { isOpenSection, setIsOpenSection } = useSimulationFormStore()
  return (
    <button
      className='w-full flex items-center p-4 pb-3 bg-brandcolorf text-white border-none lg:border lg:border-b border-b-gray-300 lg:border-b-transparent rounded-none lg:rounded-t-[8px]'
      onClick={() => setIsOpenSection(!isOpenSection)}
    >
      <div className='w-full flex items-center justify-between'>
        <div>
          <p className='text-left text-white text-xs '>{`SECTION ${
            getSectionLetterDescription(formData?.section).letter
          }`}</p>
          <h3 className='text-left mt-1 text-base text-white font-semibold leading-none overflow-hidden'>
            {truncateText(
              getSectionLetterDescription(formData?.section).description || '',
              28
            )}
          </h3>
        </div>
        {isOpenSection ? (
          <ChevronUp size={24} strokeWidth={1.5} />
        ) : (
          <ChevronDown size={24} strokeWidth={1.5} />
        )}
      </div>
    </button>
  )
}

export default FormSectionHeader
