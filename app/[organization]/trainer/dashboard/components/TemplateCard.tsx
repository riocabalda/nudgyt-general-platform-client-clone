import ServiceStatusBadge from '@/app/(shared)/components/admin/ServiceStatusBadge'
import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { Template } from '@/app/(shared)/services/trainer/templateService'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function TemplateCard({ templateData }: { templateData: Template }) {
  const { orgSlug } = useOrganization()

  const firstCharacter = templateData?.characters[0]
  const firstCharacterImageUrl = firstCharacter?.avatar?.image_path

  return (
    <Link href={`/${orgSlug}/trainer/templates/${templateData._id}`}>
      <Card className='overflow-hidden flex flex-col h-full'>
        <div className='relative pb-[32%]'>
          {firstCharacterImageUrl && (
            <Image
              src={firstCharacterImageUrl}
              fill
              alt='Character image'
              className='absolute object-cover z-[2] !w-1/2 !left-[10%]'
            />
          )}
          {templateData?.environment?.image ? (
            <Image
              src={templateData?.environment?.image}
              fill
              alt='Environment image'
              className='absolute object-cover brightness-[.6]'
            />
          ) : (
            <div className='bg-muted w-full h-full absolute' />
          )}
          <ServiceStatusBadge
            variant={templateData?.is_published ? 'published' : 'draft'}
            className='absolute z-[3] right-4 top-4'
          />
        </div>
        <div className='p-4 flex flex-col h-full'>
          <div className='flex justify-between grow'>
            <h2 className='font-semibold line-clamp-2'>
              {templateData.title || (
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
                {templateData?.created_at}
              </p>
              <p className='text-sm text-neutral-gray-600'>
                {`by ${templateData?.creator}`}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
export default TemplateCard
