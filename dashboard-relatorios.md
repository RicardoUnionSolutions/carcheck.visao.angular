# Dashboard e Relatórios - Documentação Técnica

## Visão Geral
O sistema de dashboard e relatórios do CarCheck fornece uma visão completa das consultas realizadas, métricas de performance e análises detalhadas. O sistema inclui histórico de consultas, gráficos interativos e relatórios exportáveis.

## 🏗️ **Arquitetura do Sistema**

### Componentes Principais
- **HistoricoConsultaComponent** - Lista de consultas realizadas
- **HistoricoCardComponent** - Card individual de consulta
- **DadosContaComponent** - Dados da conta do usuário
- **StatusPagamentoComponent** - Status de pagamentos
- **CkChartComponent** - Gráficos interativos

### Serviços Envolvidos
- **dadosConsultaService** - Dados de consultas
- **PagamentoService** - Dados de pagamentos
- **AnalyticsService** - Métricas e analytics
- **NotificationService** - Notificações do sistema

## 📊 **Dashboard Principal**

### 1. Estrutura do Dashboard
```typescript
// HistoricoConsultaComponent
@Component({
  selector: "historico-consulta",
  templateUrl: "./historico-consulta.component.html",
  styleUrls: ["./historico-consulta.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HistoricoCardComponent,
    CkChartComponent,
    CkLoadingComponent
  ]
})
export class HistoricoConsultaComponent implements OnInit {
  consultas: any[] = [];
  consultasFiltradas: any[] = [];
  filtros: any = {
    dataInicio: null,
    dataFim: null,
    status: 'todos',
    tipo: 'todos'
  };
  
  // Métricas do dashboard
  metricas: any = {
    totalConsultas: 0,
    consultasMes: 0,
    valorTotal: 0,
    consultasCompletas: 0,
    consultasSeguras: 0,
    consultasLeilao: 0
  };

  constructor(
    private dadosConsultaService: dadosConsultaService,
    private loginService: LoginService,
    private analyticsService: AnalyticsService
  ) {}
}
```

### 2. Carregamento de Dados
```typescript
ngOnInit() {
  this.carregarConsultas();
  this.carregarMetricas();
  this.configurarFiltros();
}

carregarConsultas() {
  this.dadosConsultaService.getConsultasUsuario()
    .subscribe(consultas => {
      this.consultas = consultas;
      this.consultasFiltradas = consultas;
      this.calcularMetricas();
    });
}

carregarMetricas() {
  this.dadosConsultaService.getMetricasUsuario()
    .subscribe(metricas => {
      this.metricas = metricas;
      this.atualizarGraficos();
    });
}
```

## 📈 **Sistema de Gráficos e Visualizações**

### 1. Gráfico de Consultas por Mês
```typescript
// CkChartComponent
@Component({
  selector: "ck-chart",
  templateUrl: "./ck-chart.component.html",
  styleUrls: ["./ck-chart.component.scss"],
  standalone: true
})
export class CkChartComponent implements OnInit {
  @Input() dados: any[] = [];
  @Input() tipo: 'line' | 'bar' | 'pie' | 'doughnut' = 'line';
  @Input() titulo: string = '';
  
  chart: any;
  opcoes: any = {};

  ngOnInit() {
    this.configurarGrafico();
    this.renderizarGrafico();
  }

  configurarGrafico() {
    this.opcoes = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: this.titulo
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  renderizarGrafico() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    
    this.chart = new Chart(ctx, {
      type: this.tipo,
      data: {
        labels: this.dados.map(item => item.label),
        datasets: [{
          label: 'Consultas',
          data: this.dados.map(item => item.valor),
          backgroundColor: this.gerarCores(this.dados.length),
          borderColor: this.gerarCores(this.dados.length),
          borderWidth: 1
        }]
      },
      options: this.opcoes
    });
  }
}
```

