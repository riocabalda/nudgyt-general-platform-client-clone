'use client'

import React, { useMemo } from 'react'
import { Loader, SearchX } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import FetchError from '@/app/(shared)/components/FetchError'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import templateService from '@/app/(shared)/services/trainer/templateService'
import TemplateCard from './TemplateCard'

function Templates() {
  const searchParams = useSearchParams()
  const hasAnyParams = searchParams.toString().length > 0
  const { orgSlug, membership } = useOrganization()

  const {
    data: templatesData,
    isLoading,
    error
  } = useSWR(`/${orgSlug}/trainer/templates?${searchParams.toString()}`, () =>
    templateService
      .getTemplates(orgSlug, searchParams.toString())
      .then((res) => res.data)
  )

  const transformedTemplatesData = useMemo(() => {
    return templatesData?.data.map((template: any) => ({
      ...template,
      is_shared: template.shared_to_organizations.includes(
        membership?.organization._id
      )
    }))
  }, [templatesData, membership])

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  if (transformedTemplatesData && transformedTemplatesData.length)
    return (
      <ul className='grid gap-[24px] lg:grid-cols-3'>
        {transformedTemplatesData.map((template: any) => (
          <li data-cy='templates' key={template._id}>
            <TemplateCard
              templateData={template}
              link={`/${orgSlug}/trainer/templates/${template._id}`}
            />
          </li>
        ))}
      </ul>
    )

  return (
    <div className='h-[500px] flex flex-col items-center justify-center'>
      <SearchX className='text-muted-foreground size-[24px]' />
      <p className='text-sm text-muted-foreground mt-[10px]'>
        {hasAnyParams ? 'No templates found' : 'No templates available'}
      </p>
    </div>
  )
}

export default Templates
