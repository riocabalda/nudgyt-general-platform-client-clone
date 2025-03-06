'use client'

import { File, Upload } from 'lucide-react'
import { ChangeEvent, ComponentProps, ReactNode, useState } from 'react'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { cn } from '../../utils'

function InputFile({
  type,
  initialFilename,
  isError,
  onChange,
  id = 'inputFile',
  forceLabelText,
  ...otherProps
}: ComponentProps<'input'> & {
  initialFilename?: string
  isError?: boolean
  id?: string
  forceLabelText?: ReactNode
}) {
  const [fileName, setFileName] = useState(initialFilename || '')

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    if (input.files && input.files.length > 0) {
      const selectedFileName = input.files[0].name
      setFileName(selectedFileName)
    } else {
      setFileName('')
    }
    if (onChange) {
      onChange(event)
    }
  }
  return (
    <>
      <label
        htmlFor={id}
        className={cn(
          'h-[50px] flex justify-between items-center gap-3 w-full rounded-sm border border-input bg-white px-3 py-2 text-sm lg:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          isError && 'border-destructive'
        )}
      >
        {fileName && <File size={20} strokeWidth={1.5} />}
        <span className='flex-1 truncate'>
          {forceLabelText ?? (fileName ? fileName : 'Upload File')}
        </span>
        <Upload className='size-4 lg:size-[20px]' />
      </label>
      <input
        id={id}
        type='file'
        onChange={handleFileChange}
        {...otherProps}
        className='hidden'
      />
    </>
  )
}

/**
 * Mainly for use in shadcn/react-hook-form Form structures
 *
 * Makes file input uncontrolled by "unspecifying" the value prop,
 * and manually pass files to change handler
 *
 * It seems like react-hook-form's Controller always uses `event.target.value`
 *
 * https://github.com/shadcn-ui/ui/discussions/2137
 */
function InputFileRHF<T extends FieldValues>(props: {
  field: ControllerRenderProps<T>
}) {
  const { field } = props

  return (
    <InputFile
      {...field}
      accept='image/jpeg, image/png'
      ref={undefined} // Avoid improper ref passing
      value={undefined}
      onChange={(event) => {
        let files = event.target.files ?? undefined
        if (files?.length === 0) {
          files = undefined
        }

        field.onChange(files)
      }}
    />
  )
}
InputFile.RHF = InputFileRHF

export default InputFile
