import USER_JSON from '../../fixtures/auth/me/success/learner.json'
type Role = Parameters<typeof cy.login>[0]
const BACKEND_URL = Cypress.env('apiBaseUrl')

function interceptUserData(id: string) {
  cy.intercept('GET', `${BACKEND_URL}/system/admin/users/${id}`, (req) => {
    req.reply({
      statusCode: 200,
      body: USER_JSON
    })
  }).as('getUser')
}

function interceptUsersListData(params: string) {
  cy.intercept('GET', `${BACKEND_URL}/admin/users?${params || ''}`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
        data: [
          {
            _id: '1',
            full_name: 'John Doe',
            role: 'admin',
            created_at: '2021-01-01T00:00:00Z',
            approved_at: '2021-01-01T00:00:00Z',
            email: 'john.doe@example.com'
          },
          {
            _id: '2',
            full_name: 'Jane Smith',
            role: 'trainer',
            created_at: '2021-02-01T00:00:00Z',
            approved_at: '2021-02-01T00:00:00Z',
            email: 'jane.smith@example.com'
          }
        ],
        from: 1,
        to: 2,
        total: 2,
        prev_page: null,
        next_page: null,
        current_page: 1
      }
    })
  }).as('getUsers')
}

function authenticateUser(role: Role) {
  cy.intercept('GET', `${BACKEND_URL}/auth/me`, {
    fixture: `auth/me/success/${role}.json`
  })
}

function fetchUserDetails(userId: string) {
  cy.intercept('GET', `${BACKEND_URL}/admin/users/${userId}`, {
    fixture: `auth/me/success/system/super-admin.json`
  })
}

function fetchNormalUserDetails(userId: string) {
  cy.intercept('GET', `${BACKEND_URL}/admin/users/${userId}`, {
    fixture: `auth/me/success/learner.json`
  })
}

function fetchRecentServices(userId: string) {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/system/admin/users/${userId}/recent-services`,
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

function fetchPageData(userId: string = '1', role: Role = 'super-admin') {
  authenticateUser(`system/${role}`)
  authenticateUser(`system/${role}`)
  interceptUserData(userId)
  fetchLearnerExperience(userId)
  authenticateUser(`system/${role}`)
  interceptUsersListData('')
  fetchNormalUserDetails(userId)
  fetchRecentServices(userId)
  interceptUsersListData('')
}

function fetchLearnerExperience(userId: string) {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/system/admin/users/${userId}/learner-experience`,
    {
      statusCode: 200,
      body: {
        data: {
          userId: userId,
          name: 'John Doe',
          tier: 'silver',
          experience: 1500,
          nextLevelExp: 3000,
          expUntilNextLevel: 1500,
          nextTier: 'gold',
          status: 'Competent'
        }
      }
    }
  )
}

function testLearnerExperience(userId: string, isMobile: boolean = false) {
  it('Displays learner experience correctly', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    cy.visit(`/system/admin/users/${userId}`)

    fetchPageData(userId)

    // Mock API response for users data

    // Wait for the learner experience data to be loaded
    cy.url().should('include', `/admin/users/${userId}`)
    // Check if the learner experience details are displayed correctly
    cy.get('h3').contains(USER_JSON.data.full_name).should('be.visible')
    cy.get('p').contains('silver').should('be.visible')
    cy.get('h1').contains('1,500 XP').should('be.visible')
    cy.get('p').contains('Competent').should('be.visible')
    cy.get('p').contains('1,500 / 3,000 XP').should('be.visible')
    cy.get('p').contains('1,500 XP until gold').should('be.visible')
  })
}

function testUserProfileAccess() {
  it('Can access user profile with valid user ID', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    cy.visit(`/system/admin/users/${USER_JSON.data._id}`)

    fetchPageData(USER_JSON.data._id)
    // // Wait for the user details to be loaded
    // Check if the user details are displayed correctly
    cy.get('p').contains(USER_JSON.data.email).should('be.visible')
    cy.get('p').should('contain', 'Jan 01, 1970, 08:00 AM')
    cy.get('p').should('contain', '4')
  })

  it('Redirects to users list when accessing a non-existent user profile', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    cy.visit(`/system/admin/users/${USER_JSON.data._id}`)

    fetchPageData(USER_JSON.data._id)

    // Attempt to visit a non-existent user profile
    cy.visit('/system/admin/users/999')

    // Intercept the API call for user details with a non-existent user
    cy.intercept('GET', `${BACKEND_URL}/system/admin/users/999`, {
      statusCode: 404,
      body: {
        error: 'User not found'
      }
    }).as('getUserDetails')

    // Check that the URL is redirected to the users list
    cy.url().should('include', '/system/admin/users')
  })
}

function testRecentServicesSection() {
  it('It should render user recent services on the user profile page', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    cy.visit(`/system/admin/users/${USER_JSON.data._id}`)

    fetchPageData(USER_JSON.data._id)

    // Check if the recent services are displayed correctly
    cy.intercept(
      'GET',
      `${BACKEND_URL}/system/admin/users/user_id/recent-services`,
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

    // TODO: Add assertions for Recent Services section once ServiceCard is implemented
    // cy.get('.mt-10').contains('Recent Services').should('be.visible')
    // cy.get('.mt-10')
    //   .contains('Managing Difficult Customer Conversations')
    //   .should('be.visible')
    // cy.get('.mt-10').contains('CREATED').should('be.visible')
    // cy.get('.mt-10').contains('Mar 21, 2024, 02:30 AM').should('be.visible')
  })

  it('Should not display user recent services section for unauthorized user', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)

    // Visit the user profile page
    cy.visit('/system/admin/users/user_id')

    // Check if the Recent Services section is not visible
    cy.get('.mt-10').should('not.exist')
  })
}

describe('User Profile Access', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080) // 16:9 1080p display
  })

  testUserProfileAccess()
  testRecentServicesSection()
  testLearnerExperience(USER_JSON.data._id)
})

describe('User Profile Access Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-se2')
  })

  testUserProfileAccess()
  testRecentServicesSection()
  testLearnerExperience(USER_JSON.data._id, true)
})
