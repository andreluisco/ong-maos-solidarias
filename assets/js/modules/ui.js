/** Utilitários de interface: toasts, alertas e destaque do menu. */
import { escapar } from './templates.js';

export function mostrarToast(mensagem, tipo = 'sucesso', duracao = 5000) {
  const area = document.querySelector('#area-toasts');
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.setAttribute('role', tipo === 'erro' ? 'alert' : 'status');
  toast.innerHTML = `<span>${escapar(mensagem)}</span>`;

  const fechar = document.createElement('button');
  fechar.type = 'button';
  fechar.className = 'toast-fechar';
  fechar.setAttribute('aria-label', 'Fechar notificação');
  fechar.textContent = '×';
  fechar.addEventListener('click', () => toast.remove());
  toast.append(fechar);

  area.append(toast);
  window.setTimeout(() => toast.remove(), duracao);
}

export function mostrarAlerta(seletor, mensagem, tipo = 'erro') {
  const alvo = document.querySelector(seletor);
  alvo.innerHTML = `<div class="alerta alerta-${tipo}"><p>${escapar(mensagem)}</p></div>`;
}

export function limparAlerta(seletor) {
  const alvo = document.querySelector(seletor);
  if (alvo) alvo.replaceChildren();
}

/** Marca o link do menu da rota atual com aria-current="page". */
export function marcarLinkAtivo(caminho) {
  document.querySelectorAll('nav a[data-rota]').forEach((link) => {
    if (link.dataset.rota === caminho) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('#menu-toggle').checked = false;
}
