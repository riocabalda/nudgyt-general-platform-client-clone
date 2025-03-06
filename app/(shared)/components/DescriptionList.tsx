import { PropsWithChildren, ReactNode } from 'react'

function DescriptionList(props: PropsWithChildren) {
  const { children } = props

  return <dl className='space-y-4 lg:space-y-1'>{children}</dl>
}

function DescriptionListItem(props: {
  title?: ReactNode
  description?: ReactNode
}) {
  const { title, description } = props

  if (description === undefined) {
    return null
  }

  return (
    <div className='flex flex-col lg:flex-row lg:justify-between lg:items-center lg:gap-4'>
      <dt className='text-neutral-gray-800 text-xs uppercase font-medium'>
        {title}
      </dt>

      <dd className='text-neutral-gray-600 text-sm'>{description}</dd>
    </div>
  )
}
DescriptionList.Item = DescriptionListItem

export default DescriptionList
