describe('Consulta CRUD flow', () => {
    beforeEach(() => {
      cy.login();
      cy.intercept('GET', '**/consultar/creditoConsulta', {
        statusCode: 200,
        body: [{ id: 1, nome: 'A', quantidade: 2 }],
      }).as('credito');
      cy.intercept('POST', '**/consultar/**', {
        statusCode: 200,
        body: {},
      }).as('consultar');
      cy.visit('/realizar-consultas');
      cy.wait('@credito');
    });
  
    it('adds, edits and removes a consulta', () => {
      cy.get('ck-select select').first().select('A');
      cy.get('input[maxlength="7"]').first().type('ABC1234');
      cy.get('.btn-consultar').click();
      cy.wait('@consultar');
      cy.get('.ck-modal').should('not.be.visible');
      cy.get('.btn-outline-orange-1.btn-circle').click();
      cy.get('.btn-outline-orange-1.btn-circle-sm')
        .first()
        .should('be.visible')
        .click();
    });
  });
  