import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { ProcessoCompraMultiplasConsultasComponent } from './processo-compra-multiplas-consultas.component';
import { ModalService } from '../service/modal.service';
import { PagSeguroService } from '../service/pagseguro.service';
import { PagamentoService } from '../service/pagamento.service';
import { Router } from '@angular/router';
import { AnalyticsService } from '../service/analytics.service';
import { PessoaService } from '../service/pessoa.service';
import { LoginService } from '../service/login.service';
import { dadosConsultaService } from '../service/dados-consulta.service';
import { VariableGlobal } from '../service/variable.global.service';
import { Title, Meta } from '@angular/platform-browser';

class ModalServiceStub {
  close = jasmine.createSpy('close');
  open = jasmine.createSpy('open');
  openModalMsg = jasmine.createSpy('openModalMsg');
}
class PagSeguroServiceStub {}
class PagamentoServiceStub {
  pagar = jasmine.createSpy('pagar').and.returnValue(Promise.resolve({ situacaoPagamento: 'APROVADO' }));
  setUltimaCompra = jasmine.createSpy('setUltimaCompra');
}
class RouterStub { navigate = jasmine.createSpy('navigate'); }
class AnalyticsServiceStub {
  addToCartCredito = jasmine.createSpy('addToCartCredito');
  registroEntrandoPagamento = jasmine.createSpy('registroEntrandoPagamento');
}
class PessoaServiceStub {
  completarCadastroPagamento = jasmine
    .createSpy('completarCadastroPagamento')
    .and.returnValue(of({ token: 'abc' }));
}
class LoginServiceStub {
  private subj = new BehaviorSubject<any>({ cliente: { tipoPessoa: 'FISICA' }, statusCadastro: 'INCOMPLETO' });
  getLogIn() {
    return this.subj.asObservable();
  }
  logIn = jasmine.createSpy('logIn');
}
class DadosConsultaServiceStub {
  getPossuiCompraAprovada = jasmine.createSpy('getPossuiCompraAprovada').and.returnValue(of(true));
}
class VariableGlobalStub {
  getUrlSite() {
    return { home: 'http://test' } as any;
  }
}
class TitleStub {
  setTitle = jasmine.createSpy('setTitle');
}
class MetaStub {
  updateTag = jasmine.createSpy('updateTag');
}
@Component({
    selector: 'forma-pagamento', template: '',
    standalone: true
})
class FormaPagamentoComponentStub {
  getPagamento() {
    return { metodo: 'credito' } as any;
  }
}
@Component({
    selector: 'ck-modal', template: '',
    standalone: true
})
class CkModalComponentStub {}

