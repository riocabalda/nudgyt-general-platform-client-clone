const TEST_USER = {
  Name: 'Sample User',
  Role: 'learner',
  OrgSlug: 'public',
  OrgName: '[PUBLIC]',
  OrgCode: 'D5B59D',
  Email: 'learner@user.com',
  JoinDate: 'Jan 01, 1970, 08:00 AM'
}

const DEVICES = ['Desktop', 'Mobile'] as const

function buildHref(args?: { orgSlug?: string }) {
  const { orgSlug = TEST_USER.OrgSlug } = args ?? {}

  const href = `/${orgSlug}` + '/learner/account' + '/upgrade-access'

  return href
}

DEVICES.forEach((device) => {
  describe(device, () => {
    beforeEach(() => {
      if (device === 'Desktop') {
        cy.viewport(1920, 1080) // 16:9 1080p display
      }
      if (device === 'Mobile') {
        cy.viewport('iphone-se2')
      }

      cy.assumeLogin(TEST_USER.Role)
      cy.visit(buildHref())
    })

    it('Shows expected title', () => {
      cy.get('h1')
        .filter(':visible')
        .contains('Upgrade Access')
        .should('be.visible')
    })

    it('Has expected free access card', () => {
      const card = () => cy.get('p').contains('Free').parents('li')

      card()
        .get('h2')
        .contains('Public Access (Free Trial)')
        .should('be.visible')

      card().get('p').contains('Free').should('be.visible')

      card()
        .get('button[disabled]')
        .contains('Current plan')
        .should('be.visible')
    })

    it('Has expected paid access card', () => {
      const card = () =>
        cy.get('p').contains('$30 per user monthly').parents('li')

      card().get('h2').contains('Public Access').should('be.visible')

      card().get('p').contains('$30 per user monthly').should('be.visible')

      card().get('button').contains('Upgrade').should('be.visible')
    })
  })
})
