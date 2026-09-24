import assert from 'node:assert/strict';
import { test } from 'node:test';
import { TEMAS, alternar, resolverTema } from './assets/js/modules/tema.js';

test('escolha salva vence a preferência do sistema', () => {
  assert.equal(resolverTema('claro', true), 'claro');
  assert.equal(resolverTema('escuro', false), 'escuro');
});

test('sem escolha salva, segue o sistema', () => {
  assert.equal(resolverTema(null, true), 'escuro');
  assert.equal(resolverTema(undefined, false), 'claro');
});

test('valores inválidos gravados são ignorados', () => {
  assert.equal(resolverTema('roxo', false), 'claro');
  assert.equal(resolverTema('roxo', true), 'escuro');
  assert.equal(resolverTema('', true), 'escuro');
});

test('alternar inverte o tema e só existem dois', () => {
  assert.equal(alternar('claro'), 'escuro');
  assert.equal(alternar('escuro'), 'claro');
  assert.deepEqual(TEMAS, ['claro', 'escuro']);
});
