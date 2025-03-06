import { twMerge } from 'tailwind-merge'

function FetchError({
  errorMessage,
  className
}: {
  errorMessage?: string
  className?: string
}) {
  return (
    <p className={twMerge('py-4', className)}>
      {errorMessage || 'Something went wrong.'}
    </p>
  )
}

export default FetchError
