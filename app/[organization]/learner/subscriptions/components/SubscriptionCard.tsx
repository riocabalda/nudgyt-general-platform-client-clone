import { Card } from '@/app/(shared)/components/ui/card'
import { cn } from '@/app/(shared)/utils'
import DOMPurify from 'dompurify'
import SelectSubscriptionModal from './SelectSubscriptionModal'
import { MockSubscription } from './Subscriptions'

function SubscriptionCard(props: {
  subscription: MockSubscription
  withFooter?: boolean
  className?: string
}) {
  const { subscription, withFooter = false, className } = props

  const hasRate = subscription.price !== null && subscription.time !== null

  return (
    <Card
      className={cn(
        'min-h-[230px] lg:min-h-[278px] flex flex-col gap-4 lg:gap-6 p-6',
        className
      )}
    >
      <header className='flex items-baseline justify-between gap-3'>
        <h2 className='font-semibold text-lg lg:text-xl text-neutral-gray-800'>
          {subscription.name}
        </h2>

        {!hasRate ? (
          <p className='text-sm text-neutral-gray-600 text-right'>Free</p>
        ) : (
          <p className='text-sm text-neutral-gray-600 text-right'>
            {subscription.price} / {subscription.time}
          </p>
        )}
      </header>

      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(subscription.features)
        }}
        className={cn(
          'text-neutral-gray-600',
          'text-sm lg:text-base',
          '[&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-5'
        )}
      ></div>

      {withFooter && (
        <footer className='mt-auto grid'>
          <SelectSubscriptionModal subscription={subscription} />
        </footer>
      )}
    </Card>
  )
}

export default SubscriptionCard
