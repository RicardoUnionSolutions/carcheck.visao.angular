import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login.component";
import { LoginService } from "../../service/login.service";
import { PessoaService } from "../../service/pessoa.service";
import { ModalService } from "../../service/modal.service";
import { AnalyticsService } from "../../service/analytics.service";
import { Title, Meta } from "@angular/platform-browser";
import { of, BehaviorSubject, throwError } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TokenService } from "../../service/token.service";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let loginServiceMock: any; // corrigido para evitar erro com subject
  let pessoaServiceMock: any;
  let modalServiceMock: any;
  let titleServiceMock: any;
  let metaServiceMock: any;
  let analyticsServiceMock: any;
  let tokenServiceMock: any;

  beforeEach(async () => {
    loginServiceMock = {
      subject: new BehaviorSubject({
        status: false,
        cliente: { documento: "" },
      }),
      getLogIn: () => loginServiceMock.subject.asObservable(),
      logIn: jasmine.createSpy("logIn"),
    };

    pessoaServiceMock = jasmine.createSpyObj("PessoaService", [
      "logar",
      "adicionarGoogle",
      "adicionarFB",
    ]);
    modalServiceMock = jasmine.createSpyObj("ModalService", [
      "openLoading",
      "closeLoading",
      "openModalMsg",
    ]);
    titleServiceMock = jasmine.createSpyObj("Title", ["setTitle"]);
    metaServiceMock = jasmine.createSpyObj("Meta", ["updateTag"]);

    analyticsServiceMock = jasmine.createSpyObj("AnalyticsService", [
      "novoCadastroGoogle",
      "novoCadastroFb",
    ]);
    tokenServiceMock = jasmine.createSpyObj("TokenService", [
      "decodeTokenFromString",
    ]);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: LoginService, useValue: loginServiceMock },
        { provide: PessoaService, useValue: pessoaServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: AnalyticsService, useValue: analyticsServiceMock },
        { provide: Title, useValue: titleServiceMock },
        { provide: Meta, useValue: metaServiceMock },
        { provide: TokenService, useValue: tokenServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    spyOn(component, "initGoogleLoginButton");
    spyOn(component.loginBtnClick, "emit");
    spyOn(component.cadastrarBtnClick, "emit");
    spyOn(component.loginFbBtnClick, "emit");
    spyOn(component.loginGoogleBtnClick, "emit");

    tokenServiceMock.decodeTokenFromString.and.returnValue({
      emailVerificado: true,
    });

    component.ngOnInit();
    fixture.detectChanges();
  });

  it("should create component and call init methods", () => {
    expect(component).toBeTruthy();
    expect(component.initGoogleLoginButton).toHaveBeenCalled();
    expect(titleServiceMock.setTitle).toHaveBeenCalled();
    expect(metaServiceMock.updateTag).toHaveBeenCalled();
  });

  it("should have invalid form when empty", () => {
    expect(component.form.valid).toBeFalsy();
  });

  it("should validate form when correctly filled", () => {
    component.form.setValue({ email: "test@email.com", senha: "123456" });
    expect(component.form.valid).toBeTruthy();
  });

  it("should trigger cadastrar button", () => {
    component.cadastrar();
    expect(component.cadastrarBtnClick.emit).toHaveBeenCalled();
  });

  it("should not log in with invalid form", () => {
    component.form.setValue({ email: "", senha: "" });
    component.login();
    expect(modalServiceMock.openLoading).not.toHaveBeenCalled();
    expect(pessoaServiceMock.logar).not.toHaveBeenCalled();
  });

  it("should log in and emit event if email is verified", fakeAsync(() => {
    const token = "mock-token";
    pessoaServiceMock.logar.and.returnValue(of(token));
    component.form.setValue({ email: "user@email.com", senha: "123456" });

    component.login();
    tick();

    expect(modalServiceMock.openLoading).toHaveBeenCalled();
    expect(pessoaServiceMock.logar).toHaveBeenCalled();
    expect(loginServiceMock.logIn).toHaveBeenCalledWith(token);
    expect(component.loginBtnClick.emit).toHaveBeenCalled();
    expect(modalServiceMock.closeLoading).toHaveBeenCalled();
  }));

  it("should set senha error on erro_email_senha", fakeAsync(() => {
    pessoaServiceMock.logar.and.returnValue(of("erro_email_senha"));
    component.form.setValue({ email: "user@email.com", senha: "wrongpass" });

    component.login();
    tick();

    const errors = component.form.controls.senha.errors;
    expect(errors?.msg).toBe("A senha não confere com o e-mail informado.");
    expect(modalServiceMock.closeLoading).toHaveBeenCalled();
  }));

  it("should not log in if email not verified", fakeAsync(() => {
    tokenServiceMock.decodeTokenFromString.and.returnValue({
      emailVerificado: false,
    });
    pessoaServiceMock.logar.and.returnValue(of("some-token"));
    component.form.setValue({ email: "user@email.com", senha: "123456" });

    component.login();
    tick();

    expect(component.emailNaoVerificado).toBeTruthy();
    expect(loginServiceMock.logIn).not.toHaveBeenCalled();
    expect(component.loginBtnClick.emit).not.toHaveBeenCalled();
  }));

  it("should handle Google login response", fakeAsync(() => {
    const credential = `header.${btoa(
      JSON.stringify({ name: "Test", email: "test@email.com" })
    )}.signature`;

    pessoaServiceMock.adicionarGoogle.and.returnValue(of("google-token"));

    component.handleCredentialResponse({ credential } as any);
    tick();

    expect(pessoaServiceMock.adicionarGoogle).toHaveBeenCalled();
    expect(analyticsServiceMock.novoCadastroGoogle).toHaveBeenCalled();
    expect(loginServiceMock.logIn).toHaveBeenCalledWith("google-token");
    expect(modalServiceMock.closeLoading).toHaveBeenCalled();
  }));

  it("should handle invalid Google credential", () => {
    const invalidCredential = "invalid.token";

    expect(() =>
      component.handleCredentialResponse({
        credential: invalidCredential,
      } as any)
    ).toThrow();
    expect(pessoaServiceMock.adicionarGoogle).not.toHaveBeenCalled();
  });

  it("should trim whitespace from email and senha", () => {
    component.form.controls.email.setValue(" test@email.com ");
    expect(component.form.controls.email.value).toBe("test@email.com");

    component.form.controls.senha.setValue(" 1 2 3 4 ");
    expect(component.form.controls.senha.value).toBe("1234");
  });

  it("should update form on ngOnchanges", () => {
    component.loginEntrada = {
      login: "new@email.com",
      senha: "654321",
      manterconectado: false,
      form: null,
    };
    component.ngOnchanges();
    expect(component.form.value).toEqual({
      email: "new@email.com",
      senha: "654321",
    });
  });

  it("should handle login error and close loading", fakeAsync(() => {
    pessoaServiceMock.logar.and.returnValue(
      throwError(() => new Error("fail"))
    );
    component.form.setValue({ email: "user@email.com", senha: "123456" });

    component.login();
    tick();

    expect(modalServiceMock.openLoading).toHaveBeenCalled();
    expect(modalServiceMock.closeLoading).toHaveBeenCalled();
  }));

  it("should call loginErro without throwing", () => {
    expect(() => component.loginErro()).not.toThrow();
  });

  it("should login with Facebook and emit event", fakeAsync(() => {
    (window as any).FB = {
      login: (cb: any) => cb(),
      api: (_: any, cb: any) =>
        cb({ id: "1", name: "User", email: "test@test.com" }),
    };
    pessoaServiceMock.adicionarFB.and.returnValue(of("fb-token"));

    component.loginFb();
    tick();

    expect(pessoaServiceMock.adicionarFB).toHaveBeenCalled();
    expect(analyticsServiceMock.novoCadastroFb).toHaveBeenCalled();
    expect(loginServiceMock.logIn).toHaveBeenCalledWith("fb-token");
    expect(component.loginFbBtnClick.emit).toHaveBeenCalled();
  }));

  it("should handle Facebook login when email exists", fakeAsync(() => {
    (window as any).FB = {
      login: (cb: any) => cb(),
      api: (_: any, cb: any) =>
        cb({ id: "1", name: "User", email: "test@test.com" }),
    };
    pessoaServiceMock.adicionarFB.and.returnValue(of("erro_email"));

    component.loginFb();
    tick();

    expect(modalServiceMock.openModalMsg).toHaveBeenCalled();
    expect(analyticsServiceMock.novoCadastroFb).not.toHaveBeenCalled();
    expect(component.loginFbBtnClick.emit).not.toHaveBeenCalled();
  }));

  it("should initialize google button and open loading on credential", () => {
    const initialize = jasmine.createSpy("initialize");
    const renderButton = jasmine.createSpy("renderButton");
    const prompt = jasmine
      .createSpy("prompt")
      .and.callFake((cb: any) =>
        cb({ getDismissedReason: () => "credential_returned" })
      );
    (window as any).google = {
      accounts: { id: { initialize, renderButton, prompt } },
    };
    spyOn(document.body, "appendChild");
    spyOn<any>(component["ngZone"], "run").and.callFake((fn: Function) => fn());

    (component.initGoogleLoginButton as jasmine.Spy).and.callThrough();
    component.initGoogleLoginButton();
    (window as any).onGoogleLibraryLoad();

    expect(initialize).toHaveBeenCalled();
    expect(renderButton).toHaveBeenCalled();
    expect(prompt).toHaveBeenCalled();
    expect(modalServiceMock.openLoading).toHaveBeenCalled();
  });

  it("should not open loading when google prompt dismissed", () => {
    const prompt = jasmine
      .createSpy("prompt")
      .and.callFake((cb: any) => cb({ getDismissedReason: () => "other" }));
    (window as any).google = {
      accounts: {
        id: {
          initialize: () => {},
          renderButton: () => {},
          prompt,
        },
      },
    };
    spyOn(document.body, "appendChild");
    spyOn<any>(component["ngZone"], "run").and.callFake((fn: Function) => fn());

    (component.initGoogleLoginButton as jasmine.Spy).and.callThrough();
    component.initGoogleLoginButton();
    (window as any).onGoogleLibraryLoad();

    expect(modalServiceMock.openLoading).not.toHaveBeenCalled();
  });

  it("should read manterconectado from localStorage", () => {
    localStorage.setItem(
      "manterconectado",
      JSON.stringify({ login: "l", senha: "s", manterconectado: true })
    );
    const fix = TestBed.createComponent(LoginComponent);
    const cmp = fix.componentInstance;
    expect(cmp.loginEntrada.login).toBe("l");
    expect(cmp.loginEntrada.senha).toBe("s");
    localStorage.removeItem("manterconectado");
  });

  it("should skip ngOnchanges when form undefined", () => {
    component.form = null as any;
    expect(() => component.ngOnchanges()).not.toThrow();
  });
});
