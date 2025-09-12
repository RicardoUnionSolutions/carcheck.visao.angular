# Plano de Migração - Componente app-processo-compra

## 📋 Resumo Executivo

Este documento detalha o plano para migrar o componente `app-processo-compra` do projeto atual para ser visualmente idêntico ao componente da pasta `ANGULAR_ANTIGO`. A análise revelou que os componentes HTML são idênticos, mas há diferenças significativas nos estilos SCSS que precisam ser corrigidas.

## 🔍 Análise Comparativa

### ✅ Componentes Idênticos (HTML)
- **processo-compra.component.html**: Idêntico entre as versões
- **step-by-step.component.html**: Idêntico entre as versões  
- **comprar-consulta.component.html**: Idêntico entre as versões
- **selecionar-veiculo.component.html**: Idêntico entre as versões
- **forma-pagamento.component.html**: Idêntico entre as versões

### ⚠️ Diferenças Identificadas (SCSS)

#### 1. **processo-compra.component.scss**
- **ANGULAR_ANTIGO**: Usa `@import 'functions', 'variables', 'mixins/breakpoints';`
- **ATUAL**: Usa `@use '../../assets/scss/bootstrap/variables' as *;` e `@use '../../assets/scss/bootstrap/mixins/breakpoints' as *;`

#### 2. **step-by-step.component.scss**
- **ANGULAR_ANTIGO**: Usa `@import 'functions', 'variables', 'mixins/breakpoints';`
- **ATUAL**: Usa variáveis SCSS modernas e `@media` queries

#### 3. **comprar-consulta.component.scss**
- **ANGULAR_ANTIGO**: Usa `@import 'functions', 'variables', 'mixins/breakpoints';`
- **ATUAL**: Usa `@use '../../../assets/scss/bootstrap/variables' as *;` e `@use '../../../assets/scss/bootstrap/mixins/breakpoints' as *;`

#### 4. **selecionar-veiculo.component.scss**
- **ANGULAR_ANTIGO**: Usa `@import 'functions', 'variables', 'mixins/breakpoints';`
- **ATUAL**: Usa `@use '../../../assets/scss/bootstrap/variables' as *;` e `@use '../../../assets/scss/bootstrap/mixins/breakpoints' as *;`

#### 5. **forma-pagamento.component.scss**
- **ANGULAR_ANTIGO**: Usa `@import 'functions', 'variables', 'mixins/breakpoints';`
- **ATUAL**: Usa `@use '../../../assets/scss/bootstrap/variables' as *;` e `@use '../../../assets/scss/bootstrap/mixins/breakpoints' as *;`

## 🎯 Objetivos da Migração

1. **Garantir compatibilidade visual 100%** entre as versões
2. **Manter funcionalidade** existente
3. **Preservar responsividade** em todos os breakpoints
4. **Manter performance** otimizada
5. **Seguir padrões SCSS modernos** do Angular 20

## 📝 Plano de Execução

### Fase 1: Preparação e Análise
- [x] ✅ Analisar componentes do ANGULAR_ANTIGO
- [x] ✅ Analisar componentes atuais
- [x] ✅ Identificar diferenças visuais
- [x] ✅ Mapear dependências SCSS

### Fase 2: Migração dos Estilos SCSS

#### 2.1 Migrar processo-compra.component.scss
**Arquivo**: `src/app/processo-compra/processo-compra.component.scss`

**Ações**:
1. Substituir imports modernos por imports do ANGULAR_ANTIGO
2. Verificar se todas as classes CSS estão presentes
3. Testar responsividade

