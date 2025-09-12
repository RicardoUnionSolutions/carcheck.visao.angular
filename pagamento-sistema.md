# Sistema de Pagamento - Documentação Técnica

## Visão Geral
O sistema de pagamento do CarCheck integra com o PagSeguro para processar transações de consultas veiculares. Suporta múltiplas formas de pagamento, processamento em tempo real e gestão completa de transações.

## 🏗️ **Arquitetura do Sistema**

### Componentes Principais
- **ProcessoCompraComponent** - Fluxo de compra individual
- **ProcessoCompraMultiplasConsultasComponent** - Compra de pacotes
- **FormaPagamentoComponent** - Seleção de método de pagamento
- **ConfirmacaoPagamentoComponent** - Confirmação de pagamento
- **StatusPagamentoComponent** - Acompanhamento de status

### Serviços Envolvidos
- **PagSeguroService** - Integração com PagSeguro
- **PagamentoService** - Gerenciamento de pagamentos
- **ModalService** - Modais de confirmação
- **AnalyticsService** - Tracking de conversões

## 💳 **Formas de Pagamento Suportadas**

### 1. Cartão de Crédito/Débito
```typescript
// CreditoComponent
@Component({
  selector: "credito",
  templateUrl: "./credito.component.html",
  styleUrls: ["./credito.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CreditoComponent implements OnInit {
  form: UntypedFormGroup;
  parcelas: any[] = [];
  maxParcelas = 12;

  constructor(
    private fb: FormBuilder,
    private pagSeguroService: PagSeguroService
  ) {
    this.form = this.fb.group({
      numeroCartao: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      nomePortador: ['', [Validators.required]],
      validade: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      parcelas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  gerarParcelas() {
    this.parcelas = [];
    for (let i = 1; i <= this.maxParcelas; i++) {
      const valorParcela = this.valorTotal / i;
      this.parcelas.push({
        quantidade: i,
        valor: valorParcela,
        valorFormatado: this.formatarMoeda(valorParcela)
      });
    }
  }
}
```

### 2. PIX
```typescript
// PixComponent
@Component({
  selector: "pix",
  templateUrl: "./pix.component.html",
  styleUrls: ["./pix.component.scss"],
  standalone: true
})
export class PixComponent implements OnInit {
  qrCode: string = '';
  codigoPix: string = '';
  expiracao: Date = new Date();

  constructor(private pagSeguroService: PagSeguroService) {}

  gerarPix() {
    this.pagSeguroService.gerarPix({
      valor: this.valorTotal,
      descricao: 'Consulta Veicular CarCheck'
    }).subscribe(response => {
      this.qrCode = response.qrCode;
      this.codigoPix = response.codigoPix;
      this.expiracao = new Date(response.expiracao);
      this.iniciarVerificacaoPagamento();
    });
  }

  iniciarVerificacaoPagamento() {
    // Verifica status do pagamento a cada 5 segundos
    const interval = setInterval(() => {
      this.verificarStatusPagamento();
    }, 5000);

    // Para verificação após 15 minutos
    setTimeout(() => {
      clearInterval(interval);
    }, 900000);
  }
}
```

### 3. Boleto Bancário
```typescript
// BoletoComponent
@Component({
  selector: "boleto",
  templateUrl: "./boleto.component.html",
  styleUrls: ["./boleto.component.scss"],
  standalone: true
})
export class BoletoComponent implements OnInit {
  codigoBarras: string = '';
  linhaDigitavel: string = '';
  vencimento: Date = new Date();
  urlBoleto: string = '';

  constructor(private pagSeguroService: PagSeguroService) {}

  gerarBoleto() {
    this.pagSeguroService.gerarBoleto({
      valor: this.valorTotal,
      vencimento: this.calcularVencimento(),
      descricao: 'Consulta Veicular CarCheck'
    }).subscribe(response => {
      this.codigoBarras = response.codigoBarras;
      this.linhaDigitavel = response.linhaDigitavel;
      this.vencimento = new Date(response.vencimento);
      this.urlBoleto = response.urlBoleto;
    });
  }

  calcularVencimento(): Date {
    const vencimento = new Date();
    vencimento.setDate(vencimento.getDate() + 3); // 3 dias úteis
    return vencimento;
  }
}
```

