import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CompletarCadastroComponent } from "./completar-cadastro.component";
import { PessoaService } from "../service/pessoa.service";
import { TokenService } from "../service/token.service";
import { LoginService } from "../service/login.service";
import { Title, Meta } from "@angular/platform-browser";

describe("CompletarCadastroComponent", () => {
  let component: CompletarCadastroComponent;
  let fixture: ComponentFixture<CompletarCadastroComponent>;

  let pessoaServiceMock: any;
  let tokenServiceMock: any;
  let loginServiceMock: any;
  let titleServiceMock: any;
  let metaServiceMock: any;

  beforeEach(async () => {
    pessoaServiceMock = jasmine.createSpyObj("PessoaService", ["atualizar"]);
    tokenServiceMock = jasmine.createSpyObj("TokenService", ["decodeToken"]);
    loginServiceMock = jasmine.createSpyObj("LoginService", ["logIn"]);
    titleServiceMock = jasmine.createSpyObj("Title", ["setTitle"]);
    metaServiceMock = jasmine.createSpyObj("Meta", ["updateTag"]);

    await TestBed.configureTestingModule({
      declarations: [CompletarCadastroComponent],
      providers: [
        { provide: PessoaService, useValue: pessoaServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        { provide: Title, useValue: titleServiceMock },
        { provide: Meta, useValue: metaServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletarCadastroComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should init component, load data and set meta tags", () => {
    spyOn(component, "carregarDadosUsuarioLogado");
    spyOn(component, "verificarDados");
    component.ngOnInit();
    expect(component.carregarDadosUsuarioLogado).toHaveBeenCalled();
    expect(component.verificarDados).toHaveBeenCalled();
    expect(titleServiceMock.setTitle).toHaveBeenCalledWith(
      "Completar Cadastro - CarCheck"
    );
    expect(metaServiceMock.updateTag).toHaveBeenCalledWith({
      name: "description",
      content:
        "Preencha ou atualize seus dados cadastrais para continuar utilizando nossos serviços com segurança.",
    });
  });

  it("should init and map cadastro when token exists", () => {
    const user = {
      email: "user@test.com",
      nome: "User",
      senha: "123",
      cliente: { tipoPessoa: "FISICA", documento: "11122233344" },
      endereco: {
        cidade: "Cidade",
        estado: "UF",
        bairro: "Bairro",
        numero: "10",
        complemento: "Comp",
        endereco: "Rua",
        cep: "00000-000",
      },
    } as any;

    localStorage.setItem("tokenLogin", "token");
    tokenServiceMock.decodeToken.and.returnValue(JSON.stringify(user));

    component.ngOnInit();

    expect(tokenServiceMock.decodeToken).toHaveBeenCalledWith("tokenLogin");
    expect(component.cadastro).toEqual(
      jasmine.objectContaining({
        tipoPessoa: "0",
        cpf: "11122233344",
        email: "user@test.com",
        nome: "User",
        senha: "123",
        cidade: "Cidade",
        uf: "UF",
        bairro: "Bairro",
        numero: "10",
        complemento: "Comp",
        endereco: "Rua",
        cep: "00000-000",
      })
    );
  });

  it("should update cadastro successfully", fakeAsync(() => {
    pessoaServiceMock.atualizar.and.returnValue(Promise.resolve("token"));
    spyOn(component.atualizouCad, "emit");

    component.atualizarCadastro();
    tick();

    expect(component.atualizado).toBeTruthy();
    expect(loginServiceMock.logIn).toHaveBeenCalledWith("token");
    expect(component.atualizouCad.emit).toHaveBeenCalled();
  }));

  it("should handle atualizarCadastro errors", fakeAsync(() => {
    const consoleSpy = spyOn(console, "log");
    pessoaServiceMock.atualizar.and.returnValue(Promise.reject("error"));
    spyOn(component.atualizouCad, "emit");

    component.atualizarCadastro();
    tick();

    expect(component.atualizado).toBeFalsy();
    expect(loginServiceMock.logIn).not.toHaveBeenCalled();
    expect(component.atualizouCad.emit).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("erro", "error");
  }));

  it("should map user data to cadastro for pessoa fisica", () => {
    component.userDados = {
      email: "user@test.com",
      nome: "User",
      senha: "123",
      cliente: { tipoPessoa: "FISICA", documento: "11122233344" },
      endereco: {
        cidade: "Cidade",
        estado: "UF",
        bairro: "Bairro",
        numero: "10",
        complemento: "Comp",
        endereco: "Rua",
        cep: "00000-000",
      },
    } as any;

    component.verificarDados();

    expect(component.cadastro).toEqual(
      jasmine.objectContaining({
        tipoPessoa: "0",
        cpf: "11122233344",
        email: "user@test.com",
        nome: "User",
        senha: "123",
        cidade: "Cidade",
        uf: "UF",
        bairro: "Bairro",
        numero: "10",
        complemento: "Comp",
        endereco: "Rua",
        cep: "00000-000",
      })
    );
  });

  it("should set tipoPessoa to 1 for pessoa juridica", () => {
    component.userDados = {
      email: "user@test.com",
      nome: "Empresa",
      senha: "123",
      cliente: { tipoPessoa: "JURIDICA", documento: "00998877665544" },
      endereco: {
        cidade: "",
        estado: "",
        bairro: "",
        numero: "",
        complemento: "",
        endereco: "",
        cep: "",
      },
    } as any;

    component.verificarDados();

    expect(component.cadastro.tipoPessoa).toBe("1");
    expect(component.cadastro.cpf).toBe("00998877665544");
  });

  it("should emit cadastro on tipoPessoaChange", () => {
    spyOn(component.cadastroChange, "emit");
    component.tipoPessoaChange();
    expect(component.cadastroChange.emit).toHaveBeenCalledWith(
      component.cadastro
    );
  });

  it("should load user data when token exists", () => {
    localStorage.setItem("tokenLogin", "token");
    tokenServiceMock.decodeToken.and.returnValue('{"nome":"John"}');

    component.carregarDadosUsuarioLogado();

    expect(tokenServiceMock.decodeToken).toHaveBeenCalledWith("tokenLogin");
    expect(component.userDados).toEqual({ nome: "John" });
  });

  it("should not load user data when token is missing", () => {
    component.carregarDadosUsuarioLogado();
    expect(tokenServiceMock.decodeToken).not.toHaveBeenCalled();
    expect(component.userDados).toBeUndefined();
  });

  it("temToken should return true if token exists", () => {
    localStorage.setItem("tokenLogin", "token");
    spyOn(component, "carregarDadosUsuarioLogado");
    const result = component.temToken();
    expect(component.carregarDadosUsuarioLogado).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  it("temToken should return false if token does not exist", () => {
    spyOn(component, "carregarDadosUsuarioLogado");
    const result = component.temToken();
    expect(component.carregarDadosUsuarioLogado).toHaveBeenCalled();
    expect(result).toBeFalsy();
  });
});