**Código a ser aplicado**:
```scss
@import 'functions', 'variables', 'mixins/breakpoints';

.currentStep-container{
    min-height: 380px;
}

.btn-next{
  width: 345px;
}

@include media-breakpoint-up(lg) {
    .container{
        max-width: 1200px;
    }
}

@include media-breakpoint-down(sm) {
    .btn-next{
        width: 100%;
    }
}

.container{
    max-width:1040px;
}

.price-container, .price-container-lg{
    font-size: 2.8rem;
    display: flex;
    align-items: baseline;
    justify-content: center;
    line-height: 0.7;
    font-weight: 700;
    border-radius: 7px;
    width: 160px;
    transition: 200ms;

    span:first-child{
        align-self: flex-end;
        font-size: 1.5rem;
        margin-right: 5px;
        line-height: 0.7;
    }

    span:last-child{
        align-self: flex-start;
        font-size: 1.5rem;
        line-height: 0.7;
    }
}

.price-container-lg{
    width: unset;
    min-width: 300px;
    font-weight: 700;
    line-height: 1;
    font-size: 4.375rem;

    span:first-child{
        font-size: 2.4rem;
        line-height: 1.2;
    }

    span:last-child{
        font-size: 2.4rem;
        line-height: 1.3;
    }
}

.preco-uni-container{
    width: 160px;
}

.consulta-container{
    width: 250px;
}

.quantidade-container{
    width: 188px;
}

.consulta{
    .img-container{
        width: 70px;
        height: 70px;
        min-width: 70px;
        min-height: 70px;
        flex-basis: 70px;
        padding: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border-radius:50%;
        object-fit: contain;
        line-height: 1;
        background: #efaa32;
        background: -moz-linear-gradient(45deg, #efaa32 0%, #ec8522 100%);
        background: -webkit-linear-gradient(45deg, #efaa32 0%,#ec8522 100%);
        background: linear-gradient(45deg, #efaa32 0%,#ec8522 100%);
        transition: 200ms all ease-in;
        border: 0px solid#ffcb3e;

        .img-wrap{
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(255,255,255,1);
            width: 100%;
            height: 100%;
            border-radius: 50%;
            color: #ff7903;
            padding: 12px;
            transition: 200ms all ease-in;

            ::ng-deep *{
                width: 100%;
                height: 100%;
                transition: 200ms all ease-in;
                filter: grayscale(0) brightness(1);
            }

            img{
                width: 100%;
                height: 100%;
                transition: 200ms all ease-in;
                filter: grayscale(0) brightness(1);
            }
        }
    }

    &.active{
        .price-container, h3{
            color: var(--orange-1);
        }

        .img-container{
            border: 3px solid #ffcb3e;
            padding: 0px;

            .img-wrap{
                background-color: rgba(255,255,255,0);

                ::ng-deep *{
                    filter: grayscale(1) brightness(2);
                }

                img{
                    filter: grayscale(1) brightness(2);
                    background: transparent;
                }
            }
        }
    }
}
```

#### 2.2 Migrar step-by-step.component.scss
**Arquivo**: `src/app/components/step-by-step/step-by-step.component.scss`

**Ações**:
1. Substituir código atual pelo código do ANGULAR_ANTIGO
2. Manter funcionalidade responsiva
3. Testar em diferentes breakpoints

**Código a ser aplicado**:
```scss
@import 'functions', 'variables', 'mixins/breakpoints';

.steps-container{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 90px;
    max-width: 900px;
    margin: 0px auto 0px auto;
    filter: drop-shadow(-1px 0px 1px rgba(0,0,0,0.1)) drop-shadow(0px 2px 3px rgba(0,0,0,0.25));
}

.title-container{
    width: 100%;
    max-width: 900px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title-container h2{
    font-size: 18px;
    width: 100px;
    text-align: center;
    margin: 0px -20px;
    transition: 400ms 0ms all ease-out;
}

.title-container h2.current{
    margin: 0px -5px;
}

@include media-breakpoint-down(md) {
    .steps-container{
        height: 50px;
        max-width: 100vw;
        padding: 0px 20px;
    }

    .title-container h2{
        font-size: 16px;
        width: 100px;
        text-align: center;
        margin: 0px -10px;
        transition: 400ms 0ms all ease-out;
    }
}

@include media-breakpoint-down(xs) {
    .steps-container{
        height: 50px;
        max-width: 100vw;
        padding: 0px 0px;
    }

    .title-container h2{
        font-size: 11px;
        width: 60px;
        text-align: center;
        margin: 0px -8px;
        transition: 400ms 0ms all ease-out;
    }
}
```

