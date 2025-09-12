import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { DisplayProdutoPagamentoComponent } from "./display-produto-pagamento.component";

describe("DisplayProdutoPagamentoComponent", () => {
  let component: DisplayProdutoPagamentoComponent;
  let fixture: ComponentFixture<DisplayProdutoPagamentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayProdutoPagamentoComponent],
      imports: [CommonModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayProdutoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize with empty consultasSelecionadas", () => {
    expect(component.consultasSelecionadas).toEqual([]);
  });

  it("should render vehicle information when dadosVeiculo is provided", () => {
    component.consultasSelecionadas = [{ composta: { nome: "Completa" } }];
    component.dadosVeiculo = {
      placa: "ABC1234",
      modelo: "Fusca",
      corVeiculo: "Azul",
      anoFabricacao: 2020,
      anoModelo: 2021,
    };
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const info = compiled.querySelector(".infos");
    expect(info).toBeTruthy();
    expect(info!.textContent).toContain("Completa");
    expect(info!.textContent).toContain("ABC1234");
    expect(info!.textContent).toContain("Fusca");
    expect(info!.textContent).toContain("Azul");
    expect(info!.textContent).toContain("2020/2021");
  });

  it("should show generic text when dadosVeiculo has erro", () => {
    component.consultasSelecionadas = [{ composta: { nome: "Básica" } }];
    component.dadosVeiculo = { erro: true };
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const text = (compiled.textContent || "").replace(/\s+/g, " ").trim();
    expect(text).toContain("Consulta Básica");
    expect(text).not.toContain("do veiculo");
    expect(compiled.querySelector(".f-16")).toBeNull(); // A classe que normalmente aparece com dados válidos
  });

  it("should list only consultas with quantidade > 0 when dadosVeiculo is not provided", () => {
    component.dadosVeiculo = null;
    component.consultasSelecionadas = [
      { quantidade: 2, label: "Básica" },
      { quantidade: 0, label: "Zero" },
      { quantidade: 1, label: "Premium" },
    ];
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const items = compiled.querySelectorAll(".col-6");

    expect(items.length).toBe(2);

    expect(items[0].textContent).toContain("2.");
    expect(items[0].textContent).toContain("Consulta Básica");

    expect(items[1].textContent).toContain("1.");
    expect(items[1].textContent).toContain("Consulta Premium");

    const text = compiled.textContent || "";
    expect(text).not.toContain("Consulta Zero");
  });

  it("should display only the first consulta when dadosVeiculo is provided", () => {
    component.consultasSelecionadas = [
      { composta: { nome: "Primeira" } },
      { composta: { nome: "Segunda" } },
    ];
    component.dadosVeiculo = {
      placa: "XYZ9876",
      modelo: "Gol",
      corVeiculo: "Preto",
      anoFabricacao: 2018,
      anoModelo: 2019,
    };
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const info = compiled.querySelector(".infos");
    expect(info).toBeTruthy();
    const text = info!.textContent || "";
    expect(text).toContain("Primeira");
    expect(text).not.toContain("Segunda");
  });

  it("should render no consultas when all quantities are zero", () => {
    component.dadosVeiculo = null;
    component.consultasSelecionadas = [
      { quantidade: 0, label: "Básica" },
      { quantidade: 0, label: "Premium" },
    ];
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const items = compiled.querySelectorAll(".col-6");
    expect(items.length).toBe(0);
  });
});
