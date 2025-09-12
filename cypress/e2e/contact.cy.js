describe('Contact page', () => {
  it('sends a contact message', () => {
    cy.intercept('POST', '**/cliente/enviarContato', {
      statusCode: 200,
      body: {}
    }).as('sendContact');

    cy.visit('/contato');

    cy.get('input[formControlName="name"]').type('Tester');
    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="subject"]').type('Hello');
    cy.get('textarea[formControlName="message"]').type('Testing message');

    cy.get('button[type="submit"]').click();

    cy.wait('@sendContact').its('request.body').should('deep.include', {
      nome: 'Tester',
      email: 'test@example.com',
      assunto: 'Hello',
      mensagem: 'Testing message'
    });

    cy.get('.wpcf7-response-output').should('contain', 'Mensagem enviada com sucesso!');
  });
});
