import { browser } from 'protractor';

describe('carcheck App', () => {
  it('should display the application title', async () => {
    await browser.get('/home');
    const title = await browser.getTitle();
    expect(title).toEqual(
      'Carcheck Brasil | Consulta de veículos e Dicas Automotivas'
    );
  });
});
