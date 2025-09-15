import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ConsultaVeicularLeilaoComponent } from "./consulta-veicular-leilao.component";
import { VariableGlobal } from "../../service/variable.global.service";

describe("ConsultaVeicularLeilaoComponent", () => {
  let fixture: ComponentFixture<ConsultaVeicularLeilaoComponent>;
  let component: ConsultaVeicularLeilaoComponent;
  let getProdutosSpy: jasmine.Spy;

  const consultaLeilao = {
    id: 2,
    nome_da_consulta: "Consulta Veicular Leilão",
    slug: "leilao",
    descricao_da_consulta: "Fuja de carros leiloados",
    valor_atual: 41.9,
    valor_promocional: 32.9,
    imagem: "./assets/images/consulta-leilao.png",
    recomendada: false,
    exemplo: "https://example.com/exemplo",
    lista_de_insumos: ["Dados originais", "Histórico de leilão", "Valor na tabela Fipe"],
    lista_de_insumos_negados: [],
  };

  beforeEach(async () => {
    getProdutosSpy = jasmine
      .createSpy("getProdutos")
      .and.returnValue([
        {
          id: 1,
          nome_da_consulta: "Consulta Veicular Completa",
          slug: "completa",
          descricao_da_consulta: "Os dados mais completos para você",
          valor_atual: 69.9,
          valor_promocional: 54.9,
          imagem: "./assets/images/consulta-completa.png",
          recomendada: true,
          exemplo: "https://example.com/completa",
          lista_de_insumos: ["Dados originais"],
          lista_de_insumos_negados: [],
        },
        { ...consultaLeilao },
        {
          id: 5,
          nome_da_consulta: "Consulta Veicular Segura",
          slug: "segura",
          descricao_da_consulta: "Os principais dados para a decisão de compra",
          valor_atual: 61.9,
          valor_promocional: 48.9,
          imagem: "./assets/images/consulta-segura.png",
          recomendada: false,
          exemplo: "https://example.com/segura",
          lista_de_insumos: ["Dados originais"],
          lista_de_insumos_negados: [],
        },
      ]);

    await TestBed.configureTestingModule({
      imports: [ConsultaVeicularLeilaoComponent],
      providers: [
        {
          provide: VariableGlobal,
          useValue: { getProdutos: getProdutosSpy },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaVeicularLeilaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("deve carregar os dados da consulta de leilão a partir do serviço", () => {
    expect(getProdutosSpy).toHaveBeenCalledTimes(1);
    expect(component.consulta).toEqual(consultaLeilao);
  });

  it("deve exibir as informações principais da consulta no template", () => {
    const compiled: HTMLElement = fixture.nativeElement as HTMLElement;
    const titulo = compiled.querySelector(".consulta h2.azul");
    const precoPromocional = compiled.querySelector(".consulta .preco");
    const linkComprar = compiled.querySelector(".consulta a.btn");

    expect(titulo?.textContent).toContain(consultaLeilao.nome_da_consulta);
    expect(precoPromocional?.textContent?.replace(/\s/g, "")).toContain("32,90");
    expect(linkComprar?.getAttribute("href")).toBe("/comprar-consulta-placa/leilao");
  });
});
