import { Card } from '@/app/(shared)/components/ui/card'

const POPULAR_SERVICES = [
  {
    title: 'Magna amet magna volutpat nec ut rutrum',
    learners: 218
  },
  {
    title: 'Placerat tristique ipsum sit nullam',
    learners: 201
  },
  {
    title: 'Venenatis ultrices nec enim augue turpis',
    learners: 196
  },
  {
    title: 'Eget turpis sed eu etiam ultricies',
    learners: 145
  }
]

function PopularServices() {
  return (
    <Card className='p-6 w-full xl:w-1/2'>
      <div className='space-y-6'>
        <h1 className='text-lg lg:text-xl text-neutral-900 font-semibold'>
          Popular Services
        </h1>
        <div className='grid grid-cols-4 gap-4'>
          <h5 className='text-sm lg:text-base col-span-3 font-semibold'>
            Service
          </h5>
          <h5 className='text-sm lg:text-base col-span-1 text-right font-semibold'>
            Learners
          </h5>
          {POPULAR_SERVICES.map((service) => (
            <>
              <p className='text-sm lg:text-base col-span-3'>
                Scenario {service.title}
              </p>
              <p className='text-sm lg:text-base col-span-1 text-right'>
                {service.learners}
              </p>
            </>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default PopularServices
