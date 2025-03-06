import { Button } from '@/app/(shared)/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import useGetSimulationResults from '../hooks/useGetSimulationResults'
import Link from 'next/link'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { orgPrefixRoute } from '@/app/(shared)/utils'

function PreviousAttemptLink() {
  const { simulationDates, isSimulationDatesLoading } =
    useGetSimulationResults()
  const { orgSlug, membership } = useOrganization()
  const previousAttempt = simulationDates?.data?.previousAttempt

  function createSimResultHref(id: string, device: 'desktop' | 'mobile') {
    const role = orgPrefixRoute(membership?.roles || [])
    return `/${orgSlug}/${role?.toLowerCase()}/simulations/${id}/results?device=${device}`
  }

  const hasNoPreviousSim = previousAttempt === undefined
  if (hasNoPreviousSim) {
    return (
      <button disabled className='disabled:opacity-50'>
        <ChevronLeft className='size-5 lg:size-6' />
      </button>
    )
  }

  return (
    <>
      <Button
        asChild
        variant='ghost'
        size='icon'
        className='size-fit text-inherit p-1 hidden lg:block'
        disabled={isSimulationDatesLoading}
      >
        <Link href={createSimResultHref(previousAttempt._id, 'desktop')}>
          <ChevronLeft className='size-5 lg:size-6' />
        </Link>
      </Button>
      <Button
        asChild
        variant='ghost'
        size='icon'
        className='size-fit text-inherit p-1 lg:hidden'
      >
        <Link href={createSimResultHref(previousAttempt._id, 'mobile')}>
          <ChevronLeft className='size-5 lg:size-6' />
        </Link>
      </Button>
    </>
  )
}

export default PreviousAttemptLink
