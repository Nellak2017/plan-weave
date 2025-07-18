const { defineConfig } = require("cypress")
require('dotenv').config()

module.exports = defineConfig({
  e2e: {
    env: {
      TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
      TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    },
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
