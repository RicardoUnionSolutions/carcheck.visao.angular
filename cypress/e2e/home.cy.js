describe('Home view initial load', () => {
    it('loads main components on home page', () => {
      cy.visit('/');
      cy.get('app-destaque').should('exist');
      cy.get('app-aplicativo').should('exist');
      cy.get('app-produtos').should('exist');
      cy.get('app-destaque-servicos').should('exist');
    });
  });
