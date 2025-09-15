const MOCK_CONSULTA_RESPONSE = {
  consult_id: '123',
  vehicle: {
    license_plate: 'ABC1234',
    uf: 'SP',
    renavam: '12345678901',
  },
  veiculo: {
    marca: 'FIAT',
    modelo: 'UNO ATTRACTIVE',
    anoFabricacao: '2018',
    anoModelo: '2019',
    cor: 'Prata',
  },
  debits: [
    {
      debit_id: 1,
      type: 'IPVA',
      description: 'IPVA 2024',
      value: 5000,
      due_date: '2025-01-10T00:00:00Z',
    },
    {
      debit_id: 2,
      type: 'MULTA',
      ticket_description: 'Multa de velocidade',
      value: 2000,
      due_date: null,
    },
  ],
};

const CONSULTAR_ENDPOINT = '**/pinpag/consultarDebitos';
const GERAR_LINK_ENDPOINT = '**/pinpag/gerarLinkPagamento';

describe('Pagar Débitos', () => {
  it('valida os campos obrigatórios do formulário de consulta', () => {
    cy.visit('/pagar-debitos');

    cy.contains('button', 'Consultar').click();

    cy.get('#email')
      .parent()
      .find('.error')
      .should('be.visible')
      .and('contain', 'Campo obrigatório');
    cy.get('#placa')
      .parent()
      .find('.error')
      .should('be.visible')
      .and('contain', 'Campo obrigatório');
    cy.get('#renavam')
      .parent()
      .find('.error')
      .should('be.visible')
      .and('contain', 'Campo obrigatório');
  });

  it('permite consultar débitos, selecionar itens e abrir o pagamento', () => {
    cy.intercept('POST', CONSULTAR_ENDPOINT, (req) => {
      req.reply({ statusCode: 200, body: MOCK_CONSULTA_RESPONSE });
    }).as('consultarDebitos');

    cy.intercept('POST', GERAR_LINK_ENDPOINT, (req) => {
      req.reply({ statusCode: 200, body: { url: '/pagar-debitos' } });
    }).as('gerarLink');

    cy.visit('/pagar-debitos', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.get('#email').type('teste@teste.com');
    cy.get('#placa').type('abc1234');
    cy.get('#placa').should('have.value', 'ABC-1234');
    cy.get('#renavam').type('12345678901');

    cy.contains('button', 'Consultar').click();
    cy.wait('@consultarDebitos');

    cy.get('.lista-debitos li').should('have.length', MOCK_CONSULTA_RESPONSE.debits.length);

    cy.get('.lista-debitos input[type="checkbox"]').first().check({ force: true });
    cy.get('.relatorio .total strong').should('contain', 'R$ 50,00');

    cy.get('.lista-debitos input[type="checkbox"]').eq(1).check({ force: true });
    cy.get('.relatorio .total strong').should('contain', 'R$ 70,00');

    cy.get('.relatorio .btn-pagar').first().click();
    cy.get('.form-pagamento').should('be.visible');

    cy.get('#nome').should('exist');
    cy.get('#documento').should('exist');

    cy.get('.form-pagamento form').within(() => {
      cy.contains('button', 'Pagar Débitos').click();
    });

    cy.get('#nome')
      .parent()
      .find('.error')
      .should('be.visible')
      .and('contain', 'Campo obrigatório');
    cy.get('#documento')
      .parent()
      .find('.error')
      .should('be.visible')
      .and('contain', 'Campo obrigatório');

    cy.get('#nome').type('Fulano de Tal');
    cy.get('#documento').type('12345678901');

    cy.get('.form-pagamento form').within(() => {
      cy.contains('button', 'Pagar Débitos').click();
    });

    cy.wait('@gerarLink')
      .its('request.body')
      .should((body) => {
        expect(body.consult_id).to.equal(MOCK_CONSULTA_RESPONSE.consult_id);
        expect(body.debits).to.deep.equal([1, 2]);
        expect(body.total_amount).to.be.greaterThan(body.service_amount);
      });
  });
});
