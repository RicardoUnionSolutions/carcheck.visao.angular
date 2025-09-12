describe('Consulta de placas de veículos', () => {
  it('realiza consulta por placa e exibe resultado', () => {
    cy.intercept('POST', '**/consultar/pegarDadosVeiculoTelaInicial', {
      fixture: 'consulta-placa-success.json'
    }).as('consultaPlaca');

    cy.visit('/consulta-teste/ABC1234/test@example.com/Teste/token123');
    cy.wait('@consultaPlaca');
    cy.contains('MARCA / MODELO');
    cy.contains('ONIX');
  });
});

describe('Consulta de empresas', () => {
  it('carrega resultado de consulta de empresa', () => {
    cy.intercept('GET', '**/consultar/dadosConsultaVeiculoCompany/*', {
      fixture: 'consulta-company-success.json'
    }).as('consultaCompany');

    cy.visit('/visualizar-consulta/abc');
    cy.wait('@consultaCompany');
    cy.get('iframe').should('have.attr', 'src', 'https://example.com/company-result');
  });
});
