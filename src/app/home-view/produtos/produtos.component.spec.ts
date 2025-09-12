import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import { of } from "rxjs";

import { ProdutosComponent } from "./produtos.component";
import { VariableGlobal } from "../../service/variable.global.service";
import { FazerConsultaService } from "../../service/fazer-consulta.service";

describe("ProdutosComponent", () => {
  let component: ProdutosComponent;
  let fixture: ComponentFixture<ProdutosComponent>;
  let variableGlobal: jasmine.SpyObj<VariableGlobal>;
  let consultaService: jasmine.SpyObj<FazerConsultaService>;
  let router: any;
  let title: jasmine.SpyObj<Title>;
  let meta: jasmine.SpyObj<Meta>;

  const description =
    "Conheça nossos produtos: consultas completas, histórico de veículos, pacotes personalizados e muito mais para garantir sua segurança na hora da compra.";

  beforeEach(waitForAsync(() => {
    variableGlobal = jasmine.createSpyObj("VariableGlobal", ["getProdutos"]);
    variableGlobal.getProdutos.and.callFake(() => [
      { 
        id: 1, 
        nome_da_consulta: "Consulta A", 
        slug: "consulta-a", 
        descricao_da_consulta: "Descrição A", 
        valor_atual: 100, 
        valor_promocional: 90, 
        imagem: "image1.jpg", 
        recomendada: false, 
        exemplo: "Exemplo A", 
        lista_de_insumos: ["Insumo 1", "Insumo 2"], 
        lista_de_insumos_negados: [] 
      },
      { 
        id: 2, 
        nome_da_consulta: "Consulta B", 
        slug: "consulta-b", 
        descricao_da_consulta: "Descrição B", 
        valor_atual: 150, 
        valor_promocional: 140, 
        imagem: "image2.jpg", 
        recomendada: false, 
        exemplo: "Exemplo B", 
        lista_de_insumos: ["Insumo 3", "Insumo 4"], 
        lista_de_insumos_negados: [] 
      },
      { 
        id: 3, 
        nome_da_consulta: "Consulta C", 
        slug: "consulta-c", 
        descricao_da_consulta: "Descrição C", 
        valor_atual: 200, 
        valor_promocional: 180, 
        imagem: "image3.jpg", 
        recomendada: true, 
        exemplo: "Exemplo C", 
        lista_de_insumos: ["Insumo 5", "Insumo 6"], 
        lista_de_insumos_negados: [] 
      },
    ]);

    consultaService = jasmine.createSpyObj("FazerConsultaService", [
      "getPacotes",
    ]);
    consultaService.getPacotes.and.callFake(() =>
      of([
        { nome: "P1", recomendada: true },
        { nome: "P2", recomendada: false },
        { nome: "P3", recomendada: false },
      ])
    );

    title = jasmine.createSpyObj("Title", ["setTitle"]);
    meta = jasmine.createSpyObj("Meta", ["updateTag"]);
    router = { url: "/" };

    TestBed.configureTestingModule({
      imports: [ProdutosComponent],
      providers: [
        { provide: VariableGlobal, useValue: variableGlobal },
        { provide: FazerConsultaService, useValue: consultaService },
        { provide: Router, useValue: router },
        { provide: Title, useValue: title },
        { provide: Meta, useValue: meta },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutosComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("should set title, meta, load products and move recommended items on init", waitForAsync(() => {
    router.url = "/";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(title.setTitle).toHaveBeenCalledWith("Produtos - CarCheck");
      expect(meta.updateTag).toHaveBeenCalledWith({
        name: "description",
        content: description,
      });
      expect(component.consultas[1].recomendada).toBeTruthy();
      expect(component.pacotes[1].recomendada).toBeTruthy();
      expect(component.tipoProduto).toBe(component.tabIndex.consultas);
    });
  }));

  it("should set tipoProduto to pacotes when navigating from processo-compra-multipla", waitForAsync(() => {
    router.url = "/processo-compra-multipla";
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.tipoProduto).toBe(component.tabIndex.pacotes);
    });
  }));

  it("moveRecomendadaToCenter should move recommended items to index 1", () => {
    component.consultas = [
      { nome: "A", recomendada: false },
      { nome: "B", recomendada: false },
      { nome: "C", recomendada: true },
    ];
    component.pacotes = [
      { nome: "P1", recomendada: true },
      { nome: "P2", recomendada: false },
      { nome: "P3", recomendada: false },
    ];

    component.moveRecomendadaToCenter();

    expect(component.consultas[1].recomendada).toBeTruthy();
    expect(component.pacotes[1].recomendada).toBeTruthy();
  });

  it("moveRecomendadaToCenter should keep arrays unchanged if already centered", () => {
    component.consultas = [
      { nome: "A", recomendada: false },
      { nome: "B", recomendada: true },
      { nome: "C", recomendada: false },
    ];
    component.pacotes = [
      { nome: "P1", recomendada: false },
      { nome: "P2", recomendada: true },
      { nome: "P3", recomendada: false },
    ];
    const consultasCopy = [...component.consultas];
    const pacotesCopy = [...component.pacotes];

    component.moveRecomendadaToCenter();

    expect(component.consultas).toEqual(consultasCopy);
    expect(component.pacotes).toEqual(pacotesCopy);
  });
});
