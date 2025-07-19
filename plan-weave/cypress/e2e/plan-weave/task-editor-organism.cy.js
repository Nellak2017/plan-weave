describe('Task Editor Organism', () => {
    beforeEach(() => {
        cy.uiLogin()
        cy.visit('/plan-weave')
    })

    // TODO: make a test account so we can start from scratch on these e2e tests, testing on main is dumb
    describe('search feature', () => {
        /* 
        1. Select Add Task, Press it
            -> select on #addTask id, press it
        2. Select Added Task (how?), type into added task something we will look for
            -> select the table (how?), 
            -> the last element displayed in that table is your task (how?), 
            -> type into the input that is the first input in the tr 
        3. Continue 1. and 2. until you have as many added tasks as you need for the test
            -> for testString in testStrings : do step 1. and 2.
        4. Select Search, Type test string into it
            -> select on type="search" inside the task editor component, it is the only one
            -> Type the test string into it
            -> If there is more than one, do it in an assertion loop for the already entered data
        5. Select the tasks in the table and assert atleast those are displayed that should be displayed
            -> Select the table
            -> assert the tr that have the first input which have the value of the tasks we entered are all present (extras allowed unless starting from scratch in the test suite)
        6. Select the tasks in the table that need to be deleted for their delete button, press delete
            -> Find the tr that has the first input which has the value of the task we need
            -> with that tr, we select the final td and inside that the delete button
            -> We press that delete button 
        */
    })
})