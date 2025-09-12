import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { of } from "rxjs";

import { HistoricoCardComponent } from "./historico-card.component";
import { dadosConsultaService } from "../../service/dados-consulta.service";
import { ModalService } from "../../service/modal.service";
import { DataService } from "../../service/dataService.service";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

const routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
const dadosConsultaServiceSpy = jasmine.createSpyObj("dadosConsultaService", [
  "getRecarregarConsulta",
]);
const modalServiceSpy = jasmine.createSpyObj("ModalService", [
  "openLoading",
  "closeLoading",
]);
const dataServiceSpy = jasmine.createSpyObj("DataService", ["setData"]);

describe("HistoricoCardComponent", () => {
  let component: HistoricoCardComponent;
  let fixture: ComponentFixture<HistoricoCardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [HistoricoCardComponent],
    schemas: [NO_ERRORS_SCHEMA],
    imports: [],
    providers: [
        { provide: Router, useValue: routerSpy },
        { provide: dadosConsultaService, useValue: dadosConsultaServiceSpy },
        { provide: ModalService, useValue: modalServiceSpy },
        { provide: DataService, useValue: dataServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoCardComponent);
    component = fixture.componentInstance;
    component.consulta = { tipo: "ConsultaTeste" } as any;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);

    routerSpy.navigate.calls.reset();
    dadosConsultaServiceSpy.getRecarregarConsulta.calls.reset();
    modalServiceSpy.openLoading.calls.reset();
    modalServiceSpy.closeLoading.calls.reset();
    dataServiceSpy.setData.calls.reset();
  });

  afterEach(() => {
    if (httpMock) {
      httpMock.verify();
    }
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should format consulta tipo on init", () => {
    component.consulta = { tipo: "ConsultaCompleta" } as any;
    component.ngOnInit();
    expect(component.consulta.tipo).toBe("Consulta Completa");
  });

  it("should format consulta tipo on changes", () => {
    component.consulta = { tipo: "ConsultaBasica" } as any;
    component.ngOnChanges();
    expect(component.consulta.tipo).toBe("Consulta Basica");
  });

  it("should navigate to vistoria when tipoProduto is LAUDO", () => {
    component.consulta = {
      tipoProduto: "LAUDO",
      laudo: { token: "abc" },
    } as any;
    component.click();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/vistoria/", "abc"]);
  });

  it("should navigate to consulta when status is 0 and not company", () => {
    component.consulta = {
      status: 0,
      consultaCompany: false,
      tokenConsulta: "tok",
    } as any;
    component.click();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["/consulta/", "tok"]);
  });

  it("should open pdf when company consulta has link", () => {
    const openSpy = spyOn(window, "open");
    component.consulta = {
      status: 0,
      consultaCompany: true,
      exibirPdf: true,
      linkPdf: "http://pdf.com",
    } as any;
    component.click();
    expect(openSpy).toHaveBeenCalledWith("http://pdf.com", "_blank");
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
  it("should set data and navigate when company consulta without pdf", () => {
    component.consulta = {
      status: 0,
      consultaCompany: true,
      exibirPdf: false,
      linkPdf: null,
      tokenConsulta: "abc",
    } as any;
    component.click();
    expect(dataServiceSpy.setData).toHaveBeenCalledWith(component.consulta);
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      "/visualizar-consulta/",
      "abc",
    ]);
  });

  it("should not navigate when status is not zero", () => {
    component.consulta = {
      status: 2,
      consultaCompany: false,
      tipoProduto: "CONSULTA",
    } as any;
    component.click();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it("should reload consulta and call montaConsultas", fakeAsync(() => {
    const event = { stopPropagation: jasmine.createSpy() } as any;
    const data = { id: 1 };
    dadosConsultaServiceSpy.getRecarregarConsulta.and.returnValue(
      Promise.resolve(data)
    );
    const montaSpy = spyOn(component, "montaConsultas");
    component.consulta = { id: 1, consultaCompany: false } as any;

    component.recarregarConsulta(event);
    tick();

    expect(modalServiceSpy.openLoading).toHaveBeenCalled();
    expect(dadosConsultaServiceSpy.getRecarregarConsulta).toHaveBeenCalledWith(
      1
    );
    expect(montaSpy).toHaveBeenCalledWith(data);
    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  }));

  it("should update status when reloading company consulta", fakeAsync(() => {
    const event = { stopPropagation: jasmine.createSpy() } as any;
    dadosConsultaServiceSpy.getRecarregarConsulta.and.returnValue(
      Promise.resolve({})
    );
    component.consulta = {
      id: 2,
      consultaCompany: true,
      status: 0,
      qtdErros: 5,
    } as any;

    component.recarregarConsulta(event);
    tick();

    expect(component.consulta.status).toBe(1);
    expect(component.consulta.qtdErros).toBe(0);
    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  }));

  it("should handle error on recarregarConsulta", fakeAsync(() => {
    const event = { stopPropagation: jasmine.createSpy() } as any;
    dadosConsultaServiceSpy.getRecarregarConsulta.and.returnValue(
      Promise.reject("error")
    );
    component.consulta = { id: 3, consultaCompany: false } as any;

    component.recarregarConsulta(event);
    tick();

    expect(modalServiceSpy.closeLoading).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  }));

  it("should build consulta in montaConsultas", () => {
    const composta: any = {
      consulta: [
        { codigoControle: "ERRO_FORNECEDOR" },
        { codigoControle: "PENDENTE" },
        { codigoControle: "OK" },
      ],
      marca: "Ford",
      modeloBin: "Fiesta",
      modeloDecodificador: "Fiesta",
      tipo: "Motocicleta",
      nomeConsulta: "Básica",
      tokenConsulta: "token123",
      placaEntrada: "ABC1234",
      chassiEntrada: "XYZ",
      dataConsulta: "2020-01-01",
      id: 10,
      laudo: { token: "l" },
      tipoProduto: "PADRAO",
    };

    component.montaConsultas(composta);

    expect(component.consulta).toEqual(
      jasmine.objectContaining({
        id: 10,
        status: 1,
        data: "2020-01-01",
        qtdErros: 1,
        tipo: "Consulta Básica",
        tokenConsulta: "token123",
        placa: "ABC1234",
        chassi: "XYZ",
        modelo: "Fiesta",
        img: "./assets/images/marcas/ford-moto.png",
        laudo: { token: "l" },
        tipoProduto: "PADRAO",
      })
    );
  });

  it("should build consulta with marca e tipo nulos", () => {
    const composta: any = {
      consulta: [{ codigoControle: "OK" }],
      marca: null,
      modeloBin: null,
      modeloDecodificador: "Modelo",
      tipo: null,
      nomeConsulta: "Extra",
      tokenConsulta: "tok6",
      placaEntrada: "FFF1234",
      chassiEntrada: "CHASSI6",
      dataConsulta: "2020-01-06",
      id: 11,
      laudo: null,
      tipoProduto: "PADRAO",
    };

    component.montaConsultas(composta);

    expect(component.consulta.img).toBe("./assets/images/marcas/semmarca.png");
    expect(component.consulta.status).toBe(0);
  });

  it("should perform GET and return blob in downloadPdfFromUrl", () => {
    const url = "http://test.com/file.pdf";
    let responseBlob: Blob | undefined;
    component.downloadPdfFromUrl(url).subscribe((blob) => {
      responseBlob = blob;
      expect(blob instanceof Blob).toBeTruthy();
      expect(blob.type).toBe("application/pdf");
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe("GET");
    expect(req.request.responseType).toBe("arraybuffer");
    expect(req.request.headers.get("Content-Type")).toBe("application/pdf");
    req.flush(new ArrayBuffer(1), {
      headers: { "Content-Type": "application/pdf" },
    });
    expect(responseBlob).toBeDefined();
  });

  it("should download pdf and stop propagation", () => {
    const stopSpy = jasmine.createSpy();
    const blob = new Blob(["test"], { type: "application/pdf" });
    spyOn(component, "downloadPdfFromUrl").and.returnValue(of(blob));
    const clickSpy = jasmine.createSpy();
    spyOn(document, "createElement").and.returnValue({
      href: "",
      download: "",
      click: clickSpy,
    } as any);
    spyOn(window.URL, "createObjectURL").and.returnValue("blob:test");

    component.baixarPdf({ stopPropagation: stopSpy } as any, "abc");

    expect(stopSpy).toHaveBeenCalled();
    expect(component.downloadPdfFromUrl).toHaveBeenCalledWith(
      "https://carcheckbrasil.s3.us-east-1.amazonaws.com/consulta-veiculo-pdf/abc.pdf"
    );
    expect(clickSpy).toHaveBeenCalled();
  });
});
