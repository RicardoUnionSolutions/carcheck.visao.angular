describe('Processo de compra único', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ7XCJzdGF0dXNcIjp0cnVlLFwiY2xpZW50ZVwiOntcImRvY3VtZW50b1wiOlwiMTIzNDU2Nzg5MDBcIixcImRhdGFOYXNjaW1lbnRvXCI6XCIxOTkwLTAxLTAxXCIsXCJ0ZWxlZm9uZVwiOlwiMTIzNDU2Nzg5XCJ9LFwibm9tZVwiOlwiVGVzdCBVc2VyXCIsXCJlbWFpbFwiOlwidXNlckBleGFtcGxlLmNvbVwifSJ9.signature';

  it('permite selecionar um produto e avançar para o pagamento', () => {
    cy.intercept('GET', '**/consultar/pegarConsultaCliente*', { fixture: 'consultas.json' }).as('consultas');
    cy.visit('/comprar-consulta-placa', {
      onBeforeLoad(win) {
        win.localStorage.setItem('tokenLogin', token);
      }
    });
    cy.wait('@consultas');
    cy.get('.tipo-consulta-btn').first().click();
    cy.contains('button', 'Continuar').click();

    cy.get('input[maxlength="7"]').type('ABC1D23');
    cy.contains('button', 'Continuar').click();

    cy.contains('app-display-produto-pagamento', 'Consulta Veicular Completa').should('be.visible');
    cy.contains('button', 'Finalizar').should('be.visible');
  });
});
