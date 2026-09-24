/**
 * Regras de validação e máscaras de entrada.
 * Funções puras (sem DOM): fáceis de testar.
 */
const somenteDigitos = (v) => String(v ?? '').replace(/\D/g, '');

/* ---------- Máscaras ---------- */
export const mascaras = {
  cpf(valor) {
    const d = somenteDigitos(valor).slice(0, 11);
    return d
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1-$2');
  },
  telefone(valor) {
    const d = somenteDigitos(valor).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    const ddd = d.slice(0, 2);
    const resto = d.slice(2);
    const corte = resto.length > 8 ? 5 : 4;
    return resto.length <= corte ? `(${ddd}) ${resto}` : `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`;
  },
  cep(valor) {
    const d = somenteDigitos(valor).slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  },
};

/* ---------- Validadores específicos ---------- */
export function cpfValido(valor) {
  const d = somenteDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (base, pesoInicial) => {
    const soma = [...base].reduce((acc, n, i) => acc + Number(n) * (pesoInicial - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return digito(d.slice(0, 9), 10) === Number(d[9]) && digito(d.slice(0, 10), 11) === Number(d[10]);
}

export function idadeEm(nascimentoISO, hoje = new Date()) {
  const n = new Date(`${nascimentoISO}T00:00:00`);
  if (Number.isNaN(n.getTime())) return NaN;
  let idade = hoje.getFullYear() - n.getFullYear();
  const aindaNaoFez = hoje.getMonth() < n.getMonth() || (hoje.getMonth() === n.getMonth() && hoje.getDate() < n.getDate());
  if (aindaNaoFez) idade -= 1;
  return idade;
}

const UF_VALIDAS = new Set(['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']);

/* ---------- Regras por campo: retornam '' (válido) ou a mensagem de erro ---------- */
export const regras = {
  nome: (v) => (v.trim().split(/\s+/).filter(Boolean).length >= 2 && v.trim().length >= 5 ? '' : 'Informe nome e sobrenome.'),
  email: (v) => (!v.trim() ? 'Informe o e-mail.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Informe um e-mail válido, como nome@exemplo.com.'),
  cpf: (v) => (!v.trim() ? 'Informe o CPF.' : !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(v) ? 'Use o formato 000.000.000-00.' : cpfValido(v) ? '' : 'CPF inválido. Confira os dígitos.'),
  telefone: (v) => (!v.trim() ? 'Informe o telefone.' : /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v) ? '' : 'Use o formato (00) 00000-0000.'),
  nascimento: (v) => {
    if (!v) return 'Informe a data de nascimento.';
    const idade = idadeEm(v);
    if (Number.isNaN(idade) || idade < 0) return 'Informe uma data válida.';
    return idade < 16 || idade > 120 ? 'É necessário ter pelo menos 16 anos.' : '';
  },
  cep: (v) => (!v.trim() ? 'Informe o CEP.' : /^\d{5}-\d{3}$/.test(v) ? '' : 'Use o formato 00000-000.'),
  cidade: (v) => (v.trim().length >= 2 ? '' : 'Informe a cidade.'),
  uf: (v) => (UF_VALIDAS.has(v) ? '' : 'Selecione o estado.'),
  perfil: (v) => (v === 'doador' || v === 'voluntario' ? '' : 'Escolha uma opção.'),
  aceite: (v) => (v ? '' : 'É necessário concordar para continuar.'),
};

export function validarCampo(nome, valor) {
  const regra = regras[nome];
  return regra ? regra(valor ?? '') : '';
}

/** Valida o objeto inteiro e devolve { campo: mensagem } só com os erros. */
export function validarFormulario(dados) {
  const erros = {};
  for (const nome of Object.keys(regras)) {
    const mensagem = validarCampo(nome, dados[nome]);
    if (mensagem) erros[nome] = mensagem;
  }
  return erros;
}
