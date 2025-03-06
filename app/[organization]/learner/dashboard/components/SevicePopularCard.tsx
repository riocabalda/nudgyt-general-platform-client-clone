import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { PopularService } from '@/app/(shared)/services/learner/dashboardService'
import { formatDateTime } from '@/app/(shared)/utils'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function ServicePopularCard({ serviceData }: { serviceData: PopularService }) {
  const { orgSlug } = useOrganization()
  return (
    <Link href={`/${orgSlug}/learner/services/${serviceData.serviceId}`}>
      <Card className='overflow-hidden flex flex-col h-full'>
        <div className='relative pb-[32%]'>
          {serviceData?.character?.avatar && (
            <Image
              src={serviceData.character.avatar}
              fill
              alt='Character image'
              className='absolute object-cover z-[2] !w-1/2 !left-[10%]'
            />
          )}
          {serviceData?.environment?.image ? (
            <Image
              src={serviceData?.environment?.image}
              fill
              alt='Environment image'
              className='absolute object-cover brightness-[.6]'
            />
          ) : (
            <div className='bg-muted w-full h-full absolute' />
          )}
        </div>
        <div className='p-4 flex flex-col h-full'>
          <div className='flex justify-between grow'>
            <h2 className='font-semibold line-clamp-2'>
              {serviceData.title || (
                <span className='text-destructive uppercase'>
                  No Service Title
                </span>
              )}
            </h2>
            <ChevronRight className='text-muted-foreground shrink-0' />
          </div>
          <div className='flex items-end justify-between'>
            <div>
              <p className='mt-1 text-sm text-neutral-gray-600'>
                {serviceData?.lastSimulation
                  ? formatDateTime(serviceData?.lastSimulation.toString())
                  : '-'}
              </p>
              <p className='text-sm text-neutral-gray-600'>
                {`by ${serviceData?.creator}`}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
export default ServicePopularCard
