# Comando para Codex - Task 10228-f3d1599

## 🎯 Contexto do Projeto
Você está trabalhando em um projeto Angular 20 (migração do Angular 9) para o sistema Carcheck Brasil, uma plataforma de consultas veiculares. O projeto está em processo de migração e você precisa implementar as mudanças da task 10228-f3d1599.

## 📋 Task a Resolver: 10228-f3d1599

**Objetivo:** Ajustar os títulos das páginas de consultas para melhorar a identificação e SEO do site.

**Tipo:** Hotfix - Melhoria de SEO e UX

**Arquivo a modificar:**
- `src/app/consulta-company/consulta-company.component.ts`

## 🔧 Mudança Específica a Implementar

### Implementação de Títulos Dinâmicos

**Arquivo:** `src/app/consulta-company/consulta-company.component.ts`

**1. Remover o título fixo do ngOnInit:**

```typescript
// ANTES
ngOnInit() {
  this.titleService.setTitle('Consulta CNPJ Completa');
  this.metaService.updateTag({
    name: 'description',
    content: 'Verifique dados de empresas por CNPJ com fonte oficial, rápida e confiável.'
  });
  // ... resto do código
}

// DEPOIS
ngOnInit() {
  // this.titleService.setTitle('Consulta CNPJ Completa'); ← REMOVER ESTA LINHA
  this.metaService.updateTag({
    name: 'description',
    content: 'Verifique dados de empresas por CNPJ com fonte oficial, rápida e confiável.'
  });
  // ... resto do código
}
```

**2. Adicionar título dinâmico baseado no tipo de consulta:**

```typescript
// Localizar o bloco else no método que carrega os dados da consulta
} else {
  this.dadosConsultaService.getConsultaVeiculoCompany(this.tokenConsulta).then(v => {
    this.dadosConsulta = v;
    if (this.dadosConsulta?.tipo != null) this.titleService.setTitle("Consulta Veicular " + this.dadosConsulta.tipo + " - Carcheck");
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dadosConsulta.linkPesquisa);
  }).catch((e)=>{console.error(e)}).finally(()=>{
    this.modalService.closeLoading();
  });
}
```

## 🎯 Instruções para Codex

1. **Abra o arquivo** `src/app/consulta-company/consulta-company.component.ts`
2. **Localize o método** `ngOnInit()`
3. **Remova a linha** `this.titleService.setTitle('Consulta CNPJ Completa');`
4. **Localize o bloco else** que carrega os dados da consulta veicular
5. **Adicione a linha** `if (this.dadosConsulta?.tipo != null) this.titleService.setTitle("Consulta Veicular " + this.dadosConsulta.tipo + " - Carcheck");`
6. **Salve o arquivo**
7. **Teste** com diferentes tipos de consulta para verificar os títulos

## 🚀 Impacto Esperado

- ✅ **Títulos dinâmicos:** Baseados no tipo de consulta específico
- ✅ **Melhoria no SEO:** Títulos mais descritivos e específicos
- ✅ **Melhor UX:** Usuários sabem exatamente qual serviço estão acessando
- ✅ **Consistência de marca:** Todas as páginas incluem "Carcheck"
- ✅ **Navegação clara:** Títulos aparecem nas abas do navegador

## 📋 Títulos Implementados

Os títulos serão gerados dinamicamente como:
- **Consulta Veicular Leilão** - Carcheck
- **Consulta Veicular Completa** - Carcheck  
- **Consulta Veicular Segura** - Carcheck

## ⚠️ Observações Importantes

- **Verificação de segurança:** `?.` evita erros se `dadosConsulta` for null
- **Verificação de tipo:** `!= null` garante que o tipo existe
- **Concatenação dinâmica:** Combina "Consulta Veicular" + tipo + "Carcheck"
- **Teste:** Verifique se os títulos aparecem corretamente no navegador
- **SEO:** Valide com ferramentas de análise de SEO

## 📊 Estatísticas da Task

- **Arquivos modificados:** 1
- **Linhas alteradas:** 1
- **Tipo:** Melhoria de SEO e UX
- **Prioridade:** Média (melhoria de experiência do usuário)
- **Risco:** Baixo (mudança simples e reversível)
