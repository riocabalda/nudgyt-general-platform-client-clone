'use client'

import { StyledTabItem, StyledTabs } from '@/app/(shared)/components/StyledTabs'
import organizationConfig from '@/app/(shared)/config/organizationConfig'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const TemplatePageTab = {
  ALL: 'all',
  MY_TEMPLATES: 'user_templates',
  PUBLISHED: 'published',
  DRAFTS: 'drafts',
  MASTER_TEMPLATES: 'master_templates'
} as const

function TemplatesTab() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { membership } = useOrganization()

  const isPublic =
    membership?.organization.name ===
    organizationConfig.PUBLIC_ORGANIZATION_NAME

  function getDefaultTab() {
    if (searchParams.get('master_templates')) {
      return TemplatePageTab.MASTER_TEMPLATES
    }

    if (
      !searchParams.has('is_published') &&
      !searchParams.has('user_templates')
    ) {
      return TemplatePageTab.ALL
    }

    if (searchParams.get('user_templates')) {
      return TemplatePageTab.MY_TEMPLATES
    }

    if (searchParams.get('is_published') === 'true') {
      return TemplatePageTab.PUBLISHED
    }

    if (searchParams.get('is_published') === 'false') {
      return TemplatePageTab.DRAFTS
    }

    throw new Error('Unknown default tab')
  }

  function isPublishedParam(isPublished?: boolean | null) {
    const params = new URLSearchParams(searchParams.toString())
    const filterParam = searchParams.get('sort_by')
    const pageParam = searchParams.get('page')

    if (pageParam && pageParam !== '1') {
      params.delete('page')
    }

    if (filterParam) {
      params.delete('sort_by')
    }

    if (isPublished === null) {
      params.delete('is_published')
      params.delete('user_templates')
      params.delete('master_templates')
    } else if (isPublished !== undefined) {
      params.set('is_published', String(isPublished))
      params.delete('user_templates')
      params.delete('master_templates')
    } else {
      params.delete('is_published')
      params.set('user_templates', 'true')
      params.delete('master_templates')
    }

    return params.toString()
  }

  function getParamsFromTabValue(tab: string) {
    console.log('tab', tab)
    if (tab === TemplatePageTab.ALL) {
      return isPublishedParam(null)
    }
    if (tab === TemplatePageTab.MY_TEMPLATES) {
      return isPublishedParam()
    }
    if (tab === TemplatePageTab.PUBLISHED) {
      return isPublishedParam(true)
    }
    if (tab === TemplatePageTab.DRAFTS) {
      return isPublishedParam(false)
    }
    if (tab === TemplatePageTab.MASTER_TEMPLATES) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('master_templates', 'true')
      params.delete('is_published')
      params.delete('user_templates')
      return params.toString()
    }

    throw new Error('Unknown tab value')
  }

  function reflectTabInParams(tab: string) {
    const params = getParamsFromTabValue(tab)

    router.replace(`${pathname}?${params}`)
  }

  /** Tab contents are rendered separately... */
  return (
    <div className='overflow-x-hidden w-full pb-1'>
      <StyledTabs
        value={getDefaultTab()}
        onValueChange={reflectTabInParams}
        className='min-h-fit'
      >
        <StyledTabItem name='All' value={TemplatePageTab.ALL} />
        <StyledTabItem
          name='My Templates'
          value={TemplatePageTab.MY_TEMPLATES}
        />
        <StyledTabItem name='Published' value={TemplatePageTab.PUBLISHED} />
        <StyledTabItem name='Drafts' value={TemplatePageTab.DRAFTS} />
        {!isPublic && (
          <StyledTabItem
            name='Master Templates'
            value={TemplatePageTab.MASTER_TEMPLATES}
          />
        )}
      </StyledTabs>
    </div>
  )
}

export default TemplatesTab
