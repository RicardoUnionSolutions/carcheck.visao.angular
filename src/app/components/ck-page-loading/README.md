# CkPageLoadingComponent

Componente global de loading para páginas da aplicação CarCheck.

## Uso

### Importação
```typescript
import { CkPageLoadingComponent } from '../components/ck-page-loading/ck-page-loading.component';

@Component({
  // ...
  imports: [
    // outros imports...
    CkPageLoadingComponent
  ]
})
```

### Template
```html
<ck-page-loading [loading]="loadingTela" text="Carregando..."></ck-page-loading>

@if (!loadingTela) {
  <!-- Conteúdo da página -->
}
```

### TypeScript
```typescript
export class MeuComponente {
  loadingTela: boolean = true;

  ngOnInit() {
    // Lógica de carregamento...
    
    // Mostrar a tela após carregamento
    setTimeout(() => {
      this.loadingTela = false;
    }, 1500);
  }
}
```

## Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `loading` | `boolean` | `false` | Controla se o loading deve ser exibido |
| `text` | `string` | `'Carregando...'` | Texto exibido abaixo do spinner |

## Exemplos

### Loading básico
```html
<ck-page-loading [loading]="isLoading"></ck-page-loading>
```

### Loading com texto customizado
```html
<ck-page-loading [loading]="isLoading" text="Processando dados..."></ck-page-loading>
```

### Loading com lógica de controle
```typescript
export class ExemploComponent {
  isLoading = true;

  ngOnInit() {
    this.carregarDados().then(() => {
      this.isLoading = false;
    });
  }
}
```

## Estilos

O componente inclui estilos responsivos e animações suaves:
- Spinner animado com cores da marca CarCheck
- Fundo semi-transparente
- Texto centralizado
- Altura total da viewport
- Cores: #244b5a (azul) e #f8f9fa (cinza claro)
