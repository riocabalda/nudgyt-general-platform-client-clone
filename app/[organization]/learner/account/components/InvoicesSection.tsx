import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import { cn } from '@/app/(shared)/utils'
import { ArrowRight } from 'lucide-react'
import moment from 'moment-timezone'

type HardCodedInvoice = {
  id: string
  date: Date
  status: 'upcoming' | 'credited' | 'paid'
  amount: number
}
const HARD_CODED_INVOICES: HardCodedInvoice[] = [
  {
    id: crypto.randomUUID(),
    date: new Date(0),
    status: 'upcoming',
    amount: Infinity
  },
  {
    id: crypto.randomUUID(),
    date: new Date('October 15, 2024'),
    status: 'credited',
    amount: 200
  },
  {
    id: crypto.randomUUID(),
    date: new Date('September 15, 2024'),
    status: 'paid',
    amount: 200
  },
  {
    id: crypto.randomUUID(),
    date: new Date('August 15, 2024'),
    status: 'paid',
    amount: 200
  },
  {
    id: crypto.randomUUID(),
    date: new Date('July 15, 2024'),
    status: 'paid',
    amount: 200
  },
  {
    id: crypto.randomUUID(),
    date: new Date('June 15, 2024'),
    status: 'paid',
    amount: 200
  }
]

function formatInvoiceDate(date: Date): string {
  const dateStr = moment.utc(date).format('MMMM D, YYYY')

  return dateStr
}

function InvoiceListItemBody(props: { invoice: HardCodedInvoice }) {
  const { invoice } = props

  if (invoice.status === 'upcoming') {
    return <h4 className='text-sm text-neutral-gray-800'>Upcoming Invoice</h4>
  }

  return (
    <section className='space-y-2'>
      <h4 className='text-sm text-neutral-gray-800'>
        {formatInvoiceDate(invoice.date)}
      </h4>

      <ul className='text-sm text-neutral-gray-600 list-inside flex list-["\0000a0•\0000a0"] first:*:[list-style:none]'>
        {invoice.status === 'credited' && <li>Credited</li>}
        {invoice.status === 'paid' && <li>Paid</li>}
        <li>USD {invoice.amount}</li>
      </ul>
    </section>
  )
}

function InvoiceListItem(props: { invoice: HardCodedInvoice; idx: number }) {
  const { invoice, idx } = props

  const isOddIdx = idx % 2 !== 0

  return (
    <li
      className={cn(
        'min-h-20 flex items-center justify-between gap-6 px-6 py-4',
        isOddIdx && 'bg-neutral-gray-100'
      )}
    >
      <InvoiceListItemBody invoice={invoice} />

      <Button
        variant='outline'
        className='h-auto py-1 lg:w-40 lg:text-sm cursor-not-allowed'
      >
        View invoice
      </Button>
    </li>
  )
}

function InvoiceListCard() {
  return (
    <Card className='overflow-hidden rounded-none lg:rounded-[8px]'>
      <ol>
        {HARD_CODED_INVOICES.map((invoice, idx) => (
          <InvoiceListItem key={invoice.id} invoice={invoice} idx={idx} />
        ))}
      </ol>
    </Card>
  )
}

function SeeAllLink() {
  return (
    <Button
      variant='link'
      className={cn(
        'no-underline p-0 lg:p-0 h-auto',
        'text-primary-500 space-x-2 cursor-not-allowed'
      )}
    >
      <span>See All</span> <ArrowRight className='size-4' />
    </Button>
  )
}

function InvoicesSection() {
  return (
    <section className='w-full space-y-6'>
      <header className='flex justify-between items-baseline gap-4 px-4 lg:p-0'>
        <h2 className='font-semibold text-2xl'>Invoices</h2>

        <SeeAllLink />
      </header>

      <InvoiceListCard />
    </section>
  )
}

export default InvoicesSection
