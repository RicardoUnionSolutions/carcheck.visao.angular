# Sistema de Consultas Veiculares - Documentação Técnica

## Visão Geral
O sistema de consultas veiculares é o coração da aplicação CarCheck, permitindo aos usuários verificar o histórico completo de veículos através de diferentes tipos de consultas. O sistema processa dados em tempo real e gera relatórios detalhados.

## 🏗️ **Arquitetura do Sistema**

### Componentes Principais
- **ConsultaComponent** - Exibição de resultados de consulta
- **RealizarConsultasComponent** - Interface para realizar novas consultas
- **ConsultaPlacaVeiculoComponent** - Consulta inicial por placa
- **ConsultaCompanyComponent** - Interface empresarial
- **ConsultaInicialComponent** - Consulta de teste

### Serviços Envolvidos
- **dadosConsultaService** - Gerenciamento de dados de consulta
- **FazerConsultaService** - Processamento de consultas
- **ConsultaDuasEtapasService** - Consultas em duas etapas
- **WebSocketService** - Atualizações em tempo real

## 🔍 **Tipos de Consultas Disponíveis**

### 1. Consulta Veicular Completa (R$ 54,90)
```typescript
const consultaCompleta = {
  id: 3,
  nome_da_consulta: "Consulta Veicular Completa",
  valor_atual: 69.9,
  valor_promocional: 54.9,
  lista_de_insumos: [
    "Dados estaduais",
    "Dados nacionais", 
    "Debitos e Multas",
    "Detalhes Renajud",
    "Restrições e Impedimentos Legais",
    "Dados originais",
    "Histórico de leilão",
    "Score aceitação de seguro",
    "Indício de sinistro",
    "Valor na tabela Fipe",
    "Desvalorização média",
    "Verificador de chassi",
    "Modelo cadastrado na montadora",
    "Recall do modelo",
    "Comunicação de venda",
    "Gravame",
    "Risco de comercialização mercado (%)",
    "Duplicidade de motor",
    "Percentual do valor do veículo leiloado na revenda",
    "Probabilidade da necessidade de vistoria física (%)",
    "Análise do estado do veículo no leilão (%)",
    "Gráficos de análise de risco",
    "Remarketing Veicular",
    "Detalhamento de veículo em remarketing veicular"
  ]
};
```

### 2. Consulta Veicular Segura (R$ 48,90)
```typescript
const consultaSegura = {
  id: 5,
  nome_da_consulta: "Consulta Veicular Segura",
  valor_atual: 58.9,
  valor_promocional: 48.9,
  lista_de_insumos: [
    "Dados estaduais",
    "Dados nacionais",
    "Debitos e Multas", 
    "Restrições e Impedimentos Legais",
    "Dados originais",
    "Score aceitação de seguro",
    "Indício de sinistro",
    "Valor na tabela Fipe",
    "Verificador de chassi",
    "Recall do modelo",
    "Gravame",
    "Duplicidade de motor"
  ]
};
```

### 3. Consulta Veicular Leilão (R$ 39,90)
```typescript
const consultaLeilao = {
  id: 2,
  nome_da_consulta: "Consulta Veicular Leilão",
  valor_atual: 49.9,
  valor_promocional: 39.9,
  lista_de_insumos: [
    "Dados estaduais",
    "Dados nacionais",
    "Histórico de leilão",
    "Valor na tabela Fipe",
    "Desvalorização média",
    "Percentual do valor do veículo leiloado na revenda",
    "Análise do estado do veículo no leilão (%)",
    "Remarketing Veicular",
    "Detalhamento de veículo em remarketing veicular"
  ]
};
```

## 🔄 **Fluxo de Processamento de Consulta**