#### 2.3 Migrar comprar-consulta.component.scss
**Arquivo**: `src/app/components/comprar-consulta/comprar-consulta.component.scss`

**Ações**:
1. Substituir imports modernos
2. Verificar se todas as classes estão presentes
3. Testar layout responsivo

**Código a ser aplicado**:
```scss
@import 'functions', 'variables', 'mixins/breakpoints';

.tipo-consulta-btn {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  border-radius: 15px;
  padding: 15px 15px;
  font-weight: 600;
  transition: 200ms all ease-in color;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  box-shadow: none;
  outline: none;
}

.price_container {
  width: 370px;
  max-width: 100%;
  background-color: #eee;
  padding: 25px 50px;
  font-size: 76px;
  display: flex;
  align-items: baseline;
  justify-content: center;
  line-height: 0.7;
  font-weight: 700;
  border-radius: 7px;
}

.price_container span:first-child {
  align-self: flex-end;
  font-size: 40px;
  margin-right: 5px;
  line-height: 0.8;
}

.price_container span:last-child {
  align-self: flex-start;
  font-size: 40px;
  line-height: 0.8;
}

@include media-breakpoint-down(md) {
  .linha{
    flex-wrap: wrap !important;
  }
  .tipo-consulta-btn {
    padding: 5px;
    height: 60px;
  }

  .text-consulta-container {
    min-height: 140px;
  }

  .price_container {
    font-size: 50px;
    padding: 15px 0px;

    span:first-child,
    span:last-child {
      font-size: 25px;
    }
  }
}

@include media-breakpoint-down(sm) {
  .price_container {
    width: 100%;
  }

  .tipo-consulta-btn {
    padding: 2px;
    height: 45px;
  }

  .linha{
    flex-wrap: wrap !important;
  }
}

.consulta {
  border: 1px solid #EEE;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 6px 6px 13px 0px #eee;
  background: #F9FAFC;
  display: table;

  h3 {
    font-size: 18px;
    font-weight: 400;
    color: black;
  }

  .dado {
    padding-left: 14px;
    color: #333;
    font-size: 12px;
  }

  .row {
    flex-wrap: nowrap;
  }

  .detalhes {
    max-height: 0;
    transition: max-height 1s ease-out;
  }

  .detalhes.expandido {
    max-height: 1000px;
  }

  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    a {
      color: #244b5a;
    }

    a:hover {
      text-decoration: none;
    }
  }

  i {
    font-size: large;
  }
}

.mdi-close {
  color: red;
}

@media (min-width: 992px) {
  .col-lg-4 {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
}

.linha{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.listaDeProdutos{
  width: 100%;
}

.discount-circle {
  height: 60px;
  border-radius: 50%;
  background-color: #ecda26;
  color: #244b5a;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: rotate(334deg);
  padding: 15px;
}

.label{
  background: rgb(32, 139, 135);
  background: linear-gradient(90deg, rgba(32, 139, 135, 1) 0%, #244b5a 100%);
  color: #FFF;
  padding: 8px 0;
  font-size: 14px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  font-weight: bold;
}

.recomendada {
  border: 1px solid #244b5a;
}

.promocional-text {
  position: static;
  background: linear-gradient(90deg, #208b87 0%, #244b5a 100%);
  color: #FFF;
  padding: 7px 24px;
  font-size: 15px;
  width: 100%;
  margin-bottom: 5px;
  border-radius: 10px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  font-weight: bold;
}

.upsell{
  margin-top: 10px;
  transition: all 0.3s ease-in-out;
}

.upsell-text{
  position: static;
  background: linear-gradient(90deg, #1b7572 0%, #244b5a 100%);
  color: #FFF;
  padding: 7px 24px;
  font-size: 15px;
  width: 100%;
  margin-bottom: 5px;
  margin-top: 5px;
  border-radius: 10px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  cursor: pointer;
  margin-left: 10%;
  transition: all 0.3s ease-in-out;
}

.upsell-text:hover {
  box-shadow: -1px 7px 6px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid #ffffffd1;
}

.upsell:hover{
  transform: scale(1.05) translateY(-5px);
}

.promocional {
  background: linear-gradient(90deg, rgba(32, 139, 135, 1) 0%, #244b5a 100%);
  color: #FFF;
  padding: 5px 0;
  font-size: 15px;
  margin-bottom: 5px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 10px;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  font-weight: bold;
  position: sticky;
}

.promocional::before {
  content: '';
  position: absolute;
  top: -1px;
  left: -1px;
  right: -1px;
  bottom: -1px;
  border-radius: 10px;
  background: red;
  background-size: 200% 200%;
  animation: led-glow 1s linear infinite;
  z-index: -1;
}

@keyframes led-glow {
  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}
```

