import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DebitoComponent } from "./debito.component";

describe("DebitoComponent", () => {
  let component: DebitoComponent;
  let fixture: ComponentFixture<DebitoComponent>;

  const bancos = [
    { nome: "Banco Itaú", codigo: "itau" },
    { nome: "Banco do Brasil", codigo: "bancodobrasil" },
    { nome: "Banco Banrisul", codigo: "banrisul" },
    { nome: "Banco Bradesco", codigo: "bradesco" },
    { nome: "Banco HSBC", codigo: "hsbc" },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebitoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DebitoComponent);
    component = fixture.componentInstance;
    component.pagamento = {};
    component.bandeiras = bancos.map((b) => ({ nome: b.nome, img: "" }));
    fixture.detectChanges();
  });

  bancos.forEach(({ nome, codigo }) => {
    it(`should select ${nome} and emit activeItemChange`, () => {
      const item = { nome } as any;
      spyOn(component.activeItemChange, "emit");

      component.selectItem(item);

      expect(component.activeItem).toEqual(item);
      expect(component.pagamento.nomeBanco).toBe(codigo);
      expect(component.activeItemChange.emit).toHaveBeenCalledWith(item);
    });
  });

  it("should keep nomeBanco when bank is unknown", () => {
    const item = { nome: "Banco Desconhecido" } as any;
    component.pagamento.nomeBanco = "anterior";
    spyOn(component.activeItemChange, "emit");

    component.selectItem(item);

    expect(component.pagamento.nomeBanco).toBe("anterior");
    expect(component.activeItem).toEqual(item);
    expect(component.activeItemChange.emit).toHaveBeenCalledWith(item);
  });
});