### 1. Inicialização da Consulta
```typescript
// RealizarConsultasComponent
carregaDadosVeiculoConsulta(i, concat: String = "") {
  var placa = this.consultas[i].placa;
  var chassi = this.consultas[i].chassi;
  var tipoPesquisa = this.consultas[i].tipoPesquisa;
  
  if (tipoPesquisa == "placa" && placa.length >= 7) {
    this.fazerConsultaService
      .consultarDadosVeiculo(placa, "placa")
      .subscribe((dados) => {
        this.consultas[i].dadosVeiculo = dados;
        this.consultas[i].marca = dados.marca;
        this.consultas[i].modelo = dados.modelo;
        this.consultas[i].ano = dados.ano;
        this.consultas[i].cor = dados.cor;
      });
  }
}
```

### 2. Processamento Assíncrono
```typescript
// FazerConsultaService
fazerConsulta(consultas: any[]): Observable<any> {
  return this.http.post(this.variableGlobal.getUrl("consulta/fazer"), {
    consultas: consultas
  }).pipe(
    map(response => {
      // Processa resposta da consulta
      return response;
    }),
    catchError(error => {
      console.error('Erro na consulta:', error);
      throw error;
    })
  );
}
```

### 3. Atualizações em Tempo Real via WebSocket
```typescript
// WebSocketService
export class WebSocketService {
  private socket: WebSocketSubject<any> | null = null;

  openWebSocket(): void {
    if (!this.socket) {
      this.socket = this.create(environment.webSocketUrl);
    }
  }

  getMessages() {
    return this.socket?.asObservable();
  }

  sendMessage(msg: any): void {
    this.socket?.next(msg);
  }
}

// Uso no componente
ngOnInit() {
  this.webSocketService.openWebSocket();
  this.webSocketService.getMessages().subscribe(message => {
    if (message.consultaId === this.consultaId) {
      this.atualizarStatusConsulta(message);
    }
  });
}
```

## 📊 **Visualização de Resultados**

### 1. Estrutura do Componente de Consulta
```typescript
@Component({
  selector: "consulta",
  templateUrl: "./consulta.component.html",
  styleUrls: ["./consulta.component.scss"],
  standalone: true,
  imports: [CommonModule, InlineSVGDirective]
})
export class ConsultaComponent implements OnInit {
  dadosConsulta: any = {};
  statusConsultaVeiculo = 0;
  options: any[] = [
    { icon: "search.svg", label: "Detalhamento", url: null },
    { icon: "timeline.svg", label: "Timeline", url: null },
  ];

  constructor(
    private loginService: LoginService,
    private modal: ModalService,
    private dadosConsultaService: dadosConsultaService,
    private title: Title,
    private meta: Meta,
    private route: ActivatedRoute,
    private router: Router,
    private variableGlobal: VariableGlobal
  ) {
    this.dadosObservable = new BehaviorSubject(null);
  }
}
```

### 2. Abas de Navegação
```typescript
// Sistema de abas para diferentes visualizações
options: any[] = [
  { icon: "search.svg", label: "Detalhamento", url: null },
  { icon: "timeline.svg", label: "Timeline", url: null },
];

selectTab(index: number) {
  this.step = index;
  this.dadosObservable.next(this.dadosConsulta);
}
```

### 3. Componentes de Dados Específicos
```typescript
// Componentes para diferentes tipos de dados
import { DadosNacionaisComponent } from './dados-nacionais/dados-nacionais.component';
import { DadosMotorComponent } from './dados-motor/dados-motor.component';
import { DadosLeilaoComponent } from './dados-leilao/dados-leilao.component';
import { DadosRemarketingComponent } from './dados-remarketing/dados-remarketing.component';
import { DadosGravamesComponent } from './dados-gravames/dados-gravames.component';
import { DadosProprietariosComponent } from './dados-proprietarios/dados-proprietarios.component';
import { DadosDecodificacaoChassiComponent } from './dados-decodificacao-chassi/dados-decodificacao-chassi.component';
import { DadosFipeComponent } from './dados-fipe/dados-fipe.component';
```

## 🔧 **Validação e Processamento de Dados**

### 1. Validação de Placa
```typescript
// UtilMasks para formatação de placa
masks: any = {
  placa: { mask: UtilMasks.placa, guide: false },
};

// Validação de placa
validarPlaca(placa: string): boolean {
  const placaRegex = /^[A-Z]{3}[0-9]{4}$/;
  return placaRegex.test(placa);
}
```

