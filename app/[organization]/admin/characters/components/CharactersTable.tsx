import FetchError from '@/app/(shared)/components/FetchError'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/(shared)/components/ui/avatar'
import { Card } from '@/app/(shared)/components/ui/card'
import { ScrollBar } from '@/app/(shared)/components/ui/scroll-area'
import { ScrollArea } from '@/app/(shared)/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/app/(shared)/components/ui/table'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { Character } from '@/app/(shared)/services/admin/characterService'
import { cn, generateAvatarInitials } from '@/app/(shared)/utils'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'

function UsersTableScrollArea(props: PropsWithChildren) {
  const { children } = props

  return (
    <ScrollArea
      scrollbar={
        <>
          <ScrollBar
            orientation='vertical'
            className='transition opacity-0 group-hover:opacity-100'
          />
          <ScrollBar
            orientation='horizontal'
            className='transition opacity-0 group-hover:opacity-100'
          />
        </>
      }
      className={cn(
        '[&_[data-radix-scroll-area-viewport]]:max-h-[600px] [&_[data-radix-scroll-area-viewport]]:flex',
        'group'
      )}
    >
      {children}
    </ScrollArea>
  )
}

function CharactersTable({
  characters,
  isLoading,
  error
}: {
  characters: Character[]
  isLoading: boolean
  error: any
}) {
  const router = useRouter()
  const { orgSlug } = useOrganization()

  const handleCharacterDetails = (characterId: string) => {
    router.push(`/${orgSlug}/admin/characters/${characterId}`)
  }

  return (
    <UsersTableScrollArea>
      <Card
        className={cn(
          'overflow-hidden border-none rounded-none lg:rounded-sm',
          isLoading && 'opacity-50'
        )}
      >
        <div className='overflow-auto'>
          <Table>
            <TableHeader className='bg-white'>
              <TableRow className='hover:bg-inherit border-b-[1px] border-b-gray-300'>
                <TableHead className='sticky top-0 px-4 py-2 font-semibold text-foreground  text-nowrap w-full max-w-[45%]'>
                  Character
                </TableHead>
                <TableHead className='sticky top-0 px-4 py-2 font-semibold text-foreground  text-nowrap'>
                  Created
                </TableHead>
                <TableHead className='sticky top-0 px-4 py-2 font-semibold text-foreground  text-nowrap'>
                  Created By
                </TableHead>
                <TableHead className='sticky top-0 px-4 py-2 font-semibold text-foreground  text-nowrap'>
                  Services
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='[&>*:nth-child(even)]:bg-muted border-b table-fixed'>
              {error && (
                <TableRow>
                  <TableCell className='text-center' colSpan={4}>
                    <FetchError errorMessage={error?.message} />
                  </TableCell>
                </TableRow>
              )}
              {isLoading ? (
                <TableRow>
                  <TableCell className='text-center' colSpan={4}>
                    <Loader className='w-4 h-4 mx-auto animate-spin' />
                  </TableCell>
                </TableRow>
              ) : characters && characters?.length ? (
                characters.map((character: Character) => (
                  <TableRow key={character._id} className='py-0 border-0'>
                    <TableCell className='py-2'>
                      <div className='flex items-center'>
                        <Avatar
                          className='size-10 mr-6 cursor-pointer'
                          onClick={() => handleCharacterDetails(character._id)}
                        >
                          <AvatarImage
                            src={(character.avatar as unknown as string) || ''}
                            alt={character.name}
                            className='object-cover bg-muted'
                          />
                          <AvatarFallback>
                            {generateAvatarInitials(character.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className='text-base font-semibold text-nowrap cursor-pointer hover:underline'
                          onClick={() => handleCharacterDetails(character._id)}
                        >
                          {character.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='py-2 text-nowrap'>
                      {character.createdAt}
                    </TableCell>
                    <TableCell className='py-2 text-nowrap'>
                      {character.createdBy}
                    </TableCell>
                    <TableCell className='py-2'>
                      {character.serviceCount}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className='text-center' colSpan={9}>
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </UsersTableScrollArea>
  )
}

export default CharactersTable
