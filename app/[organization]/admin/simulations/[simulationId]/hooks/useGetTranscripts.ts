import transcriptService from '@/app/(shared)/services/admin/transcriptService'
import useSWR from 'swr'

export function useGetTranscripts(orgSlug: string, simulationId: string) {
  const { data, isLoading, error, mutate } = useSWR(
    `/${orgSlug}/admin/transcripts/${simulationId}`,
    () =>
      transcriptService
        .getTranscriptsBySimulation(String(simulationId), orgSlug)
        .then((res) => res.data)
  )

  return { savedMessages: data?.data, isLoading, error, mutate }
}
