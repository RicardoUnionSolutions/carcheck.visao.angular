import { browser, by, element } from 'protractor';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ7c3RhdHVzOnRydWUsZW1haWw6dGVzdEB0ZXN0LmNvbSxjbGllbnRlOntkb2N1bWVudG86fX0iLCJleHAiOjE4OTM0NTYwMDB9.c2lnbmF0dXJl';

describe('Histórico de Consultas', () => {
  beforeEach(async () => {
    await browser.get('/home');
    await browser.executeScript(
      `window.localStorage.setItem('tokenLogin', '${TOKEN}')`
    );
  });

  it('deve exibir o histórico de consultas', async () => {
    await browser.get('/');
    const header = await element(by.css('historico-consulta h1')).getText();
    expect(header).toContain('HISTÓRICO');
    expect(header).toContain('CONSULTAS');
  });
});

describe('Dados da Conta', () => {
  beforeEach(async () => {
    await browser.get('/home');
    await browser.executeScript(
      `window.localStorage.setItem('tokenLogin', '${TOKEN}')`
    );
  });

  it('permite visualizar e editar dados da conta', async () => {
    await browser.get('/conta');
    const header = await element(by.css('dados-conta h1')).getText();
    expect(header).toContain('MINHA');
    const nameInput = element(by.css('ck-input input'));
    await nameInput.clear();
    await nameInput.sendKeys('Nome Teste');
    expect(await nameInput.getAttribute('value')).toBe('Nome Teste');
  });
});
