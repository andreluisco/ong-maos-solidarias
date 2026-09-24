/** Comportamento do formulário de cadastro: máscaras, validação, rascunho e envio. */
import { mascaras, validarCampo, validarFormulario } from './validation.js';
import { adicionarCadastro, cpfJaCadastrado, limparRascunho, salvarRascunho } from './storage.js';
import { limparAlerta, mostrarAlerta, mostrarToast } from './ui.js';

const CAMPOS = ['nome', 'email', 'cpf', 'telefone', 'nascimento', 'cep', 'cidade', 'uf'];

function lerDados(form) {
  const dados = Object.fromEntries(CAMPOS.map((c) => [c, form.elements[c].value]));
  dados.perfil = form.elements.perfil.value;
  dados.aceite = form.elements.aceite.checked;
  return dados;
}

function definirErro(form, nome, mensagem) {
  const erro = form.querySelector(`#erro-${nome}`);
  const controles = form.querySelectorAll(`[name="${nome}"]`);
  erro.textContent = mensagem;
  controles.forEach((c) => {
    const preenchido = c.type === 'checkbox' || c.type === 'radio' ? c.checked : c.value.trim() !== '';
    if (mensagem) c.setAttribute('aria-invalid', 'true');
    else if (preenchido) c.setAttribute('aria-invalid', 'false'); /* estado de sucesso */
    else c.removeAttribute('aria-invalid');
  });
}

function validarUm(form, nome) {
  const dados = lerDados(form);
  const mensagem = validarCampo(nome, dados[nome]);
  definirErro(form, nome, mensagem);
  return mensagem;
}

export function iniciarFormulario({ aoSalvar }) {
  const form = document.querySelector('#form-cadastro');
  if (!form) return;
  let temporizador;

  form.addEventListener('input', (evento) => {
    const campo = evento.target;
    const tipoMascara = campo.dataset?.mascara;
    if (tipoMascara) campo.value = mascaras[tipoMascara](campo.value);
    if (campo.dataset.tocado || campo.type === 'radio' || campo.type === 'checkbox') validarUm(form, campo.name);
    limparAlerta('#alerta-form');
    window.clearTimeout(temporizador);
    temporizador = window.setTimeout(() => salvarRascunho(lerDados(form)), 400);
  });

  form.addEventListener('focusout', (evento) => {
    const campo = evento.target;
    if (!campo.name || campo.type === 'radio' || campo.type === 'checkbox') return;
    campo.dataset.tocado = 'true';
    validarUm(form, campo.name);
  });

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const dados = lerDados(form);
    const erros = validarFormulario(dados);

    [...CAMPOS, 'perfil', 'aceite'].forEach((nome) => definirErro(form, nome, erros[nome] ?? ''));

    const primeiro = Object.keys(erros)[0];
    if (primeiro) {
      mostrarAlerta('#alerta-form', `Corrija ${Object.keys(erros).length} campo(s) antes de enviar.`, 'erro');
      form.querySelector(`[name="${primeiro}"]`).focus();
      return;
    }

    if (cpfJaCadastrado(dados.cpf)) {
      definirErro(form, 'cpf', 'Este CPF já está cadastrado.');
      mostrarAlerta('#alerta-form', 'Este CPF já possui cadastro.', 'aviso');
      form.elements.cpf.focus();
      return;
    }

    const cpfMascarado = `***.***.${dados.cpf.slice(8)}`;
    const salvo = adicionarCadastro({ ...dados, cpfMascarado });
    if (!salvo) {
      mostrarAlerta('#alerta-form', 'Não foi possível salvar neste navegador. Verifique se o armazenamento está habilitado.', 'erro');
      return;
    }
    limparRascunho();
    mostrarToast(`Cadastro de ${dados.nome.split(' ')[0]} salvo com sucesso!`);
    aoSalvar();
  });
}
