describe('Plan Weave Page', () => {
    beforeEach(() => cy.uiLogin())
    it('should navigate to the plan weave page successfully', () => {
        cy.visit('/plan-weave')
        cy.contains("Today's Tasks").should('be.visible')
    })
    it('should navigate to the plan weave page successfully 2', () => {
        cy.visit('/plan-weave')
        cy.contains("Today's Tasks").should('be.visible')
    })
})