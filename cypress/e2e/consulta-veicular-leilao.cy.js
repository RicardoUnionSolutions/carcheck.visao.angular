describe('Consulta Veicular Leilão page', () => {
  const pacotesMock = [
    {
      id: 3,
      composta_id: 2,
      quantidade_composta: 5,
      nome_do_pacote: 'Pacote 5 Leilão',
      descricao_do_pacote: 'Pacote especial com cinco consultas de leilão',
      porcentagem_desconto: 10,
      recomendada: true,
      ativo: true
    }
  ];

  beforeEach(() => {
    cy.intercept('GET', '**/consultar/getPacotes', {
      statusCode: 200,
      body: pacotesMock
    }).as('getPacotes');
  });

  it('exibe informações e CTA da consulta de leilão', () => {
    cy.visit('/produto/consulta-veicular-leilao');
    cy.wait('@getPacotes');

    cy.contains('h1', 'Consulta Veicular Leilão').should('be.visible');
    cy.contains('.consulta h2.azul', 'Consulta Veicular Leilão').should('be.visible');
    cy.get('.consulta .preco').should('contain.text', 'R$');
    cy.get('.consulta a.btn')
      .should('contain.text', 'comprar')
      .and('have.attr', 'href', '/comprar-consulta-placa/leilao');
    cy.contains('li', 'Histórico de Leilão').should('be.visible');
  });
});
