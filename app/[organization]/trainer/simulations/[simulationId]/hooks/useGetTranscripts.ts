import transcriptService from '@/app/(shared)/services/trainer/transcriptService'
import useSWR from 'swr'

export function useGetTranscripts(orgSlug: string, simulationId: string) {
  const { data, isLoading, error, mutate } = useSWR(
    `/${orgSlug}/trainer/transcripts/${simulationId}`,
    () =>
      transcriptService
        .getTranscriptsBySimulation(String(simulationId), orgSlug)
        .then((res) => res.data)
  )

  return { savedMessages: data?.data, isLoading, error, mutate }
}
