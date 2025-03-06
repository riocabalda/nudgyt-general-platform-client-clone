import { Checkbox } from '@/app/(shared)/components/ui/checkbox'

function FilterCheckbox({
  label,
  onChange,
  id,
  checked,
  disabled
}: {
  label: string
  onChange: (checked: boolean) => void
  id: string
  checked: boolean
  disabled?: boolean
}) {
  return (
    <div className='flex items-center space-x-2 '>
      <Checkbox
        id={id}
        onCheckedChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {label}
      </label>
    </div>
  )
}

export default FilterCheckbox
