import MetricSection from '@/app/[organization]/admin/dashboard/components/MetricSection'
import PopularSection from '@/app/[organization]/admin/dashboard/components/PopularSection'
import ServicesList from '@/app/[organization]/admin/dashboard/components/ServicesList'
import { mount } from 'cypress/react'

describe('MetricSection Component Tests', () => {
  const metricsData = {
    totalLearners: '1,234',
    totalPassingRate: '85%',
    totalServices: '24',
    averageScore: '78.5'
  }

  beforeEach(() => {
    mount(<MetricSection />)
  })

  it('should display the correct metrics', () => {
    cy.get('div').contains('Total Learners').should('be.visible')
    cy.get('div').contains(metricsData.totalLearners).should('be.visible')
    cy.get('div').contains('Total Passing Rate').should('be.visible')
    cy.get('div').contains(metricsData.totalPassingRate).should('be.visible')
    cy.get('div').contains('Total Services').should('be.visible')
    cy.get('div').contains(metricsData.totalServices).should('be.visible')
    cy.get('div').contains('Average Score').should('be.visible')
    cy.get('div').contains(metricsData.averageScore).should('be.visible')
  })
})

describe('MetricSection Component Negative Tests', () => {
  beforeEach(() => {
    mount(<MetricSection />)
  })

  it('should not display incorrect metrics', () => {
    cy.get('div').contains('Total Learners').should('not.contain', '9999')
    cy.get('div').contains('Total Passing Rate').should('not.contain', '100%')
    cy.get('div').contains('Total Services').should('not.contain', '0')
    cy.get('div').contains('Average Score').should('not.contain', '0')
  })
})

describe('PopularSection Component Tests', () => {
  const popularData = {
    description:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus ea dignissimos eos consequatur amet at natus nam. Amet error cumque laborum, recusandae, sit, voluptatibus minima neque id sequi qui harum.',
    value: '1,234'
  }

  beforeEach(() => {
    mount(<PopularSection />)
  })

  it('should display the correct popular section data', () => {
    cy.get('h5').contains('Popular').should('be.visible')
    cy.get('div').contains('Service').should('be.visible')
    cy.get('div').contains('Learners').should('be.visible')
    cy.get('div').contains(popularData.description).should('be.visible')
    cy.get('div').contains(popularData.value).should('be.visible')
  })
})

describe('PopularSection Component Negative Tests', () => {
  beforeEach(() => {
    mount(<PopularSection />)
  })

  it('should not display incorrect popular section data', () => {
    cy.get('h5').contains('Popular').should('not.contain', 'Unpopular')
    cy.get('div').contains('Service').should('not.contain', 'Unknown Service')
    cy.get('div').contains('Learners').should('not.contain', '0')
    cy.get('div')
      .contains('Lorem ipsum')
      .should('not.contain', 'Incorrect description')
    cy.get('div').contains('1,234').should('not.contain', '0')
  })
})

describe('ServicesList Component Tests', () => {
  const servicesData = {
    title: 'Managing Difficult Customer Conversations'
  }

  beforeEach(() => {
    mount(<ServicesList />)
  })

  it('should display the correct services', () => {
    cy.get('h3').contains('Recent Services').should('be.visible')
    cy.get('a').contains('View All').should('be.visible')
    cy.get('h2').contains(servicesData.title).should('be.visible')
  })
})

describe('ServicesList Component Negative Tests', () => {
  beforeEach(() => {
    mount(<ServicesList />)
  })

  it('should not display incorrect services', () => {
    cy.get('h3')
      .contains('Recent Services')
      .should('not.contain', 'Old Services')
    cy.get('a').contains('View All').should('not.contain', 'Hide All')
    cy.get('h2')
      .contains('Managing Difficult Customer Conversations')
      .should('not.contain', 'Nonexistent Service')
  })
})
