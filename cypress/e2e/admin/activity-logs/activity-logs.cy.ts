describe('Activity Logs', () => {
  context('Intial Validation', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
    })
    it('Should have 10 items', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('tbody > tr').should('have.length', 10)
    })
  })

  context('Filter Service', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
    })

    it('Should add deleted to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#deleted').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should('include', '/admin/activity-logs?service%5B%5D=DELETED')
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })

    it('Should add edited to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#edited').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should('include', '/admin/activity-logs?service%5B%5D=EDITED')
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })

    it('Should add published to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#published').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should('include', '/admin/activity-logs?service%5B%5D=PUBLISHED')
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })
  })

  context('Filter User', () => {
    beforeEach(() => {
      cy.viewport(1920, 1080)
    })

    it('Should add invited to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#invited').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should(
        'include',
        '/admin/activity-logs?user_status%5B%5D=INVITED'
      )
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })

    it('Should add approved to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#approved').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should(
        'include',
        '/admin/activity-logs?user_status%5B%5D=APPROVED'
      )
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })

    it('Should add blocked to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#blocked').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should(
        'include',
        '/admin/activity-logs?user_status%5B%5D=BLOCKED'
      )
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })

    it('Should add unblocked to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#unblocked').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should(
        'include',
        '/admin/activity-logs?user_status%5B%5D=UNBLOCKED'
      )
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })

    it('Should add archived to array of service in url params and reset', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('div:nth-of-type(5) > button').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should(
        'include',
        '/admin/activity-logs?user_status%5B%5D=ARCHIVED'
      )
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })

    it('Should add all filters', () => {
      cy.login('super-admin')
      cy.get('a:nth-of-type(4)').click()
      cy.get('div.flex > div.hidden p').click()
      cy.get('#deleted').click()
      cy.get('#edited').click()
      cy.get('#published').click()
      cy.get('#invited').click()
      cy.get('#approved').click()
      cy.get('#blocked').click()
      cy.get('div:nth-of-type(4) > button').click()
      cy.get('div:nth-of-type(5) > button').click()
      cy.get('button.bg-brandcolora').click()
      cy.url().should(
        'include',
        '/admin/activity-logs?service%5B%5D=DELETED&service%5B%5D=EDITED&service%5B%5D=PUBLISHED&user_status%5B%5D=INVITED&user_status%5B%5D=APPROVED&user_status%5B%5D=BLOCKED&user_status%5B%5D=UNBLOCKED&user_status%5B%5D=ARCHIVED'
      )
      cy.get('body > div:nth-of-type(2) button.bg-white').click()
    })
  })
})
