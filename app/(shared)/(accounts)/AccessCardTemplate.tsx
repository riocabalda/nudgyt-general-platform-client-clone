import DOMPurify from 'dompurify'
import { ReactNode } from 'react'
import { Card } from '../components/ui/card'
import { cn } from '../utils'

/** Can move common definitions below to this */
function AccessCardTemplate() {
  return null
}

function AccountAccessCardTemplate(props: {
  title: ReactNode
  featuresHtml: string[]
  body?: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const { title, featuresHtml } = props
  const { body, footer } = props
  const { className } = props

  if (featuresHtml.length === 0) {
    return null
  }

  return (
    <Card
      className={cn(
        'rounded-none lg:rounded-[8px] flex flex-col gap-4 lg:gap-6',
        'px-4 py-10 lg:px-20',
        className
      )}
    >
      <h3
        className={cn(
          'text-neutral-gray-800 font-semibold text-lg lg:text-xl',
          'text-center'
        )}
      >
        {title}
      </h3>

      {body}

      <div className='[&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1'>
        <ul>
          {featuresHtml.map((html, idx) => (
            <li key={idx} className='text-neutral-gray-600 text-sm'>
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
              />
            </li>
          ))}
        </ul>
      </div>

      {footer}
    </Card>
  )
}
AccessCardTemplate.Account = AccountAccessCardTemplate

function UpgradeAccessCardTemplate(props: {
  title: ReactNode
  featuresHtml: string[]
  body?: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const { title, featuresHtml } = props
  const { body, footer } = props
  const { className } = props

  if (featuresHtml.length === 0) {
    return null
  }

  return (
    <Card
      className={cn(
        'rounded-none lg:rounded-[8px] flex flex-col gap-4 lg:gap-6',
        'p-6',
        className
      )}
    >
      <h3
        className={cn('text-neutral-gray-800 font-semibold text-lg lg:text-xl')}
      >
        {title}
      </h3>

      {body}

      <div className='[&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1'>
        <ul>
          {featuresHtml.map((html, idx) => (
            <li key={idx} className='text-neutral-gray-600 text-sm'>
              <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
              />
            </li>
          ))}
        </ul>
      </div>

      {footer}
    </Card>
  )
}
AccessCardTemplate.Upgrade = UpgradeAccessCardTemplate

export default AccessCardTemplate