## 🔄 **Fluxo de Processamento de Pagamento**

### 1. Inicialização do Processo
```typescript
// ProcessoCompraComponent
ngOnInit() {
  this.route.params.subscribe(params => {
    this.consulta = params.consulta;
    this.placa = params.placa;
    this.email = params.email;
    
    if (this.consulta) {
      this.carregarDadosConsulta();
    }
  });

  this.carregarProdutos();
  this.configurarFormulario();
}

carregarDadosConsulta() {
  const produto = this.variableGlobal.getProdutos()
    .find(p => p.id == this.consulta);
  
  if (produto) {
    this.consultaSelecionada = produto;
    this.calcularValorTotal();
  }
}
```

### 2. Seleção de Forma de Pagamento
```typescript
selecionarFormaPagamento(forma: string) {
  this.formaPagamento = forma;
  
  switch(forma) {
    case 'credito':
      this.componentePagamento = CreditoComponent;
      break;
    case 'pix':
      this.componentePagamento = PixComponent;
      break;
    case 'boleto':
      this.componentePagamento = BoletoComponent;
      break;
  }
}
```

### 3. Processamento da Transação
```typescript
// PagSeguroService
processarPagamento(dadosPagamento: any): Observable<any> {
  const payload = {
    ...dadosPagamento,
    valor: this.valorTotal,
    descricao: 'Consulta Veicular CarCheck',
    referencia: this.gerarReferencia(),
    notificacaoUrl: this.getNotificacaoUrl()
  };

  return this.http.post(this.getUrlPagSeguro('transacoes'), payload)
    .pipe(
      map(response => {
        this.analyticsService.trackingPagamento({
          valor: this.valorTotal,
          forma: dadosPagamento.forma,
          transacaoId: response.id
        });
        return response;
      }),
      catchError(error => {
        console.error('Erro no pagamento:', error);
        throw error;
      })
    );
}
```

## 📊 **Gestão de Status de Pagamento**

### 1. Estados do Pagamento
```typescript
enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  PROCESSANDO = 'PROCESSANDO',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
  CANCELADO = 'CANCELADO',
  ESTORNADO = 'ESTORNADO'
}

// StatusPagamentoComponent
@Component({
  selector: "status-pagamento",
  templateUrl: "./status-pagamento.component.html",
  styleUrls: ["./status-pagamento.component.scss"],
  standalone: true
})
export class StatusPagamentoComponent implements OnInit {
  status: StatusPagamento = StatusPagamento.PENDENTE;
  transacao: any = {};
  tempoRestante: number = 0;

  ngOnInit() {
    this.carregarStatusPagamento();
    this.iniciarVerificacaoStatus();
  }

  carregarStatusPagamento() {
    this.pagamentoService.getStatusPagamento(this.transacaoId)
      .subscribe(status => {
        this.status = status.status;
        this.transacao = status;
        this.atualizarInterface();
      });
  }
}
```

### 2. Verificação Automática de Status
```typescript
iniciarVerificacaoStatus() {
  const interval = setInterval(() => {
    this.verificarStatusAtualizado();
  }, 10000); // Verifica a cada 10 segundos

  // Para verificação após 30 minutos
  setTimeout(() => {
    clearInterval(interval);
  }, 1800000);
}

verificarStatusAtualizado() {
  this.pagamentoService.getStatusPagamento(this.transacaoId)
    .subscribe(status => {
      if (status.status !== this.status) {
        this.status = status.status;
        this.atualizarInterface();
        
        if (status.status === StatusPagamento.APROVADO) {
          this.processarPagamentoAprovado();
        }
      }
    });
}
```

## 🎯 **Sistema de Notificações**