### 2. Gráfico de Distribuição por Tipo
```typescript
gerarDadosDistribuicao() {
  const distribuicao = {
    'Completa': this.metricas.consultasCompletas,
    'Segura': this.metricas.consultasSeguras,
    'Leilão': this.metricas.consultasLeilao
  };

  return Object.entries(distribuicao).map(([tipo, valor]) => ({
    label: tipo,
    valor: valor,
    porcentagem: (valor / this.metricas.totalConsultas) * 100
  }));
}
```

## 🔍 **Sistema de Filtros e Busca**

### 1. Filtros Avançados
```typescript
// Sistema de filtros
aplicarFiltros() {
  let consultasFiltradas = [...this.consultas];

  // Filtro por data
  if (this.filtros.dataInicio) {
    consultasFiltradas = consultasFiltradas.filter(consulta => 
      new Date(consulta.data) >= new Date(this.filtros.dataInicio)
    );
  }

  if (this.filtros.dataFim) {
    consultasFiltradas = consultasFiltradas.filter(consulta => 
      new Date(consulta.data) <= new Date(this.filtros.dataFim)
    );
  }

  // Filtro por status
  if (this.filtros.status !== 'todos') {
    consultasFiltradas = consultasFiltradas.filter(consulta => 
      consulta.status === this.filtros.status
    );
  }

  // Filtro por tipo
  if (this.filtros.tipo !== 'todos') {
    consultasFiltradas = consultasFiltradas.filter(consulta => 
      consulta.tipo === this.filtros.tipo
    );
  }

  this.consultasFiltradas = consultasFiltradas;
  this.calcularMetricasFiltradas();
}
```

### 2. Busca por Texto
```typescript
// Busca em tempo real
@ViewChild('buscaInput') buscaInput: ElementRef;

ngAfterViewInit() {
  fromEvent(this.buscaInput.nativeElement, 'input')
    .pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((event: any) => event.target.value)
    )
    .subscribe(termo => {
      this.buscarConsultas(termo);
    });
}

buscarConsultas(termo: string) {
  if (!termo.trim()) {
    this.consultasFiltradas = this.consultas;
    return;
  }

  this.consultasFiltradas = this.consultas.filter(consulta => 
    consulta.placa.toLowerCase().includes(termo.toLowerCase()) ||
    consulta.chassi.toLowerCase().includes(termo.toLowerCase()) ||
    consulta.marca.toLowerCase().includes(termo.toLowerCase()) ||
    consulta.modelo.toLowerCase().includes(termo.toLowerCase())
  );
}
```

## 📋 **Cards de Consulta**

### 1. Estrutura do Card
```typescript
// HistoricoCardComponent
@Component({
  selector: "historico-card",
  templateUrl: "./historico-card.component.html",
  styleUrls: ["./historico-card.component.scss"],
  standalone: true
})
export class HistoricoCardComponent implements OnInit {
  @Input() consulta: any;
  @Output() visualizar = new EventEmitter<string>();
  @Output() reimprimir = new EventEmitter<string>();

  statusClasses: any = {
    'CONCLUIDA': 'status-concluida',
    'PROCESSANDO': 'status-processando',
    'ERRO': 'status-erro',
    'PENDENTE': 'status-pendente'
  };

  getStatusClass(status: string): string {
    return this.statusClasses[status] || 'status-default';
  }

  getTipoIcon(tipo: string): string {
    const icons = {
      'COMPLETA': 'search-complete.svg',
      'SEGURA': 'shield-check.svg',
      'LEILAO': 'gavel.svg'
    };
    return icons[tipo] || 'search.svg';
  }
}
```

