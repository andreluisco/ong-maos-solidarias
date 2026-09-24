# Acessibilidade (WCAG 2.1 nível AA)

Documento de conformidade da plataforma Mãos Solidárias. Cada item indica o critério, como foi verificado e o resultado.
Data da auditoria: 23/09/2026. Versão auditada: `develop` antes da release 1.0.0.

## Como foi testado

| Verificação | Ferramenta / método |
|---|---|
| Regras automáticas WCAG 2.0/2.1 A e AA + boas práticas | axe-core 4.13 executado no navegador, em todas as rotas da SPA (`#/`, `#/projetos`, `#/cadastro`, `#/voluntarios` e rota 404) |
| Marcação válida | W3C Nu Html Checker (0 erros, 0 avisos) |
| CSS válido | W3C CSS Validator (0 erros) |
| Reflow | Medição de `scrollWidth` x `innerWidth` em iframes de 320, 375 e 768 px nas 5 rotas (15 combinações) |
| Contraste | Razão de luminância (fórmula WCAG) para cada par de cores dos tokens |
| Ordem de tabulação | Lista dos elementos focáveis na ordem do DOM (sem `tabindex` positivo) |
| Mudança de rota | Leitura do conteúdo da região `role="status"` a cada navegação |

Limitação declarada: ferramentas automáticas cobrem só parte do WCAG. Não foi feito teste com leitor de tela real (NVDA, VoiceOver) nem com usuários; recomenda-se como próxima etapa.

## Problemas encontrados e corrigidos

| # | Problema | Critério WCAG | Correção |
|---|---|---|---|
| 1 | `#/voluntarios` gerava rolagem horizontal em 320px (documento com 533px). O texto `.sr-only` (position: absolute) escapava do contêiner rolável. | 1.4.10 Reflow | `.tabela-rolavel { position: relative }` |
| 2 | A troca de tela na SPA não era anunciada a leitores de tela. | 4.1.3 Mensagens de status | Região `role="status"` atualizada com o título a cada rota |
| 3 | Campos sem tokens de `autocomplete` (telefone, nascimento, estado). | 1.3.5 Finalidade da entrada | `tel`, `bday` e `address-level1` |
| 4 | Toasts eram lidos duas vezes (contêiner live + `role="status"`). | 4.1.3 | `role="alert"` apenas nos erros |
| 5 | Borda de campos com 1,53:1 e anel de foco âmbar com 1,68:1. | 1.4.11 Contraste não textual, 2.4.7 | Tokens `--cor-borda-forte` (4,6:1) e `--cor-foco` (6,2:1) |
| 6 | Sem tratamento para o modo de alto contraste do sistema. | 1.4.11 / 1.4.1 | `@media (forced-colors: active)` |
| 7 | Sem opção de tema escuro para quem prefere ou precisa de menos brilho (baixa visão, fotossensibilidade). | 1.4.3 / 1.4.11 (adaptável) | Tema escuro automático (`prefers-color-scheme`) e botão de alternância, com contraste verificado |

## Navegação (operabilidade e compreensão)

| Critério | Como é atendido |
|---|---|
| 2.1.1 Teclado | Todos os controles são links, botões ou campos nativos. O menu mobile usa um checkbox real (focável e acionável com Espaço). O dropdown abre com `:focus-within`. |
| 2.4.1 Ignorar blocos | Link "Pular para o conteúdo" como primeiro elemento focável; `<main id="app" tabindex="-1">` recebe o foco. |
| 2.4.2 Título da página | `document.title` atualizado a cada rota ("Cadastro \| Mãos Solidárias"). |
| 2.4.3 Ordem do foco | Ordem lógica: skip link, marca, menu, conteúdo. Foco movido para o `<main>` a cada rota. Sem `tabindex` positivo. |
| 2.4.4 / 2.4.6 Propósito do link e títulos | Links descritivos; hierarquia h1 > h2 sem saltos; um `<h1>` por tela. |
| 2.4.7 Foco visível | `:focus-visible` com anel de 3px em `--cor-foco`. |
| 3.2.3 Navegação consistente | Mesmo cabeçalho e menu em todas as telas. |
| 1.3.1 / 4.1.2 Estrutura e nome | Landmarks (`header`, `nav`, `main`, `footer`), `aria-current="page"`, `label` ligado a cada campo, `fieldset`/`legend`, `caption` e `scope` na tabela. |
| 3.3.1 / 3.3.3 Erros | Mensagem em texto abaixo do campo (`role="alert"`, `aria-describedby`) com instrução de correção; estado em `aria-invalid`. |
| 1.4.4 / 1.4.12 Redimensionar e espaçamento | Unidades `rem` e `line-height` relativo; sem alturas fixas em texto. |
| 2.3.3 / 2.2.2 Movimento | `prefers-reduced-motion` desativa transições e animações. |