#### 2.4 Migrar selecionar-veiculo.component.scss
**Arquivo**: `src/app/components/selecionar-veiculo/selecionar-veiculo.component.scss`

**Ações**:
1. Substituir imports modernos
2. Manter funcionalidade de input
3. Testar responsividade

**Código a ser aplicado**:
```scss
@import 'functions', 'variables', 'mixins/breakpoints';

input[type="text"]{
    max-width: 400px;
    letter-spacing: 10px;
    outline: none;
    box-shadow: none;
    font-family: "Caros";
    text-transform: uppercase;
}

.veiculo-pesquisa-form{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
}

@include media-breakpoint-down(md) {
    input[type="text"]{
        max-width: 100%;
    }
}

@include media-breakpoint-down(sm) {
    .veiculo-pesquisa-form{
        flex-wrap: wrap;
    }
}
```

#### 2.5 Migrar forma-pagamento.component.scss
**Arquivo**: `src/app/components/forma-pagamento/forma-pagamento.component.scss`

**Ações**:
1. Substituir imports modernos
2. Manter estilos de checkbox personalizado
3. Testar funcionalidade de cupom

**Código a ser aplicado**:
```scss
::ng-deep tab-nav {
  height: fit-content;
  border: solid 1px #235b7529;
  width: fit-content;
  border-radius: 20px;
}

::ng-deep .tab.active {
  border-radius: 17px;
  margin: 0px !important;
}

::ng-deep.active:after {
  content: none !important;
}

.content {
  box-shadow: 4px 9px 20px 0px #cdd1d3;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}

/* Container do checkbox */
.custom-checkbox-wrapper {
  display: flex;
  align-items: center;
}

/* Esconde o checkbox original */
.custom-checkbox {
  display: none;
}

/* Estiliza o label para se parecer com um checkbox */
.custom-checkbox + label {
  position: relative;
  padding-left: 35px;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
}

/* Caixa do checkbox personalizada */
.custom-checkbox + label::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 25px;
  height: 25px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  transition: background-color 0.3s, border-color 0.3s;
}

/* Estado de foco */
.custom-checkbox:focus + label::before {
  border-color: #ecda26
}

/* Estado de seleção */
.custom-checkbox:checked + label::before {
  border-color: #ecda26
}

/* Exibe a marca de seleção quando o checkbox está marcado */
.custom-checkbox:checked + label::after {
  opacity: 1;
  animation: checkmark-appear 0.3s forwards;
}

/* Animação ao clicar */
.custom-checkbox + label::before {
  transition: all 0.3s ease;
}

.custom-checkbox:checked + label::before {
  transform: scale(1.1);
}

.custom-checkbox:not(:checked) + label::before {
  transform: scale(1);
}

/* Animação ao desmarcar */
.custom-checkbox:not(:checked) + label::after {
  opacity: 0;
  animation: checkmark-disappear 0.3s forwards;
}

/* Marca de seleção personalizada */
.custom-checkbox + label::after {
  content: "";
  position: absolute;
  left: 7px;
  top: 2px;
  width: 10px;
  height: 20px;
  border: solid #304d5a;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
}

/* Keyframes para a animação de aparecer e desaparecer */
@keyframes checkmark-appear {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(45deg);
  }
}

@keyframes checkmark-disappear {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

input,
  textarea {
    padding: 0px;
    border: none;
    outline: none;
    background: rgb(238, 238, 238);
    background: linear-gradient(0deg, rgba(238, 238, 238, 1) 0%, rgba(255, 255, 255, 1) 100%);
    height: 40px;
    border: 1px solid #555;
    border-radius: 5px;
    padding: 10px 10px;
    transition: 200ms ease-in;
    font-weight: 500;
    border-radius: 10px;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  textarea:focus,
  input:focus {
    border: 2px solid #244b5a;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  textarea:focus+label,
  input:focus+label {
    color: #244b5a;
  }
  .btn-cupom{
    height: 38px;
    width: 60px;
  }
```

