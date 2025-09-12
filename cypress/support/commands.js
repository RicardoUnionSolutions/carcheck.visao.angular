Cypress.Commands.add('login', () => {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ7XCJzdGF0dXNcIjoxLFwiY2xpZW50ZVwiOntcImRvY3VtZW50b1wiOlwiMTIzLjQ1Ni43ODktMDBcIixcImRhdGFOYXNjaW1lbnRvXCI6XCIxOTkwLTAxLTAxXCIsXCJjbGllbnRlQW50aWdvXCI6ZmFsc2V9LFwibm9tZVwiOlwiVGVzdFwifSJ9.c2lnbmF0dXJl';
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('tokenLogin', token);
    },
  });
});

