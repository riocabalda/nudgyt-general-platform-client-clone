import { cn } from '../utils'

function UserRoleBadge({
  classname,
  role
}: {
  classname?: string
  role: string
}) {
  return (
    <p
      className={cn(
        'p-[6px] bg-neutral-gray-100 rounded-[4px] min-h-[8px] min-w-[50px] text-[11px] font-medium w-max uppercase leading-[.8]',
        classname
      )}
    >
      {role}
    </p>
  )
}
export default UserRoleBadge
