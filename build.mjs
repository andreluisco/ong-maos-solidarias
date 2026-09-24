/**
 * Build de produção: minifica JS, CSS e HTML e copia os ativos para dist/.
 * A estrutura de pastas é mantida (dist/html/index.html, dist/assets/...),
 * então os caminhos relativos continuam válidos.
 */
import { build, transform } from 'esbuild';
import { minify } from 'html-minifier-terser';
import { cp, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const relatorio = [];

async function medir(nome, origem, destino) {
  const antes = origem.reduce((soma, b) => soma + b.length, 0);
  const depois = await readFile(destino);
  relatorio.push({ nome, antes, depois: depois.length, gzip: gzipSync(depois).length });
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets/js', { recursive: true });
await mkdir('dist/assets/css', { recursive: true });
await mkdir('dist/html', { recursive: true });

/* 1) JavaScript: junta os módulos ES em um único arquivo minificado */
await build({
  entryPoints: ['assets/js/main.js'],
  bundle: true,
  minify: true,
  format: 'esm',
  target: 'es2022',
  sourcemap: true,
  outfile: 'dist/assets/js/main.min.js',
});
const fontesJs = await Promise.all(
  ['main', 'modules/router', 'modules/templates', 'modules/validation', 'modules/storage', 'modules/ui', 'modules/formulario']
    .map((n) => readFile(`assets/js/${n}.js`)),
);
await medir('JavaScript (7 módulos)', fontesJs, 'dist/assets/js/main.min.js');

/* 2) CSS: concatena reset + estilos e minifica */
const fontesCss = await Promise.all(['reset', 'style'].map((n) => readFile(`assets/css/${n}.css`, 'utf8')));
const css = await transform(fontesCss.join('\n'), { loader: 'css', minify: true });
await writeFile('dist/assets/css/style.min.css', css.code);
await medir('CSS (reset + style)', fontesCss.map((t) => Buffer.from(t)), 'dist/assets/css/style.min.css');

/* 3) HTML: aponta para os arquivos minificados e remove espaços e comentários */
let html = await readFile('html/index.html', 'utf8');
const htmlOriginal = Buffer.from(html);
html = html
  .replace(/\s*<link rel="stylesheet" href="\.\.\/assets\/css\/reset\.css">\s*<link rel="stylesheet" href="\.\.\/assets\/css\/style\.css">/, '\n  <link rel="stylesheet" href="../assets/css/style.min.css">')
  .replace('../assets/js/main.js', '../assets/js/main.min.js');
const htmlMin = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  minifyCSS: false,
  minifyJS: false,
});
await writeFile('dist/html/index.html', htmlMin);
await medir('HTML (shell da SPA)', [htmlOriginal], 'dist/html/index.html');

/* 4) Ativos e página de entrada na raiz (redireciona para a SPA) */
await cp('assets/imagens', 'dist/assets/imagens', { recursive: true });
await writeFile(
  'dist/index.html',
  '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=html/index.html"><title>Mãos Solidárias</title></head><body><a href="html/index.html">Ir para o site Mãos Solidárias</a></body></html>',
);

console.log('\nArquivo                    Original    Minificado    gzip     Redução');
for (const r of relatorio) {
  const reducao = (100 * (1 - r.depois / r.antes)).toFixed(0);
  console.log(`${r.nome.padEnd(26)} ${kb(r.antes).padStart(9)} ${kb(r.depois).padStart(12)} ${kb(r.gzip).padStart(8)} ${(reducao + '%').padStart(8)}`);
}
const total = await stat('dist/assets/js/main.min.js');
console.log(`\nBuild concluído: dist/ pronto (${kb(total.size)} de JavaScript).`);
