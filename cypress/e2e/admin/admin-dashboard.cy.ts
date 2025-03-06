export {}

type Role = Parameters<typeof cy.login>[0]
const BACKEND_URL = Cypress.env('apiBaseUrl')

function authenticateUser(role: Role) {
  cy.intercept('GET', `${BACKEND_URL}/auth/me`, {
    fixture: `auth/me/success/${role}.json`
  })
}

function getMetrics() {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/system/admin/services/metrics?timeFrame=seven-days`,
    (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: [
            {
              label: 'Total Learners',
              value: '1,234',
              change: '12.5%',
              showTrend: true,
              isIncrease: true
            },
            {
              label: 'Total Passing Rate',
              value: '85%',
              change: '5.2%',
              showTrend: true,
              isIncrease: true
            },
            { label: 'Total Services', value: '24', showTrend: false },
            {
              label: 'Average Score',
              value: '78.5',
              change: '3.8%',
              showTrend: true,
              isIncrease: false
            }
          ]
        }
      })
    }
  )
}

function getPopularServices() {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/system/admin/services/popularity`,
    (req) => {
      req.reply({
        statusCode: 200,
        body: {
          data: [
            {
              description:
                'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus ea dignissimos eos consequatur amet at natus nam. Amet error cumque laborum, recusandae, sit, voluptatibus minima neque id sequi qui harum.',
              value: '1,234'
            },
            {
              description:
                'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum, voluptatibus debitis sapiente consequuntur perspiciatis quaerat minima similique recusandae nesciunt. Esse distinctio praesentium deleniti cupiditate alias saepe sit molestias, culpa illo.',
              value: '15.2m'
            },
            {
              description:
                'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos.',
              value: 'Chat'
            },
            {
              description:
                'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos.',
              value: '2PM'
            }
          ]
        }
      })
    }
  )
}

function getRecentServices() {
  cy.intercept(
    'GET',
    `${BACKEND_URL}/system/admin/services?page=1&pageSize=10&isRecent=true`,
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

function renderMetricSection() {
  it('It should render Metric Section on the dashboard page', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    // Visit the dashboard page

    // Mock API response for auth user
    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    cy.visit('/system/admin/dashboard')

    getMetrics()

    getPopularServices()
    getRecentServices()

    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    // Check if the Metric Section is visible
    cy.get('.bg-white').should('be.visible')

    // Check if the metrics are displayed correctly
    const metrics = [
      { label: 'Total Learners', value: '1,234' },
      { label: 'Total Passing Rate', value: '85%' },
      { label: 'Total Services', value: '24' },
      { label: 'Average Score', value: '78.5' }
    ]

    metrics.forEach((metric) => {
      cy.get('.bg-white').contains(metric.label).should('be.visible')
      cy.get('.bg-white').contains(metric.value).should('be.visible')
    })

    // Check if the trend indicators are displayed correctly
    cy.get('.bg-white').contains('+5.2%').should('have.class', 'text-green-500')
    cy.get('.bg-white').contains('-3.8%').should('have.class', 'text-red-500')
    cy.get('.bg-white').contains('-3.8%').should('have.class', 'text-red-500')
  })
}

function renderPopularServicesSection() {
  it('It should render Popular Services on the dashboard page', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    // Visit the dashboard page

    // Mock API response for auth user
    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    cy.visit('/system/admin/dashboard')

    getMetrics()

    getPopularServices()
    getRecentServices()

    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    // Check if the Popular Services section is visible
    cy.get('.popular-services').should('be.visible')

    it('Should display the correct number of popular services', () => {
      // Check if the correct number of popular services is displayed
      cy.get('.popular-services .grid-cols-12')
        .children()
        .should('have.length', 8) // 4 services * 2 columns each
    })

    it('Should display the correct descriptions and values for popular services', () => {
      // Check if the descriptions and values are displayed correctly
      const popularServices = [
        {
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus ea dignissimos eos consequatur amet at natus nam. Amet error cumque laborum, recusandae, sit, voluptatibus minima neque id sequi qui harum.',
          value: '1,234'
        },
        {
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rerum, voluptatibus debitis sapiente consequuntur perspiciatis quaerat minima similique recusandae nesciunt. Esse distinctio praesentium deleniti cupiditate alias saepe sit molestias, culpa illo.',
          value: '15.2m'
        },
        {
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos.',
          value: 'Chat'
        },
        {
          description:
            'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos. Quisquam, quos.',
          value: '2PM'
        }
      ]

      popularServices.forEach((service, index) => {
        cy.get('.popular-services .grid-cols-12')
          .children()
          .eq(index * 2)
          .should('contain.text', service.description)
        cy.get('.popular-services .grid-cols-12')
          .children()
          .eq(index * 2 + 1)
          .should('contain.text', service.value)
      })
    })
  })
}