### 2. Validação de Chassi
```typescript
validarChassi(chassi: string): boolean {
  const chassiRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
  return chassiRegex.test(chassi);
}
```

### 3. Processamento de Dados do Veículo
```typescript
processarDadosVeiculo(dados: any) {
  // Formatação de dados
  if (dados.ano) {
    dados.anoFormatado = dados.ano.toString();
  }
  
  // Validação de campos obrigatórios
  if (!dados.marca || !dados.modelo) {
    this.modal.openModalMsg({
      status: 2,
      title: "Erro",
      text: "Dados do veículo incompletos"
    });
    return false;
  }
  
  return true;
}
```

## 📈 **Sistema de Status e Progresso**

### 1. Estados da Consulta
```typescript
enum StatusConsulta {
  PENDENTE = 0,
  PROCESSANDO = 1,
  CONCLUIDA = 2,
  ERRO = 3
}

// Atualização de status
atualizarStatusConsulta(status: number) {
  this.statusConsultaVeiculo = status;
  
  switch(status) {
    case StatusConsulta.PENDENTE:
      this.modal.openLoading({
        title: "Aguarde...",
        text: "Iniciando consulta..."
      });
      break;
    case StatusConsulta.PROCESSANDO:
      this.modal.openLoading({
        title: "Processando...",
        text: "Consultando bases de dados..."
      });
      break;
    case StatusConsulta.CONCLUIDA:
      this.modal.closeLoading();
      this.exibirResultados();
      break;
    case StatusConsulta.ERRO:
      this.modal.closeLoading();
      this.exibirErro();
      break;
  }
}
```

### 2. Barra de Progresso
```typescript
// CkProgressBarComponent
@Component({
  selector: "ck-progress-bar",
  standalone: true,
  template: `
    <div class="progress-container">
      <div class="progress-bar" [style.width.%]="progress"></div>
      <span class="progress-text">{{ progress }}%</span>
    </div>
  `
})
export class CkProgressBarComponent {
  @Input() progress: number = 0;
  @Input() max: number = 100;
}
```

## 🎨 **Interface e Experiência do Usuário**

### 1. Design Responsivo
```scss
// consulta.component.scss
.consulta-container {
  display: flex;
  flex-direction: column;
  
  @include media-breakpoint-up(md) {
    flex-direction: row;
  }
}

.consulta-sidebar {
  width: 100%;
  
  @include media-breakpoint-up(md) {
    width: 300px;
    flex-shrink: 0;
  }
}

.consulta-content {
  flex: 1;
  min-width: 0;
}
```

### 2. Animações e Transições
```scss
.consulta-tab {
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  &.active {
    background: $primary;
    color: white;
  }
}
```

### 3. Loading States
```typescript
// Estados de carregamento
carregandoConsulta = false;

iniciarConsulta() {
  this.carregandoConsulta = true;
  this.modal.openLoading({
    title: "Processando Consulta",
    text: "Aguarde enquanto consultamos as bases de dados..."
  });
}

finalizarConsulta() {
  this.carregandoConsulta = false;
  this.modal.closeLoading();
}
```

## 🔒 **Segurança e Validação**

### 1. Validação de Entrada
```typescript
validarEntradaConsulta(consulta: any): boolean {
  // Validação de placa ou chassi
  if (consulta.tipoPesquisa === 'placa') {
    if (!this.validarPlaca(consulta.placa)) {
      this.modal.openModalMsg({
        status: 2,
        title: "Placa Inválida",
        text: "Por favor, insira uma placa válida no formato ABC1234"
      });
      return false;
    }
  } else if (consulta.tipoPesquisa === 'chassi') {
    if (!this.validarChassi(consulta.chassi)) {
      this.modal.openModalMsg({
        status: 2,
        title: "Chassi Inválido",
        text: "Por favor, insira um chassi válido com 17 caracteres"
      });
      return false;
    }
  }
  
  return true;
}
```

