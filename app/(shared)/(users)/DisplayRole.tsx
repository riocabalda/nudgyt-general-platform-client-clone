import { OrganizationMembership } from '../services/userService'

function DisplayRole(props: { orgMembership?: OrganizationMembership }) {
  const { orgMembership } = props

  const firstOrgRole = orgMembership?.roles[0]

  const isOwner = orgMembership?.is_owner ?? false
  if (isOwner) {
    return (
      <>
        {firstOrgRole}{' '}
        <span className='text-muted-foreground text-xs select-none'>
          (Owner)
        </span>
      </>
    )
  }

  return firstOrgRole
}

export default DisplayRole
