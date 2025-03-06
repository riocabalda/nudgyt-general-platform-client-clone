import OrganizationUsersInfiniteScroll from './_mobile/OrganizationUsersInfiniteScroll'
import OrganizationUsersTableView from './OrganizationUsersTableView'

function MobileContent() {
  return <OrganizationUsersInfiniteScroll />
}

function DesktopContent() {
  return (
    <div className='pt-6'>
      <OrganizationUsersTableView />
    </div>
  )
}

function OrganizationContent() {
  return (
    <>
      <div className='hidden lg:block'>
        <DesktopContent />
      </div>

      <div className='lg:hidden'>
        <MobileContent />
      </div>
    </>
  )
}

export default OrganizationContent
