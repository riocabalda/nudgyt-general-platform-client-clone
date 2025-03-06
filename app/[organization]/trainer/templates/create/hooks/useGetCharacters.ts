import characterService from '@/app/(shared)/services/trainer/characterService'
import useSWR from 'swr'

export function useGetCharacters(orgSlug: string, searchParams: string) {
  const { data, isLoading, error, mutate } = useSWR(
    orgSlug ? `/${orgSlug}/trainer/characters?${searchParams}` : null,
    () =>
      characterService
        .getCharacters(orgSlug ?? '', searchParams)
        .then((res) => res.data)
  )

  return { data, isLoading, error, mutate }
}
