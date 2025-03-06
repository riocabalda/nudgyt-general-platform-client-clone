import React from 'react'
import { Card } from '@/app/(shared)/components/ui/card'
import { OldSubscription } from '@/app/(shared)/services/admin/subscriptionService'
import EditSubscriptionModal from './EditSubscriptionModal'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.bubble.css'
import DOMPurify from 'dompurify'

function SubscriptionCard({ subscription }: { subscription: OldSubscription }) {
  const { name, features, price, time } = subscription
  return (
    <Card className='flex flex-col overflow-hidden p-6 rounded-[8px] min-h-[300px]'>
      <header>
        <p className='text-sm text-muted-foreground'>
          {price === '0' ? 'Free' : `${price} / ${time}`}
        </p>
        <h1 className='text-base font-medium lg:text-2xl text-foreground'>
          {name}
        </h1>
      </header>
      <div className='flex-1 mt-4'>
        <ReactQuill
          className='block quillReadOnly text-muted-foreground list-no-indent'
          theme='bubble'
          readOnly={true}
          value={DOMPurify.sanitize(features, {
            ADD_ATTR: ['target']
          })}
        />
      </div>
      <EditSubscriptionModal subscription={subscription} />
    </Card>
  )
}

export default SubscriptionCard
