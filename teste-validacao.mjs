import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpfValido, idadeEm, mascaras, validarCampo, validarFormulario } from './assets/js/modules/validation.js';
import { escapar, html } from './assets/js/modules/templates.js';

test('CPF: válidos e inválidos', () => {
  assert.equal(cpfValido('529.982.247-25'), true);
  assert.equal(cpfValido('52998224725'), true);
  assert.equal(cpfValido('529.982.247-24'), false);
  assert.equal(cpfValido('111.111.111-11'), false);
  assert.equal(cpfValido('123'), false);
});

test('máscaras', () => {
  assert.equal(mascaras.cpf('52998224725'), '529.982.247-25');
  assert.equal(mascaras.cpf('5299'), '529.9');
  assert.equal(mascaras.telefone('11987654321'), '(11) 98765-4321');
  assert.equal(mascaras.telefone('1133334444'), '(11) 3333-4444');
  assert.equal(mascaras.telefone('1'), '(1');
  assert.equal(mascaras.cep('01310100'), '01310-100');
});

test('regras de campo', () => {
  assert.notEqual(validarCampo('nome', 'Maria'), '');
  assert.equal(validarCampo('nome', 'Maria Souza'), '');
  assert.notEqual(validarCampo('email', 'a@b'), '');
  assert.equal(validarCampo('email', 'maria@exemplo.com'), '');
  assert.notEqual(validarCampo('cpf', '529.982.247-24'), '');
  assert.equal(validarCampo('cpf', '529.982.247-25'), '');
  assert.equal(validarCampo('telefone', '(11) 98765-4321'), '');
  assert.notEqual(validarCampo('telefone', '11987654321'), '');
  assert.equal(validarCampo('cep', '01310-100'), '');
  assert.notEqual(validarCampo('uf', 'XX'), '');
  assert.equal(validarCampo('uf', 'SP'), '');
  assert.notEqual(validarCampo('aceite', false), '');
});

test('idade e data de nascimento', () => {
  assert.equal(idadeEm('2000-06-15', new Date('2026-06-14T12:00:00')), 25);
  assert.equal(idadeEm('2000-06-15', new Date('2026-06-15T12:00:00')), 26);
  assert.notEqual(validarCampo('nascimento', '2020-01-01'), '');
  assert.equal(validarCampo('nascimento', '1990-05-20'), '');
  assert.notEqual(validarCampo('nascimento', ''), '');
});

test('formulário completo', () => {
  const ok = { nome: 'Maria Souza', email: 'maria@exemplo.com', cpf: '529.982.247-25', telefone: '(11) 98765-4321', nascimento: '1990-05-20', cep: '01310-100', cidade: 'São Paulo', uf: 'SP', perfil: 'voluntario', aceite: true };
  assert.deepEqual(validarFormulario(ok), {});
  const erros = validarFormulario({ ...ok, cpf: '000.000.000-00', aceite: false });
  assert.deepEqual(Object.keys(erros).sort(), ['aceite', 'cpf']);
});

test('templates escapam HTML e aceitam aninhamento', () => {
  assert.equal(escapar('<img src=x onerror="a()">'), '&lt;img src=x onerror=&quot;a()&quot;&gt;');
  const interno = html`<b>${'<x>'}</b>`;
  assert.equal(String(html`<p>${interno}</p>`), '<p><b>&lt;x&gt;</b></p>');
  assert.equal(String(html`<ul>${['a', 'b'].map((v) => html`<li>${v}</li>`)}</ul>`), '<ul><li>a</li><li>b</li></ul>');
  assert.equal(String(html`<i>${null}${false}${0}</i>`), '<i>0</i>');
});
