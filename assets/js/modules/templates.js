/**
 * Sistema de templates: a função de tag `html` monta o HTML com template
 * literals e ESCAPA automaticamente os valores interpolados (proteção contra
 * XSS). Para inserir HTML já seguro (outro template), ele é reconhecido pela
 * classe Seguro e não é escapado de novo.
 */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

class Seguro {
  constructor(texto) {
    this.texto = texto;
  }
  toString() {
    return this.texto;
  }
}

export const escapar = (valor) => String(valor).replace(/[&<>"']/g, (c) => ESCAPES[c]);

function converter(valor) {
  if (valor === null || valor === undefined || valor === false) return '';
  if (valor instanceof Seguro) return String(valor);
  if (Array.isArray(valor)) return valor.map(converter).join('');
  return escapar(valor);
}

export function html(partes, ...valores) {
  let saida = partes[0];
  valores.forEach((valor, i) => {
    saida += converter(valor) + partes[i + 1];
  });
  return new Seguro(saida);
}

/* ---------- Dados de exemplo ---------- */
export const PROJETOS = [
  { id: 'horta', titulo: 'Horta Comunitária', imagem: 'horta', alt: 'Canteiros de hortaliças cuidados por moradores', texto: 'Alimento saudável e renda para 40 famílias do bairro.', status: 'Vagas abertas', tipo: 'sucesso' },
  { id: 'reforco', titulo: 'Reforço Escolar', imagem: 'reforco', alt: 'Crianças estudando com uma voluntária', texto: 'Aulas de apoio para 120 crianças, três vezes por semana.', status: 'Últimas vagas', tipo: 'aviso' },
];

export const UFS = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'], ['CE', 'Ceará'],
  ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'],
  ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'], ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'],
  ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'],
  ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'],
  ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
];

const img = (nome, alt, largura, altura) => html`
  <picture>
    <source srcset="../assets/imagens/${nome}.webp" type="image/webp">
    <img src="../assets/imagens/${nome}.jpg" alt="${alt}" width="${largura}" height="${altura}">
  </picture>`;

/* ---------- Componentes reutilizáveis ---------- */
function campo({ id, rotulo, tipo = 'text', valor = '', extra = '', dica = '' }) {
  return html`
    <div class="campo">
      <label for="${id}">${rotulo}</label>
      <input type="${tipo}" id="${id}" name="${id}" value="${valor}" aria-describedby="erro-${id}" ${new Seguro(extra)}>
      ${dica ? html`<small id="dica-${id}">${dica}</small>` : ''}
      <p class="erro" id="erro-${id}" role="alert"></p>
    </div>`;
}

/* ---------- Telas ---------- */
export function home() {
  return html`
    <div class="grid">
      <section class="col-12 col-lg-8" aria-labelledby="titulo-missao">
        <h1 id="titulo-missao">Transformando vidas com solidariedade</h1>
        <figure>
          ${img('voluntarios-horta', 'Voluntários plantando mudas em uma horta comunitária', 640, 360)}
          <figcaption>Mutirão da horta comunitária, 2025.</figcaption>
        </figure>
        <p>Transformamos vidas por meio de educação, alimentação e cidadania para famílias em situação de vulnerabilidade.</p>
        <p><a class="btn" href="#/cadastro">Quero ser voluntário</a></p>
      </section>
      <section class="col-12 col-lg-4" aria-labelledby="titulo-impacto">
        <h2 id="titulo-impacto">Nosso impacto</h2>
        <ul>
          <li>+1.200 famílias atendidas</li>
          <li>85 voluntários ativos</li>
          <li>12 bairros alcançados</li>
        </ul>
      </section>
    </div>`;
}

export function projetos() {
  return html`
    <section aria-labelledby="titulo-projetos">
      <h1 id="titulo-projetos">Projetos sociais</h1>
      <ul class="lista-cartoes grid">
        ${PROJETOS.map((p) => html`
          <li class="col-12 col-md-6">
            <article>
              <h2>${p.titulo}</h2>
              ${img(p.imagem, p.alt, 320, 180)}
              <p><span class="badge badge-${p.tipo}">${p.status}</span> ${p.texto}</p>
            </article>
          </li>`)}
      </ul>
    </section>`;
}

