describe('Password Requirements Validation', () => {
    const email = 'fake@example.com' // We don’t care if email is valid here
    const passwordCases = [
        { value: 'Ab1!', message: 'Password should be at least 8 characters' },
        { value: 'A1!'.repeat(50), message: 'Password cannot be longer than 72 characters' },
        { value: 'password1!', message: 'at least one character of each:' }, // lower case
        { value: 'PASSWORD1!', message: 'at least one character of each:' }, // capital letters
        { value: 'Password!', message: 'at least one character of each:' }, // digits
    ]
    // const testedMessage = ''
    const paths = ['/signup'] // Login excluded because it should just say invalid credentials!
    paths.forEach(path => {
        describe(`Form: ${path}`, () => {
            beforeEach(() => {
                cy.visit(path)
                cy.get('#email').type(email)
            })
            passwordCases
            // .filter(({ message }) => message === testedMessage) // so this is only run
            .forEach(({ value, message }) => {
                it(`should show error: ${message}`, () => {
                    cy.get('#password').clear().type(value)
                    cy.get('#email-auth').click()
                    cy.contains(message).should('exist')
                })
            })
        })
    })
})