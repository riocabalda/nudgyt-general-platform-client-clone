import React from 'react'

const popularData = [
  {
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus ea dignissimos eos consequatur amet at natus nam. Amet error cumque laborum, recusandae, sit, voluptatibus minima neque id sequi qui harum.',
    value: '1,234'
  },
  {
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum, voluptatibus debitis sapiente consequuntur perspiciatis quaerat minima similique recusandae nesciunt. Esse distinctio praesentium deleniti cupiditate alias saepe sit molestias, culpa illo.',
    value: '15.2m'
  },
  {
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos.',
    value: 'Chat'
  },
  {
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos.',
    value: '2PM'
  }
]

function PopularSection() {
  return (
    <div className='bg-white rounded-none lg:rounded-lg p-6 flex flex-col justify-between'>
      <h5 className='text-xl font-semibold'>Popular</h5>
      <div className='grid grid-cols-12 gap-4 mt-4 lg:mt-0'>
        <div className='col-span-10 mb-2'>
          <h6 className='text-xs font-medium text-neutral-gray-800  uppercase tracking-widest'>
            Service
          </h6>
        </div>
        <div className='col-span-2 flex justify-end mb-2'>
          <h6 className='text-xs font-medium text-neutral-gray-800  uppercase tracking-widest'>
            Learners
          </h6>
        </div>

        {popularData.map((item) => (
          <>
            <div className='col-span-10'>
              <p className='text-sm text-neutral-gray-600 truncate'>
                {item.description}
              </p>
            </div>
            <div className='col-span-2 flex justify-end'>
              <p className='text-sm text-neutral-gray-600 text-left'>
                {item.value}
              </p>
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

export default PopularSection
