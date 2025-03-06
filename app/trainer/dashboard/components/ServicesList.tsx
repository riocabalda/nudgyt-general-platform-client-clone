import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const ServicesList = () => {
  return (
    <div className='mt-10'>
      <div className='flex justify-between items-center'>
        <h3 className='text-2xl font-semibold'>Recent Services</h3>
        <Link
          href='#'
          className='flex items-center gap-2 text-purple-shade-darkest2'
        >
          View All <ArrowRight size={16} />
        </Link>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6'></div>
    </div>
  )
}

export default ServicesList