## Contraste visual

Fórmula WCAG 2.x aplicada aos tokens do design system (`assets/css/style.css`).

| Elemento | Cor | Fundo | Razão | Mínimo | Critério | Resultado |
|---|---|---|---|---|---|---|
| Texto principal | `#1f2933` | `#f7faf8` | 14.04:1 | 4.5:1 | 1.4.3 | aprovado |
| Texto suave (rodapé, legendas) | `#52606d` | `#f7faf8` | 6.14:1 | 4.5:1 | 1.4.3 | aprovado |
| Título h2 | `#14603a` | `#f7faf8` | 7.23:1 | 4.5:1 | 1.4.3 | aprovado |
| Link | `#1c5fa8` | `#f7faf8` | 6.15:1 | 4.5:1 | 1.4.3 | aprovado |
| Botão | `#ffffff` | `#1b7f4c` | 5.02:1 | 4.5:1 | 1.4.3 | aprovado |
| Botão :hover | `#ffffff` | `#14603a` | 7.60:1 | 4.5:1 | 1.4.3 | aprovado |
| Menu ativo | `#ffffff` | `#1b7f4c` | 5.02:1 | 4.5:1 | 1.4.3 | aprovado |
| Menu :hover | `#14603a` | `#e3f4ea` | 6.66:1 | 4.5:1 | 1.4.3 | aprovado |
| Cabeçalho da tabela | `#ffffff` | `#14603a` | 7.60:1 | 4.5:1 | 1.4.3 | aprovado |
| Mensagem de erro | `#b42318` | `#ffffff` | 6.57:1 | 4.5:1 | 1.4.3 | aprovado |
| Toast (texto) | `#ffffff` | `#1f2933` | 14.76:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge sucesso | `#0b4a2b` | `#d3f0df` | 8.53:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge info | `#123f73` | `#d6e6f7` | 8.33:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge aviso | `#5c3d00` | `#fbe5b0` | 7.98:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge erro | `#7a1a12` | `#f8d7d3` | 7.89:1 | 4.5:1 | 1.4.3 | aprovado |
| Borda de input/select | `#6b7785` | `#ffffff` | 4.56:1 | 3.0:1 | 1.4.11 | aprovado |
| Borda de input/select sobre fundo de erro | `#6b7785` | `#fdf2f1` | 4.16:1 | 3.0:1 | 1.4.11 | aprovado |
| Anel de foco | `#1c5fa8` | `#f7faf8` | 6.15:1 | 3.0:1 | 1.4.11 / 2.4.7 | aprovado |
| Botão fechar do toast | `#f4b942` | `#1f2933` | 8.34:1 | 3.0:1 | 1.4.11 | aprovado |
| Ícone do menu hambúrguer | `#1f2933` | `#f7faf8` | 14.04:1 | 3.0:1 | 1.4.11 | aprovado |

A menor razão de texto do projeto é 5.02:1 (botões e item de menu ativo).

## Tema escuro e alto contraste

Estratégia de cores (`assets/css/style.css`, seção 13):

- Todas as cores são variáveis CSS (`--cor-texto`, `--cor-fundo`, `--alerta-*`, `--badge-*`, `--toast-*`). O tema escuro só redefine esses valores; nenhuma regra de componente precisa mudar.
- O tema segue a preferência do sistema com `@media (prefers-color-scheme: dark)`. O botão **Modo escuro** (no menu, com `aria-pressed`) permite escolher o contrário: grava `data-tema="claro"` ou `"escuro"` no `<html>` e a escolha fica no `localStorage`.
- `color-scheme: light` / `dark` faz o navegador ajustar controles nativos e barras de rolagem. Um script inline no `<head>` aplica o tema salvo antes da primeira pintura, evitando o flash de tema errado.
- Texto sobre fundos coloridos (botões, cabeçalho de tabela, ícones de alerta) usa cores fixas (`--cor-sobre-cor: #ffffff`), para não depender do tema.
- Alto contraste do sistema: `@media (forced-colors: active)` garante bordas, ícones e o estado do botão de tema.

