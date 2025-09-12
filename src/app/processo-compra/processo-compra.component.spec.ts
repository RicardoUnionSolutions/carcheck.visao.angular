import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of, BehaviorSubject, throwError } from "rxjs";

import { ProcessoCompraComponent } from "./processo-compra.component";
import { ModalService } from "../service/modal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PessoaService } from "../service/pessoa.service";
import { FazerConsultaService } from "../service/fazer-consulta.service";
import { AnalyticsService } from "../service/analytics.service";
import { PagamentoService } from "../service/pagamento.service";
import { LoginService } from "../service/login.service";
import { dadosConsultaService } from "../service/dados-consulta.service";
import { Title, Meta } from "@angular/platform-browser";

// basic stubs for required services
const emptyFn = () => {};
const modalStub = {
  openLoading: jasmine.createSpy("openLoading"),
  closeLoading: jasmine.createSpy("closeLoading"),
  openModalMsg: jasmine.createSpy("openModalMsg"),
  open: jasmine.createSpy("open"),
  close: jasmine.createSpy("close"),
};
const pessoaStub = {
  adicionar: jasmine
    .createSpy("adicionar")
    .and.returnValue(Promise.resolve("ok")),
  completarCadastroPagamento: jasmine
    .createSpy("completarCadastroPagamento")
    .and.returnValue(of({})),
};
const analyticsStub = {
  novoCadastro: jasmine.createSpy("novoCadastro"),
  cadastroCompleto: jasmine.createSpy("cadastroCompleto"),
  addToCart: jasmine.createSpy("addToCart"),
  registroEntrandoPagamento: jasmine.createSpy("registroEntrandoPagamento"),
};
const pagamentoStub = {
  pagar: jasmine
    .createSpy("pagar")
    .and.returnValue(Promise.resolve({ situacaoPagamento: "APROVADO" })),
  setUltimaCompra: jasmine.createSpy("setUltimaCompra"),
};
const dadosConsultaStub = {
  getPossuiCompraAprovada: jasmine
    .createSpy("getPossuiCompraAprovada")
    .and.returnValue(of(false)),
};
const titleStub = { setTitle: jasmine.createSpy("setTitle") };
const metaStub = { updateTag: jasmine.createSpy("updateTag") };

class LoginStub {
  subject = new BehaviorSubject<any>({
    status: false,
    cliente: { documento: "" },
    endereco: {},
  });
  getLogIn() {
    return this.subject.asObservable();
  }
  logIn = jasmine.createSpy("logIn");
}
let loginStub: LoginStub;

const routeStub = {
  snapshot: {
    paramMap: { get: () => null },
    queryParamMap: { get: () => null },
  },
};
// Router stub used only for navigation spy; needs events observable for RouterLinkWithHref
const routerStub = {
  navigate: jasmine.createSpy("navigate"),
  // minimal events stream so directives depending on Router.events can subscribe
  events: of(null),
  // RouterLinkWithHref accesses createUrlTree during initialization
  // so provide a simple spy implementation to avoid errors
  createUrlTree: jasmine.createSpy("createUrlTree").and.returnValue({}),
  // RouterLinkWithHref also calls serializeUrl; return empty string to satisfy call
  serializeUrl: jasmine.createSpy("serializeUrl").and.returnValue(""),
} as any;

const fazerConsultaStub = {
  getConsultaCliente: () =>
    of([
      {
        composta: { tipoProduto: "", nome: "" },
        principal: true,
        valorConsulta: 10,
      },
    ]),
  consultar: jasmine
    .createSpy("consultar")
    .and.returnValue(of({ placa: "AAA1A23" })),
};

