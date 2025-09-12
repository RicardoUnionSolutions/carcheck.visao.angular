describe('Form validation', () => {
    it('shows validation errors on login form', () => {
      cy.visit('/login');
      cy.get('[data-cy=login-btn]').first().click();
      cy.get('ck-input[data-cy=email] .msg').should('be.visible');
      cy.get('ck-input[data-cy=password] .msg').should('be.visible');
    });
  });
  