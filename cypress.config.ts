import { defineConfig } from 'cypress'

let cypressEnv: Record<string, string> = {}

if (process.env.NODE_ENV !== 'production') {
  try {
    // Dynamically require cypress.env.json in non-production environments
    cypressEnv = require('./cypress.env.json')
  } catch (error) {
    console.warn(
      'Warning: cypress.env.json not found. Using default configuration.'
    )
  }
}

export default defineConfig({
  env: {
    apiBaseUrl: cypressEnv?.CYPRESS_API_BASE_URL || 'http://localhost:5000/api'
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack'
    }
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000'
  }
})