### 2. Ações do Card
```typescript
visualizarConsulta(token: string) {
  this.visualizar.emit(token);
  this.router.navigate(['/consulta', token]);
}

reimprimirRelatorio(token: string) {
  this.reimprimir.emit(token);
  this.dadosConsultaService.gerarRelatorio(token)
    .subscribe(relatorio => {
      this.downloadRelatorio(relatorio);
    });
}

downloadRelatorio(relatorio: any) {
  const blob = new Blob([relatorio.conteudo], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `consulta-${relatorio.placa}-${relatorio.data}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
}
```

## 📊 **Métricas e KPIs**

### 1. Cálculo de Métricas
```typescript
calcularMetricas() {
  this.metricas = {
    totalConsultas: this.consultas.length,
    consultasMes: this.getConsultasMes(),
    valorTotal: this.getValorTotal(),
    consultasCompletas: this.getConsultasPorTipo('COMPLETA'),
    consultasSeguras: this.getConsultasPorTipo('SEGURA'),
    consultasLeilao: this.getConsultasPorTipo('LEILAO'),
    consultasConcluidas: this.getConsultasPorStatus('CONCLUIDA'),
    consultasProcessando: this.getConsultasPorStatus('PROCESSANDO'),
    consultasErro: this.getConsultasPorStatus('ERRO')
  };
}

getConsultasMes(): number {
  const agora = new Date();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  
  return this.consultas.filter(consulta => 
    new Date(consulta.data) >= inicioMes
  ).length;
}

getValorTotal(): number {
  return this.consultas.reduce((total, consulta) => {
    return total + (consulta.valor || 0);
  }, 0);
}
```

### 2. KPIs em Tempo Real
```typescript
// Atualização de KPIs via WebSocket
ngOnInit() {
  this.webSocketService.getMessages().subscribe(message => {
    if (message.tipo === 'CONSULTA_CONCLUIDA') {
      this.atualizarKPIs(message.dados);
    }
  });
}

atualizarKPIs(dados: any) {
  this.metricas.totalConsultas++;
  this.metricas.consultasMes++;
  this.metricas.valorTotal += dados.valor;
  
  // Atualiza gráficos
  this.atualizarGraficos();
}
```

## 📈 **Relatórios Exportáveis**

### 1. Geração de Relatórios
```typescript
// dadosConsultaService
gerarRelatorio(token: string): Observable<any> {
  return this.http.post(this.variableGlobal.getUrl('relatorio/gerar'), {
    token: token,
    formato: 'PDF'
  });
}

