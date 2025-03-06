import { useParams } from 'next/navigation'
import { z } from 'zod'

const PageParamsSchema = z.object({
  userId: z.string()
})

function usePageParams() {
  const paramsRaw = useParams()

  const params = PageParamsSchema.parse(paramsRaw)

  return { params }
}

export default usePageParams
