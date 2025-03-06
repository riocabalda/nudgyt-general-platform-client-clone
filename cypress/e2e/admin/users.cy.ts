import { apiUrl } from '../../utils/api'

describe('Add User modal', () => {
  const DEVICES = ['Desktop', 'Mobile'] as const
  const PAGE_PATH = (orgSlug: string) => `/${orgSlug}/admin/users`

  function loadModal(role: string, orgSlug: string) {
    cy.assumeLogin(role)
    cy.visit(PAGE_PATH(orgSlug))
    cy.get('button').filter(':visible').contains('Add User').click() // Open modal
  }

  function fillUpForm(values?: { role?: string; email?: string }) {
    const { role, email } = values ?? {}

    if (role !== undefined) {
      cy.get('button').contains('Choose Role').parent().click()
      cy.get('span').contains(role).click()
    }
    if (email !== undefined) {
      cy.get('input[name=email]').type(email)
    }
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
      })

      describe('Main elements', () => {
        const expectedOrg = {
          name: '[PUBLIC]',
          slug: 'public'
        }

        beforeEach(() => {
          loadModal('admin', expectedOrg.slug)
        })

        it('Should have a role input', () => {
          cy.get('label').contains('Role').should('be.visible')
          cy.get('button').contains('Choose Role').should('be.visible')

          /** Check visibility of dropdown selections */
          cy.get('button').contains('Choose Role').parent().click()
          cy.get('span').contains('Learner').should('be.visible')
          cy.get('span').contains('Trainer').should('be.visible')
          cy.get('span').contains('Admin').should('be.visible')
        })

        it('Should have an email input', () => {
          cy.get('input[name=email]').should('be.visible')
        })

        it('Should have an organization input', () => {
          cy.get('label').contains('Organization').should('be.visible')
          cy.get('label')
            .contains('Organization')
            .parent()
            .get('button[disabled]') // Selection dropdown trigger
            .should('be.visible')
          cy.get('label')
            .contains('Organization')
            .parent()
            .get('select[disabled]') // Underlying selection element
            .should('exist')
        })
      })

      describe('Public managers', () => {
        const expectedOrg = {
          name: '[PUBLIC]',
          slug: 'public'
        }

        beforeEach(() => {
          loadModal('admin', expectedOrg.slug)
        })

        it('Should show static URL organization', () => {
          cy.get('button[disabled]')
            .contains(expectedOrg.name)
            .should('be.visible')
        })

        it('Should send URL organization', () => {
          const email = 'example@email.com'
          const role = 'Learner'
          fillUpForm({ role, email })

          const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
          cy.intercept('POST', requestUrl).as('invite')
          cy.get('button').contains('Send Invite').click()

          cy.get('@invite')
            .its('request.body.organization')
            .should('equal', expectedOrg.name)
        })

        it('Should succeed inviting with valid inputs', () => {
          const email = 'learner@public.com'
          const role = 'Learner'
          const message = `${email} has been invited as a ${role}`

          const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
          cy.intercept('POST', requestUrl, {
            fixture: 'admin/users/invite/success.json'
          })

          cy.contains(message).should('not.exist')

          fillUpForm({ role, email })
          cy.get('button').contains('Send Invite').click()

          cy.contains(message).should('be.visible')
        })
      })

      describe('Organization managers', () => {
        const expectedOrg = {
          name: 'Org 1',
          slug: 'org-1'
        }

        beforeEach(() => {
          loadModal('organization/owner', expectedOrg.slug)
        })

        it('Should show static URL organization', () => {
          cy.get('button[disabled]')
            .contains(expectedOrg.name)
            .should('be.visible')
        })

        it('Should send URL organization', () => {
          const email = 'example@email.com'
          const role = 'Learner'
          fillUpForm({ role, email })

          const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
          cy.intercept('POST', requestUrl).as('invite')
          cy.get('button').contains('Send Invite').click()

          cy.get('@invite')
            .its('request.body.organization')
            .should('equal', expectedOrg.name)
        })

        it('Should succeed inviting with valid inputs', () => {
          const email = 'learner@org.com'
          const role = 'Learner'
          const message = `${email} has been invited as a ${role}`

          const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
          cy.intercept('POST', requestUrl, {
            fixture: 'admin/users/invite/success.json'
          })

          cy.contains(message).should('not.exist')

          fillUpForm({ role, email })
          cy.get('button').contains('Send Invite').click()

          cy.contains(message).should('be.visible')
        })
      })

      describe('System managers', () => {
        describe('Inviting public users', () => {
          const expectedOrg = {
            name: '[PUBLIC]',
            slug: 'public'
          }

          beforeEach(() => {
            loadModal('system/super-admin', expectedOrg.slug)
          })

          it('Should show static URL organization', () => {
            cy.get('button[disabled]')
              .contains(expectedOrg.name)
              .should('be.visible')
          })

          it('Should send URL organization', () => {
            const email = 'example@email.com'
            const role = 'Learner'
            fillUpForm({ role, email })

            const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
            cy.intercept('POST', requestUrl).as('invite')
            cy.get('button').contains('Send Invite').click()

            cy.get('@invite')
              .its('request.body.organization')
              .should('equal', expectedOrg.name)
          })

          it('Should succeed inviting with valid inputs', () => {
            const email = 'learner@public.com'
            const role = 'Learner'
            const message = `${email} has been invited as a ${role}`

            const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
            cy.intercept('POST', requestUrl, {
              fixture: 'admin/users/invite/success.json'
            })

            cy.contains(message).should('not.exist')

            fillUpForm({ role, email })
            cy.get('button').contains('Send Invite').click()

            cy.contains(message).should('be.visible')
          })
        })

        describe('Inviting system users', () => {
          const expectedOrg = {
            name: '[SYSTEM]',
            slug: 'system'
          }

          beforeEach(() => {
            loadModal('system/super-admin', expectedOrg.slug)
          })

          it('Should show static URL organization', () => {
            cy.get('button[disabled]')
              .contains(expectedOrg.name)
              .should('be.visible')
          })

          it('Should send URL organization', () => {
            const email = 'example@email.com'
            const role = 'Learner'
            fillUpForm({ role, email })

            const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
            cy.intercept('POST', requestUrl).as('invite')
            cy.get('button').contains('Send Invite').click()

            cy.get('@invite')
              .its('request.body.organization')
              .should('equal', expectedOrg.name)
          })

          it('Should succeed inviting with valid inputs', () => {
            const email = 'admin@system.com'
            const role = 'Admin'
            const message = `${email} has been invited as an ${role}`

            const requestUrl = apiUrl(`/${expectedOrg.slug}/admin/users/invite`)
            cy.intercept('POST', requestUrl, {
              fixture: 'admin/users/invite/success.json'
            })

            cy.contains(message).should('not.exist')

            fillUpForm({ role, email })
            cy.get('button').contains('Send Invite').click()

            cy.contains(message).should('be.visible')
          })
        })
      })
    })
  })
})
