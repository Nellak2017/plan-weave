describe('Password Requirements Validation', () => {
    const email = 'fake@example.com' // We don’t care if email is valid here
    const passwordCases = [
        { value: 'Ab1!', message: 'Password must be at least 8 characters' },
        { value: 'A1!'.repeat(50), message: 'Password must be no more than 100 characters' },
        { value: 'password1!', message: 'Password must include an uppercase letter' },
        { value: 'PASSWORD1!', message: 'Password must include a lowercase letter' },
        { value: 'Password!', message: 'Password must include a number' },
    ]
    const paths = ['/login', '/signup']
    paths.forEach(path => {
        describe(`Form: ${path}`, () => {
            beforeEach(() => {
                cy.visit(path)
                cy.get('#email').type(email)
            })
            passwordCases.forEach(({ value, message }) => {
                it(`should show error: ${message}`, () => {
                    cy.get('#password').clear().type(value)
                    cy.get('#email-auth').click()
                    cy.contains(message).should('exist')
                })
            })
        })
    })
})