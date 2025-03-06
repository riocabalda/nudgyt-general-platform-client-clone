'use client'
import SimulationSection from './SimulationSection'

export default function LearnerXPContainer() {
  // const { orgSlug } = useOrganization()
  // const { data: experience } = useSWR(
  //   `/${orgSlug}/learner/users/experience`,
  //   () => dashboardService.getExperience(orgSlug).then((res) => res.data)
  // )

  return (
    <div>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* <LearnerXPSection {...experience?.data} /> */}
        <SimulationSection />
      </div>
    </div>
  )
}
