describe('Informative pages', () => {
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
  });

  it('displays FAQ page', () => {
    cy.visit('/duvidas-frequentes');
    cy.contains('h1', 'Perguntas frequentes').should('be.visible');
  });

  it('displays blog page', () => {
    cy.visit('/blog');
    cy.contains('h3', 'Blog').should('be.visible');
  });

  it('displays privacy policy page', () => {
    cy.visit('/politica-de-privacidade');
    cy.contains('h2', 'Política de Privacidade').should('be.visible');
  });
});
