import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { VARIANTES, home, projetos } from './assets/js/modules/templates.js';

const arquivosDoSrcset = (htmlTexto) =>
  [...String(htmlTexto).matchAll(/srcset="([^"]+)"/g)]
    .flatMap(([, valor]) => valor.split(',').map((item) => item.trim().split(' ')[0]));

test('todo arquivo citado em srcset e src existe em assets/imagens', () => {
  const texto = String(home()) + String(projetos());
  const arquivos = [...arquivosDoSrcset(texto), ...[...texto.matchAll(/src="([^"]+)"/g)].map((m) => m[1])];
  assert.ok(arquivos.length >= 9, 'esperava várias imagens');
  for (const caminho of arquivos) {
    assert.ok(existsSync(new URL(`./html/${caminho}`, import.meta.url)), `arquivo ausente: ${caminho}`);
  }
});

test('srcset usa descritores de largura e sizes acompanha cada imagem', () => {
  const texto = String(projetos());
  assert.match(texto, /horta-320\.webp 320w, \.\.\/assets\/imagens\/horta\.webp 640w/);
  assert.equal((texto.match(/ sizes="/g) ?? []).length, 2);
  for (const { arquivos, sizes } of Object.values(VARIANTES)) {
    assert.ok(sizes.length > 0);
    assert.deepEqual(arquivos.map(([, w]) => w), [...arquivos.map(([, w]) => w)].sort((a, b) => a - b));
  }
});

test('imagem principal tem prioridade e as demais carregam sob demanda', () => {
  assert.match(String(home()), /fetchpriority="high"/);
  assert.doesNotMatch(String(home()), /loading="lazy"/);
  assert.equal((String(projetos()).match(/loading="lazy"/g) ?? []).length, 2);
});
