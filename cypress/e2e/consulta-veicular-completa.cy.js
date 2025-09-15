describe('Consulta Veicular Completa', () => {
  beforeEach(() => {
    cy.visit('/produto/consulta-veicular-completa');
  });

  it('exibe as informações principais do produto', () => {
    cy.contains('h1', 'Consulta Veicular Completa').should('be.visible');

    cy.get('.consulta').within(() => {
      cy.contains('RECOMENDADA').should('be.visible');
      cy.get('.azul').should('contain.text', 'Consulta Veicular Completa');
      cy.get('.de').invoke('text').should('match', /69,90/);
      cy.get('.preco').invoke('text').should('match', /54,90/);
      cy.get('a.btn').should('have.attr', 'href', '/comprar-consulta-placa/completa');
    });
  });

  it('mostra seções de suporte à consulta', () => {
    cy.contains('h1', 'Exemplo de consulta').should('be.visible');
    cy.contains('h2', 'Como funciona').should('be.visible');
    cy.contains('h1', 'Perguntas frequentes').should('be.visible');
    cy.get('app-comparar-produto').should('exist');
    cy.get('app-produtos').should('exist');
  });
});
