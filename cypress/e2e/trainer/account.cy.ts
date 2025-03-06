import { apiUrl } from '../../utils/api'

const DEVICES = ['Desktop', 'Mobile'] as const
type Device = (typeof DEVICES)[number]

function buildHref(args: {
  orgSlug: string
  device?: Device
  mainPage?: '/account' | '/subscriptions'
  subpage?: '/personal-details' | '/change-password' | ''
}) {
  const { orgSlug, device } = args
  const { mainPage = '/account', subpage = '' } = args

  const deviceSlug = device === 'Mobile' ? '/mobile' : ''
  const href = `/${orgSlug}` + '/trainer' + mainPage + deviceSlug + subpage

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
    })

    describe('Common requirements', () => {
      const TEST_USER = {
        Name: 'Sample User',
        Role: 'trainer',
        OrgSlug: 'public',
        OrgName: '[PUBLIC]',
        OrgCode: 'D5B59D',
        Email: 'trainer@user.com',
        JoinDate: 'Jan 01, 1970, 08:00 AM'
      }

      beforeEach(() => {
        cy.assumeLogin(TEST_USER.Role)
        cy.visit(
          buildHref({
            orgSlug: TEST_USER.OrgSlug
          })
        )
      })

      describe('Navigation', () => {
        it('Can go to "Edit Profile" page', () => {
          const href = buildHref({
            orgSlug: TEST_USER.OrgSlug,
            device,
            subpage: '/personal-details'
          })

          cy.get(`a[href="${href}"]`).contains('Edit Profile').click()
          cy.url().should('include', href)
        })

        it('Can go to "Change Password" page', () => {
          const href = buildHref({
            orgSlug: TEST_USER.OrgSlug,
            device,
            subpage: '/change-password'
          })

          cy.get(`a[href="${href}"]`).contains('Change Password').click()
          cy.url().should('include', href)
        })
      })
    })

    describe('Public trainers', () => {
      const TEST_USER = {
        Name: 'Sample User',
        Role: 'trainer',
        OrgSlug: 'public',
        OrgName: '[PUBLIC]',
        OrgCode: 'D5B59D',
        Email: 'trainer@user.com',
        JoinDate: 'Jan 01, 1970, 08:00 AM'
      }

      beforeEach(() => {
        cy.assumeLogin(TEST_USER.Role)
        cy.visit(
          buildHref({
            orgSlug: TEST_USER.OrgSlug
          })
        )

        const requestUrl = apiUrl(
          `/${TEST_USER.OrgSlug}/trainer/organizations/display-info`
        )
        cy.intercept('GET', requestUrl, {
          fixture: `trainer/organizations/display-info/success/${TEST_USER.Role}.json`
        })

        cy.get('p')
          .filter(':visible')
          .contains(TEST_USER.Name)
          .should('be.visible') // Wait for page to load
      })

      it('Shows expected info list', () => {
        const info = [
          {
            title: 'Organization Code',
            value: TEST_USER.OrgCode,
            isExisting: false
          },
          { title: 'Email Address', value: TEST_USER.Email, isExisting: true },
          { title: 'Date Joined', value: TEST_USER.JoinDate, isExisting: true }
        ]

        info.forEach(({ title, value, isExisting }) => {
          if (isExisting) {
            cy.get('dt').contains(title).should('be.visible')
            cy.get('dd').contains(value).should('be.visible')
          } else {
            cy.get('dt').contains(title).should('not.exist')
            cy.get('dd').contains(value).should('not.exist')
          }
        })
      })

      it('Shows access card', () => {
        const requestUrl = apiUrl(
          `/${TEST_USER.OrgSlug}/trainer/users/accounts/access`
        )
        cy.intercept('GET', requestUrl, {
          fixture: `trainer/users/accounts/access/success/${TEST_USER.Role}.json`
        })

        cy.get('h3').contains('You have Trainer Access').should('be.visible')
      })
    })

    describe('Organization trainers', () => {
      const TEST_USER = {
        Name: 'Org Trainer',
        Role: 'organization/trainer',
        OrgSlug: 'org-1',
        OrgName: 'Org 1',
        OrgCode: '483623',
        Email: 'trainer@org.com',
        JoinDate: 'Jan 01, 1970, 08:00 AM'
      }

      beforeEach(() => {
        cy.assumeLogin(TEST_USER.Role)
        cy.visit(
          buildHref({
            orgSlug: TEST_USER.OrgSlug
          })
        )

        const requestUrl = apiUrl(
          `/${TEST_USER.OrgSlug}/trainer/organizations/display-info`
        )
        cy.intercept('GET', requestUrl, {
          fixture: `trainer/organizations/display-info/success/${TEST_USER.Role}.json`
        })

        cy.get('p')
          .filter(':visible')
          .contains(TEST_USER.Name)
          .should('be.visible') // Wait for page to load
      })

      it('Shows expected info list', () => {
        const info = [
          {
            title: 'Organization Code',
            value: TEST_USER.OrgCode,
            isExisting: false
          },
          { title: 'Email Address', value: TEST_USER.Email, isExisting: true },
          { title: 'Date Joined', value: TEST_USER.JoinDate, isExisting: true }
        ]

        info.forEach(({ title, value, isExisting }) => {
          if (isExisting) {
            cy.get('dt').contains(title).should('be.visible')
            cy.get('dd').contains(value).should('be.visible')
          } else {
            cy.get('dt').contains(title).should('not.exist')
            cy.get('dd').contains(value).should('not.exist')
          }
        })
      })

      it('Shows access card', () => {
        const requestUrl = apiUrl(
          `/${TEST_USER.OrgSlug}/trainer/users/accounts/access`
        )
        cy.intercept('GET', requestUrl, {
          fixture: `trainer/users/accounts/access/success/${TEST_USER.Role}.json`
        })

        cy.get('h3')
          .contains('You have Organization Access')
          .should('be.visible')
      })
    })
  })
})
