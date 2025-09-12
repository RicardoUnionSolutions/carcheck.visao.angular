import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from "@angular/core/testing";
import { TipoProdutoPacotesComponent } from "./tipo-produto-pacotes.component";
import { Router } from "@angular/router";
import { LoginService } from "../../../service/login.service";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";

describe("TipoProdutoPacotesComponent", () => {
  let component: TipoProdutoPacotesComponent;
  let fixture: ComponentFixture<TipoProdutoPacotesComponent>;
  let router: jasmine.SpyObj<Router> & { url: string };
  let loginService: jasmine.SpyObj<LoginService>;

  const consultasMock = [
    { id: 1, valor_promocional: 50 },
    { id: 2, valor_promocional: 30 },
  ];
  const pacotesMock = [
    {
      composta_id: 1,
      quantidade_composta: 2,
      porcentagem_desconto: 10,
      nome_do_pacote: "Pacote A",
      descricao_do_pacote: "Desc A",
      recomendada: false,
    },
    {
      composta_id: 2,
      quantidade_composta: 3,
      porcentagem_desconto: 0,
      nome_do_pacote: "Pacote B",
      descricao_do_pacote: "Desc B",
      recomendada: true,
    },
  ];

  beforeEach(waitForAsync(() => {
    router = jasmine.createSpyObj<Router>("Router", ["navigate"]);
    (router.navigate as jasmine.Spy).and.returnValue(Promise.resolve(true));
    Object.defineProperty(router, "url", { value: "/", configurable: true });
    loginService = jasmine.createSpyObj<LoginService>("LoginService", [
      "getLogIn",
    ]);
    loginService.getLogIn.and.returnValue(of({ status: false }));

    TestBed.configureTestingModule({
      declarations: [TipoProdutoPacotesComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: loginService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoProdutoPacotesComponent);
    component = fixture.componentInstance;
    component.pacotes = JSON.parse(JSON.stringify(pacotesMock));
    component.consultas = consultasMock;
    router.navigate.calls.reset();
    loginService.getLogIn.calls.reset();
    loginService.getLogIn.and.returnValue(of({ status: false }));
    Object.defineProperty(router, "url", { value: "/", configurable: true });
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should format price strings", () => {
    expect(component.valorToString(10)).toBe("R$10,00");
    expect(component.valorToString(10.5)).toBe("R$10,50");
  });

  it("should set valores on init", () => {
    expect(component.pacotes[0].valor_atual).toBe(100);
    expect(component.pacotes[0].valor_promocional).toBe(90);
    expect(component.pacotes[1].valor_atual).toBe(90);
    expect(component.pacotes[1].valor_promocional).toBe(90);
  });

  it("should render a card for each pacote", () => {
    const cards = fixture.debugElement.queryAll(By.css(".cards"));
    expect(cards.length).toBe(pacotesMock.length);
  });

  it("should navigate to login when user is not logged", () => {
    const pacote = component.pacotes[0];
    loginService.getLogIn.and.returnValue(of({ status: false }));
    component.clickComprar(pacote);
    expect(router.navigate).toHaveBeenCalledWith(["/login"], {
      queryParams: { returnUrl: "/processo-compra-multipla" },
      state: { pacote },
    });
  });

  it("should navigate directly when user is logged and not on processo-compra-multipla", () => {
    const pacote = component.pacotes[0];
    Object.defineProperty(router, "url", {
      value: "/home",
      configurable: true,
    });
    loginService.getLogIn.and.returnValue(of({ status: true }));
    component.clickComprar(pacote);
    expect(router.navigate).toHaveBeenCalledWith(
      ["/processo-compra-multipla"],
      { state: { pacote } }
    );
  });

  it("should navigate to temp and then to processo-compra-multipla when already on it", fakeAsync(() => {
    const pacote = component.pacotes[0];
    Object.defineProperty(router, "url", {
      value: "/processo-compra-multipla",
      configurable: true,
    });
    loginService.getLogIn.and.returnValue(of({ status: true }));
    component.clickComprar(pacote);
    tick();
    expect(router.navigate.calls.allArgs()[0][0]).toEqual(["/url-temporaria"]);
    expect(router.navigate.calls.allArgs()[1][0]).toEqual([
      "/processo-compra-multipla",
    ]);
    expect(router.navigate.calls.allArgs()[1][1]).toEqual({
      state: { pacote },
    });
  }));
});
