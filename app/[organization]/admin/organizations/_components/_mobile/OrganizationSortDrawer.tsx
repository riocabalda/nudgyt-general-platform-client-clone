import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger
} from '@/app/(shared)/components/ui/drawer'
import { ArrowUpDown, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

function SortTrigger() {
  return (
    <DrawerTrigger asChild>
      <button className='w-full flex items-center justify-between p-3 text-foreground-800 hover:bg-muted'>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <ArrowUpDown size={20} />
            <span className='hidden absolute top-[-2.5px] right-[-2px] bg-brandcolora w-[10px] h-[10px] rounded-full' />
          </div>
          <span>Sort</span>
        </div>
        <ChevronRight size={20} />
      </button>
    </DrawerTrigger>
  )
}

function SortForm(props: { onSort: () => void }) {
  const { onSort } = props

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const getSortBy = searchParams.get('sortBy')
  const [sortBy, setSortBy] = useState(getSortBy ?? 'created_at')

  function changeSort(value: string) {
    setSortBy(value)

    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
    router.replace(`${pathname}?${params}`)

    onSort()
  }

  return (
    <form className='space-y-2'>
      {/* <label className='flex items-center gap-2'>
        <input
          type='radio'
          name='sortBy'
          value='status'
          checked={sortBy === 'status'}
          onChange={() => changeSort('status')}
        />
        <span>Status</span>
      </label> */}

      {/* <label className='flex items-center gap-2'>
        <input
          type='radio'
          name='sortBy'
          value='name'
          checked={sortBy === 'name'}
          onChange={() => changeSort('name')}
        />
        <span>Alphabetically</span>
      </label> */}

      <label className='flex items-center gap-2'>
        <input
          type='radio'
          name='sortBy'
          value='created_at'
          checked={sortBy === 'created_at'}
          onChange={() => changeSort('created_at')}
        />
        <span>Date Joined</span>
      </label>

      <label className='flex items-center gap-2 has-[:disabled]:opacity-50'>
        <input disabled type='radio' name='sortBy' value='services' />
        <span>Number of Services</span>
      </label>
    </form>
  )
}

function OrganizationSortDrawer(props: { onSort: () => void }) {
  return (
    <Drawer>
      <SortTrigger />

      <DrawerContent className='max-h-[90svh] pb-6 px-4 rounded-t-[28px] space-y-4'>
        <DrawerTitle className='font-semibold text-2xl'>Sort by:</DrawerTitle>
        <DrawerDescription className='sr-only'>
          Select organizations order
        </DrawerDescription>

        <SortForm onSort={props.onSort} />
      </DrawerContent>
    </Drawer>
  )
}

export default OrganizationSortDrawer
