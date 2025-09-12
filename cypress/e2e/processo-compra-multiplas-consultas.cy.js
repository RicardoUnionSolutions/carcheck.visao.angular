describe('Processo de compra com múltiplas consultas', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ7XCJzdGF0dXNcIjp0cnVlLFwiY2xpZW50ZVwiOntcImRvY3VtZW50b1wiOlwiMTIzNDU2Nzg5MDBcIixcImRhdGFOYXNjaW1lbnRvXCI6XCIxOTkwLTAxLTAxXCIsXCJ0ZWxlZm9uZVwiOlwiMTIzNDU2Nzg5XCJ9LFwibm9tZVwiOlwiVGVzdCBVc2VyXCIsXCJlbWFpbFwiOlwidXNlckBleGFtcGxlLmNvbVwifSJ9.signature';

  it('permite adicionar consultas ao carrinho e prosseguir para o pagamento', () => {
    cy.visit('/processo-compra-multipla', {
      onBeforeLoad(win) {
        win.localStorage.setItem('tokenLogin', token);
      }
    });

    cy.get('ck-counter').first().find('button').last().click();
    cy.contains('button', 'Continuar').should('not.be.disabled').click();

    cy.contains('app-display-produto-pagamento', 'Consulta Completa').should('be.visible');
    cy.contains('button', 'Finalizar').should('be.visible');
  });
});
