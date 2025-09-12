import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";

import { FormLaudoComponent } from "./form-laudo.component";
import { LaudoService } from "../../service/laudo.service";

// Tipos auxiliares
type UfOption = { label: string; value: string };
type CidadeOption = { uf: string; label: string; value: string };

// Stub do serviço
class LaudoServiceStub {
  ufOptions: UfOption[] = [
    { label: "Espírito Santo", value: "ES" },
    { label: "São Paulo", value: "SP" },
  ];

  cidadeOptions: CidadeOption[] = [
    { uf: "ES", label: "Vitória", value: "vitoria" },
    { uf: "SP", label: "São Paulo", value: "sp" },
  ];

  getUfOptions() {
    return this.ufOptions;
  }

  getCidadeOptions(uf: string) {
    return this.cidadeOptions.filter((c) => c.uf === uf);
  }
}

describe("FormLaudoComponent", () => {
  let component: FormLaudoComponent;
  let fixture: ComponentFixture<FormLaudoComponent>;
  let service: LaudoServiceStub;

  const mockFormValue = {
    placa: "ABC1234",
    proprietario: "John Doe",
    telefone: "27999999999",
    uf: "ES",
    cidade: "vitoria",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FormLaudoComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: LaudoService, useClass: LaudoServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLaudoComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(LaudoService) as any;
  });

  it("should create the component", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should load ufOptions from service on init", () => {
    fixture.detectChanges();
    expect(component.ufOptions).toEqual(service.ufOptions);
  });

  it("should initialize form with provided formValue", () => {
    component.formValue = mockFormValue;
    fixture.detectChanges();
    expect(component.form.value).toEqual(mockFormValue);
  });

  it("should emit formValueChange on form updates", () => {
    fixture.detectChanges();
    const emitSpy = spyOn(component.formValueChange, "emit");
    component.form.controls.proprietario.setValue("Jane Doe");
    expect(emitSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({ proprietario: "Jane Doe" })
    );
  });

  it("should emit formStatus when form becomes valid", () => {
    fixture.detectChanges();
    const statusSpy = spyOn(component.formStatus, "emit");
    component.form.setValue(mockFormValue);
    expect(statusSpy).toHaveBeenCalledWith("VALID");
  });

  it("should call formatarOptionscidade when uf changes", () => {
    fixture.detectChanges();
    const spy = spyOn(component, "formatarOptionscidade").and.callThrough();
    component.form.controls.uf.setValue("SP");
    expect(spy).toHaveBeenCalledWith("SP");
  });

  it("should update cidadeOptions and reset cidade when value not found", () => {
    fixture.detectChanges();
    component.form.patchValue({ cidade: "não-existente" });
    component.formatarOptionscidade("SP");
    expect(component.cidadeOptions).toEqual(service.getCidadeOptions("SP"));
    expect(component.form.controls.cidade.value).toBe("");
  });

  it("should keep cidade if value exists in new cidadeOptions", () => {
    fixture.detectChanges();
    component.form.patchValue({ cidade: "sp" });
    component.formatarOptionscidade("SP");
    expect(component.form.controls.cidade.value).toBe("sp");
  });

  it("should invalidate form when required fields are missing", () => {
    component.form.reset();
    fixture.detectChanges();
    expect(component.form.invalid).toBeTruthy();
  });
});
