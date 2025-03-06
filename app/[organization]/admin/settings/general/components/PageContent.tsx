import AccessCard from './AccessCard'
import OrganizationProfile from './OrganizationProfile'
import PlatformOwner from './PlatformOwner'

function PageContent() {
  return (
    <div className='w-full lg:max-w-[600px] mx-auto space-y-10'>
      <OrganizationProfile />
      <PlatformOwner />

      <AccessCard />
    </div>
  )
}

export default PageContent