describe('ProcessoCompraMultiplasConsultasComponent', () => {
  let component: ProcessoCompraMultiplasConsultasComponent;
  let modalService: ModalServiceStub;
  let analytics: AnalyticsServiceStub;
  let pagamentoService: PagamentoServiceStub;
  let router: RouterStub;
  let pessoaService: PessoaServiceStub;
  let loginService: LoginServiceStub;
  let dadosService: DadosConsultaServiceStub;
  let fixture: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ProcessoCompraMultiplasConsultasComponent,
        FormaPagamentoComponentStub,
        CkModalComponentStub,
      ],
      providers: [
        { provide: VariableGlobal, useClass: VariableGlobalStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: PagSeguroService, useClass: PagSeguroServiceStub },
        { provide: PagamentoService, useClass: PagamentoServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: AnalyticsService, useClass: AnalyticsServiceStub },
        { provide: PessoaService, useClass: PessoaServiceStub },
        { provide: LoginService, useClass: LoginServiceStub },
        { provide: dadosConsultaService, useClass: DadosConsultaServiceStub },
        { provide: Title, useClass: TitleStub },
        { provide: Meta, useClass: MetaStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    modalService = TestBed.inject(ModalService) as any;
    analytics = TestBed.inject(AnalyticsService) as any;
    pagamentoService = TestBed.inject(PagamentoService) as any;
    router = TestBed.inject(Router) as any;
    pessoaService = TestBed.inject(PessoaService) as any;
    loginService = TestBed.inject(LoginService) as any;
    dadosService = TestBed.inject(dadosConsultaService) as any;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessoCompraMultiplasConsultasComponent);
    component = fixture.componentInstance;
    component.formaPagamento = TestBed.createComponent(FormaPagamentoComponentStub).componentInstance as any;
    component.ckModal = TestBed.createComponent(CkModalComponentStub).componentInstance as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close modal', () => {
    component.abrirModal();
    expect(modalService.open).toHaveBeenCalledWith('modalAvisoCompraMultipla');
    component.closeModal();
    expect(modalService.close).toHaveBeenCalledWith('modalAvisoCompraMultipla');
  });

  it('back should decrement currentStep', () => {
    component.currentStep = 1;
    component.back();
    expect(component.currentStep).toBe(0);
  });

  it('calcularValorTotal should sum consultas when no pacote', () => {
    component.consultas = [
      { valorConsulta: 10 },
      { valorConsulta: 5 },
    ];
    component.valorTotalDesconto = 0 as any;
    component.pacote = null;
    component.calcularValorTotal();
    expect(component.valorTotal).toBe(15);
    expect(component.valorTotalDesconto).toBe(15);
  });

  it('calcularValorTotal should not change total when pacote exists', () => {
    component.consultas = [{ valorConsulta: 10 }];
    component.valorTotal = 99;
    component.pacote = {} as any;
    component.calcularValorTotal();
    expect(component.valorTotal).toBe(99);
  });

  it('valorCentavos and valorReais should split values', () => {
    expect(component.valorCentavos(10.99)).toBe('99');
    expect(component.valorReais(10.99)).toBe('10');
  });

  it('nextStep should advance currentStep and doneSteps', () => {
    component.steps = [{}, {}, {}];
    component.nextStep();
    expect(component.currentStep).toBe(1);
    expect(component.doneSteps).toBe(1);
  });

  it('next should call analytics and nextStep on consulta step', () => {
    component.steps = [{}, {}, {}];
    component.currentStep = component.stepIndex.consulta;
    component.consultas = [{ quantidade: 1 }];
    const spy = spyOn(component, 'nextStep');
    component.next();
    expect(spy).toHaveBeenCalled();
    expect(analytics.addToCartCredito).toHaveBeenCalled();
  });

  it('next should call stepCompletarCadastroEvent on cadastro step', () => {
    component.currentStep = component.stepIndex.completarCadastro;
    const spy = spyOn(component, 'stepCompletarCadastroEvent');
    component.next();
    expect(spy).toHaveBeenCalled();
  });

  it('next should call stepPagamentoEvent on pagamento step', () => {
    component.currentStep = component.stepIndex.pagamento;
    const spy = spyOn(component, 'stepPagamentoEvent');
    component.next();
    expect(spy).toHaveBeenCalled();
  });

  it('onChangeStep should trigger calcularValorTotal', () => {
    const spy = spyOn(component, 'calcularValorTotal');
    component.onChangeStep();
    expect(spy).toHaveBeenCalled();
  });

  it('formataMesagemErro should parse json list', () => {
    const result = component.formataMesagemErro('[{"message":"a"},{"message":"b"}]');
    expect(result).toEqual(['a', 'b']);
    const def = component.formataMesagemErro(null);
    expect(def.length).toBe(1);
  });

  it('stepCompletarCadastroEvent should not submit when form invalid', () => {
    const control = { markAsTouched: jasmine.createSpy('mark') };
    component.cadastrarUsuario.formCadastro = { controls: { nome: control }, invalid: true } as any;
    component.stepCompletarCadastroEvent();
    expect(control.markAsTouched).toHaveBeenCalled();
    expect(pessoaService.completarCadastroPagamento).not.toHaveBeenCalled();
  });

  it('stepCompletarCadastroEvent should submit when form valid', () => {
    const control = { markAsTouched: jasmine.createSpy('mark') };
    component.cadastrarUsuario.formCadastro = { controls: { nome: control }, invalid: false } as any;
    const nextSpy = spyOn(component, 'nextStep');
    component.stepCompletarCadastroEvent();
    expect(pessoaService.completarCadastroPagamento).toHaveBeenCalled();
    expect(loginService.logIn).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('verificaCompraAprovada should adjust steps', () => {
    component.verificaCompraAprovada();
    expect(component.stepIndex.completarCadastro).toBe(99);
    expect(component.steps.length).toBe(2);
  });

  it('stepPagamentoEvent should process payment and navigate on approval', fakeAsync(() => {
    component.consultas = [{ quantidade: 1 }];
    component.stepPagamentoEvent();
    const args = modalService.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(pagamentoService.pagar).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['confirmacao-pagamento']);
  }));

  it('stepPagamentoEvent should set error on cancel without transacao', fakeAsync(() => {
    pagamentoService.pagar.and.returnValue(Promise.resolve({ situacaoPagamento: 'CANCELADO' }));
    component.consultas = [{ quantidade: 1 }];
    component.stepPagamentoEvent();
    const args = modalService.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(component.msg).toBe('error');
  }));

  it('scrollToPacotes should call scrollIntoView on element', () => {
    const mockElement = document.createElement('div');
    const scrollSpy = spyOn(mockElement, 'scrollIntoView');
    const mockHTMLCollection = {
      length: 1,
      0: mockElement,
      item: (index: number) => index === 0 ? mockElement : null,
      namedItem: (name: string) => null
    } as HTMLCollectionOf<Element>;
    
    spyOn(document, 'getElementsByTagName').and.returnValue(mockHTMLCollection);
    
    component.scrollToPacotes();
    
    expect(document.getElementsByTagName).toHaveBeenCalledWith('tipo-produto-pacotes');
    expect(scrollSpy).toHaveBeenCalled();
  });

  it('back should not decrement when at start', () => {
    component.currentStep = 0;
    component.back();
    expect(component.currentStep).toBe(0);
  });

  it('calcularValorTotal should respect existing discount', () => {
    component.consultas = [{ valorConsulta: 10 }];
    component.valorTotalDesconto = 5 as any;
    component.pacote = null;
    component.calcularValorTotal();
    expect(component.valorTotal).toBe(10);
    expect(component.valorTotalDesconto).toBe(5);
  });

  it('nextStep should keep doneSteps when already greater', () => {
    component.steps = [{}, {}, {}];
    component.doneSteps = 2;
    component.nextStep();
    expect(component.doneSteps).toBe(2);
  });

  it('nextStep should not advance beyond last step', () => {
    component.steps = [{}, {}];
    component.currentStep = 1;
    component.nextStep();
    expect(component.currentStep).toBe(1);
  });

  it('constructor should load pacote details', () => {
    const pacote = { composta_id: 3, quantidade_composta: 2, valor_atual: 100, valor_promocional: 80 } as any;
    history.pushState({ pacote }, '', '');
    const fix = TestBed.createComponent(ProcessoCompraMultiplasConsultasComponent);
    const comp = fix.componentInstance;
    expect(comp.pacote).toEqual(pacote);
    expect(comp.consultas[0].quantidade).toBe(2);
    expect(comp.valorTotal).toBe(100);
    expect(comp.valorTotalDesconto).toBe(80);
    expect(comp.currentStep).toBe(comp.stepIndex.completarCadastro);
    history.replaceState({}, '', '');
  });

  it('constructor should set juridica and skip cadastro when status completo', () => {
    loginService['subj'].next({ cliente: { tipoPessoa: 'JURIDICA' }, statusCadastro: 'COMPLETO' });
    const fix = TestBed.createComponent(ProcessoCompraMultiplasConsultasComponent);
    const comp = fix.componentInstance;
    expect(comp.cadastrarUsuario.tipoPessoa).toBe('1');
    expect(comp.stepIndex.completarCadastro).toBe(99);
    expect(comp.steps.length).toBe(2);
    loginService['subj'].next({ cliente: { tipoPessoa: 'FISICA' }, statusCadastro: 'INCOMPLETO' });
  });

  it('stepPagamentoEvent should handle cancel with transacao', fakeAsync(() => {
    pagamentoService.pagar.and.returnValue(Promise.resolve({ situacaoPagamento: 'CANCELADO', transacao: true }));
    component.consultas = [{ quantidade: 1 }];
    component.stepPagamentoEvent();
    const args = modalService.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(pagamentoService.setUltimaCompra).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['confirmacao-pagamento']);
    expect(component.msg).toBe('error');
  }));

  it('stepPagamentoEvent should log on unknown status', fakeAsync(() => {
    spyOn(console, 'log');
    pagamentoService.pagar.and.returnValue(Promise.resolve({ situacaoPagamento: 'ERRO' }));
    component.consultas = [{ quantidade: 1 }];
    component.stepPagamentoEvent();
    const args = modalService.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(console.log).toHaveBeenCalled();
  }));

  it('stepPagamentoEvent should stop when getPagamento fails', () => {
    component.formaPagamento.getPagamento = () => {
      throw new Error('fail');
    };
    component.stepPagamentoEvent();
    expect(pagamentoService.pagar).not.toHaveBeenCalled();
  });

  it('stepPagamentoEvent should handle pagar rejection', fakeAsync(() => {
    pagamentoService.pagar.and.returnValue(Promise.reject(new Error('err')));
    component.consultas = [{ quantidade: 1 }] as any[];
    component.stepPagamentoEvent();
    const args = modalService.openModalMsg.calls.mostRecent().args[0];
    if (args && args.ok && args.ok.event) {
      args.ok.event();
    }
    tick();
    expect(component.msg).toBe('error');
    expect(component.loadingCompra).toBe(false);
  }));

  it('stepPagamentoEvent should navigate on aguardando liberacao', fakeAsync(() => {
    pagamentoService.pagar.and.returnValue(Promise.resolve({ situacaoPagamento: 'AGUARDANDO_LIBERACAO' }));
    component.consultas = [{ quantidade: 1 }];
    component.stepPagamentoEvent();
    const args = modalService.openModalMsg.calls.mostRecent().args[0];
    args.ok.event();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['confirmacao-pagamento']);
  }));

  it('stepCompletarCadastroEvent should remove formAcesso', () => {
    const control = { markAsTouched: jasmine.createSpy('mark') };
    component.cadastrarUsuario.formCadastro = { controls: { nome: control }, invalid: false } as any;
    component.cadastrarUsuario.formAcesso = {} as any;
    component.stepCompletarCadastroEvent();
    const args = pessoaService.completarCadastroPagamento.calls.mostRecent().args[0];
    expect(args.formAcesso).toBeUndefined();
  });

  it('stepCompletarCadastroEvent should handle service error', () => {
    pessoaService.completarCadastroPagamento.and.returnValue(throwError(() => new Error('err')));
    const control = { markAsTouched: jasmine.createSpy('mark') };
    component.cadastrarUsuario.formCadastro = { controls: { nome: control }, invalid: false } as any;
    component.stepCompletarCadastroEvent();
    expect(component.loadingCompra).toBe(false);
  });

  it('verificaCompraAprovada should keep steps when no approval', () => {
    dadosService.getPossuiCompraAprovada.and.returnValue(of(false));
    component.verificaCompraAprovada();
    expect(component.stepIndex.completarCadastro).toBe(1);
  });

  it('verificaCompraAprovada should log error on failure', () => {
    spyOn(console, 'log');
    const error = new Error('err');
    dadosService.getPossuiCompraAprovada.and.returnValue(throwError(() => error));
    component.verificaCompraAprovada();
    expect(console.log).toHaveBeenCalledWith('erro', jasmine.any(Error));
    expect(console.log).toHaveBeenCalledWith('erro', jasmine.objectContaining({
      message: 'err'
    }));
  });

  it('formataMesagemErro should handle empty string', () => {
    const res = component.formataMesagemErro('');
    expect(res.length).toBe(1);
  });
});