Razões de contraste do tema escuro (fórmula WCAG 2.x):

| Elemento | Cor | Fundo | Razão | Mínimo | Critério | Resultado |
|---|---|---|---|---|---|---|
| Texto principal | `#e8edf2` | `#10161b` | 15.47:1 | 4.5:1 | 1.4.3 | aprovado |
| Texto principal sobre superfície (cartões) | `#e8edf2` | `#1a222a` | 13.65:1 | 4.5:1 | 1.4.3 | aprovado |
| Texto suave | `#a7b3bf` | `#10161b` | 8.54:1 | 4.5:1 | 1.4.3 | aprovado |
| Título h2 | `#7bd7a4` | `#10161b` | 10.50:1 | 4.5:1 | 1.4.3 | aprovado |
| Link | `#86b8f2` | `#10161b` | 8.81:1 | 4.5:1 | 1.4.3 | aprovado |
| Mensagem de erro | `#ff9d94` | `#1a222a` | 8.04:1 | 4.5:1 | 1.4.3 | aprovado |
| Botão (texto branco) | `#ffffff` | `#1b7f4c` | 5.02:1 | 4.5:1 | 1.4.3 | aprovado |
| Cabeçalho da tabela | `#ffffff` | `#14603a` | 7.60:1 | 4.5:1 | 1.4.3 | aprovado |
| Menu :hover | `#7bd7a4` | `#1d3a2c` | 7.14:1 | 4.5:1 | 1.4.3 | aprovado |
| Toast (texto) | `#f2f5f8` | `#2b3742` | 11.11:1 | 4.5:1 | 1.4.3 | aprovado |
| Alerta sucesso | `#e8edf2` | `#12281d` | 13.23:1 | 4.5:1 | 1.4.3 | aprovado |
| Alerta info | `#e8edf2` | `#122338` | 13.47:1 | 4.5:1 | 1.4.3 | aprovado |
| Alerta aviso | `#e8edf2` | `#332a10` | 12.05:1 | 4.5:1 | 1.4.3 | aprovado |
| Alerta erro | `#e8edf2` | `#331715` | 13.99:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge sucesso | `#a8e6c3` | `#12352a` | 9.42:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge info | `#a9cdf5` | `#14304f` | 8.14:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge aviso | `#f2d488` | `#3d2f0a` | 9.04:1 | 4.5:1 | 1.4.3 | aprovado |
| Badge erro | `#f5b5ae` | `#4a1a16` | 8.34:1 | 4.5:1 | 1.4.3 | aprovado |
| Borda de input/select | `#8593a1` | `#1a222a` | 5.12:1 | 3.0:1 | 1.4.11 | aprovado |
| Anel de foco | `#86b8f2` | `#10161b` | 8.81:1 | 3.0:1 | 1.4.11 / 2.4.7 | aprovado |
| Botão fechar do toast | `#f4b942` | `#2b3742` | 6.87:1 | 3.0:1 | 1.4.11 | aprovado |

A menor razão de texto no tema escuro é 5.02:1 (botões com texto branco, iguais nos dois temas).

Verificação no navegador (axe-core 4.13, regras WCAG 2.0/2.1 A e AA): 0 violações nas telas Início, Projetos e Voluntários, nos dois temas, e também com amostras de todos os componentes visíveis (badges, quatro alertas, texto de erro, botões nos estados normal, desativado, perigo, secundário e pressionado, tabela, links e três toasts).

Nota sobre o método: a primeira rodada acusou `color-contrast` nos links do menu (1,23:1). Era um artefato: a aba de teste estava em segundo plano e as transições CSS de 0,2 s não avançam nesse estado, então o axe leu a cor de origem. Com as transições desativadas durante a medição, o resultado é 0 violação. O erro `region` que aparece nas medições vem do indicador injetado pela extensão do navegador de teste, não do site.

## Pendências e riscos conhecidos

- Teste manual com leitor de tela e com ampliação de 400% ainda não realizado.
- `main:focus` remove o contorno porque o foco no `<main>` é programático (não interativo).
- Os dados do formulário ficam no `localStorage` apenas para demonstração.
