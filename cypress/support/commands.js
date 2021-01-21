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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("visitLoginPage", () => {
    // Clears cookies and local storage before each test run to ensure no previous caching or data is affecting the test
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.server();
    cy.url().then(($url) => {
          cy.route('POST', '/ahoy/events').as('postEvents');
    });
    cy.visit('/');
    // Wait for /api call to resolve before attempting to interact with page
    cy.wait('@postEvents');
    // Click Login button on nav bar
    cy.get('.navbar-link').click();
    // Asserts the url changes and is correct
    cy.server();
    cy.url().then(($url) => {
          cy.route('POST', '/ahoy/visits').as('postVisits');
    });
    cy.wait('@postVisits');
    cy.confirmsLoginUrl();    
});

Cypress.Commands.add("confirmsLoginUrl", () => {
    cy.url().should('include', 'sso.zeachable.com/secure/123/users/sign_in');
});