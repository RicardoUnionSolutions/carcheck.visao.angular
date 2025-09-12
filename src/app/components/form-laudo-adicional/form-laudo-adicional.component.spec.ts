import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";

import { FormLaudoAdicionalComponent } from "./form-laudo-adicional.component";
import { LaudoService } from "../../service/laudo.service";

type UfOption = { label: string; value: string };
type CidadeOption = { uf: string; label: string; value: string };

// Stub do serviço
class LaudoServiceStub {
  ufOptions: UfOption[] = [
    { label: "São Paulo", value: "SP" },
    { label: "Rio de Janeiro", value: "RJ" },
  ];

  cidadeOptions: CidadeOption[] = [
    { uf: "SP", label: "São Paulo", value: "Sao Paulo" },
    { uf: "RJ", label: "Rio de Janeiro", value: "rj-city" },
  ];

  getUfOptions() {
    return this.ufOptions;
  }

  getCidadeOptions(uf?: string) {
    return this.cidadeOptions.filter((c) => c.uf === uf);
  }
}

describe("FormLaudoAdicionalComponent", () => {
  let component: FormLaudoAdicionalComponent;
  let fixture: ComponentFixture<FormLaudoAdicionalComponent>;
  let service: LaudoService;

  const mockFormValue = {
    placa: "ABC1234",
    proprietario: "John Doe",
    telefone: "11999999999",
    uf: "SP",
    cidade: "Sao Paulo",
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormLaudoAdicionalComponent, ReactiveFormsModule],
      providers: [{ provide: LaudoService, useClass: LaudoServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLaudoAdicionalComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(LaudoService);
    component.formValue = mockFormValue;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with input values", () => {
    expect(component.form.value).toEqual(
      jasmine.objectContaining(mockFormValue)
    );
  });

  it("should load uf options from service", () => {
    expect(component.ufOptions).toEqual(service.getUfOptions());
  });

  it("should initialize cidadeOptions based on initial UF", () => {
    expect(component.cidadeOptions).toEqual(
      service.getCidadeOptions("SP")
    );
    expect(component.form.controls.cidade.value).toBe("Sao Paulo");
  });

  it("should update cidadeOptions and reset cidade when it is not valid", () => {
    component.form.controls.cidade.setValue("rj-city");
    component.form.controls.uf.setValue("SP");
    expect(component.cidadeOptions).toEqual(service.getCidadeOptions("SP"));
    expect(component.form.controls.cidade.value).toBe("");
  });

  it("should keep cidade if it exists in the new options", () => {
    component.form.controls.cidade.setValue("Sao Paulo");
    component.formatarOptionscidade("SP");
    expect(component.form.controls.cidade.value).toBe("Sao Paulo");
  });

  it("should emit formValueChange when form values change", () => {
    const spy = spyOn(component.formValueChange, "emit");
    component.form.controls.placa.setValue("XYZ9876");
    expect(spy).toHaveBeenCalledWith(
      jasmine.objectContaining({ placa: "XYZ9876" })
    );
  });

  it("should emit formStatus when form becomes valid or invalid", () => {
    const statusSpy = spyOn(component.formStatus, "emit");

    // Valid
    component.form.setValue(mockFormValue);
    expect(statusSpy).toHaveBeenCalledWith("VALID");

    // Invalid
    statusSpy.calls.reset();
    component.form.controls.placa.setValue("");
    expect(statusSpy).toHaveBeenCalledWith("INVALID");
  });

  it("should toggle adicionarLaudo and emit change correctly", () => {
    const toggleSpy = spyOn(component.adicionarLaudoChange, "emit");

    // Toggle to true
    expect(component.adicionarLaudo).toBeFalsy();
    component.toggleAdicionarLaudo();
    expect(component.adicionarLaudo).toBeTruthy();
    expect(toggleSpy).toHaveBeenCalledWith(true);

    // Toggle to false
    component.toggleAdicionarLaudo();
    expect(component.adicionarLaudo).toBeFalsy();
    expect(toggleSpy).toHaveBeenCalledWith(false);
  });

  it("should mark form as invalid when required fields are missing", () => {
    component.form.reset();
    expect(component.form.invalid).toBeTruthy();
  });
});
