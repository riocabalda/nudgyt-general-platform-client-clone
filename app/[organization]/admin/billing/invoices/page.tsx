import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import Pagination from '@/app/(shared)/components/Pagination'
import { roles } from '@/app/(shared)/services/userService'
import { cn } from '@/app/(shared)/utils'
import { Button } from '@/app/(shared)/components/ui/button'
import { INVOICES } from '../components/data'

function Invoices() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Invoices' />}
        headerDesktop={
          <MainContainer.HeaderDesktop title='Invoices' showBackBtn />
        }
      >
        <div className='flex flex-col gap-6 items-center'>
          <div className='flex flex-col gap-6 w-full lg:max-w-[600px]'>
            <div className='py-[14px]'>
              <Pagination
                from={1}
                to={10}
                total={180}
                prev={undefined}
                next={undefined}
                currentPage={1}
              />
            </div>
            <div className='shadow-sm rounded-none lg:rounded-[8px] w-full lg:max-w-[600px] bg-white mb-10'>
              {INVOICES.map((invoice, index) => (
                <div
                  key={`invoice-${index}`}
                  className={cn(
                    'min-h-20 flex justify-between items-center gap-6 px-6',
                    index % 2 !== 0 && 'bg-neutral-100'
                  )}
                >
                  <div className='w-full flex flex-col gap-2'>
                    <p className='text-sm text-neutral-800'>{invoice.date}</p>
                    {invoice.date !== 'Upcoming' && (
                      <p className='text-sm text-neutral-600'>
                        {invoice.status} •{' '}
                        {invoice.status === 'Credited'
                          ? `(${invoice.currency} ${invoice.amount})`
                          : `${invoice.currency} ${invoice.amount}`}
                      </p>
                    )}
                  </div>
                  <Button variant='outline' size='sm' className='!py-2 !px-8'>
                    View invoice
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default Invoices
