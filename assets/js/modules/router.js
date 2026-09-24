/**
 * Roteador por hash (#/rota) para a SPA.
 * Mantém um mapa caminho -> { titulo, view } e re-renderiza o contêiner
 * principal sempre que o hash muda.
 */
const rotas = new Map();
let contêiner = null;
let aoRenderizar = () => {};

export function definirRota(caminho, rota) {
  rotas.set(caminho, rota);
}

/** Converte "#/projetos" em "/projetos". Hash vazio vira "/". */
export function caminhoAtual() {
  const { hash } = window.location;
  return hash.startsWith('#/') ? hash.slice(1) : '/';
}

/** Hashes que não começam com "#/" (ex.: #app do link "pular") não são rotas. */
function ehRota() {
  const { hash } = window.location;
  return hash === '' || hash === '#' || hash.startsWith('#/');
}

export function renderizar() {
  const caminho = caminhoAtual();
  const rota = rotas.get(caminho) ?? rotas.get('*');

  contêiner.replaceChildren();
  contêiner.insertAdjacentHTML('beforeend', String(rota.view()));

  document.title = `${rota.titulo} | Mãos Solidárias`;
  window.scrollTo(0, 0);
  contêiner.focus({ preventScroll: true });
  aoRenderizar(caminho, rota);
}

export function navegar(caminho) {
  if (caminhoAtual() === caminho) {
    renderizar();
  } else {
    window.location.hash = caminho;
  }
}

export function iniciarRouter(seletor, callback) {
  contêiner = document.querySelector(seletor);
  aoRenderizar = callback ?? aoRenderizar;
  window.addEventListener('hashchange', () => {
    if (ehRota()) renderizar();
  });
  renderizar();
}
