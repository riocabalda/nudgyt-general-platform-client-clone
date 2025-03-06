import transcriptService from '@/app/(shared)/services/learner/transcriptService'
import useSWR from 'swr'

export function useGetTranscripts(orgSlug: string, simulationId: string) {
  const { data, isLoading, error, mutate } = useSWR(
    `/${orgSlug}/learner/transcripts/${simulationId}`,
    () =>
      transcriptService
        .getTranscripts(orgSlug, String(simulationId))
        .then((res) => res.data)
  )

  return { savedMessages: data?.data, isLoading, error, mutate }
}
