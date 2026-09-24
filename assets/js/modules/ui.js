/** Utilitários de interface: toasts, alertas e destaque do menu. */
import { escapar } from './templates.js';

export function mostrarToast(mensagem, tipo = 'sucesso', duracao = 5000) {
  const area = document.querySelector('#area-toasts');
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  /* O contêiner #area-toasts já é uma região live; só erros pedem role=alert (evita leitura duplicada). */
  if (tipo === 'erro') toast.setAttribute('role', 'alert');
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

/** Anuncia a nova tela para leitores de tela (WCAG 4.1.3 Mensagens de status). */
export function anunciarRota(titulo) {
  const regiao = document.querySelector('#anuncio-rota');
  regiao.textContent = '';
  window.setTimeout(() => { regiao.textContent = `Página carregada: ${titulo}`; }, 50);
}

/** Marca o link do menu da rota atual com aria-current="page". */
export function marcarLinkAtivo(caminho) {
  document.querySelectorAll('nav a[data-rota]').forEach((link) => {
    if (link.dataset.rota === caminho) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('#menu-toggle').checked = false;
}
