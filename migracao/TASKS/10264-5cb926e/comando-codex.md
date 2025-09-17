# Comando para Codex - Task 10264-5cb926e

## 🎯 Contexto do Projeto
Você está trabalhando em um projeto Angular 20 (migração do Angular 9) para o sistema Carcheck Brasil, uma plataforma de consultas veiculares. O projeto está em processo de migração e você precisa implementar as mudanças da task 10264-5cb926e.

## 📋 Task a Resolver: 10264-5cb926e

**Objetivo:** Atualizar as requisições de pagamentos de débitos, implementando melhorias no sistema de processamento de pagamentos.

**Tipo:** Hotfix - Atualização de Requisições de Pagamento

**Arquivos a modificar:**
- `src/app/pagar-debitos/pagar-debitos.component.ts`
- `src/app/service/pagar-debitos.service.ts`

## 🔧 Mudanças Específicas a Implementar

### 1. Refatoração do Método `consultarDebitos`

**Arquivo:** `src/app/pagar-debitos/pagar-debitos.component.ts`

**Alterar o método para usar polling assíncrono:**

```typescript
// ANTES
this.service.consultarDebitos(dadosConsulta).subscribe({
  next: (v: any) => {
    console.log(v)
    this.dadosDoVeiculo = v;

    // salvar no localstorage o this.dadosDoVeiculo.consult_id
    localStorage.setItem('consulta_anterior', JSON.stringify({
      consult_id: v.consult_id,
      uf: v.vehicle.uf,
      placa: v.vehicle.license_plate,
      renavam: v.vehicle.renavam,
    }));

    this.modalService.closeLoading();
  },
  error: (err) => {
    this.modalService.closeLoading();
    // ... tratamento de erro
  }
});

// DEPOIS
this.service.consultarDebitos(dadosConsulta).subscribe({
  next: (v: any) => {
    const consultId = v.consultId;

    // Iniciar o polling para buscar o retorno
    this.buscarRetornoDebitos(consultId);
  },
  error: (err) => {
    this.modalService.closeLoading();
    // ... tratamento de erro
  }
});
```

### 2. Implementar Método `buscarRetornoDebitos`

**Arquivo:** `src/app/pagar-debitos/pagar-debitos.component.ts`

**Adicionar o novo método após o método `consultarDebitos`:**

```typescript
buscarRetornoDebitos(consultId: string) {
  let tentativas = 0;
  const maxTentativas = 20;
  const intervalo = 5000; // 5 segundos

  const fazerRequisicao = () => {
    if (tentativas >= maxTentativas) {
      this.modalService.closeLoading();
      this.modalService.openModalMsg({
        status: 2,
        cancel: { show: false },
        title: 'Timeout: Não foi possível obter os débitos. Tente novamente mais tarde.'
      });
      return;
    }

    tentativas++;
    console.log(`Tentativa ${tentativas} de ${maxTentativas} para buscar retorno dos débitos`);

    this.service.buscarRetorno(consultId).subscribe({
      next: (retorno: any) => {
        // Se retornou dados válidos (status não é "pending")
        if (retorno && retorno.status !== 'pending') {
          this.dadosDoVeiculo = retorno;
          // salvar no localstorage o this.dadosDoVeiculo.consult_id
          localStorage.setItem('consulta_anterior', JSON.stringify({
            consult_id: retorno.consult_id,
            uf: retorno.vehicle.uf,
            placa: retorno.vehicle.license_plate,
            renavam: retorno.vehicle.renavam,
          }));

          this.modalService.closeLoading();
        } else {
          // Se ainda está pendente, aguarda e tenta novamente
          setTimeout(fazerRequisicao, intervalo);
        }
      },
      error: (err) => {
        if (err.status === 404) {
          // Status 404 significa que ainda está pendente, tenta novamente
          setTimeout(fazerRequisicao, intervalo);
        } else {
          // Outros erros, para o polling
          this.modalService.closeLoading();
          this.modalService.openModalMsg({
            status: 2,
            cancel: { show: false },
            title: 'Erro ao buscar retorno dos débitos. Tente novamente.'
          });
          console.error('Erro ao buscar retorno:', err);
        }
      }
    });
  };

  // Inicia o polling
  fazerRequisicao();
}
```

### 3. Adicionar Método no Serviço

**Arquivo:** `src/app/service/pagar-debitos.service.ts`

**Adicionar o novo método no final da classe:**

```typescript
buscarRetorno(consultId: string): Observable<any> {
  return this.http.get(this.variableGlobal.getUrl("pinpag/buscarRetorno/" + consultId))
}
```

## 🎯 Instruções para Codex

1. **Abra o arquivo** `src/app/pagar-debitos/pagar-debitos.component.ts`
2. **Localize o método** `consultarDebitos`
3. **Refatore o método** conforme o exemplo "DEPOIS" acima
4. **Adicione o método** `buscarRetornoDebitos` após o método `consultarDebitos`
5. **Abra o arquivo** `src/app/service/pagar-debitos.service.ts`
6. **Adicione o método** `buscarRetorno` no final da classe
7. **Teste a funcionalidade** para garantir que o polling funciona corretamente

## 🚀 Impacto Esperado

- ✅ **Processamento assíncrono:** Consulta não bloqueia mais a interface
- ✅ **Polling inteligente:** Sistema tenta buscar resultado até 20 vezes
- ✅ **Tratamento de status:** Diferencia entre "pending" e dados válidos
- ✅ **Tratamento de erros:** 404 = pendente, outros erros = falha
- ✅ **Timeout controlado:** Máximo de 100 segundos (20 × 5s)
- ✅ **Feedback ao usuário:** Mensagens de timeout e erro específicas

## ⚠️ Observações Importantes

- **Teste extensivo:** Verifique se o polling funciona em todos os cenários
- **Tratamento de erros:** Valide se os códigos de erro estão corretos
- **Performance:** Monitore se não há impacto na performance
- **Logs:** Mantenha os logs para debug
- **Timeout:** Ajuste o número de tentativas se necessário

## 📊 Estatísticas da Task

- **Arquivos modificados:** 2
- **Linhas alteradas:** 78 (67 inserções, 11 deleções)
- **Tipo:** Refatoração e melhorias funcionais
- **Prioridade:** Alta (melhoria crítica no sistema de pagamento)
- **Risco:** Médio (mudanças significativas na lógica de negócio)