gerarRelatorioCompleto(filtros: any): Observable<any> {
  return this.http.post(this.variableGlobal.getUrl('relatorio/completo'), {
    filtros: filtros,
    formato: 'PDF',
    incluirGraficos: true
  });
}
```

### 2. Exportação de Dados
```typescript
exportarParaExcel() {
  const dados = this.consultasFiltradas.map(consulta => ({
    'Data': consulta.data,
    'Placa': consulta.placa,
    'Chassi': consulta.chassi,
    'Marca': consulta.marca,
    'Modelo': consulta.modelo,
    'Ano': consulta.ano,
    'Tipo': consulta.tipo,
    'Status': consulta.status,
    'Valor': consulta.valor
  }));

  const ws = XLSX.utils.json_to_sheet(dados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Consultas');
  
  XLSX.writeFile(wb, `consultas-${new Date().toISOString().split('T')[0]}.xlsx`);
}

exportarParaCSV() {
  const csv = this.converterParaCSV(this.consultasFiltradas);
  this.downloadArquivo(csv, 'consultas.csv', 'text/csv');
}
```

## 🔔 **Sistema de Notificações**

### 1. Notificações do Dashboard
```typescript
// NotificationService
export class NotificationService {
  private notifications: BehaviorSubject<any[]> = new BehaviorSubject([]);

  getNotifications(): Observable<any[]> {
    return this.notifications.asObservable();
  }

  adicionarNotificacao(notificacao: any) {
    const notificacoes = this.notifications.value;
    notificacoes.unshift({
      ...notificacao,
      id: this.gerarId(),
      timestamp: new Date(),
      lida: false
    });
    
    this.notifications.next(notificacoes);
  }

  marcarComoLida(id: string) {
    const notificacoes = this.notifications.value.map(notif => 
      notif.id === id ? { ...notif, lida: true } : notif
    );
    this.notifications.next(notificacoes);
  }
}
```

### 2. Tipos de Notificações
```typescript
// Tipos de notificações do sistema
enum TipoNotificacao {
  CONSULTA_CONCLUIDA = 'CONSULTA_CONCLUIDA',
  PAGAMENTO_APROVADO = 'PAGAMENTO_APROVADO',
  PAGAMENTO_REJEITADO = 'PAGAMENTO_REJEITADO',
  SISTEMA_ATUALIZACAO = 'SISTEMA_ATUALIZACAO',
  PROMOCAO = 'PROMOCAO'
}

// Exemplo de uso
this.notificationService.adicionarNotificacao({
  tipo: TipoNotificacao.CONSULTA_CONCLUIDA,
  titulo: 'Consulta Concluída',
  mensagem: `Sua consulta da placa ${placa} foi concluída com sucesso`,
  acao: () => this.visualizarConsulta(token)
});
```

## 📱 **Interface Responsiva**

### 1. Layout Adaptativo
```scss
// dashboard.component.scss
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @include media-breakpoint-up(md) {
    grid-template-columns: 2fr 1fr;
  }
  
  @include media-breakpoint-up(lg) {
    grid-template-columns: 3fr 1fr;
  }
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.consulta-card {
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
}
```

### 2. Componentes Móveis
```typescript
// Adaptação para mobile
@HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.isMobile = window.innerWidth < 768;
  this.isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
  
  if (this.isMobile) {
    this.configurarLayoutMobile();
  } else {
    this.configurarLayoutDesktop();
  }
}
```

## 🧪 **Testes e Debugging**

### 1. Testes Unitários
```typescript
describe('HistoricoConsultaComponent', () => {
  let component: HistoricoConsultaComponent;
  let fixture: ComponentFixture<HistoricoConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HistoricoConsultaComponent],
      providers: [
        { provide: dadosConsultaService, useValue: mockDadosConsultaService },
        { provide: LoginService, useValue: mockLoginService }
      ]
    });
    fixture = TestBed.createComponent(HistoricoConsultaComponent);
    component = fixture.componentInstance;
  });

  it('should load consultas on init', () => {
    component.ngOnInit();
    expect(component.consultas.length).toBeGreaterThan(0);
  });

  it('should filter consultas correctly', () => {
    component.consultas = mockConsultas;
    component.filtros.status = 'CONCLUIDA';
    component.aplicarFiltros();
    expect(component.consultasFiltradas.every(c => c.status === 'CONCLUIDA')).toBe(true);
  });
});
```

### 2. Logs de Performance
```typescript
// Métricas de performance do dashboard
medirPerformanceCarregamento() {
  const inicio = performance.now();
  
  this.carregarConsultas().subscribe(() => {
    const fim = performance.now();
    const tempoCarregamento = fim - inicio;
    
    this.analyticsService.trackingPerformance({
      metrica: 'tempo_carregamento_dashboard',
      valor: tempoCarregamento
    });
  });
}
```

## 📋 **Resumo da Implementação**

### ✅ **Funcionalidades Implementadas:**
1. **Dashboard completo** com métricas e KPIs
2. **Gráficos interativos** com Chart.js
3. **Sistema de filtros** avançados
4. **Busca em tempo real** com debounce
5. **Cards de consulta** responsivos
6. **Relatórios exportáveis** (PDF, Excel, CSV)
7. **Notificações** em tempo real
8. **Interface responsiva** para mobile/desktop
9. **Métricas de performance** e analytics
10. **Testes unitários** e debugging

### 🎯 **Benefícios:**
- **Visibilidade**: Dashboard completo das consultas
- **Análise**: Gráficos e métricas detalhadas
- **Produtividade**: Filtros e busca eficientes
- **Mobilidade**: Interface responsiva
- **Insights**: Relatórios exportáveis
- **Engajamento**: Notificações em tempo real

O sistema de dashboard e relatórios do CarCheck oferece uma visão completa e analítica das consultas realizadas, permitindo aos usuários acompanhar seu histórico e obter insights valiosos sobre suas consultas veiculares.

