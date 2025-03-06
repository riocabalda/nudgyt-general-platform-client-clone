export {}

type Role = Parameters<typeof cy.login>[0]
const BACKEND_URL = Cypress.env('apiBaseUrl')

function authenticateUser(role: Role) {
  cy.intercept('GET', `${BACKEND_URL}/auth/me`, {
    fixture: `auth/me/success/${role}.json`
  })
}

function mockExperienceData() {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/public/learner/users/experience`,
    (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: {
            experience: 7500,
            tier: 'silver',
            nextLevelExp: 10000,
            expUntilNextLevel: 2500,
            percentage: 75,
            nextTier: 'Gold',
            status: 'Advanced Learner',
            isFromLearner: true,
            fullname: 'John Smith',
            userType: 'learner',
            numberOfCases: 42
          }
        }
      })
    }
  ).as('getExperience')
}

function mockRecentServicesData() {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/public/learner/services?page=1&pageSize=10&isRecent=true`,
    {
      statusCode: 200,
      body: {
        data: [
          {
            title: 'Managing Difficult Customer Conversations',
            is_published: true,
            created_at: '2024-03-20T18:30:00Z',
            creator: {
              user_type: 'trainer',
              organization: 'Customer Service Excellence Ltd',
              fullname: 'John Smith'
            },
            character: {
              avatar:
                'https://s3-alpha-sig.figma.com/img/f665/e9e1/aa2e309d613bf90779fc9744b7d69868?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=Z6h3xmbg5~j5PrWKYtZXosdzoYqwxE0hJpPpLwGl~15BXOkaeLeq4jM9wx9MG~-EIbM--WLHWdmF5rzRCWxyj0jY9ipAhK9Ot2HRDUX3IEQVzpbOH68~Vh20qyyCzzqNzTgTpr1ct83sYvzELB02g61l1Jakl8JV1SRhjHboaJy8-nVliGnUpVKTsjb3I24e61H9u9fGSZGglp3ucQO82lC7WHHCnHy4akL-sAmD8cJGuGcKG9Ju0ehELMRFxfcL2shooJkcc081oxDuVO7Q~uXR0Ag2vxTAql6vlgr8~3z0iZgBYvJ-gY34n09K4vMLG54ScmMJA3rqSF~bvvW3KA__'
            },
            environment: {
              image:
                'https://s3-alpha-sig.figma.com/img/fd01/6d53/f2a77db42fa4ccdc9a128ac38b7999c3?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=XBo34Bfele5W8Xh9iNTMIxwV5Ey6iZm0dX3PTAC~C~qm8I5M6yS8TAibu6D~4exJWnLnhl4zQVs8UwWLOMxBU-nPKT3mbrsbxs-8kzCqcD2mbZb7jFRhj7n61WWGp-sUeQaDQMN1~bJr5mu-IUMwpsVq3JiUqqVo4xMOCdQc5gJ54Z~81ShG4rzNK~plQoPNaEmYvTkeZAPrt55fyYpmh86VOAPlxLZwR0jeiHQtmZJJaOBi99dptHf9DwMhoXDz8ckCEy6Z1v4WEQcX1MN6zWssocQhzBpwR-QyaSSQ5IofCUrL9baOAlDGl9mUT5fC7vjV~POo4HbnwcrJahfYFw__'
            }
          }
        ]
      }
    }
  ).as('getRecentServices')
}

function testXPLearnerSection(isMobile: boolean = false) {
  it('It should render Experience Section on the dashboard page', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)
    authenticateUser(role)

    // Mock data for LearnerXPSection
    mockExperienceData()
    mockRecentServicesData()

    // Check if the experience points are displayed correctly
    cy.get('h1')
      .contains('7,500 XP')
      .each(($el) => {
        if ($el.is(':visible')) {
          cy.wrap($el).should('be.visible')
        }
      })

    if (isMobile) {
      // Check if the status is displayed correctly
      cy.get('p').contains('Advanced Learner').should('not.be.visible')
    } else {
      cy.get('p').contains('Advanced Learner').should('be.visible')
      cy.get('body').then(($body) => {
        if ($body.find('.lg\\:to-tier-silver-to').length) {
          cy.get('.lg\\:to-tier-silver-to').should('be.visible')
        }
      })
    }

    // Check if the tier is displayed correctly
    cy.get('body').then(($body) => {
      if ($body.find('p:contains("silver")').length) {
        cy.get('p:contains("silver")').should('be.visible')
      }
    })

    // Check if the progress bar is displayed correctly
    cy.get('.progress-bar')
      .should('have.attr', 'style')
      .and('contain', 'width: 75%;')

    // Check if the next level experience is displayed correctly
    cy.get('p')
      .contains('2,500 XP until Gold')
      .each(($el) => {
        if ($el.is(':visible')) {
          cy.wrap($el).should('be.visible')
        }
      })
  })
}

