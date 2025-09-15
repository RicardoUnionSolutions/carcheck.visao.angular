const ENDPOINT = '**/consultar/dadosLaudoVeiculo/**';

const visitVistoria = (fixtureName, token) => {
  cy.intercept('GET', ENDPOINT, { fixture: fixtureName }).as('getVistoria');
  cy.visit(`/vistoria/${token}`);
  cy.wait('@getVistoria').its('response.statusCode').should('eq', 200);
  cy.title().should('eq', 'Acompanhamento da Vistoria');
};

describe('Tela de Vistoria', () => {
  it('exibe dados completos quando a vistoria foi solicitada', () => {
    visitVistoria('vistoria-solicitado.json', 'token-solicitado');

    cy.contains('INFORMAÇÕES DA VISTORIA').should('be.visible');
    cy.get('app-step-by-step-sm .step')
      .eq(0)
      .should('have.class', 'active')
      .and('not.have.class', 'done');
    cy.get('app-step-by-step-sm .step').eq(1).should('not.have.class', 'done');

    cy.contains(/Recebemos sua solicitação/i).should('be.visible');

    cy.contains('h4', /^Modelo$/)
      .parent()
      .within(() => {
        cy.contains('Uno Way 1.0');
      });
    cy.contains('h4', /^Ano fabricação \/ Modelo$/)
      .parent()
      .within(() => {
        cy.contains('2022');
        cy.contains('2023');
      });
    cy.contains('h4', /^Proprietário$/)
      .parent()
      .within(() => {
        cy.contains('João Silva');
      });
    cy.contains('h4', /^Contato$/)
      .parent()
      .within(() => {
        cy.contains('(11) 91234-5678');
      });
    cy.contains('h4', /^Localidade$/)
      .parent()
      .within(() => {
        cy.contains('Cariacica - ES');
      });
    cy.contains('h4', /^Solicitação$/)
      .parent()
      .find('span')
      .invoke('text')
      .should('match', /\d{2}\/\d{2}\/\d{4}/);
    cy.contains('h4', /^Vistoria$/)
      .parent()
      .find('span')
      .should('contain', 'Não realizada');

    cy.contains('SALVAR PDF').should('not.exist');
  });

  it('mostra o progresso quando a vistoria está agendada', () => {
    visitVistoria('vistoria-agendado.json', 'token-agendado');

    cy.get('app-step-by-step-sm .step').eq(0).should('have.class', 'done');
    cy.get('app-step-by-step-sm .step').eq(1).should('have.class', 'active');
    cy.get('app-step-by-step-sm .step').eq(2).should('not.have.class', 'done');

    cy.contains(/vistoria já está agendada/i).should('be.visible');
    cy.contains('h4', /^Vistoria$/)
      .parent()
      .find('span')
      .should('contain', '12/05/2024');
    cy.get('img[alt="Peugeot 208"]')
      .should('have.attr', 'src')
      .and('include', 'peugeot208.png');
    cy.contains('SALVAR PDF')
      .should('have.attr', 'href', 'https://example.com/laudo-agendado.pdf')
      .and('have.attr', 'target', 'blank');
  });

  it('destaca a etapa correta quando a vistoria foi realizada', () => {
    visitVistoria('vistoria-vistoriado.json', 'token-vistoriado');

    cy.get('app-step-by-step-sm .step').eq(0).should('have.class', 'done');
    cy.get('app-step-by-step-sm .step').eq(1).should('have.class', 'done');
    cy.get('app-step-by-step-sm .step').eq(2).should('have.class', 'active');

    cy.contains(/Já realizamos sua vistoria/i).should('be.visible');
    cy.contains('h4', /^Vistoria$/)
      .parent()
      .find('span')
      .should('contain', '25/03/2024');
  });

  it('marca todas as etapas quando o laudo foi finalizado', () => {
    visitVistoria('vistoria-finalizado.json', 'token-finalizado');

    cy.get('app-step-by-step-sm .step').each(($step, index) => {
      if (index < 3) {
        cy.wrap($step).should('have.class', 'done');
      } else {
        cy.wrap($step).should('have.class', 'active');
      }
    });
    cy.get('.container.py-5.text-center').should('not.exist');
    cy.contains('SALVAR PDF')
      .should('have.attr', 'href', 'https://example.com/laudo-final.pdf')
      .and('have.attr', 'target', 'blank');
  });
});
