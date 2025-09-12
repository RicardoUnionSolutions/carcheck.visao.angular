# Plano de Migração - Processo Compra Múltiplas Consultas

## 📋 Resumo Executivo

Este documento detalha o plano para migrar o componente `processo-compra-multiplas-consultas` da versão atual para ser visualmente idêntico à versão do projeto `ANGULAR_ANTIGO`. A análise revelou que os arquivos HTML são idênticos, mas existem diferenças significativas nos arquivos SCSS e TypeScript que afetam a aparência visual.

## 🔍 Análise Comparativa

### ✅ Arquivos Idênticos
- **HTML**: `processo-compra-multiplas-consultas.component.html` - **100% idêntico**
- **HTML dos componentes filhos**: Todos os componentes filhos têm HTML idêntico

### ⚠️ Arquivos com Diferenças

#### 1. **processo-compra-multiplas-consultas.component.scss**
- **Status**: Idêntico
- **Ação**: Nenhuma alteração necessária

#### 2. **processo-compra-multiplas-consultas.component.ts**
- **Diferenças encontradas**:
  - Versão atual usa `UntypedFormGroup` vs versão antiga usa `FormGroup`
  - Versão atual usa `history.state?.pacote` vs versão antiga usa `history.state.pacote`
  - Versão atual tem `valorTotalDesconto: number = 0` vs versão antiga tem `valorTotalDesconto: 0`
  - Versão atual tem `valorConsulta: 54.9` vs versão antiga tem `valorConsulta: 54.90`
  - Versão atual tem `valorConsulta: 48.9` vs versão antiga tem `valorConsulta: 48.90`
  - Versão atual tem `valorConsulta: 32.9` vs versão antiga tem `valorConsulta: 32.90`

#### 3. **step-by-step.component.scss**
- **Diferenças encontradas**:
  - Versão atual usa `@use` vs versão antiga usa `@import`
  - Versão atual usa `box-shadow: 0 2px 3px rgba(0,0,0,0.25)` vs versão antiga usa `filter: drop-shadow(-1px 0px 1px rgba(0,0,0,0.1)) drop-shadow(0px 2px 3px rgba(0,0,0,0.25))`
  - Versão atual usa variáveis SCSS vs versão antiga usa valores hardcoded
  - Versão atual usa `@media` queries vs versão antiga usa `@include media-breakpoint-down`

#### 4. **comprar-consulta-multipla.component.scss**
- **Diferenças encontradas**:
  - Versão atual usa `@use` vs versão antiga usa `@import`
  - Versão atual tem estilos de tabela modernos vs versão antiga tem estilos mais simples
  - Versão atual usa `#ecda26` vs versão antiga usa `#244b5a` para gradiente dos ícones
  - Versão atual tem estilos de container modernos vs versão antiga tem estilos mais básicos

#### 5. **forma-pagamento.component.html**
- **Diferenças encontradas**:
  - Versão atual usa `app-modal-termos-uso` vs versão antiga usa `ck-modal` inline
  - Versão atual tem `$event.preventDefault(); $event.stopPropagation();` vs versão antiga não tem

## 🎯 Plano de Ação

### Fase 1: Correções TypeScript (Prioridade Alta)

#### 1.1 Ajustar tipos e valores no processo-compra-multiplas-consultas.component.ts
```typescript
// Alterar de:
valorTotalDesconto: number = 0;
// Para:
valorTotalDesconto: 0;

// Alterar de:
this.pacote = history.state?.pacote || null;
// Para:
this.pacote = history.state.pacote;

// Alterar de:
UntypedFormGroup
// Para:
FormGroup

// Alterar valores das consultas:
valorConsulta: 54.90, // em vez de 54.9
valorConsulta: 48.90, // em vez de 48.9
valorConsulta: 32.90, // em vez de 32.9
```

### Fase 2: Migração SCSS (Prioridade Alta)

