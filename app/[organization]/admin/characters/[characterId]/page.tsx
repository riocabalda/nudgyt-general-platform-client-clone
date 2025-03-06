'use client'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import CharacterDetails from './components/CharacterDetails'
import CharacterOptionMenu from './components/CharacterOptionMenu'

function CharactersPage() {
  return (
    <RequireAuth role={[roles.admin, roles.superadmin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Character Details' />}
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Character Details'
            showBackBtn
            slotEnd={<CharacterOptionMenu />}
          />
        }
      >
        <div className='container px-4 lg:px-[40px] space-y-6 mt-4 lg:mt-0'>
          <CharacterDetails />
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default CharactersPage
