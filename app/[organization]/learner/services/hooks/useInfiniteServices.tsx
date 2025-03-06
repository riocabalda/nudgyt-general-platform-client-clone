import { useEffect, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import serviceService from '@/app/(shared)/services/learner/serviceService'

type ServiceResponse = {
  data: any[]
  has_next_page: boolean
  total: number
}

type UseInfiniteServicesProps = {
  orgSlug: string
  view?: 'recent' | 'new'
  search?: string | null
  sortBy?: string | null
}

export function useInfiniteServices({
  orgSlug,
  view,
  search,
  sortBy
}: UseInfiniteServicesProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [fetchLoading, setFetchLoading] = useState(false)

  const getKey = (
    pageIndex: number,
    previousPageData: ServiceResponse | null
  ) => {
    const currentPageIndex = pageIndex + 1

    if (previousPageData && !previousPageData.has_next_page) return null

    const queryParams = new URLSearchParams()
    if (search) queryParams.append('search', search)
    if (sortBy) queryParams.append('sort_by', sortBy)
    if (view) queryParams.append('service_view', view)

    const keyParams = `page=${currentPageIndex}${queryParams.toString() && `&${queryParams.toString()}`}`

    return keyParams
  }

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<ServiceResponse>(getKey, (params: string) =>
      serviceService.getServices(orgSlug, params).then((res) => res.data)
    )

  const servicesData = data?.flatMap((page) => page.data)
  const isTotalServices = data?.at(-1)?.total === servicesData?.length

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight
      const viewportHeight = window.innerHeight
      const scrolledHeight = window.scrollY
      const percentageScrolled =
        (scrolledHeight / (totalHeight - viewportHeight)) * 100
      setScrollPosition(Number(percentageScrolled.toFixed()))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (
      scrollPosition > 90 &&
      !fetchLoading &&
      !isValidating &&
      !isTotalServices
    ) {
      setFetchLoading(true)
      setSize(size + 1)
    }
    if (!isValidating) {
      setFetchLoading(false)
    }
  }, [
    scrollPosition,
    fetchLoading,
    isValidating,
    isTotalServices,
    size,
    setSize
  ])

  return {
    servicesData,
    error,
    isLoading,
    isValidating,
    isTotalServices
  }
}
