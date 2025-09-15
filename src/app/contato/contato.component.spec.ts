import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { Title, Meta } from "@angular/platform-browser";

import { ContatoComponent } from "./contato.component";
import { PessoaService } from "../service/pessoa.service";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("ContatoComponent", () => {
  let component: ContatoComponent;
  let fixture: ComponentFixture<ContatoComponent>;
  let pessoaServiceSpy: jasmine.SpyObj<PessoaService>;
  let titleService: Title;
  let metaService: Meta;

  beforeEach(waitForAsync(() => {
    pessoaServiceSpy = jasmine.createSpyObj("PessoaService", ["enviarContato"]);

    TestBed.configureTestingModule({
      imports: [ContatoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: PessoaService, useValue: pessoaServiceSpy },
        Title,
        Meta,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContatoComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);

    spyOn(titleService, "setTitle").and.callThrough();
    spyOn(metaService, "updateTag").and.callThrough();

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set page title and meta description on init", () => {
    const expectedDescription =
      "Entre em contato com a equipe CarCheck. Tire suas dúvidas, envie sugestões ou solicite suporte técnico.";
    expect(titleService.setTitle).toHaveBeenCalledWith(
      "Fale Conosco | CarCheck"
    );
    expect(titleService.getTitle()).toBe("Fale Conosco | CarCheck");
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: "description",
      content: expectedDescription,
    });
    const tag = metaService.getTag('name="description"');
    expect(tag?.getAttribute("content")).toBe(expectedDescription);
  });

  it("should have invalid form when empty", () => {
    expect(component.contactForm.valid).toBeFalsy();
  });

  it("should expose form controls through getter", () => {
    expect(component.formControls).toBe(component.contactForm.controls);
  });

  it("should not submit when form is invalid", fakeAsync(() => {
    const consoleSpy = spyOn(console, "log");

    component.contactForm.reset();
    component.submitForm();
    tick();

    expect(component.showErrors).toBeTrue();
    expect(pessoaServiceSpy.enviarContato).not.toHaveBeenCalled();
    expect(component.submitMessage).toBe("");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Formulário inválido. Verifique os campos."
    );
  }));

  it("should submit form and show success message when service resolves", fakeAsync(() => {
    pessoaServiceSpy.enviarContato.and.returnValue(Promise.resolve());
    component.contactForm.setValue({
      name: "John Doe",
      email: "john@example.com",
      subject: "Assunto",
      message: "Olá",
    });

    const expectedBody = {
      nome: "John Doe",
      email: "john@example.com",
      assunto: "Assunto",
      mensagem: "Olá",
    };

    component.submitForm();
    tick();

    expect(pessoaServiceSpy.enviarContato).toHaveBeenCalledWith(expectedBody);
    expect(component.showErrors).toBeTrue();
    expect(component.submitMessage).toBe("Mensagem enviada com sucesso!");
  }));

  it("should handle service error and show error message", fakeAsync(() => {
    pessoaServiceSpy.enviarContato.and.returnValue(Promise.reject("error"));
    component.contactForm.setValue({
      name: "John Doe",
      email: "john@example.com",
      subject: "Assunto",
      message: "Olá",
    });

    component.submitForm();
    tick();

    expect(pessoaServiceSpy.enviarContato).toHaveBeenCalled();
    expect(component.submitMessage).toBe(
      "Erro ao enviar mensagem. Tente novamente mais tarde."
    );
  }));
});
