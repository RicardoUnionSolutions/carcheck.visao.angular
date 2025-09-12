import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ConsultaComponent } from "./consulta.component";
import { LoginService } from "../service/login.service";
import { ModalService } from "../service/modal.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { VariableGlobal } from "../service/variable.global.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import { BehaviorSubject, of, throwError } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("ConsultaComponent", () => {
  let component: ConsultaComponent;
  let fixture: ComponentFixture<ConsultaComponent>;

  const loginServiceStub = {
    subject: new BehaviorSubject({ status: false }),
    getLogIn: function () {
      return this.subject.asObservable();
    },
  };

  const modalServiceStub = {
    openLoading: jasmine.createSpy("openLoading"),
    closeLoading: jasmine.createSpy("closeLoading"),
    openModalMsg: jasmine.createSpy("openModalMsg"),
  };

  const dadosConsultaServiceStub = {
    getConsultaVeiculo: jasmine
      .createSpy("getConsultaVeiculo")
      .and.returnValue(Promise.resolve({})),
    downloadPdf: jasmine.createSpy("downloadPdf"),
  };

  const variableGlobalStub = {
    getUrl: jasmine
      .createSpy("getUrl")
      .and.callFake((path: string) => "base/" + path),
  };

  const titleSpy = jasmine.createSpyObj("Title", ["setTitle"]);
  const metaSpy = jasmine.createSpyObj("Meta", ["updateTag"]);

  const activatedRouteStub = {
    params: of({ tokenConsulta: "tokenXYZ" }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultaComponent],
      providers: [
        { provide: LoginService, useValue: loginServiceStub },
        { provide: ModalService, useValue: modalServiceStub },
        { provide: dadosConsultaService, useValue: dadosConsultaServiceStub },
        { provide: VariableGlobal, useValue: variableGlobalStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: {} },
        { provide: Title, useValue: titleSpy },
        { provide: Meta, useValue: metaSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize and load data on ngOnInit", () => {
    const carregarSpy = spyOn(component, "carregarInformacoes");
    const verificaExemploSpy = spyOn(component, "verificaExemplo");
    component.ngOnInit();
    expect(titleSpy.setTitle).toHaveBeenCalled();
    expect(metaSpy.updateTag).toHaveBeenCalled();
    expect(component.tokenConsulta).toBe("tokenXYZ");
    expect(carregarSpy).toHaveBeenCalled();
    expect(verificaExemploSpy).toHaveBeenCalledWith("tokenXYZ");
  });

  it("should build pdf url", () => {
    component.tokenConsulta = "abc";
    expect(component.getUrlPdf()).toBe(
      "base/consultar/relatorioConsultaPdf/abc"
    );
  });

  describe("setStatusVeiculo", () => {
    it("should set statusConsultaVeiculo to 0 when veiculo has data", () => {
      component.dadosConsulta = { veiculo: { modelo: "carro" } } as any;
      component.setStatusVeiculo();
      expect(component.statusConsultaVeiculo).toBe(0);
    });

    it("should set statusConsultaVeiculo to 1 when veiculo is empty", () => {
      component.dadosConsulta = { veiculo: {} } as any;
      component.setStatusVeiculo();
      expect(component.statusConsultaVeiculo).toBe(1);
    });

    it("should set statusConsultaVeiculo to 2 when veiculo is null", () => {
      component.dadosConsulta = {} as any;
      component.setStatusVeiculo();
      expect(component.statusConsultaVeiculo).toBe(2);
    });
  });

  it("should count object fields correctly", () => {
    expect(component.qtdeCamposObjeto({ a: 1, b: 2 })).toBe(2);
    expect(component.qtdeCamposObjeto({})).toBe(0);
  });

  describe("verificaCor", () => {
    it("should return color from veiculo", () => {
      component.dadosConsulta = { veiculo: { cor: "Azul" } } as any;
      expect(component.verificaCor()).toBe("Azul");
    });

    it("should fallback to binestadual color", () => {
      component.dadosConsulta = {
        veiculo: null,
        binestadual: { dadosveiculo: { cor: "Preto" } },
      } as any;
      expect(component.verificaCor()).toBe("Preto");
    });

    it("should return default when no color", () => {
      component.dadosConsulta = {
        veiculo: null,
        binestadual: null,
        binfederal: null,
        binrf: null,
        snva: null,
      } as any;
      expect(component.verificaCor()).toBe("----");
    });
  });

  describe("verificaChassi", () => {
    it("should return chassi from veiculo", () => {
      component.dadosConsulta = { veiculo: { chassi: "ABC123" } } as any;
      expect(component.verificaChassi()).toBe("ABC123");
    });

    it("should fallback to binestadual chassi", () => {
      component.dadosConsulta = {
        veiculo: null,
        binestadual: { dadosveiculo: { chassi: "XYZ987" } },
      } as any;
      expect(component.verificaChassi()).toBe("XYZ987");
    });

    it("should return default when no chassi", () => {
      component.dadosConsulta = {
        veiculo: null,
        binestadual: null,
        binfederal: null,
        binrf: null,
        snva: null,
      } as any;
      expect(component.verificaChassi()).toBe("----");
    });
  });

  describe("verificaCombustivel", () => {
    it("should return combustivel from veiculo", () => {
      component.dadosConsulta = { veiculo: { combustivel: "Gasolina" } } as any;
      expect(component.verificaCombustivel()).toBe("Gasolina");
    });

    it("should fallback to binestadual combustivel", () => {
      component.dadosConsulta = {
        veiculo: null,
        binestadual: { dadosveiculo: { combustivel: "Etanol" } },
      } as any;
      expect(component.verificaCombustivel()).toBe("Etanol");
    });

    it("should return default when no combustivel", () => {
      component.dadosConsulta = {
        veiculo: null,
        binestadual: null,
        binfederal: null,
        binrf: null,
        snva: null,
      } as any;
      expect(component.verificaCombustivel()).toBe("----");
    });
  });

  describe("verificaIndicadorVenda", () => {
    it("should return true when comunicação de venda is present", () => {
      component.dadosConsulta = {
        binestadual: {
          restricoes: [{ descricao: "CONSTA COMUNICACAO DE VENDA" }],
        },
      } as any;
      expect(component.verificaIndicadorVenda()).toBeTruthy();
    });

    it('should return "NÃO CONSTA" when restricoes do not match', () => {
      component.dadosConsulta = {
        binestadual: { restricoes: [{ descricao: "OUTRA" }] },
      } as any;
      expect(component.verificaIndicadorVenda()).toBe("NÃO CONSTA");
    });

    it("should return default when no restricoes", () => {
      component.dadosConsulta = { binestadual: { restricoes: [] } } as any;
      expect(component.verificaIndicadorVenda()).toBe(
        "NAO CONSTA COMUNICADO DE VENDA"
      );
    });
  });

  describe("verificaDebitos e Multas", () => {
    it("should detect debitos or multas", () => {
      component.dadosConsulta = {
        binestadual: { dadosDebito: {}, dadosMulta: null },
      } as any;
      expect(component.verificaDebitos()).toBeTruthy();
      component.dadosConsulta = {
        binestadual: { dadosDebito: null, dadosMulta: {} },
      } as any;
      expect(component.verificaDebitos()).toBeTruthy();
      component.dadosConsulta = { binestadual: { dadosMulta: {} } } as any;
      expect(component.verificaMultas()).toBeTruthy();
    });

    it("should return undefined when no debitos or multas", () => {
      component.dadosConsulta = {
        binestadual: { dadosDebito: null, dadosMulta: null },
      } as any;
      expect(component.verificaDebitos()).toBeUndefined();
      expect(component.verificaMultas()).toBeUndefined();
    });
  });

  describe("verificaRF", () => {
    it("should return true when restriction includes roubo e furto", () => {
      component.dadosConsulta = {
        binestadual: { restricoes: [{ descricao: "ROUBO E FURTO ATIVO" }] },
      } as any;
      expect(component.verificaRF()).toBeTruthy();
    });

    it("should return undefined when no rf restriction", () => {
      component.dadosConsulta = {
        binestadual: { restricoes: [{ descricao: "OUTRA" }] },
      } as any;
      expect(component.verificaRF()).toBeUndefined();
    });
  });

  describe("verificaGravame", () => {
    it("should return true when gravame exists and not NADA CONSTA", () => {
      component.dadosConsulta = {
        binestadual: {
          dadosGravame: { tipoRestricao: "COM GRAVAME", other: 1 },
        },
      } as any;
      expect(component.verificaGravame()).toBeTruthy();
    });

    it("should return undefined when gravame is NADA CONSTA or empty", () => {
      component.dadosConsulta = {
        binestadual: { dadosGravame: { tipoRestricao: "NADA CONSTA" } },
      } as any;
      expect(component.verificaGravame()).toBeUndefined();
      component.dadosConsulta = { binestadual: { dadosGravame: null } } as any;
      expect(component.verificaGravame()).toBeUndefined();
    });
  });

  describe("verificaRestricao", () => {
    it("should return true when any restriction condition matches", () => {
      component.dadosConsulta = {
        binestadual: {
          restricoes: [{ descricao: "alguma" }],
          dadosDebito: null,
          dadosMulta: null,
          dadosGravame: null,
        },
        leilao: { dadosLeilao: [] },
        sinistro: { codigoControle: "SEMREGISTRO" },
      } as any;
      expect(component.verificaRestricao()).toBeTruthy();
    });

    it("should return undefined when no restrictions", () => {
      spyOn(component, "verificaGravame").and.returnValue(false);
      component.dadosConsulta = {
        binestadual: { restricoes: [], dadosDebito: null, dadosMulta: null },
        leilao: { dadosLeilao: [] },
        sinistro: { codigoControle: "SEMREGISTRO" },
      } as any;
      expect(component.verificaRestricao()).toBeUndefined();
    });
  });

  describe("verificaExemplo", () => {
    it("should set consultaExemplo to true when token has exemplo", () => {
      expect(component.verificaExemplo("abc-exemplo-123")).toBeTruthy();
      expect(component.consultaExemplo).toBeTruthy();
    });

    it("should set consultaExemplo to false otherwise", () => {
      expect(component.verificaExemplo("token"));
      expect(component.consultaExemplo).toBeFalsy();
    });
  });

  describe("verificaEntrada", () => {
    it("should return placaEntrada when available", () => {
      component.dadosConsulta = { placaEntrada: "ABC1234" } as any;
      expect(component.verificaEntrada()).toBe("ABC1234");
    });

    it("should return chassiEntrada when placaEntrada is null", () => {
      component.dadosConsulta = { chassiEntrada: "CHS123" } as any;
      expect(component.verificaEntrada()).toBe("CHS123");
    });
  });

  describe("verificaPlaca", () => {
    it("should return placa from veiculo when present", () => {
      component.dadosConsulta = { veiculo: { placa: "AAA1111" } } as any;
      expect(component.verificaPlaca()).toBe("AAA1111");
    });

    it("should return placa from binestadual", () => {
      component.dadosConsulta = {
        binestadual: { dadosveiculo: { placa: "BBB2222" } },
      } as any;
      expect(component.verificaPlaca()).toBe("BBB2222");
    });

    it("should return placa from binfederal", () => {
      component.dadosConsulta = {
        binfederal: { dadosveiculo: { placa: "CCC3333" } },
      } as any;
      expect(component.verificaPlaca()).toBe("CCC3333");
    });

    it("should return placa from binrf", () => {
      component.dadosConsulta = {
        binrf: { dadosveiculo: [{ placa: "old" }, { placa: "DDD4444" }] },
      } as any;
      expect(component.verificaPlaca()).toBe("DDD4444");
    });

    it("should return placa from snva", () => {
      component.dadosConsulta = {
        snva: { dadosveiculo: { placa: "EEE5555" } },
      } as any;
      expect(component.verificaPlaca()).toBe("EEE5555");
    });

    it("should return default when no placa is found", () => {
      component.dadosConsulta = {} as any;
      expect(component.verificaPlaca()).toBe("Sem placa");
    });
  });

  describe("basic getters", () => {
    it("verificaLogo should return formatted marca when veiculo exists", () => {
      component.dadosConsulta = {
        veiculo: { marca: "Honda", tipo: "Motocicleta" },
      } as any;
      expect(component.verificaLogo()).toBe("honda-moto");
    });

    it("verificaLogo should handle veiculo without motocicleta", () => {
      component.dadosConsulta = {
        veiculo: { marca: "Ford", tipo: "Carro" },
      } as any;
      expect(component.verificaLogo()).toBe("ford");
    });

    it("verificaLogo should handle snva data", () => {
      component.dadosConsulta = {
        snva: { dadosveiculo: { marca: "Yamaha", tipo: "Motocicleta" } },
      } as any;
      expect(component.verificaLogo()).toBe("yamaha-moto");
    });

    it("verificaLogo should return semmarca for snva prefix", () => {
      component.dadosConsulta = {
        snva: { dadosveiculo: { marca: "I/Ford", tipo: "Carro" } },
      } as any;
      expect(component.verificaLogo()).toBe("semmarca");
    });

    it("verificaLogo should return semmarca for snva motocicleta unknown", () => {
      component.dadosConsulta = {
        snva: { dadosveiculo: { marca: "I/Ford", tipo: "Motocicleta" } },
      } as any;
      expect(component.verificaLogo()).toBe("semmarca");
    });

    it("verificaLogo should handle binrf data", () => {
      component.dadosConsulta = {
        binrf: {
          dadosveiculo: [
            { marca: "old", tipo: "Carro" },
            { marca: "BMW", tipo: "Motocicleta" },
          ],
        },
      } as any;
      expect(component.verificaLogo()).toBe("bmw-moto");
    });

    it("verificaLogo should handle binrf without motocicleta", () => {
      component.dadosConsulta = {
        binrf: { dadosveiculo: [{ marca: "BMW", tipo: "Carro" }] },
      } as any;
      expect(component.verificaLogo()).toBe("bmw");
    });

    it("verificaLogo should return default when no marca", () => {
      component.dadosConsulta = {} as any;
      expect(component.verificaLogo()).toBe("semmarca");
    });

    it("verificaMarca should return marca from veiculo", () => {
      component.dadosConsulta = { veiculo: { marca: "Ford" } } as any;
      expect(component.verificaMarca()).toBe("Ford");
    });

    it("verificaMarca should return default when not found", () => {
      component.dadosConsulta = {} as any;
      expect(component.verificaMarca()).toBe("----");
    });

    it("verificaModelo should return modeloBin from veiculo", () => {
      component.dadosConsulta = { veiculo: { modeloBin: "ModelX" } } as any;
      expect(component.verificaModelo()).toBe("ModelX");
    });

    it("verificaAnoModelo should return anoModelo from veiculo", () => {
      component.dadosConsulta = { veiculo: { anoModelo: 2020 } } as any;
      expect(component.verificaAnoModelo()).toBe(2020);
    });

    it("verificaAnoFabricacao should return anoFabricacao from veiculo", () => {
      component.dadosConsulta = { veiculo: { anoFabricacao: 2019 } } as any;
      expect(component.verificaAnoFabricacao()).toBe(2019);
    });

    it("verificaCilindradas should return cilindrada from veiculo", () => {
      component.dadosConsulta = { veiculo: { cilindrada: 300 } } as any;
      expect(component.verificaCilindradas()).toBe(300);
    });

    it("verificaEstado should return uf from veiculo", () => {
      component.dadosConsulta = { veiculo: { uf: "SP" } } as any;
      expect(component.verificaEstado()).toBe("SP");
    });

    it("verificaMunicipio should return municipio from veiculo", () => {
      component.dadosConsulta = { veiculo: { municipio: "São Paulo" } } as any;
      expect(component.verificaMunicipio()).toBe("São Paulo");
    });

    it("verificaIdConsulta should return id when present", () => {
      component.dadosConsulta = { veiculo: {}, id: 123 } as any;
      expect(component.verificaIdConsulta()).toBe(123);
    });
  });

  describe("other data sources for getters", () => {
    const cases = [
      {
        method: "verificaMarca",
        veiculoKey: "marca",
        otherKey: "marca",
        def: "----",
      },
      {
        method: "verificaModelo",
        veiculoKey: "modeloBin",
        otherKey: "modelo",
        def: "----",
      },
      {
        method: "verificaAnoModelo",
        veiculoKey: "anoModelo",
        otherKey: "anoModelo",
        def: "----",
      },
      {
        method: "verificaAnoFabricacao",
        veiculoKey: "anoFabricacao",
        otherKey: "anoFabricacao",
        def: "----",
      },
      {
        method: "verificaCilindradas",
        veiculoKey: "cilindrada",
        otherKey: "cilindrada",
        def: "----",
      },
      {
        method: "verificaEstado",
        veiculoKey: "uf",
        otherKey: "uf",
        def: "----",
      },
      {
        method: "verificaMunicipio",
        veiculoKey: "municipio",
        otherKey: "municipio",
        def: "----",
      },
      {
        method: "verificaIdConsulta",
        veiculoKey: null,
        otherKey: "id",
        def: "----",
        root: true,
      },
      {
        method: "verificaCor",
        veiculoKey: "cor",
        otherKey: "cor",
        def: "----",
      },
      {
        method: "verificaChassi",
        veiculoKey: "chassi",
        otherKey: "chassi",
        def: "----",
      },
      {
        method: "verificaCombustivel",
        veiculoKey: "combustivel",
        otherKey: "combustivel",
        def: "----",
      },
    ];

    cases.forEach((c) => {
      it(`${c.method} should read from all sources`, () => {
        if (c.root) {
          component.dadosConsulta = { veiculo: {}, id: "v1" } as any;
        } else {
          component.dadosConsulta = {
            veiculo: { [c.veiculoKey]: "v1" },
          } as any;
        }
        expect((component as any)[c.method]()).toBe("v1");

        component.dadosConsulta = {
          binestadual: { dadosveiculo: { [c.otherKey]: "v2" } },
        } as any;
        expect((component as any)[c.method]()).toBe("v2");

        component.dadosConsulta = {
          binfederal: { dadosveiculo: { [c.otherKey]: "v3" } },
        } as any;
        expect((component as any)[c.method]()).toBe("v3");

        component.dadosConsulta = {
          binrf: {
            dadosveiculo: [{ [c.otherKey]: "old" }, { [c.otherKey]: "v4" }],
          },
        } as any;
        expect((component as any)[c.method]()).toBe("v4");

        component.dadosConsulta = {
          snva: { dadosveiculo: { [c.otherKey]: "v5" } },
        } as any;
        expect((component as any)[c.method]()).toBe("v5");

        component.dadosConsulta = {} as any;
        expect((component as any)[c.method]()).toBe(c.def);
      });
    });
  });

  describe("ngChanges", () => {
    it("should trigger setStatusVeiculo", () => {
      const spy = spyOn(component, "setStatusVeiculo");
      component.ngChanges();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("carregarInformacoes", () => {
    it("should populate data on success", fakeAsync(() => {
      const dados = {
        composta: { nome: "Completa" },
        veiculo: { marca: null },
        tokenConsulta: "tok",
      };
      dadosConsultaServiceStub.getConsultaVeiculo.and.returnValue(
        Promise.resolve(dados)
      );
      component.carregarInformacoes();
      tick();
      expect(component.statusCarregamento).toBe(1);
      expect(component.dadosConsulta).toEqual(dados as any);
      expect(modalServiceStub.closeLoading).toHaveBeenCalled();
    }));

    it("should populate data using toPromise and set flags", fakeAsync(() => {
      const dados = {
        composta: { nome: "Parcial" },
        veiculo: { marca: "Ford" },
        tokenConsulta: "tok2",
      };
      dadosConsultaServiceStub.getConsultaVeiculo.and.returnValue({
        toPromise: () => Promise.resolve(dados),
      });
      component.carregarInformacoes();
      tick();
      expect(component.removeAbas).toBeTruthy();
      expect(component.marcaVeiculo).toBe("ford");
    }));

    it("should handle error", fakeAsync(() => {
      dadosConsultaServiceStub.getConsultaVeiculo.and.returnValue(
        Promise.reject("err")
      );
      component.carregarInformacoes();
      tick();
      expect(component.statusCarregamento).toBe(-1);
      expect(modalServiceStub.closeLoading).toHaveBeenCalled();
    }));
  });

  describe("downloadPdf", () => {
    it("should download and close modal", () => {
      const blob = new Blob(["data"], { type: "application/pdf" });
      const linkMock = {
        href: "",
        download: "",
        click: jasmine.createSpy("click"),
      } as any;
      spyOn(window.URL, "createObjectURL").and.returnValue("blob:url");
      spyOn(document, "createElement").and.returnValue(linkMock);
      spyOn(window, "open");
      dadosConsultaServiceStub.downloadPdf.and.returnValue(of(blob));
      component.dadosConsulta = { tokenConsulta: "abc" } as any;
      component.downloadPdf();
      expect(modalServiceStub.openLoading).toHaveBeenCalled();
      expect(dadosConsultaServiceStub.downloadPdf).toHaveBeenCalled();
      expect(linkMock.click).toHaveBeenCalled();
      expect(modalServiceStub.closeLoading).toHaveBeenCalled();
    });

    it("should show error when download fails", () => {
      dadosConsultaServiceStub.downloadPdf.and.returnValue(
        throwError(() => "err")
      );
      component.dadosConsulta = { tokenConsulta: "abc" } as any;
      component.downloadPdf();
      expect(modalServiceStub.openModalMsg).toHaveBeenCalled();
      expect(modalServiceStub.closeLoading).toHaveBeenCalled();
    });

    it("should use msSaveOrOpenBlob when available", () => {
      const blob = new Blob(["data"], { type: "application/pdf" });
      dadosConsultaServiceStub.downloadPdf.and.returnValue(of(blob));
      const saveSpy = jasmine.createSpy("msSaveOrOpenBlob");
      (window.navigator as any).msSaveOrOpenBlob = saveSpy;
      component.dadosConsulta = { tokenConsulta: "abc" } as any;
      component.downloadPdf();
      expect(saveSpy).toHaveBeenCalled();
      delete (window.navigator as any).msSaveOrOpenBlob;
    });
  });

  describe("scrollTo", () => {
    it("should scroll element into view", () => {
      const el = { scrollIntoView: jasmine.createSpy("scrollIntoView") } as any;
      spyOn(document, "getElementById").and.returnValue(el);
      component.scrollTo("foo");
      expect(el.scrollIntoView).toHaveBeenCalled();
    });
  });
});
