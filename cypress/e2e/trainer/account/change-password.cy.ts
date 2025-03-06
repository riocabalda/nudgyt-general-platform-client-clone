export {}

const TEST_USER = {
  Name: 'Sample User',
  Role: 'trainer',
  OrgSlug: 'public',
  OrgName: '[PUBLIC]',
  OrgCode: 'D5B59D',
  Email: 'trainer@user.com',
  JoinDate: 'Jan 01, 1970, 08:00 AM'
}

const DEVICES = ['Desktop', 'Mobile'] as const
type Device = (typeof DEVICES)[number]

function buildHref(args?: { orgSlug?: string; device?: Device }) {
  const { orgSlug = TEST_USER.OrgSlug, device } = args ?? {}

  const deviceSlug = device === 'Mobile' ? '/mobile' : ''
  const href =
    `/${orgSlug}` + '/trainer/account' + deviceSlug + '/change-password'

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

    it('Requires current password', () => {
      cy.get('label').contains('Current Password').should('be.visible')
      cy.get('input#current_password[type=password]').should('be.visible')
    })

    it('Requires password confirmation', () => {
      cy.get('label').contains('Confirm Password').should('be.visible')
      cy.get('input#confirm_password[type=password]').should('be.visible')
    })

    if (device === 'Desktop') {
      it('Shows form in a modal', () => {
        cy.get('h2')
          .contains('Change Password') // Form title
          .parents('div[role=dialog]') // Should be in a visible dialog
          .should('be.visible')
      })
    }

    describe('Save button', () => {
      it('Is disabled by default', () => {
        cy.get('button[disabled]')
          .contains('Change Password')
          .should('be.visible')
      })

      it('Is enabled after changing inputs', () => {
        cy.get('input#current_password[type=password]').type('something')

        cy.get('button').contains('Change Password').should('not.be.disabled')
      })
    })
  })
})