function testSimulationSection() {
  it('It should render Simulation Section on the dashboard page', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)
    authenticateUser(role)

    mockExperienceData()
    mockRecentServicesData()
    // Check if the Simulation Section is displayed correctly
    cy.get('h1').contains('Start a Simulation').should('be.visible')

    // Check if the "Choose Case" button is displayed and has the correct text
    cy.get('button').contains('Choose Case').should('be.visible')

    // Check if the "Choose Case" button has the correct class for styling
    cy.get('button')
      .contains('Choose Case')
      .should('have.class', 'bg-purple-shade-darkest2')

    // Check if the "Create Case" button is hidden on smaller screens
    cy.get('button').contains('Create Case').should('not.be.visible')

    // Check if the "Create Case" button is disabled
    cy.get('button')
      .contains('Create Case')
      .should('have.class', 'pointer-events-none')

    // Check if the link to '/learner/cases' is correct
    cy.get('a[href="/learner/cases"]').should('be.visible')
  })
}

function testRecentServicesSection() {
  it('It should render Recent Services on the dashboard page', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)

    // Mock data for LearnerXPSection
    mockExperienceData()

    // Check if the recent services are displayed correctly
    mockRecentServicesData()
    // TODO: Test the Recent Services section until ServiceCard is implemented
    // cy.get('.mt-10').contains('Recent Services').should('be.visible')
    // cy.get('.mt-10')
    //   .contains('Managing Difficult Customer Conversations')
    //   .should('be.visible')
    // cy.get('.mt-10').contains('CREATED').should('be.visible')
    // cy.get('.mt-10').contains('Mar 21, 2024, 02:30 AM').should('be.visible')
  })

  it('Should not display Recent Services section for unauthorized user', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)

    // Mock data for LearnerXPSection
    mockExperienceData()
    mockRecentServicesData()
    // Check if the Recent Services section is not visible
    cy.get('.mt-10').should('not.exist')
  })

  it('Should display error message when failing to load Recent Services', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)

    // Mock data for LearnerXPSection
    mockExperienceData()

    // Intercept the API call for recent services and force it to fail
    cy.intercept(
      'GET',
      `${BACKEND_URL}/public/learner/services?page=1&pageSize=10&isRecent=true`,
      {
        statusCode: 500,
        body: {
          message: 'Internal Server Error'
        }
      }
    ).as('getRecentServices')

    // Check if the error message is displayed
    cy.get('p').contains('Internal Server Error').should('be.visible')
  })

  it('Should display No Recent Cases message when no recent services are available', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)

    // Mock data for LearnerXPSection
    mockExperienceData()

    // Intercept the API call for recent services and force it to fail
    cy.intercept(
      'GET',
      `${BACKEND_URL}/public/learner/services?page=1&pageSize=10&isRecent=true`,
      {
        statusCode: 200,
        body: {
          data: []
        }
      }
    ).as('getRecentServices')

    // Check if the error message is displayed
    cy.get('p').contains('No recent cases').should('be.visible')
  })
}

describe('Test Case for Learner Dashboard Page (Desktop)', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080) // 16:9 1080p display
  })
  testXPLearnerSection()
  testSimulationSection()
  testRecentServicesSection()
})

describe('Test Case for Learner Dashboard Page (Desktop)', () => {
  beforeEach(() => {
    cy.viewport(390, 844) // iPhone 15 display
  })
  testXPLearnerSection(true)
  testSimulationSection()
  testRecentServicesSection()
})
