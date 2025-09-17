# Comando para Codex - Task 10134-10137-10140-6685b91

## 🎯 Contexto do Projeto
Você está trabalhando em um projeto Angular 20 (migração do Angular 9) para o sistema Carcheck Brasil, uma plataforma de consultas veiculares. O projeto está em processo de migração e você precisa implementar as mudanças da task 10134-10137-10140-6685b91.

## 📋 Task a Resolver: 10134-10137-10140-6685b91

**Objetivo:** Implementar sistema completo de Termos de Uso, atualizar Perguntas Frequentes e solicitar aceite aos Termos de Uso para cadastro no sistema.

**Tipo:** Feature - Implementação de Termos de Uso e FAQ

**Arquivos a modificar/criar:**
- `src/app/app.module.ts`
- `src/app/forma-pagamento/forma-pagamento.component.html`
- `src/app/forma-pagamento/forma-pagamento.component.ts`
- `src/app/modal-termos-uso.component.html` (NOVO)
- `src/app/modal-termos-uso.component.scss` (NOVO)
- `src/app/modal-termos-uso.component.ts` (NOVO)
- `src/app/duvidas-frequentes.component.scss`
- `src/app/login-view/login-view.component.html`
- `src/app/login-view/login-view.component.ts`
- `src/app/utils/faqs.ts`

## 🔧 Mudanças Específicas a Implementar

### 1. Criar Modal de Termos de Uso

**Arquivo:** `src/app/modal-termos-uso.component.ts` (NOVO)

```typescript
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalService } from './service/modal.service';

@Component({
  selector: 'app-modal-termos-uso',
  templateUrl: './modal-termos-uso.component.html',
  styleUrls: ['./modal-termos-uso.component.scss']
})
export class ModalTermosUsoComponent {
  @Output() fechar = new EventEmitter<boolean>();
  @Input() visible: boolean = false;

  constructor(private modalService: ModalService) {}

  ngOnChanges(changes: any) {
    if (changes.visible && this.visible) {
      this.modalService.open('modaltermosuso');
    }
  }

  closeModalTermosUso(aceitou: boolean) {
    this.fechar.emit(aceitou);
    this.modalService.close('modaltermosuso');
  }
}
```

**Arquivo:** `src/app/modal-termos-uso.component.html` (NOVO)

```html
<!-- Implementar interface completa do modal de termos de uso -->
<!-- 375 linhas de HTML com conteúdo legal detalhado -->
<!-- Botões de aceitar/recusar -->
<!-- Layout responsivo -->
```

**Arquivo:** `src/app/modal-termos-uso.component.scss` (NOVO)

```scss
/* Estilos específicos para o modal */
/* Layout responsivo */
/* Cores e tipografia consistentes */
```

### 2. Atualizar Login View

**Arquivo:** `src/app/login-view/login-view.component.ts`

**Adicionar propriedades:**

```typescript
termosUsoAceito: boolean = false;
alertTermosUso: boolean = false;
mostrarModalTermos: boolean = false;
```

**Adicionar validação no método `efetuarCadastro`:**

```typescript
efetuarCadastro() {
  if (!this.termosUsoAceito) {
    this.alertTermosUso = true;
    return;
  }
  // ... resto do código de cadastro
}
```

**Arquivo:** `src/app/login-view/login-view.component.html`

**Adicionar interface de aceite:**

```html
<div class="py-2 px-3 bg-light rounded my-3">
  <div class="flex-ac custom-checkbox-wrapper">
    <input [(ngModel)]="termosUsoAceito" class="custom-checkbox m-0 radio-md" 
           id="inputtermposdeuso" type="checkbox" name="inputtermposdeuso">
    <label for="inputtermposdeuso" class="f-16 ml-2 fw-700">
      Li e aceito com os
      <u (click)="openModalTermosUso(); $event.preventDefault(); $event.stopPropagation();"
         class="pointer text-orange-1 fw-700">
        Termos de uso e Política de Privacidade
      </u>.
    </label>
  </div>
</div>
```

### 3. Refatorar Forma de Pagamento

**Arquivo:** `src/app/forma-pagamento/forma-pagamento.component.html`

**Remover 380 linhas** do conteúdo de termos de uso (será movido para o modal)

**Arquivo:** `src/app/forma-pagamento/forma-pagamento.component.ts`

**Integrar com o novo sistema de termos** (7 linhas alteradas)

### 4. Atualizar FAQ

**Arquivo:** `src/app/utils/faqs.ts`

**Refatorar completamente** (237 linhas modificadas):
- Melhorar estrutura e organização
- Adicionar novas perguntas e respostas
- Organizar por categorias

### 5. Atualizar App Module

**Arquivo:** `src/app/app.module.ts`

**Adicionar o novo componente:**

```typescript
import { ModalTermosUsoComponent } from './modal-termos-uso.component';

// No array declarations:
declarations: [
  // ... outros componentes
  ModalTermosUsoComponent
]
```

### 6. Atualizar Estilos

**Arquivo:** `src/app/duvidas-frequentes.component.scss`

**Adicionar 4 linhas** para melhorias visuais

## 🎯 Instruções para Codex

1. **Criar os 3 novos arquivos** do modal de termos de uso
2. **Atualizar o login view** com validação de aceite
3. **Refatorar a forma de pagamento** removendo conteúdo duplicado
4. **Atualizar o FAQ** com melhor organização
5. **Registrar o novo componente** no app.module.ts
6. **Testar o fluxo completo** de cadastro com aceite de termos

## 🚀 Impacto Esperado

- ✅ **Conformidade legal:** Sistema completo de termos de uso
- ✅ **Melhor UX:** FAQs organizadas e acessíveis
- ✅ **Processo transparente:** Aceite obrigatório para cadastro
- ✅ **Interface modular:** Separação clara de responsabilidades
- ✅ **Conformidade LGPD:** Atendimento às regulamentações

## ⚠️ Observações Importantes

- **Conteúdo legal:** Revisar com equipe jurídica
- **Teste extensivo:** Validar fluxo completo de cadastro
- **Responsividade:** Testar modal em diferentes dispositivos
- **Acessibilidade:** Garantir compatibilidade com leitores de tela
- **Performance:** Verificar impacto na carga da página

## 📊 Estatísticas da Task

- **Arquivos modificados:** 10
- **Linhas alteradas:** 1.075 (613 inserções, 462 deleções)
- **Novos componentes:** 3
- **Tipo:** Feature completa - Termos de Uso e FAQ
- **Prioridade:** Alta (conformidade legal)
- **Risco:** Alto (mudanças significativas na arquitetura)
