import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { LoginViewComponent } from "./login-view.component";
import { LoginService } from "../service/login.service";
import { PessoaService } from "../service/pessoa.service";
import { ModalService } from "../service/modal.service";
import { AnalyticsService } from "../service/analytics.service";
import { Router, ActivatedRoute } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

// ✅ Stubs para componentes filhos
@Component({
    selector: "login", template: "",
    standalone: true
})
class LoginStubComponent {
  @Output() cadastrarBtnClick = new EventEmitter<void>();
  @Output() loginFbBtnClick = new EventEmitter<void>();
  @Input() hidden: boolean;
}

@Component({
    selector: "cadastrar", template: "",
    standalone: true
})
class CadastrarStubComponent {
  @Input() cadastro: any;
}

describe("LoginViewComponent", () => {
  let component: LoginViewComponent;
  let fixture: ComponentFixture<LoginViewComponent>;

  let loginServiceMock: any;
  let pessoaServiceMock: any;
  let modalServiceMock: any;
  let routerMock: any;
  let routeMock: any;
  let analyticsServiceMock: any;

  beforeEach(async () => {
    loginServiceMock = {
      subject: new BehaviorSubject({
        status: false,
        cliente: { documento: "" },
      }),
      getLogIn() {
        return this.subject.asObservable();
      },
      logIn: jasmine.createSpy("logIn"),
      logOut: jasmine.createSpy("logOut"),
    };

    pessoaServiceMock = {
      atualizar: jasmine.createSpy("atualizar"),
      adicionar: jasmine.createSpy("adicionar"),
    };

    modalServiceMock = jasmine.createSpyObj("ModalService", [
      "openLoading",
      "closeLoading",
      "openModalMsg",
      "open",
      "close",
    ]);

    routerMock = { navigate: jasmine.createSpy("navigate") };
    routeMock = { params: new Subject<any>(), queryParams: new Subject<any>() };
    analyticsServiceMock = jasmine.createSpyObj("AnalyticsService", [
      "novoCadastroFb",
      "novoCadastro",
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        LoginViewComponent,
        LoginStubComponent,
        CadastrarStubComponent, // ✅ incluído aqui
      ],
      providers: [
        { provide: LoginService, useValue: loginServiceMock },
        { provide: PessoaService, useValue: pessoaServiceMock },
        { provide: ModalService, useValue: modalServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: AnalyticsService, useValue: analyticsServiceMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginViewComponent);
    component = fixture.componentInstance;
    component.cadastrarUsuario.form = new UntypedFormGroup({
      email: new UntypedFormControl("", Validators.required),
    });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to root when login succeeds without returnUrl", () => {
    routerMock.navigate.calls.reset();
    loginServiceMock.subject.next({ status: true });
    expect(routerMock.navigate).toHaveBeenCalledWith(["/"]);
  });

  it("should navigate to returnUrl when login succeeds with returnUrl", () => {
    component.returnUrl = "/home";
    routerMock.navigate.calls.reset();
    loginServiceMock.subject.next({ status: true });
    expect(routerMock.navigate).toHaveBeenCalledWith(["/home"], { state: {} });
  });

  it("should include pacote state when history has pacote", () => {
    component.returnUrl = "/home";
    routerMock.navigate.calls.reset();
    history.pushState({ pacote: "dados" }, "", "");
    loginServiceMock.subject.next({ status: true });
    expect(routerMock.navigate).toHaveBeenCalledWith(["/home"], {
      state: { pacote: "dados" },
    });
    history.pushState({}, "", "");
  });

  it("should log out and navigate to login on logout param", () => {
    loginServiceMock.logOut.calls.reset();
    routerMock.navigate.calls.reset();
    routeMock.params.next({ logout: "out" });
    expect(loginServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it("should ignore logout when param is different", () => {
    loginServiceMock.logOut.calls.reset();
    routerMock.navigate.calls.reset();
    routeMock.params.next({ logout: "in" });
    expect(loginServiceMock.logOut).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it("should set returnUrl and cadastrar from query params on init", () => {
    routeMock.queryParams.next({ returnUrl: "/foo", cadastro: true });
    expect(component.returnUrl).toBe("/foo");
    expect(component.cadastrar).toBeTruthy();
  });

  it("should open and close modal", () => {
    component.abrirModal();
    expect(modalServiceMock.open).toHaveBeenCalledWith("modalAvisoLogin");
    component.closeModal();
    expect(modalServiceMock.close).toHaveBeenCalledWith("modalAvisoLogin");
  });

  it("should unsubscribe on destroy", () => {
    const spy = spyOn(component.logInSubscriber, "unsubscribe");
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });

  it("should toggle cadastrar flag", () => {
    component.cadastrar = false;
    component.cadastrarChange();
    expect(component.cadastrar).toBeTruthy();
    component.cadastrarChange();
    expect(component.cadastrar).toBeFalsy();
  });

  it("should not proceed when form is invalid", () => {
    const markSpy = spyOn(
      component.cadastrarUsuario.form.controls.email,
      "markAsTouched"
    );
    component.efetuarCadastro();
    expect(markSpy).toHaveBeenCalled();
    expect(modalServiceMock.openLoading).not.toHaveBeenCalled();
    expect(pessoaServiceMock.atualizar).not.toHaveBeenCalled();
    expect(pessoaServiceMock.adicionar).not.toHaveBeenCalled();
  });

  it("should call atualizar when tokenFacebook is present", fakeAsync(() => {
    component.cadastrarUsuario.tokenFacebook = "fb";
    component.cadastrarUsuario.form.setValue({ email: "a@b.com" });
    pessoaServiceMock.atualizar.and.returnValue(Promise.resolve("token"));
    component.efetuarCadastro();
    tick();
    expect(modalServiceMock.openLoading).toHaveBeenCalled();
    expect(pessoaServiceMock.atualizar).toHaveBeenCalled();
    expect(analyticsServiceMock.novoCadastroFb).toHaveBeenCalled();
    expect(modalServiceMock.closeLoading).toHaveBeenCalled();
    expect(modalServiceMock.openModalMsg).toHaveBeenCalled();
    const args = modalServiceMock.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    expect(loginServiceMock.logIn).toHaveBeenCalledWith("token");
  }));

  it("should handle atualizar error", fakeAsync(() => {
    component.cadastrarUsuario.tokenFacebook = "fb";
    component.cadastrarUsuario.form.setValue({ email: "a@b.com" });
    pessoaServiceMock.atualizar.and.returnValue(Promise.reject("erro"));
    modalServiceMock.openModalMsg.calls.reset();
    analyticsServiceMock.novoCadastroFb.calls.reset();
    component.efetuarCadastro();
    tick();
    expect(pessoaServiceMock.atualizar).toHaveBeenCalled();
    expect(modalServiceMock.closeLoading).toHaveBeenCalled();
    expect(modalServiceMock.openModalMsg).not.toHaveBeenCalled();
    expect(analyticsServiceMock.novoCadastroFb).not.toHaveBeenCalled();
  }));

  it("should set email error when email already exists", fakeAsync(() => {
    component.cadastrarUsuario.tokenFacebook = "";
    component.cadastrarUsuario.form.setValue({ email: "a@b.com" });
    pessoaServiceMock.adicionar.and.returnValue(Promise.resolve("erro_email"));
    component.efetuarCadastro();
    tick();
    expect(pessoaServiceMock.adicionar).toHaveBeenCalled();
    expect(component.cadastrarUsuario.form.controls.email.errors?.msg).toBe(
      "E-mail já cadastrado"
    );
    expect(modalServiceMock.openModalMsg).not.toHaveBeenCalled();
  }));

  it("should add user and open modal when cadastro succeeds", fakeAsync(() => {
    component.cadastrarUsuario.tokenFacebook = "";
    component.cadastrarUsuario.form.setValue({ email: "a@b.com" });
    pessoaServiceMock.adicionar.and.returnValue(Promise.resolve("token"));
    component.jwtHelper = {
      decodeToken: () => ({ iss: JSON.stringify({ emailVerificado: true }) }),
    } as any;
    component.efetuarCadastro();
    tick();
    expect(pessoaServiceMock.adicionar).toHaveBeenCalled();
    expect(analyticsServiceMock.novoCadastro).toHaveBeenCalled();
    expect(modalServiceMock.openModalMsg).toHaveBeenCalled();
    const args = modalServiceMock.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    expect(loginServiceMock.logIn).toHaveBeenCalledWith("token");
  }));

  it("should not open modal when email not verified", fakeAsync(() => {
    component.cadastrarUsuario.tokenFacebook = "";
    component.cadastrarUsuario.form.setValue({ email: "a@b.com" });
    pessoaServiceMock.adicionar.and.returnValue(Promise.resolve("token"));
    component.jwtHelper = {
      decodeToken: () => ({ iss: JSON.stringify({ emailVerificado: false }) }),
    } as any;
    modalServiceMock.openModalMsg.calls.reset();
    component.efetuarCadastro();
    tick();
    expect(pessoaServiceMock.adicionar).toHaveBeenCalled();
    expect(modalServiceMock.openModalMsg).not.toHaveBeenCalled();
  }));

  it("should show error modal when adicionar fails", fakeAsync(() => {
    component.cadastrarUsuario.tokenFacebook = "";
    component.cadastrarUsuario.form.setValue({ email: "a@b.com" });
    pessoaServiceMock.adicionar.and.returnValue(Promise.reject("error"));
    component.efetuarCadastro();
    tick();
    expect(modalServiceMock.openModalMsg).toHaveBeenCalled();
  }));
});
