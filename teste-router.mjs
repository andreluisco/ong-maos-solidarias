import assert from 'node:assert/strict';
import { test } from 'node:test';

/* O roteador lê window.location.hash; aqui simulamos só o necessário. */
globalThis.window = { location: { hash: '' } };
const { caminhoAtual } = await import('./assets/js/modules/router.js');

const rota = (hash) => {
  window.location.hash = hash;
  return caminhoAtual();
};

test('rotas simples', () => {
  assert.equal(rota(''), '/');
  assert.equal(rota('#/'), '/');
  assert.equal(rota('#/projetos'), '/projetos');
  assert.equal(rota('#/cadastro'), '/cadastro');
});

test('normaliza barra final e maiúsculas (regressão do bug da 1.0.0)', () => {
  assert.equal(rota('#/projetos/'), '/projetos');
  assert.equal(rota('#/Projetos'), '/projetos');
  assert.equal(rota('#/CADASTRO/'), '/cadastro');
  assert.equal(rota('#//'), '/');
});

test('hashes que não são rotas (âncoras) viram a raiz', () => {
  assert.equal(rota('#app'), '/');
  assert.equal(rota('#'), '/');
});
