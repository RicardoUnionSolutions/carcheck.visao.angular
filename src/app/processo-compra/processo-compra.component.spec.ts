import { fakeAsync, flushMicrotasks } from "@angular/core/testing";
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { BehaviorSubject, of, throwError } from "rxjs";

import { ProcessoCompraComponent } from "./processo-compra.component";

class FakeLoginService {
  private subject: BehaviorSubject<any>;
  logIn = jasmine.createSpy("logIn").and.callFake((value: any) => {
    this.subject.next(value);
  });

  constructor(initialValue: any) {
    this.subject = new BehaviorSubject(initialValue);
  }

  getLogIn() {
    return this.subject.asObservable();
  }

  emit(value: any) {
    this.subject.next(value);
  }
}

describe("ProcessoCompraComponent", () => {
  let modalService: jasmine.SpyObj<any>;
  let pessoaService: {
    adicionar: jasmine.Spy;
    completarCadastroPagamento: jasmine.Spy;
  };
  let fazerConsultaService: jasmine.SpyObj<any>;
  let analyticsService: jasmine.SpyObj<any>;
  let pagamentoService: jasmine.SpyObj<any>;
  let dadosConsultaService: jasmine.SpyObj<any>;
  let router: jasmine.SpyObj<any>;
  let title: jasmine.SpyObj<any>;
  let meta: jasmine.SpyObj<any>;
  let routeStub: any;
  let paramMap: Record<string, string | null>;
  let queryParamMap: Record<string, string | null>;
  let loginService: FakeLoginService;
  let component: ProcessoCompraComponent;
  let lastConsultaParam: string | undefined;

  const defaultConsultas = [
    {
      principal: true,
      composta: { nome: "Consulta Principal", tipoProduto: "CONSULTA" },
      valorConsulta: 79.9,
    },
    {
      principal: false,
      composta: { nome: "Laudo Completo", tipoProduto: "LAUDO" },
      valorConsulta: 29.9,
    },
  ];

  const defaultLoginState = {
    status: false,
    statusCadastro: undefined,
    cliente: {
      documento: "",
      tipoPessoa: "FISICA",
      clienteTipoIndefinido: "S",
    },
    endereco: {
      cep: "",
      endereco: "",
      cidade: "",
      bairro: "",
      numero: "",
      uf: "",
    },
    email: "",
    nome: "",
    tokenFacebook: "",
  };

  type LoginState = typeof defaultLoginState;

  const cadastroResponse = {
    status: true,
    statusCadastro: "COMPLETO",
    cliente: {
      documento: "98765432100",
      tipoPessoa: "FISICA",
      clienteTipoIndefinido: "N",
    },
    endereco: {
      cep: "29100-000",
      endereco: "Rua Um",
      cidade: "Vitória",
      bairro: "Centro",
      numero: "100",
      uf: "ES",
    },
    email: "novo@carcheck.com",
    nome: "Novo Usuário",
  };

  function createComponent(loginOverride: Partial<LoginState> = {}) {
    const loginState: LoginState = {
      ...defaultLoginState,
      ...loginOverride,
      cliente: {
        ...defaultLoginState.cliente,
        ...(loginOverride.cliente || {}),
      },
      endereco: {
        ...defaultLoginState.endereco,
        ...(loginOverride.endereco || {}),
      },
    };

    loginService = new FakeLoginService(loginState);

    component = new ProcessoCompraComponent(
      modalService as any,
      routeStub,
      pessoaService as any,
      fazerConsultaService as any,
      analyticsService as any,
      pagamentoService as any,
      loginService as any,
      router as any,
      dadosConsultaService as any,
      title as any,
      meta as any
    );

    component.cadastrarUsuario.formAcesso = new UntypedFormGroup({
      email: new UntypedFormControl("", Validators.required),
      senha: new UntypedFormControl("", Validators.required),
    });
    component.cadastrarUsuario.formCadastro = new UntypedFormGroup({
      nome: new UntypedFormControl("", Validators.required),
      cpf: new UntypedFormControl("", Validators.required),
    });

    component.listaConsulta = [];
    component.consultasSelecionadas = [];
    component.consultaLaudo = null as any;
    component.possuiLaudo = false;
    component.valorTotal = 0;
    component.valorTotalDesconto = 0;

    return component;
  }

  beforeEach(() => {
    modalService = jasmine.createSpyObj("ModalService", [
      "openLoading",
      "closeLoading",
      "openModalMsg",
      "open",
      "close",
    ]);

    pessoaService = {
      adicionar: jasmine
        .createSpy("adicionar")
        .and.returnValue(Promise.resolve(cadastroResponse)),
      completarCadastroPagamento: jasmine
        .createSpy("completarCadastroPagamento")
        .and.returnValue(of(cadastroResponse)),
    };

    fazerConsultaService = jasmine.createSpyObj("FazerConsultaService", [
      "consultar",
      "getConsultaCliente",
    ]);

    analyticsService = jasmine.createSpyObj("AnalyticsService", [
      "novoCadastro",
      "cadastroCompleto",
      "addToCart",
      "registroEntrandoPagamento",
    ]);

    pagamentoService = jasmine.createSpyObj("PagamentoService", [
      "pagar",
      "setUltimaCompra",
    ]);

    dadosConsultaService = jasmine.createSpyObj("dadosConsultaService", [
      "getPossuiCompraAprovada",
    ]);

    router = jasmine.createSpyObj("Router", ["navigate"]);
    title = jasmine.createSpyObj("Title", ["setTitle"]);
    meta = jasmine.createSpyObj("Meta", ["updateTag"]);

    fazerConsultaService.consultar.and.returnValue(of({ placa: "AAA1A23" }));
    lastConsultaParam = undefined;
    fazerConsultaService.getConsultaCliente.and.callFake((param: string) => {
      lastConsultaParam = param;
      return {
        toPromise: () => Promise.resolve(defaultConsultas),
      };
    });

    pagamentoService.pagar.and.returnValue(
      Promise.resolve({ situacaoPagamento: "APROVADO" })
    );

    dadosConsultaService.getPossuiCompraAprovada.and.returnValue(of(false));

    paramMap = {};
    queryParamMap = {};
    routeStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => (key in paramMap ? paramMap[key] : null),
        },
        queryParamMap: {
          get: (key: string) =>
            key in queryParamMap ? queryParamMap[key] : null,
        },
      },
    };
  });

  it("deve configurar metadados e normalizar placa/email no ngOnInit", () => {
    paramMap["placa"] = "abc1d23";
    paramMap["email"] = "teste@carcheck.com";
    component = createComponent();
    component.pesquisaPlaca = "";

    component.ngOnInit();

    expect(title.setTitle).toHaveBeenCalledWith(
      "Processo de Compra - CarCheck"
    );
    expect(meta.updateTag).toHaveBeenCalledWith({
      name: "description",
      content:
        "Realize sua compra de consulta veicular em etapas simples: escolha, cadastro e pagamento seguro.",
    });
    expect(component.pesquisaPlaca).toBe("ABC1D23");
    expect(component.pesquisaEmail).toBe("TESTE@CARCHECK.COM");
  });

  it("deve habilitar cadastro e preencher dados quando documento está ausente", () => {
    const loginOverride: Partial<LoginState> = {
      status: true,
      cliente: {
        documento: "",
        tipoPessoa: "FISICA",
        clienteTipoIndefinido: "S",
      },
      endereco: {
        cep: "29100-000",
        endereco: "Rua Um",
        cidade: "Vitória",
        bairro: "Centro",
        numero: "99",
        uf: "ES",
      },
      email: "usuario@teste.com",
      nome: "Usuário Teste",
      tokenFacebook: "fb-token",
    };

    component = createComponent(loginOverride);

    expect(component.cadastrar).toBeTrue();
    expect(component.cadastrarRestoFB).toBeTrue();
    expect(component.cadastrarUsuario.email).toBe("usuario@teste.com");
    expect(component.cadastrarUsuario.nome).toBe("Usuário Teste");
    expect(component.cadastrarUsuario.cep).toBe("29100-000");
    expect(component.cadastrarUsuario.uf).toBe("Rua Um");
    expect(component.cadastrarUsuario.tipoPessoa).toBe("0");
    expect(component.cadastrarUsuario.tokenFacebook).toBe("fb-token");
  });

  it("deve configurar passos reduzidos quando cadastro está completo", () => {
    component = createComponent({
      status: true,
      statusCadastro: "COMPLETO",
      cliente: { documento: "123", tipoPessoa: "JURIDICA", clienteTipoIndefinido: "N" },
    });

    expect(component.stepIndex.pagamento).toBe(2);
    expect(component.steps.length).toBe(3);
  });

  it("deve incluir passo de completar cadastro quando cadastro está incompleto", () => {
    component = createComponent({
      status: true,
      statusCadastro: "INCOMPLETO",
      cliente: { documento: "123", tipoPessoa: "FISICA", clienteTipoIndefinido: "N" },
    });

    expect(component.stepIndex.completarCadastro).toBe(2);
    expect(component.steps.length).toBe(5);
  });

  it("deve montar passos de acesso quando usuário não está logado", () => {
    component = createComponent({ status: false });

    expect(component.steps.some((s) => s.title === "Acesso")).toBeTrue();
    expect(component.steps.some((s) => s.title === "Cadastro")).toBeTrue();
  });

  it("deve avançar automaticamente quando consulta da rota não é placa", () => {
    paramMap["consulta"] = "relatorio";
    component = createComponent({ status: false });

    expect(component.currentStep).toBe(1);
  });

  it("deve normalizar consulta quando rota fornece placa válida", () => {
    paramMap["consulta"] = "aaa-1a23";
    component = createComponent({ status: false });

    expect(component.pesquisaPlaca).toBe("AAA1A23");
    expect(component.currentStep).toBe(0);
  });

  it("deve abrir e fechar modal de aviso", () => {
    component = createComponent();
    component.abrirModal();
    component.closeModal();

    expect(modalService.open).toHaveBeenCalledWith("modalAviso");
    expect(modalService.close).toHaveBeenCalledWith("modalAviso");
  });

  it("validaPlaca deve reconhecer formatos válidos e inválidos", () => {
    component = createComponent();
    expect(component.validaPlaca("ABC1D23")).toBeTrue();
    expect(component.validaPlaca("1234567")).toBeFalse();
  });

  it("stepVeiculoEvent deve exigir dados do veículo", () => {
    component = createComponent();
    component.pesquisaChassi = "";
    component.pesquisaPlaca = "";

    component.stepVeiculoEvent();

    expect(component.msg).toBe("danger");
  });

  it("stepVeiculoEvent deve validar placa informada", () => {
    component = createComponent();
    component.tipoPesquisa = "placa";
    component.pesquisaPlaca = "ABC1234";

    component.stepVeiculoEvent();

    expect(component.msg).toBe("danger");
  });

  it("stepVeiculoEvent deve consultar chassi e avançar", () => {
    component = createComponent();
    component.tipoPesquisa = "chassi";
    component.pesquisaChassi = "XYZ123";
    fazerConsultaService.consultar.and.returnValue(of({ modelo: "Carro" }));
    const nextSpy = spyOn(component, "nextStep");

    component.stepVeiculoEvent();

    expect(component.dadosVeiculo.modelo).toBe("Carro");
    expect(component.dadosVeiculo.erro).toBeFalse();
    expect(nextSpy).toHaveBeenCalled();
  });

  it("stepVeiculoEvent deve tratar retorno nulo na consulta por chassi", () => {
    component = createComponent();
    component.tipoPesquisa = "chassi";
    component.pesquisaChassi = "XYZ123";
    fazerConsultaService.consultar.and.returnValue(of(null));

    component.stepVeiculoEvent();

    expect(component.dadosVeiculo.erro).toBeTrue();
  });

  it("stepVeiculoEvent deve tratar erro na consulta por chassi", () => {
    component = createComponent();
    component.tipoPesquisa = "chassi";
    component.pesquisaChassi = "XYZ123";
    fazerConsultaService.consultar.and.returnValue(
      throwError(() => new Error("falha"))
    );

    component.stepVeiculoEvent();

    expect(component.dadosVeiculo.erro).toBeTrue();
  });

  it("stepVeiculoEvent deve consultar placa e armazenar retorno", () => {
    component = createComponent();
    component.tipoPesquisa = "placa";
    component.pesquisaPlaca = "abc1d23";
    fazerConsultaService.consultar.and.returnValue(of({ cor: "Azul" }));
    const nextSpy = spyOn(component, "nextStep");

    component.stepVeiculoEvent();

    expect(component.dadosVeiculo.cor).toBe("Azul");
    expect(component.dadosVeiculo.placa).toBe("ABC1D23");
    expect(component.dadosVeiculo.erro).toBeFalse();
    expect(nextSpy).toHaveBeenCalled();
  });

  it("stepCadastroEvent deve pular cadastro quando usuário já possui documento", () => {
    component = createComponent();
    component.cadastrar = false;
    component.logIn = { cliente: { documento: "123" } } as any;
    const hideSpy = spyOn(component, "escondeCadastro");
    const nextSpy = spyOn(component, "nextStep");

    component.stepCadastroEvent();

    expect(component.currentStep).toBe(1);
    expect(hideSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });

  it("stepCadastroEvent deve avançar quando documento é placeholder", () => {
    component = createComponent();
    component.logIn = { cliente: { documento: "000.000.000-00" } } as any;
    const nextSpy = spyOn(component, "nextStep");

    component.stepCadastroEvent();

    expect(nextSpy).toHaveBeenCalledTimes(1);
    expect(modalService.openLoading).not.toHaveBeenCalled();
  });

  it("stepCadastroEvent deve marcar campos como touched quando formulário inválido", () => {
    component = createComponent();
    const markSpy = spyOn(
      component.cadastrarUsuario.formAcesso.controls.email,
      "markAsTouched"
    );

    component.stepCadastroEvent();

    expect(markSpy).toHaveBeenCalled();
  });

  it(
    "stepCadastroEvent deve cadastrar usuário e avançar quando formulário válido",
    fakeAsync(() => {
      component = createComponent({
        cliente: { documento: "000.000.000-00", tipoPessoa: "FISICA", clienteTipoIndefinido: "N" },
      });
      component.cadastrarUsuario.formAcesso.controls.email.setValue(
        "novo@teste.com"
      );
      component.cadastrarUsuario.formAcesso.controls.senha.setValue("123");
      component.logIn = { cliente: { documento: "000.000.000-00" } } as any;
      const nextSpy = spyOn(component, "nextStep");
      const hideSpy = spyOn(component, "escondeCadastro");

      component.stepCadastroEvent();
      flushMicrotasks();

      expect(modalService.openLoading).toHaveBeenCalled();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      expect(modalConfig.title).toContain("Cadastro Efetuado");

      modalConfig.ok.event();

      expect(loginService.logIn).toHaveBeenCalledWith(cadastroResponse);
      expect(component.cadastrar).toBeFalse();
      expect(hideSpy).toHaveBeenCalled();
      expect(nextSpy).toHaveBeenCalled();
    })
  );

  it(
    "stepCadastroEvent deve sinalizar erro de email já cadastrado",
    fakeAsync(() => {
      pessoaService.adicionar.and.returnValue(
        Promise.resolve("erro_email")
      );
      component = createComponent();
      component.cadastrarUsuario.formAcesso.controls.email.setValue(
        "ja@existe.com"
      );
      component.cadastrarUsuario.formAcesso.controls.senha.setValue("123");
      const nextSpy = spyOn(component, "nextStep");

      component.stepCadastroEvent();
      flushMicrotasks();

      expect(
        component.cadastrarUsuario.formAcesso.controls.email.errors?.msg
      ).toBe("E-mail já cadastrado");
      expect(nextSpy).not.toHaveBeenCalled();
    })
  );

  it(
    "stepCadastroEvent deve tratar exceção durante cadastro",
    fakeAsync(() => {
      pessoaService.adicionar.and.returnValue(Promise.reject("falha"));
      component = createComponent();
      component.cadastrarUsuario.formAcesso.controls.email.setValue(
        "erro@teste.com"
      );
      component.cadastrarUsuario.formAcesso.controls.senha.setValue("123");

      component.stepCadastroEvent();
      flushMicrotasks();

      expect(modalService.closeLoading).toHaveBeenCalled();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      expect(modalConfig.title).toContain("Erro ao efetuar transação");
      expect(component.loadingCompra).toBeFalse();
    })
  );

  it("stepCompletarCadastroEvent deve marcar campos e parar quando inválido", () => {
    component = createComponent();
    const markSpy = spyOn(
      component.cadastrarUsuario.formCadastro.controls.nome,
      "markAsTouched"
    );

    component.stepCompletarCadastroEvent();

    expect(markSpy).toHaveBeenCalled();
    expect(pessoaService.completarCadastroPagamento).not.toHaveBeenCalled();
  });

  it("stepCompletarCadastroEvent deve completar cadastro e avançar", () => {
    component = createComponent();
    component.cadastrarUsuario.formCadastro.controls.nome.setValue("Nome");
    component.cadastrarUsuario.formCadastro.controls.cpf.setValue("111");
    const nextSpy = spyOn(component, "nextStep");
    const hideSpy = spyOn(component, "escondeCadastro");

    component.stepCompletarCadastroEvent();

    expect(pessoaService.completarCadastroPagamento).toHaveBeenCalledWith(
      jasmine.objectContaining({ clienteTipoIndefinido: "N" })
    );
    expect(analyticsService.cadastroCompleto).toHaveBeenCalled();
    expect(loginService.logIn).toHaveBeenCalledWith(cadastroResponse);
    expect(hideSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
    expect(component.loadingCompra).toBeFalse();
  });

  it("stepCompletarCadastroEvent deve tratar erro do serviço", () => {
    pessoaService.completarCadastroPagamento.and.returnValue(
      throwError(() => "falha")
    );
    component = createComponent();
    component.cadastrarUsuario.formCadastro.controls.nome.setValue("Nome");
    component.cadastrarUsuario.formCadastro.controls.cpf.setValue("111");

    component.stepCompletarCadastroEvent();

    expect(component.loadingCompra).toBeFalse();
  });

  it("next deve direcionar fluxo conforme o passo atual", () => {
    component = createComponent();
    component.stepIndex = {
      consulta: 0,
      veiculo: 1,
      cadastro: 2,
      completarCadastro: 3,
      pagamento: 4,
    } as any;
    component.steps = [{}, {}, {}, {}, {}] as any;
    component.consultasSelecionadas = [
      { composta: { nome: "Produto" } },
    ] as any;

    const nextSpy = spyOn(component, "nextStep");
    component.currentStep = 0;
    component.next();
    expect(nextSpy).toHaveBeenCalled();

    const veiculoSpy = spyOn(component, "stepVeiculoEvent");
    component.currentStep = 1;
    component.next();
    expect(analyticsService.addToCart).toHaveBeenCalledWith("Produto");
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
    expect(component.ultimoStep).toBeTrue();
  });

  it("next deve bloquear avanço quando laudo estiver inválido", () => {
    component = createComponent();
    component.stepIndex = { consulta: 0, veiculo: 1 } as any;
    component.currentStep = 1;
    component.possuiLaudo = true;
    component.laudoStatus = "INVALID";
    const veiculoSpy = spyOn(component, "stepVeiculoEvent");

    component.next();

    expect(veiculoSpy).not.toHaveBeenCalled();
  });

  it("next deve aplicar dados do laudo quando válido", () => {
    component = createComponent();
    component.stepIndex = { consulta: 0, veiculo: 1 } as any;
    component.currentStep = 1;
    component.possuiLaudo = true;
    component.laudoStatus = "VALID";
    component.laudo.placa = "bbb1c23";
    component.consultasSelecionadas = [
      { composta: { nome: "Produto" } },
    ] as any;
    const veiculoSpy = spyOn(component, "stepVeiculoEvent");

    component.next();

    expect(component.pesquisaPlaca).toBe("bbb1c23");
    expect(component.tipoPesquisa).toBe("placa");
    expect(analyticsService.addToCart).toHaveBeenCalledWith("Produto");
    expect(veiculoSpy).toHaveBeenCalled();
  });

  it("nextStep deve avançar controlando índices concluídos", () => {
    component = createComponent();
    component.steps = [{}, {}] as any;
    component.currentStep = 0;
    component.doneSteps = 0;

    component.nextStep();
    expect(component.currentStep).toBe(1);
    expect(component.doneSteps).toBe(1);

    component.nextStep();
    expect(component.currentStep).toBe(1);
    expect(component.doneSteps).toBe(1);
  });

  it(
    "carregaOpcoesConsultaUsuario deve usar email do usuário logado",
    fakeAsync(() => {
      component = createComponent({ status: true, email: "cliente@teste.com" });
      component.listaConsulta = [];
      component.consultasSelecionadas = [];
      const selectSpy = spyOn(component, "selecionarTipoConsulta").and.callThrough();
      const calcSpy = spyOn(component, "calcularValorTotal").and.callThrough();

      component.carregaOpcoesConsultaUsuario();
      flushMicrotasks();

      expect(lastConsultaParam).toBe("cliente@teste.com");
      expect(component.listaConsulta.length).toBe(2);
      expect(selectSpy).toHaveBeenCalled();
      expect(calcSpy).toHaveBeenCalled();
    })
  );

  it(
    "carregaOpcoesConsultaUsuario deve usar parâmetro padrão quando não logado",
    fakeAsync(() => {
      component = createComponent({ status: false });
      component.listaConsulta = [];
      component.consultasSelecionadas = [];

      component.carregaOpcoesConsultaUsuario();
      flushMicrotasks();

      expect(lastConsultaParam).toBe("padrao");
    })
  );

  it(
    "carregaOpcoesConsultaUsuario deve tratar erro da API",
    fakeAsync(() => {
      fazerConsultaService.getConsultaCliente.and.returnValue({
        toPromise: () => Promise.reject("falha"),
      });
      component = createComponent();
      const consoleSpy = spyOn(console, "log");

      component.carregaOpcoesConsultaUsuario();
      flushMicrotasks();

      expect(consoleSpy).toHaveBeenCalledWith(
        "erro ao carregar consultas",
        "falha"
      );
      consoleSpy.and.callThrough();
    })
  );

  it("cadastrarChange deve alternar flag de cadastro", () => {
    component = createComponent();
    expect(component.cadastrar).toBeFalse();
    component.cadastrarChange();
    expect(component.cadastrar).toBeTrue();
  });

  it("loginChange deve acionar próximo passo", () => {
    component = createComponent();
    const nextSpy = spyOn(component, "next");
    component.loginChange();
    expect(nextSpy).toHaveBeenCalled();
  });

  it("loginFbChange deve respeitar flag de cadastro", () => {
    component = createComponent();
    const nextSpy = spyOn(component, "next");
    component.cadastrarRestoFB = false;
    component.loginFbChange();
    expect(nextSpy).toHaveBeenCalledTimes(1);

    nextSpy.calls.reset();
    component.cadastrarRestoFB = true;
    component.loginFbChange();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  it("valorCentavos e valorReais devem formatar números", () => {
    component = createComponent();
    expect(component.valorCentavos(10.5)).toBe("50");
    expect(component.valorReais(10.5)).toBe("10");
  });

  it("selecionarTipoConsulta deve respeitar parâmetro e avançar quando solicitado", () => {
    component = createComponent();
    component.listaConsulta = JSON.parse(JSON.stringify(defaultConsultas));
    paramMap["consulta"] = "principal";
    queryParamMap["next"] = "CONSULTA";
    const nextSpy = spyOn(component, "nextStep");

    component.selecionarTipoConsulta();

    expect(component.consultasSelecionadas[0].composta.nome).toBe(
      "Consulta Principal"
    );
    expect(component.listaConsulta[0].quantidade).toBe(1);
    expect(component.consultaLaudo.composta.tipoProduto).toBe("LAUDO");
    expect(component.possuiLaudo).toBeFalse();
    expect(nextSpy).toHaveBeenCalled();
  });

  it("selecionarTipoConsulta deve escolher consulta principal quando não há correspondência", () => {
    component = createComponent();
    component.listaConsulta = [
      {
        principal: true,
        composta: { nome: "Plano Básico", tipoProduto: "CONSULTA" },
        valorConsulta: 10,
      },
      {
        principal: false,
        composta: { nome: "Laudo", tipoProduto: "LAUDO" },
        valorConsulta: 5,
      },
    ] as any;
    paramMap["consulta"] = "nao-existe";

    component.selecionarTipoConsulta();

    expect(component.consultasSelecionadas[0].composta.nome).toBe(
      "Plano Básico"
    );
  });

  it("selecionarTipoConsulta deve utilizar primeiro item quando não há principal", () => {
    component = createComponent();
    component.listaConsulta = [
      {
        principal: false,
        composta: { nome: "Laudo", tipoProduto: "LAUDO" },
        valorConsulta: 5,
      },
      {
        principal: false,
        composta: { nome: "Adicional", tipoProduto: "CONSULTA" },
        valorConsulta: 7,
      },
    ] as any;

    component.selecionarTipoConsulta();

    expect(component.consultasSelecionadas[0].composta.nome).toBe("Laudo");
    expect(component.possuiLaudo).toBeTrue();
  });

  it("selecionarTipoConsulta deve lidar com lista vazia", () => {
    component = createComponent();
    component.listaConsulta = [];

    component.selecionarTipoConsulta();

    expect(component.consultasSelecionadas[0]).toBeNull();
  });

  it("escondeCadastro deve ajustar passos e índices", () => {
    component = createComponent();
    component.escondeCadastro();

    expect(component.stepIndex.pagamento).toBe(2);
    expect(component.steps.length).toBe(3);
  });

  it("verificaCompraAprovada deve esconder cadastro quando serviço retornar true", () => {
    component = createComponent();
    dadosConsultaService.getPossuiCompraAprovada.and.returnValue(of(true));
    const hideSpy = spyOn(component, "escondeCadastro");

    component.verificaCompraAprovada();

    expect(hideSpy).toHaveBeenCalled();
  });

  it("verificaCompraAprovada deve tratar erro do serviço", () => {
    component = createComponent();
    dadosConsultaService.getPossuiCompraAprovada.and.returnValue(
      throwError(() => "falha")
    );
    const consoleSpy = spyOn(console, "log");

    component.verificaCompraAprovada();

    expect(consoleSpy).toHaveBeenCalledWith("erro", "falha");
    consoleSpy.and.callThrough();
  });

  it("selecionarConsultaEvent deve atualizar seleção e calcular total", () => {
    component = createComponent();
    const calcSpy = spyOn(component, "calcularValorTotal");
    const consultas = [
      { composta: { tipoProduto: "LAUDO" }, valorConsulta: 10 },
      { composta: { tipoProduto: "OUTRO" }, valorConsulta: 5 },
    ] as any;

    component.selecionarConsultaEvent(consultas);

    expect(component.consultasSelecionadas).toBe(consultas);
    expect(component.possuiLaudo).toBeTrue();
    expect(calcSpy).toHaveBeenCalled();
  });

  it("calcularValorTotal deve somar valores e definir desconto inicial", () => {
    component = createComponent();
    component.consultasSelecionadas = [
      { valorConsulta: 10 },
      { valorConsulta: 5 },
    ] as any;

    component.calcularValorTotal();

    expect(component.valorTotal).toBe(15);
    expect(component.valorTotalDesconto).toBe(15);
  });

  it("calcularValorTotal deve preservar desconto existente", () => {
    component = createComponent();
    component.consultasSelecionadas = [{ valorConsulta: 20 }] as any;
    component.valorTotalDesconto = 99;

    component.calcularValorTotal();

    expect(component.valorTotal).toBe(20);
    expect(component.valorTotalDesconto).toBe(99);
  });

  it("toggleLaudoAdicional deve adicionar e remover consulta de laudo", () => {
    component = createComponent();
    component.consultasSelecionadas = [defaultConsultas[0]] as any;
    component.consultaLaudo = defaultConsultas[1] as any;
    component.pesquisaPlaca = "AAA1A23";
    component.pesquisaChassi = "CHASSI";
    const resetSpy = spyOn(component, "resetLaudo").and.callThrough();

    component.toggleLaudoAdicional(true);
    expect(component.consultasSelecionadas.length).toBe(2);
    expect(component.laudo.placa).toBe("AAA1A23");
    expect(component.laudo.chassi).toBe("CHASSI");

    component.toggleLaudoAdicional(false);
    expect(component.consultasSelecionadas.length).toBe(1);
    expect(resetSpy).toHaveBeenCalled();
  });

  it("resetLaudo deve limpar campos do laudo", () => {
    component = createComponent();
    component.laudo = {
      chassi: "1",
      placa: "2",
      proprietario: "3",
      telefone: "4",
      uf: "5",
      cidade: "6",
    } as any;

    component.resetLaudo();

    expect(component.laudo).toEqual({
      chassi: "",
      placa: "",
      proprietario: "",
      telefone: "",
      uf: "",
      cidade: "",
    });
  });

  it("stepPagamentoEvent deve abortar quando forma de pagamento lança erro", () => {
    component = createComponent();
    component.formaPagamento = {
      getPagamento: () => {
        throw new Error("falha");
      },
    } as any;
    component.consultasSelecionadas = [
      { composta: { nome: "Produto" } },
    ] as any;

    component.stepPagamentoEvent();

    expect(pagamentoService.pagar).not.toHaveBeenCalled();
  });

  function prepararPagamento() {
    component.formaPagamento = {
      getPagamento: () => ({ tipo: "cartao" }),
    } as any;
    component.consultasSelecionadas = [
      { composta: { nome: "Produto" } },
    ] as any;
    component.dadosVeiculo = { modelo: "Carro" } as any;
    component.laudo = {
      proprietario: "Dono",
      telefone: "2799999999",
      uf: "ES",
      cidade: "Vitória",
    } as any;
  }

  it(
    "stepPagamentoEvent deve concluir compra aprovada",
    fakeAsync(() => {
      component = createComponent();
      prepararPagamento();

      component.stepPagamentoEvent();
      expect(analyticsService.registroEntrandoPagamento).toHaveBeenCalled();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      modalConfig.ok.event();
      flushMicrotasks();

      expect(pagamentoService.pagar).toHaveBeenCalled();
      expect(pagamentoService.setUltimaCompra).toHaveBeenCalledWith(
        jasmine.anything(),
        component.consultasSelecionadas,
        "unica"
      );
      expect(router.navigate).toHaveBeenCalledWith([
        "confirmacao-pagamento",
      ]);
      expect(component.loadingCompra).toBeFalse();
    })
  );

  it(
    "stepPagamentoEvent deve tratar pagamento aguardando liberação",
    fakeAsync(() => {
      pagamentoService.pagar.and.returnValue(
        Promise.resolve({ situacaoPagamento: "AGUARDANDO_LIBERACAO" })
      );
      component = createComponent();
      prepararPagamento();

      component.stepPagamentoEvent();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      modalConfig.ok.event();
      flushMicrotasks();

      expect(router.navigate).toHaveBeenCalledWith([
        "confirmacao-pagamento",
      ]);
    })
  );

  it(
    "stepPagamentoEvent deve tratar pagamento cancelado com transação registrada",
    fakeAsync(() => {
      pagamentoService.pagar.and.returnValue(
        Promise.resolve({ situacaoPagamento: "CANCELADO", transacao: true })
      );
      component = createComponent();
      prepararPagamento();

      component.stepPagamentoEvent();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      modalConfig.ok.event();
      flushMicrotasks();

      expect(router.navigate).toHaveBeenCalledWith([
        "confirmacao-pagamento",
      ]);
      expect(component.msg).toBe("error");
    })
  );

  it(
    "stepPagamentoEvent deve tratar pagamento cancelado sem transação",
    fakeAsync(() => {
      pagamentoService.pagar.and.returnValue(
        Promise.resolve({ situacaoPagamento: "CANCELADO", transacao: false })
      );
      component = createComponent();
      prepararPagamento();

      component.stepPagamentoEvent();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      modalConfig.ok.event();
      flushMicrotasks();

      expect(router.navigate).not.toHaveBeenCalled();
      expect(component.msg).toBe("error");
    })
  );

  it(
    "stepPagamentoEvent deve registrar situação desconhecida",
    fakeAsync(() => {
      const consoleSpy = spyOn(console, "log");
      pagamentoService.pagar.and.returnValue(
        Promise.resolve({ situacaoPagamento: "DESCONHECIDO" })
      );
      component = createComponent();
      prepararPagamento();

      component.stepPagamentoEvent();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      modalConfig.ok.event();
      flushMicrotasks();

      expect(consoleSpy).toHaveBeenCalledWith(
        "ERRO AO EFETUAR PAGAMENTO",
        jasmine.any(Object)
      );
      consoleSpy.and.callThrough();
    })
  );

  it(
    "stepPagamentoEvent deve tratar rejeição na cobrança",
    fakeAsync(() => {
      pagamentoService.pagar.and.returnValue(Promise.reject("falha"));
      component = createComponent();
      prepararPagamento();

      component.stepPagamentoEvent();
      const modalConfig = modalService.openModalMsg.calls.mostRecent().args[0];
      modalConfig.ok.event();
      flushMicrotasks();

      expect(component.msg).toBe("error");
      expect(component.loadingCompra).toBeFalse();
    })
  );

  it("ngAfterViewInit deve ser executado sem erros", () => {
    component = createComponent();
    component.ngAfterViewInit();
    expect(true).toBeTrue();
  });
});