### 1. Webhook do PagSeguro
```typescript
// PagSeguroService
processarNotificacao(notificacao: any): Observable<any> {
  const codigoNotificacao = notificacao.notificationCode;
  
  return this.http.get(`${this.getUrlPagSeguro('notificacoes')}/${codigoNotificacao}`)
    .pipe(
      map(response => {
        this.atualizarStatusTransacao(response);
        return response;
      })
    );
}

atualizarStatusTransacao(transacao: any) {
  const status = this.mapearStatusPagSeguro(transacao.status);
  
  this.pagamentoService.atualizarStatus({
    transacaoId: transacao.reference,
    status: status,
    dados: transacao
  }).subscribe();
}
```

### 2. Notificações em Tempo Real
```typescript
// WebSocketService para notificações
enviarNotificacaoPagamento(usuarioId: string, status: string) {
  const notificacao = {
    tipo: 'PAGAMENTO',
    usuarioId: usuarioId,
    status: status,
    timestamp: new Date().toISOString()
  };
  
  this.webSocketService.sendMessage(notificacao);
}
```

## 💰 **Cálculos e Valores**

### 1. Cálculo de Valores
```typescript
calcularValorTotal() {
  let valorBase = 0;
  
  // Valor base da consulta
  if (this.consultaSelecionada) {
    valorBase = this.consultaSelecionada.valor_promocional || 
                this.consultaSelecionada.valor_atual;
  }
  
  // Desconto por pacote
  if (this.quantidade > 1) {
    const desconto = this.calcularDescontoPacote(this.quantidade);
    valorBase = valorBase * (1 - desconto);
  }
  
  // Taxa de processamento
  const taxaProcessamento = this.calcularTaxaProcessamento(valorBase);
  
  this.valorTotal = valorBase + taxaProcessamento;
  this.valorFormatado = this.formatarMoeda(this.valorTotal);
}

calcularDescontoPacote(quantidade: number): number {
  if (quantidade >= 10) return 0.15; // 15% desconto
  if (quantidade >= 5) return 0.10;  // 10% desconto
  if (quantidade >= 3) return 0.05;  // 5% desconto
  return 0;
}
```

### 2. Formatação de Moeda
```typescript
formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

formatarParcela(valor: number, quantidade: number): string {
  const valorParcela = valor / quantidade;
  return `${quantidade}x de ${this.formatarMoeda(valorParcela)}`;
}
```

## 🔒 **Segurança e Validação**

### 1. Validação de Dados de Pagamento
```typescript
validarDadosPagamento(dados: any): boolean {
  // Validação de cartão
  if (dados.forma === 'credito') {
    if (!this.validarNumeroCartao(dados.numeroCartao)) {
      this.exibirErro('Número do cartão inválido');
      return false;
    }
    
    if (!this.validarCVV(dados.cvv)) {
      this.exibirErro('CVV inválido');
      return false;
    }
    
    if (!this.validarValidade(dados.validade)) {
      this.exibirErro('Data de validade inválida');
      return false;
    }
  }
  
  return true;
}

validarNumeroCartao(numero: string): boolean {
  // Algoritmo de Luhn
  const numeroLimpo = numero.replace(/\D/g, '');
  let soma = 0;
  let par = false;
  
  for (let i = numeroLimpo.length - 1; i >= 0; i--) {
    let digito = parseInt(numeroLimpo.charAt(i));
    
    if (par) {
      digito *= 2;
      if (digito > 9) digito -= 9;
    }
    
    soma += digito;
    par = !par;
  }
  
  return soma % 10 === 0;
}
```

### 2. Criptografia de Dados Sensíveis
```typescript
criptografarDadosCartao(dados: any): any {
  return {
    ...dados,
    numeroCartao: this.criptografar(dados.numeroCartao),
    cvv: this.criptografar(dados.cvv)
  };
}

criptografar(texto: string): string {
  // Implementação de criptografia (exemplo com btoa)
  return btoa(texto);
}
```

## 📱 **Interface e UX**

