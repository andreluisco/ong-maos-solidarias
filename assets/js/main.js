/** Ponto de entrada da SPA: registra as rotas, inicia o roteador e liga os eventos de cada tela. */
import { definirRota, iniciarRouter, navegar } from './modules/router.js';
import { cadastro, home, naoEncontrada, projetos, voluntarios } from './modules/templates.js';
import { lerRascunho, listarCadastros, removerCadastro } from './modules/storage.js';
import { iniciarFormulario } from './modules/formulario.js';
import { anunciarRota, marcarLinkAtivo, mostrarToast } from './modules/ui.js';

definirRota('/', { titulo: 'Início', view: home });
definirRota('/projetos', { titulo: 'Projetos Sociais', view: projetos });
definirRota('/cadastro', { titulo: 'Cadastro', view: () => cadastro(lerRascunho()) });
definirRota('/voluntarios', { titulo: 'Voluntários', view: () => voluntarios(listarCadastros()) });
definirRota('*', { titulo: 'Página não encontrada', view: naoEncontrada });

/** Executado depois de cada renderização: liga o comportamento da tela atual. */
function aoRenderizar(caminho, rota) {
  marcarLinkAtivo(caminho);
  anunciarRota(rota.titulo);
  if (caminho === '/cadastro') iniciarFormulario({ aoSalvar: () => navegar('/voluntarios') });
}

/* Delegação de eventos: um único listener cobre botões criados dinamicamente. */
document.querySelector('#app').addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-remover]');
  if (!botao) return;
  removerCadastro(botao.dataset.remover);
  mostrarToast('Cadastro removido.', 'info');
  navegar('/voluntarios');
});

iniciarRouter('#app', aoRenderizar);
