describe('Login Form Tests', () => {
    beforeEach(() => {
        // Before each test, runs a shared command to visit the login url
        cy.visitLoginPage(); 
    });
    it('Verifies Successful Login', () => {
        cy.get('h1.text-center').should('be.visible'); // Login page header is visible
        cy.get('#user_email').should('be.visible').type(Cypress.env('email'));
        cy.get('#user_email').invoke('val').should('contain', Cypress.env('email'));
        cy.get('#user_password').should('be.visible').type(Cypress.env('password'));
        cy.get('#user_password').invoke('val').should('not.be.empty');
        cy.get('.btn').should('be.visible').should('be.enabled').click();  
        cy.wait('@postEvents').should((xhr) => {
            expect(xhr.status, 'successful POST').to.equal(200)
        });                
        cy.url().should('contain', 'takehome.zeachable');
        cy.get('#search-courses').should('be.visible');
    });


    it('Verifies Empty Login Info Error', () => {
        cy.get('.btn').click();
        cy.wait('@postEvents');
        cy.get('.alert').should('be.visible').invoke('text').should('include', 'Invalid email or password');
        cy.confirmsLoginUrl();
    });


     it('Verifies Invalid Login Info', () => {
        cy.get('#user_email').should('be.visible').type('cats@test.com');
        cy.get('#user_password').should('be.visible').type('cats');
        cy.get('.btn').click();
        cy.wait('@postEvents');
        cy.get('.alert').should('be.visible').invoke('text').should('include', 'Invalid email or password');
        cy.confirmsLoginUrl();

    });

    it('Verifies Forgot Password Button and Redirect', () => {
        cy.server();
        cy.route('GET', '/secure/123/users/password/new').as('newPassword');
        cy.get('.link-below-button').should('be.visible').click(); // Forgot Password button
        cy.wait('@newPassword').should((xhr) => {
            expect(xhr.status, 'successful POST').to.equal(200)
        });               
        cy.url().should('include', 'password/new');
    });
    
    
    it('Verifies Create Account Button and Redirect', () => {
        cy.server();
        cy.route('GET', '/secure/123/users/sign_up?flow_school_id=123').as('signUp');
        cy.get('.box-footer > a').should('be.visible').click(); // Create Account button
        cy.wait('@signUp').should((xhr) => {
            expect(xhr.status, 'successful POST').to.equal(200);
        });                
        cy.url().should('include', 'sign_up');
    });
  
});