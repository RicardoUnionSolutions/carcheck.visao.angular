import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { RecuperarSenhaComponent } from "./recuperar-senha.component";
import { ModalService } from "../service/modal.service";
import { PessoaService } from "../service/pessoa.service";
import { Title, Meta } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";
import { delay } from "rxjs/operators";
import { RouterTestingModule } from "@angular/router/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("RecuperarSenhaComponent", () => {
  let component: RecuperarSenhaComponent;
  let fixture: ComponentFixture<RecuperarSenhaComponent>;
  let pessoaServiceSpy: any;
  let modalServiceSpy: any;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(waitForAsync(() => {
    pessoaServiceSpy = jasmine.createSpyObj("PessoaService", [
      "recuperarSenha",
    ]);
    modalServiceSpy = jasmine.createSpyObj("ModalService", ["openModalMsg"]);

    TestBed.configureTestingModule({
      declarations: [RecuperarSenhaComponent],
      imports: [ReactiveFormsModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: PessoaService, useValue: pessoaServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        Title,
        Meta,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarSenhaComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);

    spyOn(titleService, "setTitle").and.callThrough();
    spyOn(metaService, "updateTag").and.callThrough();

    fixture.detectChanges();
  });

  it("should create and initialize form and meta data", () => {
    expect(component).toBeTruthy();
    expect(titleService.setTitle).toHaveBeenCalledWith(
      "Recuperar Senha - Sistema de Consulta Veicular"
    );
    const expectedDescription =
      "Insira seu e-mail para recuperar a senha de acesso ao sistema de consulta veicular.";
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: expectedDescription,
    });
    expect(component.email).toBeDefined();
    expect(component.email.invalid).toBeTruthy();
  });

  it("should trim whitespace from email value", () => {
    component.email.setValue("  teste@teste.com  ");
    expect(component.email.value).toBe("teste@teste.com");
  });

  it("should not send email when form is invalid", () => {
    component.email.setValue("");
    component.enviarEmail();
    expect(component.email.touched).toBeTruthy();
    expect(pessoaServiceSpy.recuperarSenha).not.toHaveBeenCalled();
    expect(component.loading).toBeFalsy();
  });

  it("should send email and set emailEnviado on success", fakeAsync(() => {
    pessoaServiceSpy.recuperarSenha.and.returnValue(of("ok").pipe(delay(0)));
    component.email.setValue("teste@teste.com");

    component.enviarEmail();
    expect(component.loading).toBeTruthy();
    tick();

    expect(pessoaServiceSpy.recuperarSenha).toHaveBeenCalledWith(
      "teste@teste.com"
    );
    expect(component.emailEnviado).toBeTruthy();
    expect(component.loading).toBeFalsy();
  }));

  it("should set error when email is not registered", fakeAsync(() => {
    pessoaServiceSpy.recuperarSenha.and.returnValue(
      of("email_nao_cadastrado").pipe(delay(0))
    );
    component.email.setValue("teste@teste.com");

    component.enviarEmail();
    expect(component.loading).toBeTruthy();
    tick();

    expect(component.email.errors?.msg).toBe("E-mail não cadastrado.");
    expect(component.emailEnviado).toBeFalsy();
    expect(component.loading).toBeFalsy();
  }));

  it("should open modal when service returns error", fakeAsync(() => {
    pessoaServiceSpy.recuperarSenha.and.returnValue(throwError("error"));
    component.email.setValue("teste@teste.com");

    component.enviarEmail();
    tick();

    expect(modalServiceSpy.openModalMsg).toHaveBeenCalled(); // verifica se o modal foi aberto
    expect(component.emailEnviado).toBeFalsy(); // CORRIGIDO: deve ser false
    expect(component.loading).toBeFalsy();
  }));
});
