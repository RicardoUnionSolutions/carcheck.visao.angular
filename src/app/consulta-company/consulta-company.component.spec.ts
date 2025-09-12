import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { BehaviorSubject, of } from "rxjs";
import { ConsultaCompanyComponent } from "./consulta-company.component";
import { ActivatedRoute } from "@angular/router";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { LoginService } from "../service/login.service";
import { ModalService } from "../service/modal.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { DataService } from "../service/dataService.service";
import {
  DomSanitizer,
  Title,
  Meta,
  BrowserModule,
} from "@angular/platform-browser";

class LoginServiceStub {
  private subject = new BehaviorSubject<any>({ status: false });
  getLogIn() {
    return this.subject.asObservable();
  }
  emit(value: any) {
    this.subject.next(value);
  }
}

class ModalServiceStub {
  openLoading = jasmine.createSpy("openLoading");
  closeLoading = jasmine.createSpy("closeLoading");
}

class DadosConsultaServiceStub {
  getConsultaVeiculoCompany = jasmine
    .createSpy("getConsultaVeiculoCompany")
    .and.returnValue(Promise.resolve({ linkPesquisa: "http://service.test" }));
}

class DataServiceStub {
  data: any;
  getData() {
    return this.data;
  }
  clearData = jasmine.createSpy("clearData");
}

class TitleStub {
  setTitle = jasmine.createSpy("setTitle");
}

class MetaStub {
  updateTag = jasmine.createSpy("updateTag");
}

class ActivatedRouteStub {
  private subject = new BehaviorSubject<any>({ get: () => null });
  paramMap = this.subject.asObservable();
  setParamMap(map: any) {
    this.subject.next(map);
  }
}

describe("ConsultaCompanyComponent", () => {
  let component: ConsultaCompanyComponent;
  let fixture: ComponentFixture<ConsultaCompanyComponent>;
  let route: ActivatedRouteStub;
  let modalService: ModalServiceStub;
  let dataService: DataServiceStub;
  let dadosService: DadosConsultaServiceStub;
  let titleService: TitleStub;
  let metaService: MetaStub;
  let loginService: LoginServiceStub;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultaCompanyComponent],
      providers: [
        { provide: LoginService, useClass: LoginServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: dadosConsultaService, useClass: DadosConsultaServiceStub },
        { provide: DataService, useClass: DataServiceStub },
        { provide: Title, useClass: TitleStub },
        { provide: Meta, useClass: MetaStub },
      ],
      imports: [BrowserModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute) as any;
    modalService = TestBed.inject(ModalService) as any;
    dataService = TestBed.inject(DataService) as any;
    dadosService = TestBed.inject(dadosConsultaService) as any;
    titleService = TestBed.inject(Title) as any;
    metaService = TestBed.inject(Meta) as any;
    loginService = TestBed.inject(LoginService) as any;
  }));

  function createComponent() {
    fixture = TestBed.createComponent(ConsultaCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it("should create the component", () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it("should update iframeHeight on valid message", () => {
    createComponent();
    const event = {
      origin: "https://www.companyconferi.com.br",
      data: { height: 500 },
    } as MessageEvent;
    component.onMessage(event);
    expect(component.iframeHeight).toBe("500px");
  });

  it("should ignore messages from other origins", () => {
    createComponent();
    const event = {
      origin: "https://evil.com",
      data: { height: 300 },
    } as MessageEvent;
    component.onMessage(event);
    expect(component.iframeHeight).toBe("1000px");
  });

  it("should ignore messages without numeric height", () => {
    createComponent();
    const event = {
      origin: "https://www.companyconferi.com.br",
      data: { height: "300" },
    } as any;
    component.onMessage(event);
    expect(component.iframeHeight).toBe("1000px");
  });

  it("verificaExemplo should set consultaExemplo", () => {
    createComponent();
    component.verificaExemplo("abc-exemplo");
    expect(component.consultaExemplo).toBeTruthy();
    component.verificaExemplo("abc");
    expect(component.consultaExemplo).toBeFalsy();
  });

  it("should update login when LoginService emits", () => {
    createComponent();
    expect(component.login.status).toBe(false);
    loginService.emit({ status: true });
    expect(component.login.status).toBe(true);
  });

  it("ngOnInit should use existing data from DataService", () => {
    dataService.data = { linkPesquisa: "http://existing.test" };
    route.setParamMap({ get: () => "token123" });
    createComponent();
    expect(modalService.openLoading).toHaveBeenCalled();
    expect(modalService.closeLoading).toHaveBeenCalled();
    expect(dadosService.getConsultaVeiculoCompany).not.toHaveBeenCalled();
    expect(
      (component.iframeUrl as any).changingThisBreaksApplicationSecurity
    ).toBe("http://existing.test");
    expect(titleService.setTitle).toHaveBeenCalledWith(
      "Consulta CNPJ Completa"
    );
    expect(metaService.updateTag).toHaveBeenCalled();
  });

  it("ngOnInit should fetch data when DataService empty", waitForAsync(() => {
    dataService.data = null;
    const promiseResult = { linkPesquisa: "http://service.test" };
    dadosService.getConsultaVeiculoCompany.and.returnValue(
      Promise.resolve(promiseResult)
    );
    route.setParamMap({ get: () => "tok" });
    createComponent();
    expect(modalService.openLoading).toHaveBeenCalled();
    return fixture.whenStable().then(() => {
      expect(dadosService.getConsultaVeiculoCompany).toHaveBeenCalledWith(
        "tok"
      );
      expect(
        (component.iframeUrl as any).changingThisBreaksApplicationSecurity
      ).toBe("http://service.test");
      expect(modalService.closeLoading).toHaveBeenCalled();
    });
  }));

  it("ngOnInit should handle service error", waitForAsync(() => {
    dataService.data = null;
    const consoleSpy = spyOn(console, "error");
    dadosService.getConsultaVeiculoCompany.and.returnValue(
      Promise.reject("err")
    );
    route.setParamMap({ get: () => "tok" });
    createComponent();
    expect(modalService.openLoading).toHaveBeenCalled();
    return fixture.whenStable().then(() => {
      expect(dadosService.getConsultaVeiculoCompany).toHaveBeenCalledWith(
        "tok"
      );
      expect(consoleSpy).toHaveBeenCalledWith("err");
      expect(modalService.closeLoading).toHaveBeenCalled();
      expect(component.iframeUrl).toBeUndefined();
    });
  }));

  it("should clear data on destroy", () => {
    createComponent();
    component.ngOnDestroy();
    expect(dataService.clearData).toHaveBeenCalled();
  });
});
