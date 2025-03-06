import characterService from '@/app/(shared)/services/admin/characterService'
import useSWR from 'swr'

export function useGetCharacters(orgSlug: string, searchParams: string) {
  const { data, isLoading, error, mutate } = useSWR(
    orgSlug ? `/${orgSlug}/admin/characters?${searchParams}` : null,
    () =>
      characterService
        .getCharacters(orgSlug ?? '', searchParams)
        .then((res) => res.data)
  )

  return { data, isLoading, error, mutate }
}
