describe('Confirmacao de Pagamento', () => {
  beforeEach(() => {
    cy.login();
  });

  it('exibe mensagem quando nao ha confirmacao', () => {
    cy.visit('/confirmacao-pagamento');
    cy.contains('Nenhuma confirmação de pagamento foi encontrada.').should('be.visible');
    cy.get('a[href="/status-pagamento"]').should('be.visible');
  });
});
