import * as React from 'react'
import { cn } from '@/app/(shared)/utils'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

// Dynamic import for ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className='h-[200px] w-full bg-neutral-gray-100 animate-pulse rounded-sm' />
  )
})

// Default toolbar modules
const defaultModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold'],
    [{ list: 'ordered' }, { list: 'bullet' }]
  ]
}

// Default formats
const defaultFormats = ['bold', 'list', 'bullet']

export interface RichTextProps {
  value: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  isError?: boolean
  modules?: object
  formats?: string[]
  readOnly?: boolean
  height?: string
}

const RichText = React.forwardRef<HTMLDivElement, RichTextProps>(
  (
    {
      className,
      value,
      onChange,
      placeholder = 'Start typing...',
      isError,
      modules = defaultModules,
      formats = defaultFormats,
      readOnly = false,
      ...props
    },
    ref
  ) => {
    const effectiveModules = readOnly ? { toolbar: false } : modules
    return (
      <div
        ref={ref}
        className={cn('relative', isError && 'quill-error', className)}
      >
        <ReactQuill
          theme={readOnly ? 'bubble' : 'snow'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          modules={effectiveModules}
          formats={formats}
          readOnly={readOnly}
          className={cn(
            'h-full flex flex-col',
            'rounded-sm',
            '[&_.ql-toolbar]:border-input [&_.ql-toolbar]:bg-white [&_.ql-toolbar]:rounded-t-sm',
            '[&_.ql-container]:border-input [&_.ql-container]:bg-white [&_.ql-container]:rounded-b-sm',
            '[&_.ql-editor]:text-sm [&_.ql-editor]:lg:text-base',
            '[&_.ql-editor]:prose [&_.ql-editor]:max-w-none [&_.ql-editor]:bg-white',
            '[&_.ql-editor_p]:!my-0',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            'disabled:cursor-not-allowed disabled:bg-neutral-gray-100 disabled:text-muted-foreground',
            isError &&
              '[&_.ql-toolbar]:border-destructive [&_.ql-container]:border-destructive',
            readOnly && 'quillReadOnly'
          )}
          {...props}
        />
      </div>
    )
  }
)

RichText.displayName = 'RichText'

export { RichText }