function renderRecentServicesSection() {
  it('It should render Recent Services on the dashboard page', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    // Visit the dashboard page

    // Mock API response for auth user
    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    cy.visit('/system/admin/dashboard')

    getMetrics()

    getPopularServices()
    getRecentServices()

    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    cy.get('.mt-10').contains('Recent Services').should('be.visible')
    cy.get('.mt-10')
      .contains('Managing Difficult Customer Conversations')
      .should('be.visible')
    cy.get('.mt-10').contains('CREATED').should('be.visible')
    cy.get('.mt-10').contains('Mar 21, 2024, 02:30 AM').should('be.visible')
  })

  it('Should not display Recent Services section for unauthorized user', () => {
    const role: Role = 'learner'
    cy.login(role)

    // Mock API response for auth user
    authenticateUser(role)

    // Visit the dashboard page
    cy.visit('/system/admin/dashboard')

    // Check if the Recent Services section is not visible
    cy.get('.mt-10').should('not.exist')
  })

  it('Should display error message when failing to load Recent Services', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    // Visit the dashboard page

    // Mock API response for auth user
    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    cy.visit('/system/admin/dashboard')

    getMetrics()

    getPopularServices()
    getRecentServices()

    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)
    // Intercept the API call for recent services and force it to fail
    cy.intercept(
      'GET',
      `${BACKEND_URL}/system/admin/services?page=1&pageSize=10&isRecent=true`,
      {
        statusCode: 500,
        body: {
          message: 'Internal Server Error'
        }
      }
    ).as('getRecentServices')

    // Visit the dashboard page
    cy.visit('/system/admin/dashboard')

    // Check if the error message is displayed
    cy.get('p').contains('Internal Server Error').should('be.visible')
  })

  it('Should display No Recent Cases message when no recent services are available', () => {
    const role: Role = 'super-admin'
    cy.login(`system/${role}`)

    // Visit the dashboard page

    // Mock API response for auth user
    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    cy.visit('/system/admin/dashboard')

    getMetrics()

    getPopularServices()
    getRecentServices()

    authenticateUser(`system/${role}`)
    // Mock API response for auth user
    authenticateUser(`system/${role}`)

    // Intercept the API call for recent services and force it to fail
    cy.intercept(
      'GET',
      `${BACKEND_URL}/system/admin/services?page=1&pageSize=10&isRecent=true`,
      {
        statusCode: 200,
        body: {
          data: []
        }
      }
    ).as('getRecentServices')

    // Visit the dashboard page
    cy.visit('/system/admin/dashboard')

    // Check if the error message is displayed
    cy.get('p').contains('No recent cases').should('be.visible')
  })
}

describe('Test Case for Admin Dashboard Page (Desktop)', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
  })
  renderMetricSection()
  renderPopularServicesSection()
  renderRecentServicesSection()
})

describe('Test Case for Admin Dashboard Page (Mobile)', () => {
  beforeEach(() => {
    cy.viewport('iphone-6')
  })
  renderMetricSection()
  renderPopularServicesSection()
  renderRecentServicesSection()
})
