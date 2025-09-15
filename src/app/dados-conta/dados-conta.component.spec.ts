import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  flushMicrotasks,
  waitForAsync,
} from "@angular/core/testing";
import { ReactiveFormsModule, UntypedFormBuilder } from "@angular/forms";
import { of } from "rxjs";

import { DadosContaComponent } from "./dados-conta.component";
import { VariableGlobal } from "../service/variable.global.service";
import { CepService } from "../service/cep.service";
import { LoginService } from "../service/login.service";
import { PessoaService } from "../service/pessoa.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { TokenService } from "../service/token.service";
import { Title } from "@angular/platform-browser";
import { Meta } from "@angular/platform-browser";

const variableGlobalStub = {
  getUrlSite: () => ({ home: "http://site.com" }),
  getUrl: () => "http://api",
};

const cepResponse = {
  logradouro: "Rua A",
  localidade: "Cidade B",
  bairro: "Bairro C",
  uf: "SP",
  erro: false,
};

const cepServiceStub: Partial<CepService> = {
  search: jasmine
    .createSpy("search")
    .and.returnValue(Promise.resolve(cepResponse)),
};

const loginMock = {
  email: "john@test.com",
  nome: "John Doe",
  cliente: {
    documento: "39053344705",
    dataNascimento: "01/01/2000",
    telefone: "9999-9999",
  },
  endereco: {
    cep: "12.345-678",
    endereco: "Rua A",
    bairro: "Bairro C",
    estado: "SP",
    cidade: "Cidade B",
    numero: "123",
    complemento: "Ap 1",
  },
};

const loginServiceStub = {
  getLogIn: () => of(loginMock),
  logIn: jasmine.createSpy("logIn"),
};

const pessoaServiceStub = {
  atualizar: jasmine
    .createSpy("atualizar")
    .and.returnValue(Promise.resolve("new-token")),
};

