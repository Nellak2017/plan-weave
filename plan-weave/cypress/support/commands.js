// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('uiLogin', () => {
    cy.session('supabase-session', () => {
        cy.visit('/login')
        cy.get('#email').type(Cypress.env('TEST_EMAIL'))
        cy.get('#password').type(Cypress.env('TEST_PASSWORD'))
        cy.get('#email-auth').click()
        cy.url().should('not.include', '/login')
    })
})
Cypress.Commands.add('addTasks', () => {
    
})
Cypress.Commands.add('searchTasks', (query) => {
    cy.get('input[type="search"').clear().type(query)
})
Cypress.Commands.add('deleteAllTasks', () => {
    
})
Cypress.Commands.add('taskList', () => {
    
})
