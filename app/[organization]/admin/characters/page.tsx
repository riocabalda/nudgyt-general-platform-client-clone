'use client'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import Search from '@/app/(shared)/components/Search'
import { roles } from '@/app/(shared)/services/userService'
import CharactersTable from './components/CharactersTable'
import FilterPopover from './components/FilterPopover'
import Pagination from '@/app/(shared)/components/Pagination'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useSWR from 'swr'
import characterService from '@/app/(shared)/services/admin/characterService'
import { useSearchParams } from 'next/navigation'

function CharactersPage() {
  const { orgSlug } = useOrganization()
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')
  const filterByGender = Array.from(searchParams.entries())
    .filter(([key]) => key.startsWith('gender[')) // Filter for gender parameters
    .map(([, value]) => value) // Extract the values
  const filters: { [key: string]: string[] } = {}

  if (filterByGender.length > 0) {
    filters.gender = filterByGender
  }

  const buildQueryParams = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (page) params.set('page', page)
    if (limit) params.set('limit', limit)
    if (Object.keys(filters).length > 0) {
      params.set('filter', JSON.stringify(filters))
    }
    return params.toString()
  }

  const {
    data: characters,
    isLoading,
    error
  } = useSWR(
    `${orgSlug}/trainer/characters/paginated?${buildQueryParams()}`,
    () =>
      characterService
        .getPaginatedCharacters(orgSlug, buildQueryParams())
        .then((res) => res.data.data)
  )

  const filterGroups = [
    {
      title: 'GENDER',
      filters: [
        { id: 'male', label: 'Male', value: 'MALE' },
        { id: 'female', label: 'Female', value: 'FEMALE' }
      ]
    }
  ]

  const paramKeys = {
    GENDER: 'gender'
  }

  return (
    <RequireAuth role={[roles.admin, roles.superadmin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Characters' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Characters' />}
      >
        <div className='container px-4 lg:px-[40px] mt-4 lg:mt-0'>
          <div className='flex gap-2 lg:gap-10 items-center'>
            <div className='flex items-center gap-4 w-full lg:w-auto'>
              <Search containerClass='lg:w-full xl:w-[344px]' />
            </div>
            <div className='hidden lg:block'>
              <Pagination
                from={characters?.from}
                to={characters?.to}
                total={characters?.total}
                prev={characters?.prev ?? undefined}
                next={characters?.next ?? undefined}
                currentPage={characters?.current_page || 1}
              />
            </div>
            <div className='grid place-items-end ml-auto'>
              <FilterPopover
                filterGroups={filterGroups}
                paramKeys={paramKeys}
              />
            </div>
          </div>
          <div className='mt-6'>
            <CharactersTable
              characters={characters?.data || []}
              isLoading={isLoading}
              error={error}
            />
          </div>
          <div className='lg:hidden mt-4 flex justify-end'>
            <Pagination
              from={characters?.from}
              to={characters?.to}
              total={characters?.total}
              prev={characters?.prev ?? undefined}
              next={characters?.next ?? undefined}
              currentPage={characters?.current_page || 1}
            />
          </div>
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default CharactersPage
