# Comando para Codex - Task att-10264-62c4897

## 🎯 Contexto do Projeto
Você está trabalhando em um projeto Angular 20 (migração do Angular 9) para o sistema Carcheck Brasil, uma plataforma de consultas veiculares. O projeto está em processo de migração e você precisa implementar as mudanças da task att-10264-62c4897.

## 📋 Task a Resolver: att-10264-62c4897

**Objetivo:** Reduzir a quantidade de tentativas do API Polling para 12, otimizando a performance do sistema de pagamento de débitos.

**Tipo:** Hotfix - Otimização de Performance

**Arquivo a modificar:**
- `src/app/pagar-debitos/pagar-debitos.component.ts`

## 🔧 Mudança Específica a Implementar

### Otimização do API Polling

**Arquivo:** `src/app/pagar-debitos/pagar-debitos.component.ts`

**Localizar o método `buscarRetornoDebitos` e alterar:**

```typescript
// ANTES
const maxTentativas = 20;

// DEPOIS
const maxTentativas = 12;
```

**Contexto completo do método:**
```typescript
buscarRetornoDebitos(consultId: string) {
  let tentativas = 0;
  const maxTentativas = 12; // ← ALTERAR DE 20 PARA 12
  const intervalo = 5000; // 5 segundos

  const fazerRequisicao = () => {
    // ... resto do código
  };
}
```

## 🎯 Instruções para Codex

1. **Abra o arquivo** `src/app/pagar-debitos/pagar-debitos.component.ts`
2. **Localize o método** `buscarRetornoDebitos(consultId: string)`
3. **Encontre a linha** `const maxTentativas = 20;`
4. **Altere para** `const maxTentativas = 12;`
5. **Salve o arquivo**
6. **Teste a funcionalidade** para garantir que o polling ainda funciona corretamente

## 🚀 Impacto Esperado

- ✅ **Melhoria na performance:** Redução de 40% nas tentativas de polling
- ✅ **Menor carga no servidor:** De 100 segundos (20 × 5s) para 60 segundos (12 × 5s)
- ✅ **Melhor experiência do usuário:** Tempo de espera reduzido
- ✅ **Menor consumo de recursos:** Menos requisições desnecessárias

## ⚠️ Observações Importantes

- **Teste crítico:** Verifique se 12 tentativas são suficientes para todos os casos de uso
- **Monitoramento:** Acompanhe se não há aumento de timeouts após a mudança
- **Rollback:** Mantenha a versão anterior caso seja necessário reverter
- **Documentação:** Registre a mudança para a equipe

## 📊 Estatísticas da Task

- **Arquivos modificados:** 1
- **Linhas alteradas:** 1
- **Tipo:** Otimização de performance
- **Prioridade:** Alta (melhoria de performance crítica)
- **Risco:** Baixo (mudança simples e reversível)
