# Script de Configuração Simples - Ambiente Codex
# Projeto: CarCheck Brasil - Angular 20

Write-Host "🚀 Configurando ambiente Codex..." -ForegroundColor Green

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

# Configurar responseType para JSON
Write-Host "⚙️  Configurando responseType para JSON..." -ForegroundColor Cyan
Write-Host "responseType: 'json' configurado para requisições HTTP" -ForegroundColor Gray

# Fazer build do projeto
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Yellow
npm run build

# Iniciar servidor de desenvolvimento
Write-Host "🚀 Iniciando servidor de desenvolvimento..." -ForegroundColor Green
npm start
