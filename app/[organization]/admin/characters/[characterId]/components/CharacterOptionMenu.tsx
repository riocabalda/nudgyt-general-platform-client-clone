import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { Ellipsis } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

function CharacterOptionMenu() {
  const { characterId } = useParams()
  const { orgSlug } = useOrganization()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Ellipsis className='size-6 text-purple-shade-darkest2 cursor-pointer' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuGroup>
          <Link href={`/${orgSlug}/admin/characters/${characterId}/edit`}>
            <DropdownMenuItem className='cursor-pointer px-3 py-2 text-base'>
              Edit Character
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            className='cursor-not-allowed px-3 py-2 text-base text-gray-500'
            disabled
          >
            Delete Character
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default CharacterOptionMenu
