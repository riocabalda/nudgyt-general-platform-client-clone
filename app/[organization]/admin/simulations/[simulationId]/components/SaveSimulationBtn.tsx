import React from 'react'
import { Save } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useGetSimulation } from '../hooks/useGetSimulation'
import { Button } from '@/app/(shared)/components/ui/button'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function SaveSimulationBtn() {
  const { orgSlug } = useOrganization()
  const { simulationId } = useParams()
  const router = useRouter()

  const { simulationData, mutate } = useGetSimulation(
    orgSlug,
    String(simulationId)
  )
  const handleSaveExit = () => {
    router.replace(`/${orgSlug}/admin/services/${simulationData?.service}`)
    mutate()
  }

  return (
    <Button
      variant='outline'
      className='flex itemcenter gap-[10px] w-full'
      disabled={!simulationData?.service}
      onClick={handleSaveExit}
    >
      <Save size={20} />
      <span>Save</span>
    </Button>
  )
}

export default SaveSimulationBtn