describe("ProcessoCompraComponent", () => {
  let component: ProcessoCompraComponent;
  let fixture: ComponentFixture<ProcessoCompraComponent>;

  beforeEach(async () => {
    loginStub = new LoginStub();
    await TestBed.configureTestingModule({
      declarations: [ProcessoCompraComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ModalService, useValue: modalStub },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: PessoaService, useValue: pessoaStub },
        { provide: FazerConsultaService, useValue: fazerConsultaStub },
        { provide: AnalyticsService, useValue: analyticsStub },
        { provide: PagamentoService, useValue: pagamentoStub },
        { provide: LoginService, useValue: loginStub },
        { provide: dadosConsultaService, useValue: dadosConsultaStub },
        { provide: Title, useValue: titleStub },
        { provide: Meta, useValue: metaStub },
        { provide: Router, useValue: routerStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessoCompraComponent);
    component = fixture.componentInstance;
    // ensure cadastrarUsuario object with invalid forms
    component.cadastrarUsuario = {
      razaoSocial: "",
      cnpj: "",
      nome: "",
      cpf: "",
      email: "",
      senha: "",
      cep: "",
      numero: "",
      endereco: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      tipoPessoa: "0",
      telefone: "",
      tokenFacebook: "",
      clienteTipoIndefinido: "S",
      formAcesso: new UntypedFormGroup({
        email: new UntypedFormControl("", Validators.required),
        senha: new UntypedFormControl("", Validators.required),
      }),
      formCadastro: new UntypedFormGroup({
        nome: new UntypedFormControl("", Validators.required),
        cpf: new UntypedFormControl("", Validators.required),
      }),
    } as any;
    component.cadastrar = true; // avoid early return
    component.logIn = { cliente: { documento: "" } } as any;
    fixture.detectChanges();
  });

  afterEach(() => {
    pessoaStub.completarCadastroPagamento.and.returnValue(of({}));
    pagamentoStub.pagar.and.returnValue(
      Promise.resolve({ situacaoPagamento: "APROVADO" })
    );

    // 👇 adiciona isto:
    pagamentoStub.pagar.calls.reset();

    routerStub.navigate.calls.reset?.();
    modalStub.openModalMsg.calls.reset();
    modalStub.openLoading.calls.reset();
    modalStub.closeLoading.calls.reset();

    // (opcional) reset dos getters e console.log como combinamos
    (routeStub.snapshot.paramMap.get as any) = () => null;
    (routeStub.snapshot.queryParamMap.get as any) = () => null;
    if ((console.log as any).and?.originalFn)
      (console.log as any).and.callThrough();
  });

  function recreateWithLogin(v: any) {
    // prepara o próximo valor que o take(1) vai consumir
    loginStub.subject = new BehaviorSubject<any>(v);

    // espione ANTES de criar o componente, pois o construtor pode chamar
    // escondeCadastro dependendo do valor
    return TestBed.createComponent(ProcessoCompraComponent);
  }

  it("deve criar o componente", () => {
    expect(component).toBeTruthy();
  });

  it("ngOnInit deve ajustar <title> e <meta description>", () => {
    component.ngOnInit();
    expect(titleStub.setTitle).toHaveBeenCalled();
    expect(metaStub.updateTag).toHaveBeenCalled();
  });

  it("constructor: se param consulta for placa válida, seta pesquisaPlaca e NÃO chama nextStep", () => {
    (routeStub.snapshot.paramMap.get as any) = (k: string) =>
      k === "consulta" ? "AAA-1A23" : null;
    const spyNext = spyOn(ProcessoCompraComponent.prototype as any, "nextStep");
    // recria o componente para reexecutar o construtor
    fixture = TestBed.createComponent(ProcessoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pesquisaPlaca).toBe("AAA1A23");
    expect(spyNext).not.toHaveBeenCalled();
  });

  it("constructor: se param consulta NÃO for placa, chama nextStep", () => {
    (routeStub.snapshot.paramMap.get as any) = (k: string) =>
      k === "consulta" ? "seguro" : null;
    const spyNext = spyOn(ProcessoCompraComponent.prototype as any, "nextStep");
    fixture = TestBed.createComponent(ProcessoCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spyNext).toHaveBeenCalled();
  });

  it("constructor: documento vazio/placeholder força cadastrar=true e preenche cadastrarUsuario", () => {
    loginStub.subject.next({
      status: true,
      cliente: {
        documento: "",
        tipoPessoa: "FISICA",
        clienteTipoIndefinido: "S",
      },
      endereco: {
        cep: "1",
        endereco: "rua",
        cidade: "c",
        bairro: "b",
        numero: "10",
        uf: "ES",
      },
      email: "u@u.com",
      nome: "User",
      tokenFacebook: "t",
    });
    expect(component.cadastrar).toBeTruthy();
    expect(component.cadastrarUsuario.email).toBe("u@u.com");
    expect(component.cadastrarUsuario.nome).toBe("User");
  });

  it("deve marcar campos do formAcesso como touched", () => {
    const spy = spyOn(
      component.cadastrarUsuario.formAcesso.controls.email,
      "markAsTouched"
    );
    component.stepCadastroEvent();
    expect(spy).toHaveBeenCalled();
  });

  it("deve marcar campos do formCadastro como touched", () => {
    const spy = spyOn(
      component.cadastrarUsuario.formCadastro.controls.nome,
      "markAsTouched"
    );
    component.stepCompletarCadastroEvent();
    expect(spy).toHaveBeenCalled();
  });

  it("deve abrir e fechar modal de aviso", () => {
    component.abrirModal();
    component.closeModal();
    expect(modalStub.open).toHaveBeenCalledWith("modalAviso");
    expect(modalStub.close).toHaveBeenCalledWith("modalAviso");
  });

  it("validaPlaca deve validar formatos corretos", () => {
    expect(component.validaPlaca("AAA1A23")).toBeTruthy();
    expect(component.validaPlaca("1234567")).toBeFalsy();
  });

  it("ngOnInit: se pesquisaPlaca vazia e existe param placa, normaliza para UPPER", () => {
    (routeStub.snapshot.paramMap.get as any) = (k: string) =>
      k === "placa" ? "bbb2c33" : null;
    component.pesquisaPlaca = "";
    component.ngOnInit();
    expect(component.pesquisaPlaca).toBe("BBB2C33");
  });

  it("stepVeiculoEvent deve lidar com placa e chassi", () => {
    component.steps = [{}, {}, {}];
    // nenhum dado
    component.pesquisaChassi = "";
    component.pesquisaPlaca = "";
    component.stepVeiculoEvent();
    expect(component.msg).toBe("danger");

    // placa inválida
    component.tipoPesquisa = "placa";
    component.pesquisaPlaca = "ABC123";
    component.stepVeiculoEvent();
    expect(component.msg).toBe("danger");

    // chassi válido
    const nextSpy = spyOn(component, "nextStep");
    component.tipoPesquisa = "chassi";
    component.pesquisaChassi = "XYZ";
    component.stepVeiculoEvent();
    expect(nextSpy).toHaveBeenCalled();

    // placa válida
    nextSpy.calls.reset();
    component.tipoPesquisa = "placa";
    component.pesquisaPlaca = "AAA1A23";
    component.stepVeiculoEvent();
    expect(nextSpy).toHaveBeenCalled();
    expect(component.dadosVeiculo.placa).toBe("AAA1A23");
  });

  it("stepVeiculoEvent: chassi retorna null → dadosVeiculo={erro:true}", () => {
    (fazerConsultaStub.consultar as any).and.returnValue(of(null));
    component.tipoPesquisa = "chassi";
    component.pesquisaChassi = "ABC";
    component.stepVeiculoEvent();
    expect(component.dadosVeiculo.erro).toBeTruthy();
  });

  it("stepVeiculoEvent: chassi com erro do serviço → dadosVeiculo={erro:true}", () => {
    (fazerConsultaStub.consultar as any).and.returnValue(
      throwError(() => "boom")
    );
    component.tipoPesquisa = "chassi";
    component.pesquisaChassi = "ABC";
    component.stepVeiculoEvent();
    expect(component.dadosVeiculo.erro).toBeTruthy();
  });

  it("calcularValorTotal e selecionarConsultaEvent devem funcionar", () => {
    const consulta = { valorConsulta: 10, composta: { tipoProduto: "X" } };
    component.selecionarConsultaEvent([consulta]);
    expect(component.consultasSelecionadas.length).toBe(1);
    expect(component.valorTotal).toBe(10);
  });

  it("toggleLaudoAdicional deve adicionar e remover laudo", () => {
    component.consultasSelecionadas = [
      { valorConsulta: 10, composta: { tipoProduto: "X" } },
    ] as any;
    component.consultaLaudo = {
      valorConsulta: 5,
      composta: { tipoProduto: "LAUDO" },
    } as any;
    component.pesquisaPlaca = "AAA1A23";
    component.toggleLaudoAdicional(true);
    expect(component.consultasSelecionadas.length).toBe(2);
    component.toggleLaudoAdicional(false);
    expect(component.consultasSelecionadas.length).toBe(1);
    expect(component.laudo.placa).toBe("");
  });

  it("valorCentavos e valorReais devem formatar valores", () => {
    expect(component.valorCentavos("10.50")).toBe("50");
    expect(component.valorReais("10.50")).toBe("10");
  });

  it("cadastrarChange, loginChange e loginFbChange devem chamar next", () => {
    const spy = spyOn(component, "next");
    component.cadastrarChange();
    expect(component.cadastrar).toBeFalsy();
    component.loginChange();
    expect(spy).toHaveBeenCalled();
    spy.calls.reset();
    component.cadastrarRestoFB = false;
    component.loginFbChange();
    expect(spy).toHaveBeenCalled();
  });
  it("loginFbChange: se cadastrarRestoFB=true, não avança", () => {
    const spy = spyOn(component, "next");
    component.cadastrarRestoFB = true;
    component.loginFbChange();
    expect(spy).not.toHaveBeenCalled();
  });

  it("escondeCadastro deve ajustar passos", () => {
    component.escondeCadastro();
    expect(component.stepIndex.pagamento).toBe(2);
    expect(component.steps.length).toBe(3);
  });

  it("login COMPLETO: chama escondeCadastro", () => {
    const spy = spyOn(
      ProcessoCompraComponent.prototype as any,
      "escondeCadastro"
    );
    fixture = recreateWithLogin({
      status: true,
      statusCadastro: "COMPLETO",
      cliente: { documento: "1" },
      endereco: {},
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });

  it("login INCOMPLETO: stepIndex inclui completarCadastro", () => {
    fixture = recreateWithLogin({
      status: true,
      statusCadastro: "INCOMPLETO",
      cliente: { documento: "1" },
      endereco: {},
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.stepIndex.completarCadastro).toBe(2);
  });

  it("NÃO logado: steps incluem Acesso e Cadastro", () => {
    fixture = recreateWithLogin({
      status: false,
      cliente: { documento: "" },
      endereco: {},
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.steps.some((s) => s.title === "Acesso")).toBeTruthy();
    expect(component.steps.some((s) => s.title === "Cadastro")).toBeTruthy();
  });

  it("resetLaudo deve limpar dados", () => {
    component.laudo = {
      chassi: "1",
      placa: "2",
      proprietario: "3",
      telefone: "4",
      uf: "5",
      cidade: "6",
    } as any;
    component.resetLaudo();
    expect(component.laudo.placa).toBe("");
  });

  it("stepCadastroEvent deve efetuar cadastro quando válido", fakeAsync(() => {
    component.cadastrarUsuario.formAcesso.controls.email.setValue("a@a.com");
    component.cadastrarUsuario.formAcesso.controls.senha.setValue("123");
    const nextSpy = spyOn(component, "nextStep");
    component.stepCadastroEvent();
    tick();
    expect(pessoaStub.adicionar).toHaveBeenCalled();
    const args = modalStub.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    expect(nextSpy).toHaveBeenCalled();
  }));
  it("stepCadastroEvent: se cadastrar=false e documento válido, escondeCadastro e avança", () => {
    const spyHide = spyOn(component, "escondeCadastro");
    const spyNext = spyOn(component, "nextStep");
    component.cadastrar = false;
    component.logIn = { cliente: { documento: "123" } } as any;
    component.stepCadastroEvent();
    expect(spyHide).toHaveBeenCalled();
    expect(spyNext).toHaveBeenCalled();
  });

  it("stepCadastroEvent: se documento placeholder, apenas avança", () => {
    const spyNext = spyOn(component, "nextStep");
    component.logIn = { cliente: { documento: "000.000.000-00" } } as any;
    component.stepCadastroEvent();
    expect(spyNext).toHaveBeenCalled();
  });

  it('stepCadastroEvent: quando adicionar resolve "erro_email", seta erro no campo e NÃO avança', fakeAsync(() => {
    (pessoaStub.adicionar as any).and.returnValue(
      Promise.resolve("erro_email")
    );
    component.cadastrarUsuario.formAcesso.controls.email.setValue("x@x.com");
    component.cadastrarUsuario.formAcesso.controls.senha.setValue("1");
    const spyNext = spyOn(component, "nextStep");
    component.stepCadastroEvent();
    tick();
    expect(
      component.cadastrarUsuario.formAcesso.controls.email.errors?.msg
    ).toBe("E-mail já cadastrado");
    expect(spyNext).not.toHaveBeenCalled();
  }));
  it("stepCompletarCadastroEvent: erro no serviço mantém loading=false", () => {
    (pessoaStub.completarCadastroPagamento as any).and.returnValue(
      throwError(() => "x")
    );
    component.cadastrarUsuario.formCadastro.controls.nome.setValue("a");
    component.cadastrarUsuario.formCadastro.controls.cpf.setValue("1");
    component.stepCompletarCadastroEvent();
    expect(component.loadingCompra).toBeFalsy();
  });

  it("stepCompletarCadastroEvent deve completar quando formulário válido", () => {
    component.cadastrarUsuario.formCadastro.controls.nome.setValue("Teste");
    component.cadastrarUsuario.formCadastro.controls.cpf.setValue("1");
    const nextSpy = spyOn(component, "nextStep");
    component.stepCompletarCadastroEvent();
    expect(pessoaStub.completarCadastroPagamento).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });

  it("next deve acionar passos corretos", () => {
    component.stepIndex = {
      consulta: 0,
      veiculo: 1,
      cadastro: 2,
      completarCadastro: 3,
      pagamento: 4,
    } as any;
    component.steps = [{}, {}, {}, {}, {}];
    const nextStepSpy = spyOn(component, "nextStep");
    component.currentStep = 0;
    component.next();
    expect(nextStepSpy).toHaveBeenCalled();

    const veiculoSpy = spyOn(component, "stepVeiculoEvent");
    component.currentStep = 1;
    component.next();
    expect(veiculoSpy).toHaveBeenCalled();

    const cadastroSpy = spyOn(component, "stepCadastroEvent");
    component.currentStep = 2;
    component.next();
    expect(cadastroSpy).toHaveBeenCalled();

    const completarSpy = spyOn(component, "stepCompletarCadastroEvent");
    component.currentStep = 3;
    component.next();
    expect(completarSpy).toHaveBeenCalled();

    const pagamentoSpy = spyOn(component, "stepPagamentoEvent");
    component.currentStep = 4;
    component.next();
    expect(pagamentoSpy).toHaveBeenCalled();
    expect(component.ultimoStep).toBeTruthy();
  });

  it("next deve interromper quando laudo inválido", () => {
    const veiculoSpy = spyOn(component, "stepVeiculoEvent");
    component.stepIndex = { consulta: 0, veiculo: 1 } as any;
    component.currentStep = 1;
    component.possuiLaudo = true;
    component.laudoStatus = "INVALID";
    component.next();
    expect(veiculoSpy).not.toHaveBeenCalled();
  });

  it("next: passo veículo com laudo válido deve setar placa/tipo e chamar addToCart", () => {
    component.possuiLaudo = true;
    component.laudoStatus = "OK";
    component.laudo.placa = "ccc3d44";
    component.stepIndex = { consulta: 0, veiculo: 1 } as any;
    component.currentStep = 1;
    component.consultasSelecionadas = [
      { composta: { nome: "Produto X" } },
    ] as any;
    const spyVeiculo = spyOn(component, "stepVeiculoEvent");
    component.next();
    expect(component.tipoPesquisa).toBe("placa");
    expect(component.pesquisaPlaca).toBe("ccc3d44");
    expect(analyticsStub.addToCart).toHaveBeenCalledWith("Produto X");
    expect(spyVeiculo).toHaveBeenCalled();
  });

  it("nextStep deve controlar índices", () => {
    component.steps = [{}, {}];
    component.currentStep = 0;
    component.doneSteps = 0;
    component.nextStep();
    expect(component.currentStep).toBe(1);
    expect(component.doneSteps).toBe(1);
    component.nextStep();
    expect(component.currentStep).toBe(1);
  });

  it("stepPagamentoEvent deve efetuar pagamento e navegar", fakeAsync(() => {
    component.consultasSelecionadas = [
      { composta: { nome: "Teste" }, valorConsulta: 10 },
    ] as any;
    component.dadosVeiculo = {} as any;
    component.laudo = {
      proprietario: "",
      telefone: "",
      uf: "",
      cidade: "",
    } as any;
    component.formaPagamento = { getPagamento: () => ({}) } as any;
    component.stepPagamentoEvent();
    const args = modalStub.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(routerStub.navigate).toHaveBeenCalledWith(["confirmacao-pagamento"]);
  }));

  it("pagamento: AGUARDANDO_LIBERACAO navega", fakeAsync(() => {
    (pagamentoStub.pagar as any).and.returnValue(
      Promise.resolve({ situacaoPagamento: "AGUARDANDO_LIBERACAO" })
    );
    component.formaPagamento = { getPagamento: () => ({}) } as any;
    component.consultasSelecionadas = [{ composta: { nome: "N" } }] as any;
    component.stepPagamentoEvent();
    const args = modalStub.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(routerStub.navigate).toHaveBeenCalledWith(["confirmacao-pagamento"]);
  }));

  it("pagamento: CANCELADO com transacao=true navega", fakeAsync(() => {
    (pagamentoStub.pagar as any).and.returnValue(
      Promise.resolve({ situacaoPagamento: "CANCELADO", transacao: true })
    );
    component.formaPagamento = { getPagamento: () => ({}) } as any;
    component.consultasSelecionadas = [{ composta: { nome: "N" } }] as any;
    component.stepPagamentoEvent();
    const args = modalStub.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(routerStub.navigate).toHaveBeenCalledWith(["confirmacao-pagamento"]);
  }));

  it("pagamento: CANCELADO com transacao=false não navega e seta msg=error", fakeAsync(() => {
    (pagamentoStub.pagar as any).and.returnValue(
      Promise.resolve({ situacaoPagamento: "CANCELADO", transacao: false })
    );
    component.formaPagamento = { getPagamento: () => ({}) } as any;
    component.consultasSelecionadas = [{ composta: { nome: "N" } }] as any;
    component.stepPagamentoEvent();
    const args = modalStub.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(routerStub.navigate).not.toHaveBeenCalledWith([
      "confirmacao-pagamento",
    ]);
    expect(component.msg).toBe("error");
  }));

  it("pagamento: status desconhecido cai no default", fakeAsync(() => {
    spyOn(console, "log");
    (pagamentoStub.pagar as any).and.returnValue(
      Promise.resolve({ situacaoPagamento: "DESCONHECIDO" })
    );
    component.formaPagamento = { getPagamento: () => ({}) } as any;
    component.consultasSelecionadas = [{ composta: { nome: "N" } }] as any;
    component.stepPagamentoEvent();
    const args = modalStub.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(console.log).toHaveBeenCalled(); // default log
  }));

  it("pagamento: reject no pagar cai no catch e seta msg=error", fakeAsync(() => {
    (pagamentoStub.pagar as any).and.returnValue(Promise.reject("x"));
    component.formaPagamento = { getPagamento: () => ({}) } as any;
    component.consultasSelecionadas = [{ composta: { nome: "N" } }] as any;
    component.stepPagamentoEvent();
    const args = modalStub.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(component.msg).toBe("error");
  }));

  it("stepPagamentoEvent: se getPagamento lança erro, não chama pagar", () => {
    component.formaPagamento = {
      getPagamento: () => {
        throw new Error("x");
      },
    } as any;
    component.consultasSelecionadas = [{ composta: { nome: "N" } }] as any;
    component.stepPagamentoEvent();
    expect(pagamentoStub.pagar).not.toHaveBeenCalled();
  });

  it("stepPagamentoEvent: se getPagamento lança erro, não chama pagar", () => {
    pagamentoStub.pagar.calls.reset(); // 👈 garante contador zerado
    component.formaPagamento = {
      getPagamento: () => {
        throw new Error("x");
      },
    } as any;
    component.consultasSelecionadas = [{ composta: { nome: "N" } }] as any;

    component.stepPagamentoEvent();

    expect(pagamentoStub.pagar).not.toHaveBeenCalled();
  });

  it("carregaOpcoesConsultaUsuario deve popular listas", fakeAsync(() => {
    component.listaConsulta = [] as any;
    component.consultasSelecionadas = [] as any;
    component.carregaOpcoesConsultaUsuario();
    tick();
    expect(component.listaConsulta.length).toBeGreaterThan(0);
    expect(component.consultasSelecionadas.length).toBe(1);
  }));

  it("carregaOpcoesConsultaUsuario: erro no serviço é tratado (log chamado)", fakeAsync(() => {
    spyOn(console, "log");
    const original = fazerConsultaStub.getConsultaCliente;
    (fazerConsultaStub as any).getConsultaCliente = () => {
      throw new Error("oops");
    };
    component.carregaOpcoesConsultaUsuario();
    tick();
    expect(console.log).toHaveBeenCalled();
    // restaura para não interferir em outros testes
    (fazerConsultaStub as any).getConsultaCliente = original;
  }));

  it("selecionarTipoConsulta deve definir consulta e navegar quando indicado", () => {
    (routeStub.snapshot.paramMap.get as any) = (k: string) =>
      k === "consulta" ? "principal" : null;
    (routeStub.snapshot.queryParamMap.get as any) = (k: string) =>
      k === "next" ? "CONSULTA" : null;
    component.listaConsulta = [
      {
        composta: { nome: "Principal", tipoProduto: "X" },
        principal: true,
        valorConsulta: 10,
      },
      {
        composta: { nome: "Laudo", tipoProduto: "LAUDO" },
        principal: false,
        valorConsulta: 5,
      },
    ] as any;
    const spy = spyOn(component, "nextStep");
    component.selecionarTipoConsulta();
    expect(component.consultasSelecionadas[0].composta.nome).toBe("Principal");
    expect(component.consultaLaudo.composta.tipoProduto).toBe("LAUDO");
    expect(spy).toHaveBeenCalled();
  });

  it("selecionarTipoConsulta: quando não bate e não há principal, seleciona índice 0", () => {
    (routeStub.snapshot.paramMap.get as any) = () => "qualquer";
    component.listaConsulta = [
      {
        composta: { nome: "X", tipoProduto: "X" },
        principal: false,
        valorConsulta: 1,
      },
      {
        composta: { nome: "Y", tipoProduto: "X" },
        principal: false,
        valorConsulta: 2,
      },
    ] as any;
    component.selecionarTipoConsulta();
    expect(component.consultasSelecionadas[0].composta.nome).toBe("X");
  });

  it("verificaCompraAprovada deve chamar serviço", () => {
    component.verificaCompraAprovada();
    expect(dadosConsultaStub.getPossuiCompraAprovada).toHaveBeenCalled();
  });
  it("verificaCompraAprovada: quando true esconde cadastro", () => {
    const spy = spyOn(component, "escondeCadastro");
    (dadosConsultaStub.getPossuiCompraAprovada as any).and.returnValue(
      of(true)
    );
    component.verificaCompraAprovada();
    expect(spy).toHaveBeenCalled();
  });
});
