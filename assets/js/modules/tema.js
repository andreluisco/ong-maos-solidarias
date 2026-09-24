/**
 * Tema claro/escuro. Sem escolha salva, segue o sistema (prefers-color-scheme).
 * O botão grava a escolha e a aplica em <html data-tema="...">, e o CSS
 * troca os tokens de cor. As funções resolverTema e alternar são puras.
 */
import { lerTema, salvarTema } from './storage.js';

export const TEMAS = ['claro', 'escuro'];

/** Escolha salva vence; sem ela, vale a preferência do sistema. */
export function resolverTema(guardado, sistemaEscuro) {
  if (TEMAS.includes(guardado)) return guardado;
  return sistemaEscuro ? 'escuro' : 'claro';
}

export const alternar = (atual) => (atual === 'escuro' ? 'claro' : 'escuro');

export function iniciarTema() {
  const raiz = document.documentElement;
  const sistema = window.matchMedia('(prefers-color-scheme: dark)');
  const botao = document.querySelector('#alternar-tema');
  if (!botao) return;

  const guardado = lerTema();
  if (TEMAS.includes(guardado)) raiz.dataset.tema = guardado;

  const efetivo = () => resolverTema(raiz.dataset.tema, sistema.matches);
  const atualizar = () => botao.setAttribute('aria-pressed', String(efetivo() === 'escuro'));

  botao.addEventListener('click', () => {
    const novo = alternar(efetivo());
    raiz.dataset.tema = novo;
    salvarTema(novo);
    atualizar();
  });
  sistema.addEventListener('change', atualizar);
  atualizar();
}
