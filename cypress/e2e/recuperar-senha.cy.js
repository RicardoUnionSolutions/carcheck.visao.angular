describe('Password recovery flow', () => {
  it('requests password reset for valid email', () => {
    cy.intercept('POST', '**/cliente/recuperarSenha', {
      statusCode: 200,
      body: 'ok',
      headers: { 'content-type': 'text/plain' }
    }).as('recuperar');
    cy.visit('/recuperar-senha');
    cy.get('ck-input[data-cy=email] input').type('user@example.com');
    cy.contains('button', 'Confirmar').click();
    cy.wait('@recuperar');
    cy.contains('E-mail enviado com sucesso!').should('be.visible');
  });

  it('shows validation error for invalid email', () => {
    cy.intercept('POST', '**/cliente/recuperarSenha').as('recuperar');
    cy.visit('/recuperar-senha');
    cy.get('ck-input[data-cy=email] input').type('invalid-email');
    cy.contains('button', 'Confirmar').click();
    cy.get('ck-input[data-cy=email] .msg').should('contain', 'Email inválido');
    cy.wait(500);
    cy.get('@recuperar.all').should('have.length', 0);
  });

  it('shows error when email is not registered', () => {
    cy.intercept('POST', '**/cliente/recuperarSenha', {
      statusCode: 200,
      body: 'email_nao_cadastrado',
      headers: { 'content-type': 'text/plain' }
    }).as('recuperar');
    cy.visit('/recuperar-senha');
    cy.get('ck-input[data-cy=email] input').type('notfound@example.com');
    cy.contains('button', 'Confirmar').click();
    cy.wait('@recuperar');
    cy.get('ck-input[data-cy=email] .msg').should('contain', 'E-mail não cadastrado');
  });
});

