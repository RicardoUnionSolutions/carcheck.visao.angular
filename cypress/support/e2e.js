require('./commands');

// Ignore internal Cypress errors related to replaceAll while
// keeping other unexpected exceptions visible during debugging.
Cypress.on('uncaught:exception', (err) => {
  if (err && err.message && err.message.includes('replaceAll')) {
    return false;
  }
});
