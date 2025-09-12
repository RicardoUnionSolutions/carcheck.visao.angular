describe('Protected routes navigation', () => {
    it('redirects unauthenticated users to login', () => {
      cy.visit('/conta');
      cy.url().should('include', '/home');
    });

    it('redirects unauthenticated users from realizar-consultas to login', () => {
      cy.visit('/realizar-consultas');
      cy.url().should('include', '/home');
    });

    it('allows navigation after login', () => {
      cy.login();
      cy.visit('/conta');
      cy.url().should('include', '/conta');
      cy.visit('/realizar-consultas');
      cy.url().should('include', '/realizar-consultas');
    });
  });
  