import { ComponentProps } from 'react'
import { cn } from '../utils'
import Navigations from './Navigations'

function SidebarSection(props: {
  title: string
  data: ComponentProps<typeof Navigations>['navs']
  className?: string
}) {
  const { title, data, className } = props

  if (data.length === 0) {
    return null
  }

  return (
    <>
      <p
        className={cn('text-sm font-bold mt-[40px] mb-2 uppercase', className)}
      >
        {title}
      </p>
      <Navigations navs={data} />
    </>
  )
}

export default SidebarSection
