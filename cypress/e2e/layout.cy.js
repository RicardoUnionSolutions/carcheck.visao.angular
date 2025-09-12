describe('Layout and responsiveness', () => {
    it('displays the navigation menu on mobile view', () => {
      cy.viewport('iphone-6');
      cy.visit('/login');
      cy.get('nav').should('be.visible');
    });

    it('contains main menu links', () => {
      cy.visit('/home');
      cy.get('nav').within(() => {
        cy.contains('a', 'Início').should('have.attr', 'href', '/home');
        cy.contains('a', 'Consulta de Placa')
          .should('have.attr', 'href', '/consulta-placa-veiculo');
      });
    });

    it('navigates to pages via menu links', () => {
      cy.visit('/home');
      cy.get('nav').contains('a', 'Consulta de Placa').click({ force: true });
      cy.url().should('include', '/consulta-placa-veiculo');
    });

    it('shows footer with external links', () => {
      cy.visit('/home');
      cy.get('footer').within(() => {
        cy.get(
          'a[href="https://play.google.com/store/apps/details?id=com.sazso.carcheck"]'
        ).should('have.attr', 'target', '_blank');
        cy.get(
          'a[href="https://www.facebook.com/carcheckbrasil"]'
        ).should('have.attr', 'target', '_blank');
      });
    });
  });
  