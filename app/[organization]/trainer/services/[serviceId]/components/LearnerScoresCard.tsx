import React from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import { LearnersScores } from '@/app/(shared)/services/trainer/serviceService'
import Link from 'next/link'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
function LearnerScoresCard({
  learnersScores,
  hasFormUploaded
}: {
  learnersScores: LearnersScores[]
  hasFormUploaded: boolean
}) {
  const { orgSlug } = useOrganization()
  return (
    <Card className='rounded-[8px]'>
      <Table>
        <TableHeader>
          <TableRow className='[&_*]:font-semibold [&_*]:text-black [&_th]:px-6'>
            <TableHead className='w-full'>Name</TableHead>
            <TableHead className='text-left truncate '>Best Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='[&>*:nth-child(even)]:bg-muted [&_*]:text-neutral-gray-800'>
          {learnersScores?.map((learnerScore, i) => (
            <TableRow key={i} className='border-none'>
              <TableCell className='px-6'>
                <Link
                  href={`/${orgSlug}/trainer/mobile/simulations/${learnerScore.simulation_id}/results`}
                  className='font-medium text-neutral-gray-600 hover:underline truncate lg:hidden'
                >
                  {learnerScore.user.full_name}
                </Link>
                <Link
                  href={`/${orgSlug}/trainer/simulations/${learnerScore.simulation_id}/results`}
                  className='font-medium text-neutral-gray-600 hover:underline truncate hidden lg:block'
                >
                  {learnerScore.user.full_name}
                </Link>
              </TableCell>
              <TableCell className='text-left px-6'>
                {hasFormUploaded ? Math.round(learnerScore.best_score) : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

export default LearnerScoresCard
