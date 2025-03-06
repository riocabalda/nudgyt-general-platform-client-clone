'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDateTime } from '@/app/(shared)/utils'
import { Card } from '@/app/(shared)/components/ui/card'
import { useGetService } from '../../hooks/useGetService'
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@/app/(shared)/components/ui/table'
import PreviousAttemptsPagination from './PreviousAttemptsPagination'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetSimulationsPreviousAttempt from '../../hooks/useGetSimulationsPreviousAttempt'

export default function PreviousAttemptCard() {
  const [page, setPage] = useState<string>('1')
  const { serviceId } = useParams()
  const router = useRouter()
  const { orgSlug } = useOrganization()

  const { serviceData } = useGetService(orgSlug, serviceId as string)

  const hasForm = !!serviceData?.basic_level.form_questions.length

  const { data, mutate } = useGetSimulationsPreviousAttempt(
    orgSlug,
    `service_id=${serviceId}&page=${page}`
  )

  function handleSeeSimulationResult(simulation_id: string) {
    router.push(`/${orgSlug}/learner/simulations/${simulation_id}/results`)
  }

  useEffect(() => {
    mutate()
  }, [page])

  return data?.data && data?.data.length ? (
    <Card className='rounded-[8px] p-[24px] mt-[24px] space-y-[16px] relative'>
      <div className='flex items-start justify-between'>
        <h2 className='text-lg font-semibold'>Previous Attempts</h2>
        <PreviousAttemptsPagination data={data} setPage={setPage} />
      </div>
      <Table>
        <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
          {data.data.map((item) => (
            <TableRow
              key={item.simulation_id}
              className='border-none cursor-pointer hover:bg-muted'
              onClick={() => handleSeeSimulationResult(item.simulation_id)}
            >
              <TableCell className='px-6 min-w-[300px] py-[14px] underline'>
                {formatDateTime(item.started_at.toString())}
              </TableCell>
              {hasForm && (
                <>
                  <TableCell className='px-0 py-[14px] font-bold text-brandcolorf'>
                    {item.score}%
                  </TableCell>
                  <TableCell className='px-0 py-[14px] text-brandcolorf capitalize'>
                    {item.competency}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='w-full h-2 lg:h-0' />
    </Card>
  ) : null
}
