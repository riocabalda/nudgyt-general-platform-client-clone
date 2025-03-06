import LearnerXPSection from '@/app/(shared)/components/LearnerXPSection'
import LearnerXPContainer from '@/app/[organization]/learner/dashboard/components/LearnerXPContainer'
import SimulationSection from '@/app/[organization]/learner/dashboard/components/SimulationSection'
import { mount } from 'cypress/react'

describe('LearnerXPSection Component Tests', () => {
  const learnerXPData = {
    experience: 2500,
    tier: 'bronze',
    nextLevelExp: 5000,
    expUntilNextLevel: 2500,
    percentage: 50,
    nextTier: 'Silver',
    status: 'Beginner Learner',
    isFromLearner: true,
    fullname: 'Sarah Johnson',
    userType: 'learner',
    numberOfCases: 15
  }

  beforeEach(() => {
    mount(<LearnerXPSection {...learnerXPData} />)
  })

  it('should display the correct XP and tier', () => {
    cy.get('h1').contains('2,500 XP').should('be.visible')
    cy.get('p').contains('Beginner Learner').should('be.visible')
    cy.get('p').contains('bronze').should('be.visible')
  })

  it('should display the correct progress bar width', () => {
    cy.get('div.bg-gradient-to-r').should('have.attr', 'style', 'width: 50%;')
  })

  it('should display the correct next tier', () => {
    cy.get('p').contains('2,500 XP until Silver').should('be.visible')
  })
})

describe('LearnerXPSection Component Negative Tests', () => {
  beforeEach(() => {
    mount(
      <LearnerXPSection
        experience={0}
        tier='none'
        nextLevelExp={0}
        expUntilNextLevel={0}
        percentage={0}
        nextTier='None'
        status='No Status'
      />
    )
  })

  it('should not display incorrect XP and tier', () => {
    cy.get('h1').contains('2,500 XP').should('not.exist')
    cy.get('p').contains('Beginner Learner').should('not.exist')
    cy.get('p').contains('bronze').should('not.exist')
  })

  it('should not display incorrect next tier', () => {
    cy.get('p').contains('Next Tier: Gold').should('not.exist')
  })

  it('should not display incorrect number of cases', () => {
    cy.get('p').contains('Cases Completed: 20').should('not.exist')
  })
})

describe('SimulationSection Component Tests', () => {
  beforeEach(() => {
    mount(<SimulationSection />)
  })

  it('should display the correct simulation section title', () => {
    cy.get('h1').contains('Start a Simulation').should('be.visible')
  })

  it('should display the correct button text', () => {
    cy.get('button').contains('Choose Case').should('be.visible')
  })

  it('should display the correct simulation description', () => {
    cy.get('button')
      .contains('Choose a case to start your simulation journey.')
      .should('not.exist')
  })
})

describe('SimulationSection Component Negative Tests', () => {
  beforeEach(() => {
    mount(<SimulationSection />)
  })

  it('should not display incorrect button text', () => {
    cy.get('button').contains('Start Simulation').should('not.exist')
  })

  it('should not display incorrect simulation description', () => {
    cy.get('button').contains('Begin your adventure now!').should('not.exist')
  })
})

describe('LearnerXPContainer Component Tests', () => {
  beforeEach(() => {
    mount(<LearnerXPContainer />)
  })

  it('should display the correct welcome message', () => {
    cy.get('h4').contains('Welcome back, Lucy').should('be.visible')
  })

  it('should display the LearnerXPSection component', () => {
    cy.get('h1').contains('2,500 XP').should('be.visible')
  })

  it('should display the SimulationSection component', () => {
    cy.get('h1').contains('Start a Simulation').should('be.visible')
  })

  it('should display the correct user type', () => {
    cy.get('p').contains('User Type: learner').should('not.exist')
  })
})

describe('LearnerXPContainer Component Negative Tests', () => {
  beforeEach(() => {
    mount(<LearnerXPContainer />)
  })

  it('should not display incorrect welcome message', () => {
    cy.get('h4').contains('Welcome back, John').should('not.exist')
  })

  it('should not display incorrect LearnerXPSection data', () => {
    cy.get('h1').contains('5,000 XP').should('not.exist')
  })

  it('should not display incorrect SimulationSection data', () => {
    cy.get('h1').contains('End Simulation').should('not.exist')
  })

  it('should not display incorrect user type', () => {
    cy.get('p').contains('User Type: admin').should('not.exist')
  })
})