### 2. Sanitização de Dados
```typescript
sanitizarDadosConsulta(dados: any): any {
  return {
    placa: dados.placa?.toUpperCase().trim(),
    chassi: dados.chassi?.toUpperCase().trim(),
    tipoPesquisa: dados.tipoPesquisa,
    // Remove caracteres especiais
    observacoes: dados.observacoes?.replace(/[<>]/g, '')
  };
}
```

## 📱 **Integração com APIs Externas**

### 1. Consulta de Dados Estaduais
```typescript
consultarDadosEstaduais(placa: string): Observable<any> {
  return this.http.post(this.variableGlobal.getUrl("consulta/dados-estaduais"), {
    placa: placa
  });
}
```

### 2. Consulta de Dados Nacionais
```typescript
consultarDadosNacionais(placa: string): Observable<any> {
  return this.http.post(this.variableGlobal.getUrl("consulta/dados-nacionais"), {
    placa: placa
  });
}
```

### 3. Consulta de Dados FIPE
```typescript
consultarDadosFipe(placa: string): Observable<any> {
  return this.http.post(this.variableGlobal.getUrl("consulta/dados-fipe"), {
    placa: placa
  });
}
```

## 🚀 **Performance e Otimização**

### 1. Lazy Loading de Componentes
```typescript
// Carregamento sob demanda de componentes pesados
const DadosNacionaisComponent = () => import('./dados-nacionais/dados-nacionais.component');
const DadosLeilaoComponent = () => import('./dados-leilao/dados-leilao.component');
```

### 2. Cache de Consultas
```typescript
// Cache de consultas já realizadas
private consultasCache = new Map<string, any>();

getConsultaFromCache(placa: string): any {
  return this.consultasCache.get(placa);
}

setConsultaCache(placa: string, dados: any): void {
  this.consultasCache.set(placa, dados);
}
```

### 3. Debounce para Inputs
```typescript
// Debounce para evitar consultas excessivas
@ViewChild('placaInput') placaInput: ElementRef;

ngAfterViewInit() {
  fromEvent(this.placaInput.nativeElement, 'input')
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => this.consultarDadosVeiculo())
    )
    .subscribe(dados => {
      this.processarDados(dados);
    });
}
```

## 🧪 **Testes e Debugging**

### 1. Testes Unitários
```typescript
describe('ConsultaComponent', () => {
  let component: ConsultaComponent;
  let fixture: ComponentFixture<ConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConsultaComponent],
      providers: [
        { provide: dadosConsultaService, useValue: mockDadosConsultaService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    });
    fixture = TestBed.createComponent(ConsultaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate placa correctly', () => {
    expect(component.validarPlaca('ABC1234')).toBe(true);
    expect(component.validarPlaca('ABC123')).toBe(false);
  });
});
```

### 2. Logs de Debug
```typescript
// Logs estruturados para debugging
console.log('ConsultaComponent - Iniciando consulta:', {
  placa: this.placa,
  tipoPesquisa: this.tipoPesquisa,
  timestamp: new Date().toISOString()
});

console.log('ConsultaComponent - Dados recebidos:', {
  dados: this.dadosConsulta,
  status: this.statusConsultaVeiculo
});
```

## 📋 **Resumo da Implementação**

### ✅ **Funcionalidades Implementadas:**
1. **Múltiplos tipos de consulta** (Completa, Segura, Leilão)
2. **Validação robusta** de placa e chassi
3. **Processamento assíncrono** com WebSocket
4. **Interface responsiva** com abas
5. **Cache inteligente** de consultas
6. **Loading states** e feedback visual
7. **Integração com APIs** externas
8. **Sistema de status** em tempo real
9. **Componentes modulares** para diferentes dados
10. **Testes unitários** e debugging

### 🎯 **Benefícios:**
- **Performance**: Consultas rápidas e eficientes
- **UX**: Interface intuitiva e responsiva
- **Escalabilidade**: Arquitetura modular
- **Manutenibilidade**: Código bem estruturado
- **Confiabilidade**: Validações e tratamento de erros

Este sistema de consultas veiculares é o núcleo da aplicação CarCheck, fornecendo uma experiência completa e profissional para verificação de histórico de veículos.

