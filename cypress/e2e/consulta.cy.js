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

describe('Visualização de consulta', () => {
  it('exibe detalhes completos da consulta concluída', () => {
    cy.intercept('GET', '**/consultar/dadosConsultaVeiculo/*', {
      fixture: 'consulta-visualizacao-success.json'
    }).as('consultaDetalhe');

    cy.visit('/consulta/token-exemplo');
    cy.wait('@consultaDetalhe');
    cy.contains('DETALHES DA CONSULTA');
    cy.contains('MARCA / MODELO');
    cy.contains('Honda / Civic Touring');
    cy.contains('FABRICAÇÃO / MODELO');
    cy.contains('2021 / 2022');
    cy.contains('ENTRADA:');
    cy.contains('ABC1D23');
    cy.contains('CÓDIGO DA CONSULTA:');
    cy.contains('98765');
    cy.contains('TOKEN DA CONSULTA:');
    cy.contains('token-exemplo');
  });

  it('informa quando a consulta não possui registros', () => {
    cy.intercept('GET', '**/consultar/dadosConsultaVeiculo/*', {
      fixture: 'consulta-visualizacao-semregistro.json'
    }).as('consultaSemRegistro');

    cy.visit('/consulta/token-semregistro');
    cy.wait('@consultaSemRegistro');
    cy.contains('Veículo não encontrado!');
    cy.contains('Não há registro no DETRAN ou DENATRAN');
    cy.contains('NOVA CONSULTA');
  });
});
