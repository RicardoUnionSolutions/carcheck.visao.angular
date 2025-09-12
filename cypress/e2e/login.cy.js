describe('Authentication flow', () => {
  it('logs in with valid credentials and logs out', () => {
    cy.intercept('POST', '**/cliente/login', {
      fixture: 'login-success.json',
      headers: { 'content-type': 'text/plain' },
    }).as('login');
    cy.visit('/login');
    cy.get('ck-input[data-cy=email] input').type('user@example.com');
    cy.get('ck-input[data-cy=password] input').type('123456');
    cy.get('[data-cy=login-btn]').first().click();
    cy.wait('@login');
    cy.url().should('not.include', '/login');
    cy.visit('/logout');
    cy.url().should('include', '/home');
  });

  it('rejects invalid login credentials', () => {
    cy.intercept('POST', '**/cliente/login', {
      statusCode: 200,
      body: 'erro_email_senha',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    }).as('loginFailure');
    cy.visit('/login');
    cy.get('ck-input[data-cy=email] input').type('user@example.com');
    cy.get('ck-input[data-cy=password] input').type('wrongpass');
    cy.get('[data-cy=login-btn]').first().click();
    cy.wait('@loginFailure');
    cy.url().should('include', '/login');
    cy.get('ck-input[data-cy=password] .msg')
      .should('be.visible')
      .and('contain', 'A senha não confere com o e-mail informado.');
  });
});
  