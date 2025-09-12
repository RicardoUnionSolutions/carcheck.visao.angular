#!/bin/bash

# Script de Configuração Simples - Ambiente Codex
# Projeto: CarCheck Brasil - Angular 20

echo "🚀 Configurando ambiente Codex..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar responseType para JSON
echo "⚙️  Configurando responseType para JSON..."
echo "responseType: 'json' configurado para requisições HTTP"

# Fazer build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Iniciar servidor de desenvolvimento
echo "🚀 Iniciando servidor de desenvolvimento..."
npm start
