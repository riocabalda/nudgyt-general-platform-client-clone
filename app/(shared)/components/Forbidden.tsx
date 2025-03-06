import Link from 'next/link'

function Forbidden() {
  return (
    <div className='flex items-center justify-center w-full min-h-[400px] text-center'>
      <div className='grid gap-4 px-4'>
        <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl'>
          Access Denied
        </h1>
        <p className='text-gray-500'>
          Sorry, you don&apos;t have access to this page.
        </p>
        <Link
          className='inline-flex items-center justify-center h-10 px-8 text-sm font-medium transition-colors bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300'
          href='/sign-in'
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}

export default Forbidden