export function cadastro(rascunho = {}) {
  const sel = (uf) => (rascunho.uf === uf ? 'selected' : '');
  const marcado = (v) => (rascunho.perfil === v ? 'checked' : '');
  return html`
    <section aria-labelledby="titulo-cadastro">
      <h1 id="titulo-cadastro">Cadastro de voluntários e doadores</h1>
      <div id="alerta-form" role="status"></div>
      <form id="form-cadastro" novalidate>
        <fieldset>
          <legend>Dados pessoais</legend>
          ${campo({ id: 'nome', rotulo: 'Nome completo', valor: rascunho.nome ?? '', extra: 'autocomplete="name" required' })}
          ${campo({ id: 'email', rotulo: 'E-mail', tipo: 'email', valor: rascunho.email ?? '', extra: 'autocomplete="email" required' })}
          ${campo({ id: 'cpf', rotulo: 'CPF', valor: rascunho.cpf ?? '', extra: 'inputmode="numeric" maxlength="14" placeholder="000.000.000-00" data-mascara="cpf" required' })}
          ${campo({ id: 'telefone', rotulo: 'Telefone', tipo: 'tel', valor: rascunho.telefone ?? '', extra: 'maxlength="15" placeholder="(00) 00000-0000" data-mascara="telefone" required' })}
          ${campo({ id: 'nascimento', rotulo: 'Data de nascimento', tipo: 'date', valor: rascunho.nascimento ?? '', extra: 'required' })}
        </fieldset>
        <fieldset>
          <legend>Endereço</legend>
          ${campo({ id: 'cep', rotulo: 'CEP', valor: rascunho.cep ?? '', extra: 'inputmode="numeric" maxlength="9" placeholder="00000-000" autocomplete="postal-code" data-mascara="cep" required' })}
          ${campo({ id: 'cidade', rotulo: 'Cidade', valor: rascunho.cidade ?? '', extra: 'autocomplete="address-level2" required' })}
          <div class="campo">
            <label for="uf">Estado</label>
            <select id="uf" name="uf" aria-describedby="erro-uf" required>
              <option value="">Selecione</option>
              ${UFS.map(([sigla, nome]) => html`<option value="${sigla}" ${new Seguro(sel(sigla))}>${nome}</option>`)}
            </select>
            <p class="erro" id="erro-uf" role="alert"></p>
          </div>
        </fieldset>
        <fieldset>
          <legend>Perfil de colaborador</legend>
          <p class="opcoes">
            <input type="radio" id="doador" name="perfil" value="doador" ${new Seguro(marcado('doador'))}>
            <label for="doador">Doador</label>
            <input type="radio" id="voluntario" name="perfil" value="voluntario" ${new Seguro(marcado('voluntario'))}>
            <label for="voluntario">Voluntário</label>
          </p>
          <p class="erro" id="erro-perfil" role="alert"></p>
          <p class="opcoes">
            <input type="checkbox" id="aceite" name="aceite" ${new Seguro(rascunho.aceite ? 'checked' : '')}>
            <label for="aceite">Concordo com o uso dos meus dados para contato (LGPD).</label>
          </p>
          <p class="erro" id="erro-aceite" role="alert"></p>
        </fieldset>
        <button type="submit">Enviar cadastro</button>
      </form>
    </section>`;
}

export function voluntarios(lista = []) {
  return html`
    <section aria-labelledby="titulo-voluntarios">
      <h1 id="titulo-voluntarios">Cadastros recebidos</h1>
      ${lista.length === 0
        ? html`<p class="alerta alerta-info">Nenhum cadastro salvo ainda. <a href="#/cadastro">Faça o primeiro cadastro</a>.</p>`
        : html`
          <p>${lista.length} ${lista.length === 1 ? 'cadastro salvo' : 'cadastros salvos'} neste navegador.</p>
          <div class="tabela-rolavel">
            <table>
              <caption>Cadastros armazenados no localStorage</caption>
              <thead><tr><th scope="col">Nome</th><th scope="col">Perfil</th><th scope="col">Cidade/UF</th><th scope="col">CPF</th><th scope="col"><span class="sr-only">Ações</span></th></tr></thead>
              <tbody>
                ${lista.map((c) => html`
                  <tr>
                    <th scope="row">${c.nome}</th>
                    <td>${c.perfil === 'doador' ? 'Doador' : 'Voluntário'}</td>
                    <td>${c.cidade}/${c.uf}</td>
                    <td>${c.cpfMascarado}</td>
                    <td><button type="button" class="btn-perigo" data-remover="${c.id}">Remover<span class="sr-only"> ${c.nome}</span></button></td>
                  </tr>`)}
              </tbody>
            </table>
          </div>`}
    </section>`;
}

export function naoEncontrada() {
  return html`
    <section aria-labelledby="titulo-404">
      <h1 id="titulo-404">Página não encontrada</h1>
      <p class="alerta alerta-erro">O endereço que você acessou não existe. <a href="#/">Voltar ao início</a>.</p>
    </section>`;
}
