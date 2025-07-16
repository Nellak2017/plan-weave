const email = Cypress.env('TEST_EMAIL')
const password = Cypress.env('TEST_PASSWORD')
const invalidCredentials = "Invalid login credentials"
const invalidEmailFormat = "Invalid email format"
const invalidPasswordFormat = "Invalid password format"
const emailRequired = "Email is required"
const passwordRequired = "Password is required"
describe('Login - Success Flow', () => {
  beforeEach(() => { cy.visit('/login') })
  it('should log in with valid credentials and be redirected to the app page', () => {
    cy.get('#email').type(email)
    cy.get('#password').type(password)
    cy.get('#email-auth').click()
    cy.url().should('include', '/plan-weave')
    cy.contains("Today's Tasks").should('exist')
  })
})
describe('Login - Failure Flow', () => {
  beforeEach(() => { cy.visit('/login') })
  it('should show error with invalid password', () => {
    cy.get('#email').type(email)
    cy.get('#password').type(`${password} extra stuff`)
    cy.get('#email-auth').click()
    cy.contains(invalidCredentials).should('exist')
  })
  it('should show warning with invalid email syntax', () => {
    cy.get('#email').type(`${email} extra stuff`)
    cy.get('#password').type(password)
    cy.get('#email-auth').click()
    cy.contains(invalidEmailFormat).should('exist')
  })
  it('should show error with incorrect email', () => {
    cy.get('#email').type(`extra stuff${email}`)
    cy.get('#password').type(password)
    cy.get('#email-auth').click()
    cy.contains(invalidCredentials).should('exist')
  })
  it('should show warning when email and password are empty', () => {
    cy.get('#email-auth').click()
    cy.contains(emailRequired).should('exist')
    cy.contains(passwordRequired).should('exist')
  })
})