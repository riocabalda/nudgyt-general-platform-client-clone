'use client'

import { Loader } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog'
import useInvitations from '../hooks/useInvitations'
import useOrganization from '../hooks/useOrganization'
import useUser from '../hooks/useUser'
import organizationService from '../services/organizationService'
import { OrganizationMembership } from '../services/userService'
import { cn, getRoleSlug, replaceSlugs } from '../utils'
import NewOwnerInvitationCard from './NewOwnerInvitationCard'

function DeclineInvitationModal(props: { membership: OrganizationMembership }) {
  const { membership } = props
  const { mutateUser } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const newOrgName = membership.organization.name
  const newOrgSlug = membership.organization.slug

  async function decline() {
    setIsSubmitting(true)
    try {
      await organizationService.updateInvitation(newOrgSlug, membership._id, {
        action: 'decline'
      })
      await mutateUser()
      setIsModalOpen(false)

      toast.success(`Invitation to ${newOrgName} declined`)
    } catch (error) {
      console.error(error)

      toast.error(`Failed declining invite to ${newOrgName}`)
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Decline</Button>
      </DialogTrigger>

      <DialogContent className='rounded-[8px] w-[90%] max-w-[600px] grid gap-4 lg:gap-6 p-4 lg:p-6'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold lg:text-2xl'>
            Decline Invitation
          </DialogTitle>

          <DialogDescription className='lg:text-base'>
            Are you sure you want to decline this invitation from{' '}
            <span className='font-bold'>{newOrgName}</span>?
          </DialogDescription>
        </DialogHeader>

        <footer className='grid lg:grid-cols-2 gap-4 lg:gap-6'>
          <DialogClose asChild>
            <Button variant='outline'>Go back</Button>
          </DialogClose>

          <Button
            disabled={isSubmitting}
            onClick={decline}
            className='w-full bg-primary-500 hover:bg-primary-500/90'
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                Declining...
              </>
            ) : (
              <>Decline</>
            )}
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  )
}

function MembershipInvitationCard(props: {
  newMembership: OrganizationMembership
}) {
  const { newMembership } = props
  const router = useRouter()
  const pathname = usePathname()
  const { mutateUser } = useUser()
  const { membership: currentMembership } = useOrganization()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentOrgSlug = currentMembership?.organization.slug
  const currentOrgFirstRole = currentMembership?.roles[0]

  const newOrgName = newMembership.organization.name
  const newOrgSlug = newMembership.organization.slug
  const newOrgFirstRole = newMembership.roles[0]

  async function acceptInvitation() {
    setIsSubmitting(true)
    try {
      if (currentOrgSlug === undefined || currentOrgFirstRole === undefined) {
        throw new Error('Required values not available')
      }

      await organizationService.updateInvitation(
        newOrgSlug,
        newMembership._id,
        { action: 'accept' }
      )
      await mutateUser()

      const newMembershipPathname = replaceSlugs(pathname, {
        [currentOrgSlug]: newOrgSlug,
        [getRoleSlug(currentOrgFirstRole)]: getRoleSlug(newOrgFirstRole)
      })
      router.push(newMembershipPathname)

      toast.success(`Invitation to ${newOrgName} accepted`)
    } catch (error) {
      console.error(error)

      toast.error(`Failed accepting invite to ${newOrgName}`)
    }
    setIsSubmitting(false)
  }

  return (
    <Card className='mx-4 lg:mx-0 rounded-[8px] px-6 py-10 lg:px-20 space-y-6 border-2 border-primary-500'>
      <h3 className='text-center text-neutral-gray-800 font-semibold text-2xl'>
        You&rsquo;ve been invited to join {newOrgName}
      </h3>

      <p className='text-neutral-gray-600 text-sm'>
        As part of this organization, you&rsquo;ll gain access to exclusive
        tools and resources, including AI-powered services tailored for your
        organization.
      </p>

      <footer className='grid lg:grid-cols-2 gap-4'>
        <DeclineInvitationModal membership={newMembership} />

        <Button
          onClick={acceptInvitation}
          disabled={isSubmitting}
          className='w-full bg-primary-500 hover:bg-primary-500/90'
        >
          {isSubmitting ? (
            <>
              <Loader className='w-4 h-4 mr-2 animate-spin' />
              Accepting...
            </>
          ) : (
            <>Accept invitation</>
          )}
        </Button>
      </footer>
    </Card>
  )
}

function InvitationCardList(props: { className?: string }) {
  const { className } = props
  const { hasInvitations, invitations, pendingOrganizations } = useInvitations()

  if (!hasInvitations) {
    return null
  }

  return (
    <ol className={cn(className)}>
      {pendingOrganizations.map((pendingOrganization, idx) => (
        <li key={idx}>
          <NewOwnerInvitationCard pendingOrganization={pendingOrganization} />
        </li>
      ))}

      {invitations.map((membership, idx) => (
        <li key={idx}>
          <MembershipInvitationCard newMembership={membership} />
        </li>
      ))}
    </ol>
  )
}

export default InvitationCardList