describe("DadosContaComponent", () => {
  let component: DadosContaComponent;
  let fixture: ComponentFixture<DadosContaComponent>;
  let cepService: CepService;
  let pessoaService: any;
  let titleService: jasmine.SpyObj<Title>;
  let metaService: jasmine.SpyObj<Meta>;

  beforeEach(waitForAsync(() => {
    titleService = jasmine.createSpyObj("Title", ["setTitle"]);
    metaService = jasmine.createSpyObj("Meta", ["updateTag"]);

    TestBed.configureTestingModule({
      declarations: [DadosContaComponent],
      imports: [ReactiveFormsModule],
      providers: [
        UntypedFormBuilder,
        { provide: VariableGlobal, useValue: variableGlobalStub },
        { provide: CepService, useValue: cepServiceStub },
        { provide: LoginService, useValue: loginServiceStub },
        { provide: PessoaService, useValue: pessoaServiceStub },
        { provide: dadosConsultaService, useValue: {} },
        { provide: TokenService, useValue: {} },
        { provide: Title, useValue: titleService },
        { provide: Meta, useValue: metaService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DadosContaComponent);
    component = fixture.componentInstance;
    cepService = TestBed.inject(CepService);
    pessoaService = TestBed.inject(PessoaService);
    (cepService.search as jasmine.Spy).and.returnValue(Promise.resolve(cepResponse));
    (cepService.search as jasmine.Spy).calls.reset();
    pessoaService.atualizar.and.returnValue(Promise.resolve("new-token"));
    pessoaService.atualizar.calls.reset();
    loginServiceStub.logIn.calls.reset();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should configure metadata and populate default data on init", () => {
    expect(titleService.setTitle).toHaveBeenCalledWith(
      "Dados da Conta - CarCheck"
    );
    expect(metaService.updateTag).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: "description",
        content:
          "Atualize os dados da sua conta, endereço, telefone e senha com segurança e praticidade.",
      })
    );
    expect(component.urlSite).toBe("http://site.com");
    expect(component.consultas.length).toBe(5);
    expect(component.consultas[0]).toEqual(
      jasmine.objectContaining({
        link: "http://site.com/consulta-completa/",
        quantidade: 0,
      })
    );
    expect(component.form.get("nome")?.value).toBe(loginMock.nome);
    expect(component.form.get("email")?.disabled).toBeTrue();
  });

  it("should validate CPF with UtilValidators after loading user info", () => {
    component.form.get("documento")?.setValue("11111111111");
    component.form.get("documento")?.markAsTouched();
    component.form.get("documento")?.updateValueAndValidity();
    expect(component.form.get("documento")?.errors?.cpf).toBeTrue();
  });

  it("should remove spaces from password fields", () => {
    component.form.get("senhaNova")?.setValue(" 1 2 3 ");
    component.form.get("senhaAntiga")?.setValue(" a b c ");
    expect(component.form.get("senhaNova")?.value).toBe("123");
    expect(component.form.get("senhaAntiga")?.value).toBe("abc");
  });

  it("should keep password fields when no spaces", () => {
    component.form.get("senhaNova")?.setValue("1234");
    component.form.get("senhaAntiga")?.setValue("abcd");
    expect(component.form.get("senhaNova")?.value).toBe("1234");
    expect(component.form.get("senhaAntiga")?.value).toBe("abcd");
  });

  it("should build consultations list based on data", () => {
    component.urlSite = "http://site";
    const data = [
      { nome: "Completa", quantidade: 1, id: 1 },
      { nome: "Segura", quantidade: 2, id: 2 },
      { nome: "Gravame", quantidade: 3, id: 3 },
      { nome: "Leilao", quantidade: 4, id: 4 },
      { nome: "Decodificador", quantidade: 5, id: 5 },
    ];
    component.montarConsultas(data);
    expect(component.consultas.length).toBe(5);
    expect(component.consultas[0]).toEqual(
      jasmine.objectContaining({
        label: "Completa",
        link: "http://site/consulta-completa/",
        quantidade: 1,
      })
    );
    expect(component.consultas[4]).toEqual(
      jasmine.objectContaining({
        label: "Decodificador",
        link: "http://site/consulta-decodificador/",
        quantidade: 5,
      })
    );
  });

  it("should search for CEP and update address fields", fakeAsync(() => {
    component.form.get("cep")?.setValue("12.345-678");
    tick(600);
    flushMicrotasks();
    expect(cepService.search).toHaveBeenCalledWith("12345678");
    expect(component.form.get("rua")?.value).toBe("Rua A");
    expect(component.form.get("cidade")?.value).toBe("Cidade B");
    expect(component.loadingEndereco).toBeFalsy();
  }));

  it("should not search CEP when length is invalid", fakeAsync(() => {
    (cepService.search as jasmine.Spy).calls.reset();
    component.form.get("cep")?.setValue("123");
    tick(600);
    expect(cepService.search).not.toHaveBeenCalled();
  }));

  it("should handle CEP service error flag", fakeAsync(() => {
    (cepService.search as jasmine.Spy).and.returnValue(
      Promise.resolve({ erro: true })
    );

    component.form.get("cep")?.setValue("12.345-678");
    tick(600);
    flushMicrotasks();
    expect(component.form.get("rua")?.value).toBe("Rua A");
    expect(component.loadingEndereco).toBeFalsy();
  }));

  it("should handle CEP search rejection", fakeAsync(() => {
    (cepService.search as jasmine.Spy).and.callFake(() => Promise.reject("erro"));

    component.form.get("cep")?.setValue("12.345-678");
    tick(600);
    flushMicrotasks();
    expect(component.loadingEndereco).toBeFalsy();
  }));

  it("should keep current address when CEP response has null values", fakeAsync(() => {
    (cepService.search as jasmine.Spy).and.returnValue(
      Promise.resolve({
        logradouro: null,
        localidade: null,
        bairro: null,
        uf: null,
        erro: false,
      })
    );

    component.form.patchValue({
      rua: "Antiga",
      cidade: "Cidade antiga",
      bairro: "Bairro antigo",
      uf: "AA",
    });
    component.form.get("cep")?.setValue("12.345-678");
    tick(600);
    flushMicrotasks();
    expect(component.form.get("rua")?.value).toBe("Antiga");
    expect(component.form.get("cidade")?.value).toBe("Cidade antiga");
    expect(component.form.get("bairro")?.value).toBe("Bairro antigo");
    expect(component.form.get("uf")?.value).toBe("AA");
  }));

  it("should not call atualizar when form is invalid", () => {
    // Reset the form and mark all fields as touched to trigger validation
    component.form.reset();
    Object.keys(component.form.controls).forEach((key) => {
      component.form.get(key)?.markAsTouched();
    });

    // Clear any previous calls to the spy
    (pessoaService.atualizar as jasmine.Spy).calls.reset();

    component.salvar();

    expect(pessoaService.atualizar).not.toHaveBeenCalled();
  });

  it("should ignore short new password and keep senha field empty", fakeAsync(() => {
    component.form.patchValue({ senhaAntiga: "abc", senhaNova: " " });
    component.salvar();
    expect(component.loadingCadastro).toBeTrue();
    flushMicrotasks();
    const payload = pessoaService.atualizar.calls.mostRecent().args[0];
    expect(payload.senha).toBe("");
    expect(payload.senhaAntiga).toBe("abc");
    expect(loginServiceStub.logIn).toHaveBeenCalledWith("new-token");
    expect(component.loadingCadastro).toBeFalse();
  }));

  it("should save data and login on success", fakeAsync(() => {
    component.getUserInfo();
    tick(600);

    component.form.patchValue({ senhaAntiga: "abcd", senhaNova: "" });
    component.salvar();
    expect(component.loadingCadastro).toBeTruthy();
    flushMicrotasks();
    expect(pessoaService.atualizar).toHaveBeenCalled();
    expect(loginServiceStub.logIn).toHaveBeenCalledWith("new-token");
    expect(component.msg).toBe("success");
    expect(component.form.get("senhaNova")?.value).toBe("");
    expect(component.form.get("senhaAntiga")?.value).toBe("");
    expect(component.loadingCadastro).toBeFalsy();
  }));

  it("should send new password when senhaNova is valid", fakeAsync(() => {
    component.getUserInfo();
    tick(600);
    component.form.patchValue({ senhaAntiga: "abcd", senhaNova: "1234" });
    component.salvar();
    flushMicrotasks();
    const payload = pessoaService.atualizar.calls.mostRecent().args[0];
    expect(payload.senha).toBe("1234");
  }));

  it("should handle error on save and set password error", async () => {
    pessoaService.atualizar.and.callFake(() =>
      Promise.reject({ error: "erro_senha" })
    );
    component.getUserInfo();

    // Aguarda a subscrição se resolver
    await new Promise((resolve) => setTimeout(resolve, 600));

    component.form.patchValue({ senhaAntiga: "abcd", senhaNova: "" });
    await component.salvar();

    expect(component.loadingCadastro).toBeFalsy();
    expect(component.form.get("senhaAntiga")?.errors?.password).toBeTruthy();
  });

  it("should handle generic error on save", async () => {
    pessoaService.atualizar.and.callFake(() => Promise.reject({ error: "x" }));
    component.getUserInfo();
    await new Promise((resolve) => setTimeout(resolve, 600));
    component.form.patchValue({ senhaAntiga: "abcd", senhaNova: "" });
    await component.salvar();
    expect(component.form.get("senhaAntiga")?.errors).toBeNull();
  });

  it("should call carregaCreditoCliente without throwing", () => {
    expect(() => component.carregaCreditoCliente()).not.toThrow();
  });
});
