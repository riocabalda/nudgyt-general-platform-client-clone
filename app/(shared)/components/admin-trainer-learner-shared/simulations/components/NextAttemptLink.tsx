import { Button } from '@/app/(shared)/components/ui/button'
import { ChevronRight } from 'lucide-react'
import useGetSimulationResults from '../hooks/useGetSimulationResults'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import Link from 'next/link'
import { orgPrefixRoute } from '@/app/(shared)/utils'
function NextAttemptLink() {
  const { simulationDates, isSimulationDatesLoading } =
    useGetSimulationResults()
  const { orgSlug, membership } = useOrganization()

  const nextAttempt = simulationDates?.data?.nextAttempt

  function createSimResultHref(id: string, device: 'desktop' | 'mobile') {
    const role = orgPrefixRoute(membership?.roles || [])
    return `/${orgSlug}/${role?.toLowerCase()}/simulations/${id}/results?device=${device}`
  }

  const hasNoNextSim = nextAttempt === undefined
  if (hasNoNextSim) {
    return (
      <button disabled className='disabled:opacity-50'>
        <ChevronRight className='size-5 lg:size-6' />
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
        <Link href={createSimResultHref(nextAttempt._id, 'desktop')}>
          <ChevronRight className='size-5 lg:size-6' />
        </Link>
      </Button>
      <Button
        asChild
        variant='ghost'
        size='icon'
        className='size-fit text-inherit p-1 lg:hidden'
      >
        <Link href={createSimResultHref(nextAttempt._id, 'mobile')}>
          <ChevronRight className='size-5 lg:size-6' />
        </Link>
      </Button>
    </>
  )
}

export default NextAttemptLink
