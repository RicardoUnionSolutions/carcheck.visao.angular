const FAQ_COUNT = 26;
const META_DESCRIPTION =
  'Encontre respostas para as perguntas mais comuns sobre nossas consultas veiculares, planos e formas de pagamento.';

describe('Dúvidas frequentes page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/painel/**', req => {
      if (req.url.includes('getPosts')) {
        req.reply({ statusCode: 200, body: { posts: [], totalDePosts: 0 } });
      } else if (req.url.includes('getCategorias')) {
        req.reply({ statusCode: 200, body: { listaDeCategorias: [] } });
      } else if (req.url.includes('getPostsByCategoria')) {
        req.reply({ statusCode: 200, body: { posts: [], totalDePosts: 0 } });
      } else {
        req.reply({ statusCode: 200, body: {} });
      }
    }).as('apiPainel');

    cy.visit('/duvidas-frequentes');
  });

  it('displays the FAQ heading and metadata', () => {
    cy.contains('h1', 'Perguntas frequentes').should('be.visible');
    cy.title().should('eq', 'Dúvidas Frequentes | CarCheck');
    cy.get('meta[name="description"]').should('have.attr', 'content', META_DESCRIPTION);
  });

  it('renders the entire FAQ list collapsed by default', () => {
    cy.get('.card').should('have.length', FAQ_COUNT);
    cy.get('.card').first().within(() => {
      cy.get('.question-text').should(
        'contain',
        'O que é o Carcheck Brasil?'
      );
    });
    cy.get('.card .accordion-body-wrapper.open').should('not.exist');
    cy.get('.card .icon.rotar').should('not.exist');
  });

  it('toggles different FAQ cards when clicking their headers', () => {
    cy.get('.card').eq(0).as('firstCard');
    cy.get('.card').eq(1).as('secondCard');

    cy.get('@firstCard').find('.card-header').click();
    cy.get('@firstCard')
      .find('.accordion-body-wrapper')
      .should('have.class', 'open');
    cy.get('@firstCard').find('.icon').should('have.class', 'rotar');

    cy.get('@secondCard').find('.card-header').click();
    cy.get('@secondCard')
      .find('.accordion-body-wrapper')
      .should('have.class', 'open');
    cy.get('@secondCard').find('.icon').should('have.class', 'rotar');

    cy.get('@firstCard')
      .find('.accordion-body-wrapper')
      .should('not.have.class', 'open');
    cy.get('@firstCard').find('.icon').should('not.have.class', 'rotar');
  });

  it('allows toggling the same FAQ repeatedly', () => {
    cy.get('.card').eq(0).as('firstCard');

    cy.get('@firstCard').find('.card-header').click();
    cy.get('@firstCard')
      .find('.accordion-body-wrapper')
      .should('have.class', 'open');

    cy.get('@firstCard').find('.card-header').click();
    cy.get('@firstCard')
      .find('.accordion-body-wrapper')
      .should('not.have.class', 'open');

    cy.get('@firstCard').find('.card-header').click();
    cy.get('@firstCard')
      .find('.accordion-body-wrapper')
      .should('have.class', 'open');
    cy.get('@firstCard').find('.icon').should('have.class', 'rotar');
  });
});
