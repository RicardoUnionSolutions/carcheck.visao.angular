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

  it('exibe contestação, disputa e erro de pagamento', () => {
    cy.intercept('POST', '**/pagamento/lista**', { fixture: 'payment-additional-statuses.json' }).as('lista');
    cy.visit('/status-pagamento');
    cy.wait('@lista').its('response.statusCode').should('eq', 200);

    cy.contains('Contestação').should('be.visible');
    cy.contains('Disputa').should('be.visible');
    cy.contains('Erro de Pagamento').should('be.visible');
    cy.get('table.ck-table tr').contains('Erro de Pagamento').parent().find('.mdi-close.text-danger').should('be.visible');
  });

  it('permite buscar pagamentos pelo código', () => {
    let callCount = 0;
    cy.intercept('POST', '**/pagamento/lista**', (req) => {
      callCount += 1;

      if (callCount === 1) {
        expect(req.body).to.deep.equal({ codigoPagamento: null });
        req.reply({ fixture: 'payment-pending.json' });
      } else {
        expect(req.body).to.deep.equal({ codigoPagamento: '99999' });
        req.reply({ fixture: 'payment-approved.json' });
      }
    }).as('lista');

    cy.visit('/status-pagamento');
    cy.wait('@lista');

    cy.get('ck-input input').type('99999');
    cy.contains('button', 'Buscar').click();

    cy.wait('@lista');

    cy.get('table.ck-table tr').eq(1).within(() => {
      cy.contains('12345');
      cy.contains('Aprovada');
    });
  });
});
