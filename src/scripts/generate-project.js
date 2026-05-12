/* global require, __dirname, process */
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const projectName = 'trancoso-resolve';
const outputZip = path.join(__dirname, '..', `${projectName}.zip`);
const srcDir = path.join(__dirname, '..');

// Cria stream de saída
const output = fs.createWriteStream(outputZip);
const archive = archiver('zip', { zlib: { level: 9 } });

// Pasta/arquivos a ignorar
const ignore = [
  'node_modules',
  '.git',
  'dist',
  '.env',
  '.env.local',
  '.DS_Store',
  '*.zip',
  '.vercel',
  '.next',
  'coverage',
  '.vscode',
  '.idea'
];

function shouldIgnore(filePath) {
  return ignore.some(pattern => {
    if (pattern.startsWith('*.')) {
      return filePath.endsWith(pattern.replace('*', ''));
    }
    return filePath.includes(pattern);
  });
}

// Função recursiva para adicionar arquivos
function addFilesRecursive(dir, baseDir = '') {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(baseDir, file);
    
    if (shouldIgnore(relativePath)) {
      console.log(`⏭️  Ignorando: ${relativePath}`);
      return;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      addFilesRecursive(fullPath, relativePath);
    } else {
      archive.file(fullPath, { name: relativePath });
      console.log(`✅ Adicionado: ${relativePath}`);
    }
  });
}

// Listeners
output.on('close', () => {
  console.log(`\n🎉 ZIP criado com sucesso!`);
  console.log(`📦 Arquivo: ${outputZip}`);
  console.log(`📊 Tamanho: ${(output.bytesWritten / 1024).toFixed(2)} KB`);
});

archive.on('error', (err) => {
  console.error('❌ Erro ao criar ZIP:', err);
  process.exit(1);
});

output.on('error', (err) => {
  console.error('❌ Erro de escrita:', err);
  process.exit(1);
});

// Inicia
console.log(`📂 Compactando ${projectName}...\n`);
archive.pipe(output);

// Adiciona arquivos
addFilesRecursive(srcDir);

// Finaliza
archive.finalize();