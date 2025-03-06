import { invitationStatus, User } from '@/app/(shared)/services/userService'

describe('<UserDetails />', () => {
  it('renders with mock data', () => {
    const mockUser: User = {
      _id: '1',
      full_name: 'John Doe',
      created_at: '2021-01-01T00:00:00Z',
      email: 'john.doe@example.com',
      contact: '123-456-7890',
      archived_at: '',
      email_verified_at: '',
      deleted_at: '',
      trainings_count: 0,
      subscriptions_count: 0,
      subscriptions_with_active_courses_count: 0,
      organizations: [
        {
          _id: '1',
          organization: {
            _id: '1',
            name: 'Test Organization',
            slug: 'test-organization',

            approved_at: '2021-01-01T00:00:00Z'
          },
          roles: ['admin'],
          is_owner: false,

          status: invitationStatus.ACCEPTED,

          created_at: '2021-01-01T00:00:00Z',
          updated_at: '2021-01-01T00:00:00Z',
          slug: 'test-organization'
        }
      ] as any,
      last_logged_in_at: '2021-01-01T00:00:00Z'
    }

    cy.mount(<UserDetails user={mockUser} completedServices={4} />)

    cy.get('p').contains('john.doe@example.com').should('be.visible')
    cy.get('p').should('contain', 'Jan 01, 2021, 08:00 AM')
    cy.get('p').should('contain', '4')
  })
})

import LearnerXPSection from '@/app/(shared)/(users)/[userId]/LearnerXPSection'
import UserDetails from '@/app/(shared)/(users)/[userId]/UserDetails'

describe('<LearnerXPSection />', () => {
  it('renders with mock data', () => {
    const mockLearnerXP = {
      experience: 1500,
      tier: 'silver',
      nextLevelExp: 3000,
      expUntilNextLevel: 1500,
      percentage: 50,
      nextTier: 'gold',
      status: 'Competent',
      fullname: 'John Doe'
    }

    cy.mount(<LearnerXPSection {...mockLearnerXP} />)

    cy.get('h3').contains('John Doe').should('be.visible')
    cy.get('p').contains('silver').should('be.visible')
    cy.get('h1').contains('1,500 XP').should('be.visible')
    cy.get('p').contains('Competent').should('be.visible')
    cy.get('p').contains('1,500 / 3,000 XP').should('be.visible')
    cy.get('p').contains('1,500 XP until gold').should('be.visible')
  })
})
