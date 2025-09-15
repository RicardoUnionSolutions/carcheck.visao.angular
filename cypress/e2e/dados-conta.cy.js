const base64Url = (str) =>
  Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const defaultUser = {
  status: true,
  email: "john@test.com",
  nome: "John Doe",
  cliente: {
    documento: "39053344705",
    dataNascimento: "2000-01-01T00:00:00",
    telefone: "11988887777",
    clienteAntigo: false,
  },
  endereco: {
    cep: "12345678",
    endereco: "Rua A",
    bairro: "Bairro C",
    estado: "SP",
    cidade: "Cidade B",
    numero: "123",
    complemento: "Ap 1",
  },
};

const buildToken = (overrides = {}) => {
  const user = Cypress._.merge({}, defaultUser, overrides);
  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: JSON.stringify(user),
    })
  );
  const signature = base64Url("signature");
  return `${header}.${payload}.${signature}`;
};

const visitConta = (tokenOverrides = {}) => {
  const token = buildToken(tokenOverrides);
  cy.visit("/conta", {
    onBeforeLoad(win) {
      win.localStorage.setItem("tokenLogin", token);
    },
  });
};

const getInputByLabel = (label) =>
  cy.contains("label", label).prev("input");

const getSelectByLabel = (label) =>
  cy.contains("label", label).prev("select");

describe("Dados da conta", () => {
  it("permite visualizar e atualizar os dados da conta", () => {
    cy.intercept("POST", "**/cliente/atualizaDadosConta", (req) => {
      req.reply({
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: '"updated-token"',
      });
    }).as("updateAccount");

    cy.intercept(
      "GET",
      "https://viacep.com.br/ws/87654321/json/",
      {
        statusCode: 200,
        body: {
          logradouro: "Rua Nova",
          localidade: "Cidade Nova",
          bairro: "Bairro Novo",
          uf: "RJ",
        },
      }
    ).as("buscarCep");

    visitConta();

    cy.contains("h1", "Informações Pessoais").should("be.visible");

    getInputByLabel("Nome").should("have.value", "John Doe");
    getInputByLabel("Email")
      .should("have.value", "john@test.com")
      .and("be.disabled");

    getInputByLabel("Nome").clear().type("Maria Silva");
    getInputByLabel("Telefone")
      .type("{selectall}{backspace}11997776666");
    getInputByLabel("CEP")
      .type("{selectall}{backspace}87654321");

    cy.wait("@buscarCep");

    getInputByLabel("Rua").should("have.value", "Rua Nova");
    getInputByLabel("Cidade").should("have.value", "Cidade Nova");
    getInputByLabel("Bairro").should("have.value", "Bairro Novo");
    getSelectByLabel("UF").should("have.value", "RJ");

    getInputByLabel("Nº").type("{selectall}{backspace}321");
    getInputByLabel("Complemento").type("{selectall}{backspace}Casa 2");

    getInputByLabel("Senha atual")
      .type("{selectall}{backspace}SenhaAtual123");
    getInputByLabel("Nova senha")
      .type(" nova 1234 ");

    cy.contains("button", "SALVAR").click();

    cy.wait("@updateAccount")
      .its("request.body")
      .should((body) => {
        expect(body).to.include({
          nome: "Maria Silva",
          senha: "nova1234",
          senhaAntiga: "SenhaAtual123",
          cep: "87.654-321",
          endereco: "Rua Nova",
          numero: "321",
          bairro: "Bairro Novo",
          cidade: "Cidade Nova",
          complemento: "Casa 2",
          estado: "RJ",
          uf: "RJ",
          email: "john@test.com",
          documento: "39053344705",
        });
        expect(body.telefone.replace(/\D/g, "")).to.eq("11997776666");
      });

    cy.contains("Dados alterados com sucesso.").should("be.visible");
    getInputByLabel("Senha atual").should("have.value", "");
    getInputByLabel("Nova senha").should("have.value", "");
    cy.contains("button", "SALVAR").should("not.be.disabled");
  });

  it("exibe mensagem de erro quando a senha atual está incorreta", () => {
    cy.intercept("POST", "**/cliente/atualizaDadosConta", {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: '"erro_senha"',
    }).as("updateAccountErro");

    visitConta();

    cy.contains("h1", "Informações de acesso").should("be.visible");

    getInputByLabel("Senha atual")
      .type("{selectall}{backspace}SenhaInvalida");

    cy.contains("button", "SALVAR").click();

    cy.wait("@updateAccountErro");

    cy.contains("Senha incorreta.").should("be.visible");
    cy.contains("Dados alterados com sucesso.").should("not.be.visible");
  });
});

