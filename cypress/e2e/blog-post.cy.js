describe('Blog post view', () => {
  const post = {
    id: 1,
    titulo: 'Guia completo para avaliar um veículo usado',
    slug: 'guia-avaliar-veiculo',
    body: '<p>Conteúdo principal do post</p>',
    descricao: 'Aprenda os pontos essenciais para avaliar um veículo usado.',
    categoria: 'Dicas',
    linkImg: 'https://example.com/post-principal.png',
    categoriaSlug: 'dicas',
    dataCriacao: '2024-02-01T10:00:00.000Z',
    autor: 'Especialista Carcheck'
  };

  const highlights = {
    posts: [
      { ...post },
      {
        id: 2,
        titulo: 'Checklist de compra segura',
        slug: 'checklist-compra-segura',
        body: '<p>Como garantir uma compra sem surpresas.</p>',
        descricao: 'Itens que você precisa conferir antes de comprar um carro usado.',
        categoria: 'Dicas',
        linkImg: 'https://example.com/checklist.png',
        categoriaSlug: 'dicas',
        dataCriacao: '2024-02-10T10:00:00.000Z',
        autor: 'Equipe Carcheck',
        slugCategory: 'dicas',
        category: 'Dicas'
      },
      {
        id: 3,
        titulo: 'Como identificar quilometragem adulterada',
        slug: 'quilometragem-adulterada',
        body: '<p>Dicas para fugir de fraudes comuns.</p>',
        descricao: 'Veja sinais que indicam adulteração de quilometragem.',
        categoria: 'Segurança',
        linkImg: 'https://example.com/quilometragem.png',
        categoriaSlug: 'seguranca',
        dataCriacao: '2024-02-15T10:00:00.000Z',
        autor: 'Equipe Carcheck',
        slugCategory: 'seguranca',
        category: 'Segurança'
      },
      {
        id: 4,
        titulo: 'Documentos que não podem faltar',
        slug: 'documentos-indispensaveis',
        body: '<p>Saiba quais documentos solicitar.</p>',
        descricao: 'Documentação essencial antes de fechar negócio.',
        categoria: 'Tutoriais',
        linkImg: 'https://example.com/documentos.png',
        categoriaSlug: 'tutoriais',
        dataCriacao: '2024-02-20T10:00:00.000Z',
        autor: 'Equipe Carcheck',
        slugCategory: 'tutoriais',
        category: 'Tutoriais'
      }
    ],
    totalDePosts: 4
  };

  beforeEach(() => {
    cy.intercept('GET', '**/painel/getPostById/1', post).as('getPost');
    cy.intercept('GET', '**/painel/getPosts/?currentPage=1&qtdPerPage=3', highlights).as('getHighlights');
  });

  it('exibe a postagem e os destaques relacionados', () => {
    cy.visit('/blog/1/guia-avaliar-veiculo');
    cy.wait('@getPost');
    cy.wait('@getHighlights');

    cy.get('#destaque_interno h2').should('contain', post.titulo);
    cy.get('#destaque_interno h5').should('contain', post.categoria);
    cy.get('.list-share li').should('have.length', 4);
    cy.contains('#conteudo', 'Conteúdo principal do post');

    cy.get('.sidebar h3').should('contain', 'Descubra mais');
    cy.get('.sidebar li.cat-item').should('have.length', 2);
    cy.get('.sidebar li.cat-item').first().within(() => {
      cy.get('h4').should('contain', highlights.posts[1].titulo);
      cy.get('small').should('exist');
    });
    cy.get('.sidebar li.cat-item').eq(1).within(() => {
      cy.get('h4').should('contain', highlights.posts[2].titulo);
    });

    cy.get('.sidebar button.btn.btn-warning').should('contain', 'Ver mais');
    cy.document().its('title').should('eq', post.titulo);
    cy.get('meta[name="description"]').should('have.attr', 'content', post.descricao);
  });
});
