import React from 'react'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/app/(shared)/components/ui/card'
import { formatDateTime } from '@/app/(shared)/utils'
import { roles } from '@/app/(shared)/services/userService'
import TemplateMasterBadge from '@/app/(shared)/components/admin/TemplateMasterBadge'
import ServiceStatusBadge from '@/app/(shared)/components/admin/ServiceStatusBadge'
import useUser from '@/app/(shared)/hooks/useUser'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function TemplateCard({ templateData, link }: any) {
  const { user } = useUser()
  const { orgSlug } = useOrganization()

  const isCreator =
    templateData?.creator?._id === user?._id &&
    templateData.organization.slug === orgSlug

  return (
    <Link href={link}>
      <Card className='overflow-hidden flex flex-col h-full'>
        <div className='relative pb-[32%]'>
          {isCreator && (
            <ServiceStatusBadge
              variant={templateData?.is_published ? 'published' : 'draft'}
              className='absolute z-[3] right-4 top-4'
            />
          )}

          {templateData.is_master_template && <TemplateMasterBadge />}
          {templateData?.characters?.[0]?.avatar && (
            <Image
              src={templateData.characters[0].avatar.image_path ?? ''}
              fill
              alt='Character image'
              className='absolute object-cover z-[2] !w-1/2 !left-[10%]'
            />
          )}
          {templateData?.environment?.image ? (
            <Image
              src={templateData.environment.image ?? ''}
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
              {templateData.title || (
                <span className='text-destructive uppercase'>
                  No Template Title
                </span>
              )}
            </h2>
            <ChevronRight className='text-muted-foreground shrink-0' />
          </div>
          <div className='flex items-end justify-between'>
            <div>
              <p className='mt-4 text-neutral-gray-800 font-medium text-xs leading-none'>
                CREATED
              </p>
              <p className='mt-1 text-sm text-neutral-gray-600'>
                {templateData.created_at &&
                  formatDateTime(templateData.created_at)}
              </p>
              {templateData.creator && (
                <p className='text-sm text-neutral-gray-600'>
                  {`by ${
                    templateData?.creator?.user_type === roles.trainer
                      ? templateData?.creator?.organization
                      : templateData?.creator?.full_name
                  }`}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default TemplateCard