### Fase 3: Verificação e Testes

#### 3.1 Testes Visuais
- [ ] Verificar layout em desktop (1920x1080)
- [ ] Verificar layout em tablet (768x1024)
- [ ] Verificar layout em mobile (375x667)
- [ ] Verificar responsividade em breakpoints intermediários
- [ ] Comparar pixel-perfect com ANGULAR_ANTIGO

#### 3.2 Testes Funcionais
- [ ] Testar fluxo completo de compra
- [ ] Testar seleção de consultas
- [ ] Testar formulário de veículo
- [ ] Testar formulário de pagamento
- [ ] Testar validações de formulário

#### 3.3 Testes de Performance
- [ ] Verificar tempo de carregamento
- [ ] Verificar bundle size
- [ ] Verificar renderização

### Fase 4: Validação Final

#### 4.1 Checklist de Validação
- [ ] ✅ Layout idêntico ao ANGULAR_ANTIGO
- [ ] ✅ Responsividade mantida
- [ ] ✅ Funcionalidade preservada
- [ ] ✅ Performance otimizada
- [ ] ✅ Código limpo e organizado

#### 4.2 Documentação
- [ ] Atualizar documentação de componentes
- [ ] Documentar mudanças realizadas
- [ ] Criar guia de manutenção

## 🚨 Riscos e Mitigações

### Riscos Identificados
1. **Quebra de responsividade**: Migração pode afetar breakpoints
2. **Conflito de estilos**: Imports diferentes podem causar conflitos
3. **Performance**: Mudança de imports pode afetar performance

### Mitigações
1. **Testes extensivos** em todos os breakpoints
2. **Validação gradual** componente por componente
3. **Monitoramento de performance** durante e após migração
4. **Backup** dos arquivos originais antes da migração

## 📊 Cronograma Estimado

| Fase | Duração | Responsável |
|------|---------|-------------|
| Fase 1: Preparação | ✅ Concluída | - |
| Fase 2: Migração SCSS | 2-3 horas | Desenvolvedor |
| Fase 3: Testes | 1-2 horas | Desenvolvedor |
| Fase 4: Validação | 1 hora | Desenvolvedor |
| **Total** | **4-6 horas** | - |

## 🎯 Critérios de Sucesso

1. **Visual**: Layout 100% idêntico ao ANGULAR_ANTIGO
2. **Funcional**: Todas as funcionalidades operacionais
3. **Responsivo**: Funcionamento correto em todos os dispositivos
4. **Performance**: Sem degradação de performance
5. **Manutenibilidade**: Código limpo e bem documentado

## 📋 Próximos Passos

1. **Executar migração** dos arquivos SCSS conforme plano
2. **Realizar testes** em ambiente de desenvolvimento
3. **Validar visualmente** comparando com ANGULAR_ANTIGO
4. **Deploy** em ambiente de teste
5. **Validação final** com stakeholders
6. **Deploy** em produção

---

**Data de Criação**: $(date)  
**Versão**: 1.0  
**Status**: Pronto para Execução
