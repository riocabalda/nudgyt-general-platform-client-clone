'use client'

import { useSearchParams } from 'next/navigation'
import { z } from 'zod'

export const PageTab = {
  BASIC: 'basic',
  ENTERPRISE: 'enterprise'
} as const

const PageParamsSchema = z.object({
  tab: z.nativeEnum(PageTab).default(PageTab.BASIC)
})

function usePageParams() {
  const paramsRaw = useSearchParams()

  const params = PageParamsSchema.parse(Object.fromEntries(paramsRaw))

  return {
    params
  }
}

export default usePageParams
