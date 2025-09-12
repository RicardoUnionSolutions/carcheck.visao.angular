describe('Status de Pagamento', () => {
  beforeEach(() => {
    cy.login();
  });

  it('exibe pagamento aprovado', () => {
    cy.intercept('POST', '**/pagamento/lista**', { fixture: 'payment-approved.json' }).as('lista');
    cy.visit('/status-pagamento');
    cy.wait('@lista').its('response.statusCode').should('eq', 200);
    cy.get('table.ck-table tr').eq(1).within(() => {
      cy.contains('12345');
      cy.get('.mdi-check.text-success').should('be.visible');
      cy.contains('Aprovada');
    });
  });

  it('exibe pagamento rejeitado', () => {
    cy.intercept('POST', '**/pagamento/lista**', { fixture: 'payment-rejected.json' }).as('lista');
    cy.visit('/status-pagamento');
    cy.wait('@lista').its('response.statusCode').should('eq', 200);
    cy.get('table.ck-table tr').eq(1).within(() => {
      cy.contains('54321');
      cy.get('.mdi-close.text-danger').should('be.visible');
      cy.contains('Cancelada');
    });
  });

  it('exibe pagamento pendente', () => {
    cy.intercept('POST', '**/pagamento/lista**', { fixture: 'payment-pending.json' }).as('lista');
    cy.visit('/status-pagamento');
    cy.wait('@lista').its('response.statusCode').should('eq', 200);
    cy.get('table.ck-table tr').eq(1).within(() => {
      cy.contains('11111');
      cy.get('.mdi-clock.text-blue').should('be.visible');
      cy.contains('Aguardando');
    });
  });
});
