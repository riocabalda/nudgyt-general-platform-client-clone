export {}

const TEST_USER = {
  Name: 'Sample User',
  Role: 'admin',
  OrgSlug: 'public',
  OrgName: '[PUBLIC]',
  OrgCode: 'D5B59D',
  Email: 'admin@user.com',
  JoinDate: 'Jan 01, 1970, 08:00 AM'
}

const DEVICES = ['Desktop', 'Mobile'] as const
type Device = (typeof DEVICES)[number]

function buildHref(args?: { orgSlug?: string; device?: Device }) {
  const { orgSlug = TEST_USER.OrgSlug, device } = args ?? {}

  const deviceSlug = device === 'Mobile' ? '/mobile' : ''
  const href =
    `/${orgSlug}` + '/admin/account' + deviceSlug + '/personal-details'

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
      cy.visit(buildHref({ device }))
    })

    it('Shows expected default values', () => {
      cy.get('input#full_name').should('have.value', TEST_USER.Name)
      cy.get('input#email').should('have.value', TEST_USER.Email)
    })

    it('Has fixed email input', () => {
      cy.get('input#email[disabled]').should('be.visible')
    })

    it('Should not have contact number input', () => {
      cy.get('label').contains('Contact Number').should('not.exist')
      cy.get('input[type=tel]').should('not.exist')
    })

    if (device === 'Desktop') {
      it('Shows form in a modal', () => {
        cy.get('h2')
          .contains('Personal Details') // Form title
          .parents('div[role=dialog]') // Should be in a visible dialog
          .should('be.visible')
      })
    }

    describe('Save button', () => {
      it('Is disabled by default', () => {
        cy.get('button[disabled]')
          .contains('Update Personal Details')
          .should('be.visible')
      })

      it('Is enabled after changing inputs', () => {
        cy.get('input#full_name').clear().type('Updated Name')

        cy.get('button')
          .contains('Update Personal Details')
          .should('not.be.disabled')
      })
    })
  })
})
