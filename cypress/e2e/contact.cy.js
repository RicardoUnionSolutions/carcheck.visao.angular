describe('Contact page', () => {
  const fillForm = () => {
    cy.get('input[formControlName="name"]').type('Tester');
    cy.get('input[formControlName="email"]').type('test@example.com');
    cy.get('input[formControlName="subject"]').type('Hello');
    cy.get('textarea[formControlName="message"]').type('Testing message');
  };

  it('shows validation errors when submitting an empty form', () => {
    cy.intercept('POST', '**/cliente/enviarContato', () => {
      throw new Error('Request should not be sent when form is invalid');
    });

    cy.visit('/contato');

    cy.get('input[formControlName="name"]').focus().blur();
    cy.get('input[formControlName="email"]').focus().blur();
    cy.get('input[formControlName="subject"]').focus().blur();
    cy.get('textarea[formControlName="message"]').focus().blur();

    cy.get('button[type="submit"]').click();

    cy.contains('O nome é obrigatório.').should('be.visible');
    cy.contains('O e-mail é obrigatório.').should('be.visible');
    cy.contains('O assunto é obrigatório.').should('be.visible');
    cy.contains('A mensagem é obrigatória.').should('be.visible');
    cy.get('.wpcf7-response-output').should('not.exist');
  });

  it('sends a contact message', () => {
    cy.intercept('POST', '**/cliente/enviarContato', {
      statusCode: 200,
      body: {}
    }).as('sendContact');

    cy.visit('/contato');

    fillForm();

    cy.get('button[type="submit"]').click();

    cy.wait('@sendContact').its('request.body').should('deep.include', {
      nome: 'Tester',
      email: 'test@example.com',
      assunto: 'Hello',
      mensagem: 'Testing message'
    });

    cy.get('.wpcf7-response-output').should('contain', 'Mensagem enviada com sucesso!');
  });

  it('shows an error message when the request fails', () => {
    cy.intercept('POST', '**/cliente/enviarContato', {
      statusCode: 500,
      body: { message: 'Erro' }
    }).as('sendContactError');

    cy.visit('/contato');

    fillForm();

    cy.get('button[type="submit"]').click();

    cy.wait('@sendContactError').its('request.body').should('deep.include', {
      nome: 'Tester',
      email: 'test@example.com',
      assunto: 'Hello',
      mensagem: 'Testing message'
    });

    cy.get('.wpcf7-response-output').should(
      'contain',
      'Erro ao enviar mensagem. Tente novamente mais tarde.'
    );
  });
});
