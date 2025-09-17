# Comando para Codex - Task correcao-package-lock-json-cc56f1e

## 🎯 Contexto do Projeto
Você está trabalhando em um projeto Angular 20 (migração do Angular 9) para o sistema Carcheck Brasil, uma plataforma de consultas veiculares. O projeto está em processo de migração e você precisa implementar as mudanças da task correcao-package-lock-json-cc56f1e.

## 📋 Task a Resolver: correcao-package-lock-json-cc56f1e

**Objetivo:** Corrigir problemas no arquivo package-lock.json para resolver conflitos de dependências e garantir a estabilidade do projeto.

**Tipo:** Hotfix - Correção de Dependências

**Arquivo a modificar:**
- `package-lock.json`

## 🔧 Mudança Específica a Implementar

### Regeneração Completa do package-lock.json

**Problemas identificados:**
- Conflitos de versões entre dependências
- Inconsistências no package-lock.json
- Possíveis problemas de instalação de pacotes
- Dependências desatualizadas ou corrompidas

**Solução a implementar:**
- Regeneração completa do package-lock.json
- Atualização de todas as dependências para versões compatíveis
- Resolução de conflitos de versões
- Garantia de consistência entre package.json e package-lock.json

## 🎯 Instruções para Codex

### Método 1: Regeneração Automática (Recomendado)

1. **Fazer backup** do package-lock.json atual:
   ```bash
   cp package-lock.json package-lock.json.backup
   ```

2. **Remover** o package-lock.json corrompido:
   ```bash
   rm package-lock.json
   ```

3. **Limpar** o cache do npm:
   ```bash
   npm cache clean --force
   ```

4. **Reinstalar** todas as dependências:
   ```bash
   npm install
   ```

5. **Verificar** se não há erros:
   ```bash
   npm audit
   ```

### Método 2: Correção Manual (Se necessário)

1. **Abrir** o arquivo `package-lock.json`
2. **Identificar** dependências com conflitos de versão
3. **Atualizar** versões para serem compatíveis
4. **Remover** entradas duplicadas ou obsoletas
5. **Verificar** consistência com package.json

## 🚀 Impacto Esperado

- ✅ **Resolução de conflitos:** Dependências compatíveis entre si
- ✅ **Instalação estável:** Pacotes instalam sem erros
- ✅ **Melhor compatibilidade:** Versões atualizadas e seguras
- ✅ **Redução de erros:** Menos problemas de build
- ✅ **Dependências seguras:** Vulnerabilidades corrigidas

## ⚠️ Observações Importantes

### Antes da Correção:
- **Backup obrigatório:** Sempre fazer backup antes de alterar
- **Teste em ambiente isolado:** Não aplicar em produção primeiro
- **Documentar dependências:** Listar principais dependências afetadas

### Durante a Correção:
- **Monitorar erros:** Acompanhar mensagens de erro durante instalação
- **Verificar compatibilidade:** Testar se todas as dependências funcionam
- **Validar build:** Executar `ng build` para verificar se compila

### Após a Correção:
- **Teste extensivo:** Validar todas as funcionalidades
- **Executar auditoria:** `npm audit` para verificar vulnerabilidades
- **Documentar mudanças:** Registrar principais alterações
- **Comunicar equipe:** Informar sobre mudanças significativas

## 🔍 Verificações Pós-Implementação

1. **Build do projeto:**
   ```bash
   ng build
   ```

2. **Teste do servidor:**
   ```bash
   ng serve
   ```

3. **Auditoria de segurança:**
   ```bash
   npm audit
   ```

4. **Verificação de dependências:**
   ```bash
   npm list
   ```

5. **Teste de funcionalidades:** Validar todas as funcionalidades críticas

## 📊 Estatísticas da Task

- **Arquivos modificados:** 1
- **Linhas alteradas:** 20.801 (11.833 inserções, 8.968 deleções)
- **Tipo:** Correção massiva de dependências
- **Prioridade:** Crítica (estabilidade do projeto)
- **Risco:** Alto (pode quebrar funcionalidades existentes)

## 🚨 Avisos Importantes

- **Esta é uma correção crítica** para a estabilidade do projeto
- **Teste extensivamente** todas as funcionalidades após a correção
- **Mantenha backup** do package-lock.json original
- **Comunique a equipe** sobre as mudanças realizadas
- **Monitore** o sistema após a implementação
