/**
 * Camada de persistência sobre o localStorage.
 * Todos os acessos ficam em try/catch: o navegador pode bloquear o
 * armazenamento (modo privado) ou o JSON salvo pode estar corrompido.
 */
const CHAVE_CADASTROS = 'maos-solidarias:cadastros';
const CHAVE_RASCUNHO = 'maos-solidarias:rascunho';
const CHAVE_TEMA = 'maos-solidarias:tema';

function ler(chave, padrao) {
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? JSON.parse(bruto) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave, valor) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

const novoId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`);

export const listarCadastros = () => ler(CHAVE_CADASTROS, []);

export function cpfJaCadastrado(cpf) {
  return listarCadastros().some((c) => c.cpf === cpf);
}

export function adicionarCadastro(dados) {
  const lista = listarCadastros();
  const registro = { ...dados, id: novoId(), criadoEm: new Date().toISOString() };
  return gravar(CHAVE_CADASTROS, [...lista, registro]) ? registro : null;
}

export function removerCadastro(id) {
  return gravar(CHAVE_CADASTROS, listarCadastros().filter((c) => c.id !== id));
}

export const lerTema = () => ler(CHAVE_TEMA, null);
export const salvarTema = (tema) => gravar(CHAVE_TEMA, tema);

export const salvarRascunho = (dados) => gravar(CHAVE_RASCUNHO, dados);
export const lerRascunho = () => ler(CHAVE_RASCUNHO, {});

export function limparRascunho() {
  try {
    window.localStorage.removeItem(CHAVE_RASCUNHO);
  } catch {
    /* sem armazenamento disponível: nada a limpar */
  }
}