#### 2.1 Migrar step-by-step.component.scss
```scss
// Substituir @use por @import
@import 'functions', 'variables', 'mixins/breakpoints';

// Substituir box-shadow por filter
.steps-container {
    filter: drop-shadow(-1px 0px 1px rgba(0,0,0,0.1)) drop-shadow(0px 2px 3px rgba(0,0,0,0.25));
}

// Substituir variáveis por valores hardcoded
// Substituir @media queries por @include media-breakpoint-down
```

#### 2.2 Migrar comprar-consulta-multipla.component.scss
```scss
// Substituir @use por @import
@import 'functions', 'variables', 'mixins/breakpoints';

// Alterar gradiente dos ícones de #ecda26 para #244b5a
background: #244b5a;
background: -moz-linear-gradient(45deg, #244b5a 0%, #346b81 100%);
background: -webkit-linear-gradient(45deg, #244b5a 0%,#346b81 100%);
background: linear-gradient(45deg, #244b5a 0%,#346b81 100%);

// Remover estilos de tabela modernos e usar estilos mais simples
// Remover estilos de container modernos
```

### Fase 3: Ajustes HTML (Prioridade Média)

#### 3.1 Ajustar forma-pagamento.component.html
```html
<!-- Substituir app-modal-termos-uso por ck-modal inline -->
<ck-modal id="modaltermosuso" class="full-screen">
  <!-- Conteúdo do modal inline -->
</ck-modal>

<!-- Remover preventDefault e stopPropagation -->
<u (click)="openModalTermosUso()" class="pointer text-orange-1 fw-700">
  Termos de uso e Política de Privacidade
</u>
```

### Fase 4: Verificação e Testes (Prioridade Alta)

#### 4.1 Checklist de Verificação Visual
- [ ] Step-by-step com sombra correta
- [ ] Ícones das consultas com gradiente azul
- [ ] Layout responsivo idêntico
- [ ] Cores e espaçamentos idênticos
- [ ] Animações e transições idênticas
- [ ] Modal de termos de uso funcionando

#### 4.2 Testes Funcionais
- [ ] Fluxo de compra funcionando
- [ ] Validação de formulários
- [ ] Cálculo de valores
- [ ] Navegação entre steps
- [ ] Responsividade em diferentes dispositivos

## 📁 Arquivos a Serem Modificados

### Arquivos TypeScript
1. `src/app/processo-compra-multiplas-consultas/processo-compra-multiplas-consultas.component.ts`

### Arquivos SCSS
1. `src/app/components/step-by-step/step-by-step.component.scss`
2. `src/app/components/comprar-consulta-multipla/comprar-consulta-multipla.component.scss`

### Arquivos HTML
1. `src/app/components/forma-pagamento/forma-pagamento.component.html`

## ⚠️ Riscos e Considerações

### Riscos Técnicos
- **Quebra de funcionalidade**: Alterações no TypeScript podem quebrar funcionalidades existentes
- **Conflitos de CSS**: Migração de @use para @import pode causar conflitos
- **Responsividade**: Alterações no SCSS podem afetar a responsividade

### Mitigações
- Fazer backup dos arquivos antes das alterações
- Testar cada alteração individualmente
- Usar git para versionamento
- Testar em diferentes dispositivos e navegadores

## 🚀 Cronograma Estimado

- **Fase 1**: 2 horas
- **Fase 2**: 4 horas
- **Fase 3**: 1 hora
- **Fase 4**: 2 horas
- **Total**: 9 horas

## 📝 Notas Importantes

1. **Compatibilidade**: Manter compatibilidade com Angular 20
2. **Performance**: Não afetar performance da aplicação
3. **Manutenibilidade**: Código deve permanecer limpo e manutenível
4. **Testes**: Todos os testes existentes devem continuar passando

## ✅ Critérios de Sucesso

- [ ] Aparência visual 100% idêntica à versão antiga
- [ ] Funcionalidades preservadas
- [ ] Performance mantida ou melhorada
- [ ] Código limpo e manutenível
- [ ] Testes passando
- [ ] Responsividade funcionando

---

**Data de Criação**: $(date)
**Versão**: 1.0
**Status**: Em Desenvolvimento
