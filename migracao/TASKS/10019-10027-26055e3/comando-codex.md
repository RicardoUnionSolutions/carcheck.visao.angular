# Comando para Codex - Task 10019-10027-26055e3

## 🎯 Contexto do Projeto
Você está trabalhando em um projeto Angular 20 (migração do Angular 9) para o sistema Carcheck Brasil, uma plataforma de consultas veiculares. O projeto está em processo de migração e você precisa implementar as mudanças da task 10019-10027-26055e3.

## 📋 Task a Resolver: 10019-10027-26055e3

**Objetivo:** Atualizar a Política de Privacidade e melhorar a responsividade do botão de Cadastro da landing page.

**Tipo:** Hotfix - Atualização de conteúdo e responsividade

**Arquivos a modificar:**
- `src/app/forma-pagamento/forma-pagamento.component.html`
- `src/app/components/navbar/navbar.component.scss`

## 🔧 Mudanças Específicas a Implementar

### 1. Atualização do Label de Termos de Uso

**Arquivo:** `src/app/forma-pagamento/forma-pagamento.component.html`

**Localizar e alterar:**
```html
<!-- ANTES -->
<label for="inputtermposdeuso" class="f-16 ml-2 fw-700">Li e aceito com os <u (click)="openModalTermosUso()"
  class="pointer text-orange-1 fw-700">termos
  de uso</u>.</label>

<!-- DEPOIS -->
<label for="inputtermposdeuso" class="f-16 ml-2 fw-700">Li e aceito com os <u (click)="openModalTermosUso()"
  class="pointer text-orange-1 fw-700">Termos
  de uso e Política de Privacidade</u>.</label>
```

### 2. Refatoração da Política de Privacidade

**Arquivo:** `src/app/forma-pagamento/forma-pagamento.component.html`

**Ação:** Melhorar a formatação de toda a seção de política de privacidade com:
- Quebras de linha adequadas
- Indentação consistente
- Parágrafos bem estruturados
- Melhor legibilidade

**Exemplo de formatação a aplicar:**
```html
<!-- ANTES -->
<p>Seja bem-vindo ao nosso site. Leia atentamente os termos abaixo.
Este documento e todo o conteúdo disponibilizado por Carcheck Brasil doravante denominada apenas "EMPRESA",
regulamenta
os direitos e obrigações de todos os visitantes do site, aqui denominados "(à) USUÁRIO". O acesso e uso do site
implica
na aceitação integral destes Termos e Condições.</p>

<!-- DEPOIS -->
<p>
  Seja bem-vindo ao nosso site. Leia atentamente os termos abaixo.
</p>
<p>
  Este documento e todo o conteúdo disponibilizado por Carcheck Brasil doravante denominada apenas "EMPRESA",
  regulamenta os direitos e obrigações de todos os visitantes do site, aqui denominados "(à) USUÁRIO". O acesso e
  uso do site implica na aceitação integral destes Termos e Condições.
</p>
```

### 3. Adição de Nova Seção na Política

**Arquivo:** `src/app/forma-pagamento/forma-pagamento.component.html`

**Adicionar após a seção 3.1.6:**
```html
<p>
  3.2. CERCA DE 2% (DOIS POR CENTO) DAS CONSULTAS REALIZADAS NO SISTEMA PODERÃO PASSAR POR UMA ANÁLISE AUTOMÁTICA
  COMPLEMENTAR, DESTINADA À VERIFICAÇÃO DE INFORMAÇÕES RELACIONADAS A LEILÕES, SINISTROS, RESTRIÇÕES
  ADMINISTRATIVAS OU DEMAIS IMPEDIMENTOS RELEVANTES.
</p>
<p>
  3.2.1. NESSAS SITUAÇÕES, O SISTEMA PODERÁ EXIBIR A MENSAGEM INFORMANDO QUE A CONSULTA ESTÁ EM PROCESSAMENTO.
  ESSE PROCEDIMENTO VISA ASSEGURAR A PRECISÃO, A CONSISTÊNCIA E A INTEGRIDADE DOS DADOS FORNECIDOS. CASO O USUÁRIO
  DESEJE ESCLARECIMENTOS ADICIONAIS, PODERÁ CONTATAR O SUPORTE DA EMPRESA POR MEIO DOS CANAIS OFICIAIS DE
  ATENDIMENTO.
</p>
```

### 4. Melhoria de Responsividade do Botão

**Arquivo:** `src/app/components/navbar/navbar.component.scss`

**Localizar a classe `.cadastrar` e adicionar:**
```scss
.cadastrar{
  white-space: nowrap;  // ← ADICIONAR ESTA LINHA
  color: #ecda26 !important;
  cursor: pointer;
}
```

## 🎯 Instruções para Codex

1. **Abra o arquivo** `src/app/forma-pagamento/forma-pagamento.component.html`
2. **Localize a seção** de termos de uso e política de privacidade
3. **Aplique as mudanças** de formatação conforme os exemplos acima
4. **Adicione a nova seção** 3.2 sobre análise automática de consultas
5. **Atualize o label** para incluir "Política de Privacidade"
6. **Abra o arquivo** `src/app/components/navbar/navbar.component.scss`
7. **Adicione** `white-space: nowrap;` na classe `.cadastrar`
8. **Teste a responsividade** em diferentes tamanhos de tela
9. **Verifique** se a formatação está consistente em todo o documento

## ⚠️ Observações Importantes

- **Conformidade Legal:** As mudanças na política de privacidade devem manter a conformidade com LGPD
- **Responsividade:** Teste em dispositivos móveis e desktop
- **Acessibilidade:** Mantenha a estrutura semântica do HTML
- **Consistência:** Aplique a formatação uniformemente em todo o documento
- **Backup:** Faça backup dos arquivos antes de modificar

## 🚀 Resultado Esperado

- ✅ Label atualizado para "Termos de uso e Política de Privacidade"
- ✅ Política de privacidade com formatação melhorada e legível
- ✅ Nova seção 3.2 adicionada sobre análise automática
- ✅ Botão de cadastro com responsividade melhorada
- ✅ Interface mais profissional e acessível

## 📊 Estatísticas da Task

- **Arquivos modificados:** 2
- **Linhas alteradas:** 538 (296 inserções, 242 deleções)
- **Tipo:** Hotfix - Atualização de conteúdo e responsividade
- **Prioridade:** Média (melhorias de UX e conformidade legal)
