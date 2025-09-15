#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando build otimizado para produção...\n');

try {
  // 1. Limpar dist anterior
  console.log('🧹 Limpando build anterior...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // 2. Build de produção com otimizações
  console.log('⚡ Executando build de produção...');
  execSync('ng build --configuration production', { stdio: 'inherit' });

  // 3. Build SSR (opcional - comentado por enquanto)
  console.log('🔄 Pulando build SSR (não configurado)...');
  // execSync('ng build --configuration production --ssr', { stdio: 'inherit' });

  // 4. Análise de bundle
  console.log('📊 Analisando tamanho do bundle...');
  try {
    execSync('npx webpack-bundle-analyzer dist/browser/stats.json', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Webpack Bundle Analyzer não encontrado. Instale com: npm install -g webpack-bundle-analyzer');
  }

  // 5. Verificação de performance
  console.log('🔍 Verificando métricas de performance...');
  
  const distPath = path.join(__dirname, '../dist/browser');
  const files = fs.readdirSync(distPath);
  
  console.log('\n📁 Arquivos gerados:');
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  ${file}: ${sizeKB} KB`);
    }
  });

  // 6. Verificação de imagens otimizadas
  console.log('\n🖼️  Verificando otimização de imagens...');
  const assetsPath = path.join(distPath, 'assets/images');
  if (fs.existsSync(assetsPath)) {
    const imageFiles = fs.readdirSync(assetsPath).filter(file => 
      /\.(png|jpg|jpeg|webp|avif)$/i.test(file)
    );
    
    console.log(`  Encontradas ${imageFiles.length} imagens`);
    imageFiles.forEach(file => {
      const filePath = path.join(assetsPath, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`    ${file}: ${sizeKB} KB`);
    });
  }

  console.log('\n✅ Build otimizado concluído com sucesso!');
  console.log('\n📈 Próximos passos para melhorar performance:');
  console.log('  1. Teste com PageSpeed Insights');
  console.log('  2. Configure CDN para assets estáticos');
  console.log('  3. Implemente Service Worker para cache');
  console.log('  4. Configure compressão gzip/brotli no servidor');
  console.log('  5. Monitore Core Web Vitals em produção');

} catch (error) {
  console.error('❌ Erro durante o build:', error.message);
  process.exit(1);
}