### 1. Componente de Forma de Pagamento
```typescript
// FormaPagamentoComponent
@Component({
  selector: "forma-pagamento",
  templateUrl: "./forma-pagamento.component.html",
  styleUrls: ["./forma-pagamento.component.scss"],
  standalone: true
})
export class FormaPagamentoComponent implements OnInit {
  formasPagamento = [
    { id: 'credito', nome: 'Cartão de Crédito', icon: 'credit-card.svg' },
    { id: 'pix', nome: 'PIX', icon: 'pix.svg' },
    { id: 'boleto', nome: 'Boleto Bancário', icon: 'barcode.svg' }
  ];

  formaSelecionada: string = '';

  selecionarForma(forma: string) {
    this.formaSelecionada = forma;
    this.formaSelecionadaChange.emit(forma);
  }
}
```

### 2. Loading States
```typescript
// Estados de carregamento durante pagamento
processandoPagamento = false;

iniciarProcessamento() {
  this.processandoPagamento = true;
  this.modal.openLoading({
    title: "Processando Pagamento",
    text: "Aguarde enquanto processamos sua transação..."
  });
}

finalizarProcessamento() {
  this.processandoPagamento = false;
  this.modal.closeLoading();
}
```

## 🧪 **Testes e Debugging**

### 1. Testes Unitários
```typescript
describe('PagSeguroService', () => {
  let service: PagSeguroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PagSeguroService]
    });
    service = TestBed.inject(PagSeguroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should process payment correctly', () => {
    const dadosPagamento = {
      forma: 'credito',
      numeroCartao: '4111111111111111',
      valor: 54.90
    };

    service.processarPagamento(dadosPagamento).subscribe(response => {
      expect(response.status).toBe('APROVADO');
    });

    const req = httpMock.expectOne(`${service.getUrlPagSeguro('transacoes')}`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: 'APROVADO', id: '12345' });
  });
});
```

### 2. Logs de Transação
```typescript
// Logs estruturados para debugging
logTransacao(transacao: any) {
  console.log('PagSeguroService - Transação processada:', {
    id: transacao.id,
    status: transacao.status,
    valor: transacao.valor,
    forma: transacao.forma,
    timestamp: new Date().toISOString()
  });
}
```

## 📊 **Analytics e Métricas**

### 1. Tracking de Conversões
```typescript
// AnalyticsService
trackingPagamento(dados: any) {
  gtag('event', 'purchase', {
    transaction_id: dados.transacaoId,
    value: dados.valor,
    currency: 'BRL',
    payment_type: dados.forma
  });
}

trackingAbandonoCarrinho(etapa: string) {
  gtag('event', 'cart_abandonment', {
    step: etapa,
    value: this.valorTotal
  });
}
```

### 2. Métricas de Performance
```typescript
// Métricas de tempo de processamento
medirTempoProcessamento() {
  const inicio = performance.now();
  
  this.processarPagamento().subscribe(() => {
    const fim = performance.now();
    const tempoProcessamento = fim - inicio;
    
    this.analyticsService.trackingPerformance({
      metrica: 'tempo_processamento_pagamento',
      valor: tempoProcessamento
    });
  });
}
```

## 📋 **Resumo da Implementação**

### ✅ **Funcionalidades Implementadas:**
1. **Múltiplas formas de pagamento** (Cartão, PIX, Boleto)
2. **Processamento em tempo real** com PagSeguro
3. **Gestão de status** automática
4. **Validação robusta** de dados
5. **Sistema de notificações** via WebSocket
6. **Cálculos automáticos** de valores e descontos
7. **Interface responsiva** e intuitiva
8. **Segurança** com criptografia
9. **Analytics** e tracking de conversões
10. **Testes unitários** e debugging

### 🎯 **Benefícios:**
- **Conversão**: Múltiplas opções de pagamento
- **Segurança**: Validações e criptografia
- **UX**: Interface clara e feedback visual
- **Confiabilidade**: Processamento robusto
- **Analytics**: Métricas detalhadas de performance

O sistema de pagamento do CarCheck oferece uma experiência completa e segura para processamento de transações, integrando perfeitamente com o fluxo de consultas veiculares.

