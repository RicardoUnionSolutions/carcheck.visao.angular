import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { PessoaService } from "./pessoa.service";
import { VariableGlobal } from "./variable.global.service";
import { LoginService } from "./login.service";

describe("PessoaService", () => {
  let service: PessoaService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let variableSpy: jasmine.SpyObj<VariableGlobal>;
  let loginSpy: jasmine.SpyObj<LoginService>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj("HttpClient", ["post", "get"]);
    variableSpy = jasmine.createSpyObj("VariableGlobal", ["getUrl"]);
    variableSpy.getUrl.and.callFake((url: string) => `base/${url}`);
    loginSpy = jasmine.createSpyObj("LoginService", [
      "getEmail",
      "getTelefone",
      "logIn",
    ]);

    TestBed.configureTestingModule({
      providers: [
        PessoaService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: VariableGlobal, useValue: variableSpy },
        { provide: LoginService, useValue: loginSpy },
      ],
    });

    service = TestBed.inject(PessoaService);
  });

  afterEach(() => {
    localStorage.clear();
    document.cookie =
      "identificadorParceiro=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  });

  it("should read existing cookie value", () => {
    document.cookie = "foo=bar";
    expect(service.getCookie("foo")).toBe("bar");
  });

  it("should return null for missing cookie", () => {
    expect(service.getCookie("missing")).toBeNull();
  });

  it("should delegate getEmail and getTelefone to LoginService", () => {
    loginSpy.getEmail.and.returnValue("a@a");
    loginSpy.getTelefone.and.returnValue("123");
    expect(service.getEmail()).toBe("a@a");
    expect(service.getTelefone()).toBe("123");
  });

  it("should register user with lowercased email and partner cookie", async () => {
    httpSpy.post.and.returnValue(of("ok"));
    spyOn(service, "getCookie").and.returnValue("id");
    const cad: any = { email: "USER@MAIL.COM" };
    await service.adicionar(cad);
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/cadastrarCliente",
      { email: "user@mail.com", identificacaoParceiro: "id" },
      { responseType: "json" }
    );
  });

  it("should register user without partner when cookie absent", async () => {
    httpSpy.post.and.returnValue(of("ok"));
    const cad: any = { email: "USER@MAIL.COM" };
    await service.adicionar(cad);
    const args = httpSpy.post.calls.mostRecent().args;
    expect(args[0]).toBe("base/cliente/cadastrarCliente");
    expect(args[1].identificacaoParceiro).toBeUndefined();
  });

  it("should update user data", async () => {
    httpSpy.post.and.returnValue(of("ok"));
    const cad: any = { nome: "x" };
    await service.atualizar(cad);
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/atualizaDadosConta",
      cad,
      { responseType: "json" }
    );
  });

  it("should get credito with lowercased email", () => {
    httpSpy.get.and.returnValue(of("ok"));
    service.getCreditoCliente("USER@MAIL.COM").subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith(
      "base/consultar/pegarCreditoCliente?email=user@mail.com"
    );
  });

  it("should register facebook user and include partner cookie", () => {
    httpSpy.post.and.returnValue(of("ok"));
    spyOn(service, "getCookie").and.returnValue("fb");
    const cad: any = {};
    service.adicionarFB(cad).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/cadastrarClienteFacebook",
      { identificacaoParceiro: "fb" },
      { responseType: "json" }
    );
  });

  it("should register google user", () => {
    httpSpy.post.and.returnValue(of("ok"));
    const cad: any = { nome: "g" };
    service.adicionarGoogle(cad).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/cadastrarClienteGoogle",
      cad,
      { responseType: "json" }
    );
  });

  it("should login user and store manterconectado", () => {
    httpSpy.post.and.returnValue(of("token"));
    const login: any = {
      login: "USER",
      email: "USER@MAIL.COM",
      manterconectado: true,
    };
    service.logar(login).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/login",
      {
        login: "user",
        email: "user@mail.com",
        manterconectado: true,
      },
      { responseType: "json" }
    );
    expect(localStorage.getItem("manterconectado")).toBe(
      JSON.stringify({
        login: "user",
        email: "user@mail.com",
        manterconectado: true,
      })
    );
  });

  it("should login via facebook and call loginService.logIn", () => {
    httpSpy.post.and.returnValue(of("token"));
    const login: any = { manterconectado: true };
    service.logarFB(login).subscribe((res) => expect(res).toBe("token"));
    expect(httpSpy.post).toHaveBeenCalledWith("base/cliente/loginFB", login, {
      responseType: "json",
    });
    expect(loginSpy.logIn).toHaveBeenCalledWith("token");
    expect(localStorage.getItem("manterconectado")).toBe(JSON.stringify(login));
  });

  it("should login via google and call loginService.logIn", () => {
    httpSpy.post.and.returnValue(of("token"));
    const login: any = { manterconectado: true };
    service.logarGoogle(login).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/loginGoogle",
      login,
      { responseType: "json" }
    );
    expect(loginSpy.logIn).toHaveBeenCalledWith("token");
    expect(localStorage.getItem("manterconectado")).toBe(JSON.stringify(login));
  });

  it("should request password recovery with lowercased email", () => {
    httpSpy.post.and.returnValue(of("ok"));
    service.recuperarSenha("USER@MAIL.COM").subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/recuperarSenha",
      { email: "user@mail.com" },
      { responseType: "json" }
    );
  });

  it("should complete cadastro during payment", () => {
    httpSpy.post.and.returnValue(of("ok"));
    const cad: any = { a: 1 };
    service.completarCadastroPagamento(cad).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/completaDadosConta",
      cad,
      { responseType: "json" }
    );
  });

  it("should send email marketing data", () => {
    httpSpy.post.and.returnValue(of("ok"));
    const body: any = { a: 1 };
    service.cadastrarAtualizarEmailMarketing(body).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/enviaEmailMarketing",
      body
    );
  });

  it("should schedule email marketing", () => {
    httpSpy.post.and.returnValue(of("ok"));
    service.agendarEmailMarketing().subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/agendarEmailMarketing",
      {}
    );
  });

  it("should register email marketing", () => {
    httpSpy.post.and.returnValue(of("ok"));
    const body: any = { a: 1 };
    service.cadastraEmailMarketing(body).subscribe();
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/cadastraEmailMarketing",
      body
    );
  });

  it("should send contact and return promise", async () => {
    httpSpy.post.and.returnValue(of("ok"));
    const body: any = { text: "a" };
    await service.enviarContato(body);
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/enviarContato",
      body
    );
  });

  it("should verify code", async () => {
    httpSpy.post.and.returnValue(of("ok"));
    const entrada: any = { a: 1 };
    await service.verificarCodigo(entrada);
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/verificarCodigo",
      entrada
    );
  });

  it("should resend verification code", async () => {
    httpSpy.post.and.returnValue(of("ok"));
    const entrada: any = { a: 1 };
    await service.reenviarCodigo(entrada);
    expect(httpSpy.post).toHaveBeenCalledWith(
      "base/cliente/reenviarVerificacao",
      entrada
    );
  });
});
