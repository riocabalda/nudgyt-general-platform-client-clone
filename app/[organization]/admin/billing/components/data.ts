type InvoiceStatus = 'Upcoming' | 'Paid' | 'Credited'

export const INVOICES: Array<{
  date?: string
  status?: InvoiceStatus
  amount?: number
  currency?: string
}> = [
  {
    date: 'Upcoming'
  },
  {
    date: 'November 15, 2024',
    status: 'Upcoming',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'October 15, 2024',
    status: 'Credited',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'September 15, 2024',
    status: 'Paid',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'August 15, 2024',
    status: 'Paid',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'July 15, 2024',
    status: 'Paid',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'June 15, 2024',
    status: 'Paid',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'May 15, 2024',
    status: 'Paid',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'April 15, 2024',
    status: 'Paid',
    amount: 200,
    currency: 'USD'
  },
  {
    date: 'March 15, 2024',
    status: 'Paid',
    amount: 200,
    currency: 'USD'
  }
]
