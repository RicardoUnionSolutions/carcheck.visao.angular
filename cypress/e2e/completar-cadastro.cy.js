const base64Url = (str) => Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

describe('Completar cadastro', () => {
  it('permite preencher e atualizar dados do usuario', () => {
    const userData = {
      cliente: { tipoPessoa: 'FISICA', documento: '12345678901' },
      email: 'old@example.com',
      nome: 'Old Name',
      senha: 'oldpass',
      endereco: {
        cidade: 'City',
        estado: 'ST',
        bairro: 'Bairro',
        numero: '1',
        complemento: '',
        endereco: 'Rua',
        cep: '12345-678'
      }
    };
    const token = `${base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${base64Url(
      JSON.stringify({ iss: JSON.stringify(userData) })
    )}.${base64Url('signature')}`;

    cy.intercept('POST', '**/cliente/atualizaDadosConta', {
      statusCode: 200,
      body: 'ok'
    }).as('update');

    cy.visit('/completar-cadastro', {
      onBeforeLoad(win) {
        win.localStorage.setItem('tokenLogin', token);
      }
    });

    cy.get('ck-input[data-cy=nome] input', { timeout: 10000 })
      .should('not.be.disabled')
      .clear()
      .type('Novo Nome');
    cy.get('ck-input[data-cy=email] input', { timeout: 10000 })
      .should('not.be.disabled')
      .clear()
      .type('novo@example.com');
    cy.get('ck-input[data-cy=confirm-email] input', { timeout: 10000 })
      .should('not.be.disabled')
      .clear()
      .type('novo@example.com');
    cy.get('ck-input[data-cy=senha] input', { timeout: 10000 })
      .should('not.be.disabled')
      .clear()
      .type('senha123');
    cy.get('ck-input[data-cy=confirm-senha] input', { timeout: 10000 })
      .should('not.be.disabled')
      .clear()
      .type('senha123');

    cy.get('[data-cy=update-btn]').click();
    cy.wait('@update').its('request.body').should('deep.include', {
      nome: 'Novo Nome',
      email: 'novo@example.com',
      senha: 'senha123'
    });
  });
});
