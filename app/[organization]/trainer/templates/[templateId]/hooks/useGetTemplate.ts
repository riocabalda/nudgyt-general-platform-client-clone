import templateService from '@/app/(shared)/services/trainer/templateService'
import useSWR from 'swr'

function useGetTemplate(orgSlug: string, templateId: string | null) {
  const shouldFetch = Boolean(orgSlug && templateId && templateId !== 'null')
  const { data, isLoading, error, mutate } = useSWR(
    shouldFetch ? `${orgSlug}/trainer/templates/${templateId}` : null,
    () =>
      templateService
        .getTemplateById(orgSlug, String(templateId))
        .then((res) => res.data)
  )
  return { data, error, isLoading, mutate }
}
export default useGetTemplate
