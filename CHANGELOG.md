# Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).

## [1.0.3] - 2026-09-24

### Corrigido

- Deploy no GitHub Pages: o workflow disparado por tag (`v*`) falhava na v1.0.2 porque o ambiente `github-pages` só aceita deploys da branch `main`. O deploy agora dispara em push na `main` (merge de release ou hotfix). Documentação atualizada.

## [1.0.2] - 2026-09-24

### Adicionado

- Dependabot semanal para dependências npm e versões das GitHub Actions, com PRs abertos contra `develop` (#2).
- Workflow de CI executável manualmente (`workflow_dispatch`) (#3).

### Alterado

- README com link da demonstração online, URL de clone e selo do CI; `docs/PUBLICACAO.md` com o endereço publicado e a verificação pós-deploy (#1).

## [1.0.1] - 2026-09-23

### Corrigido

- Roteador: endereços com barra final ou maiúsculas (`#/projetos/`, `#/Projetos`) abriam a página 404. Agora são normalizados para a rota correta. Teste de regressão adicionado (9 testes no total).

## [1.0.0] - 2026-09-23

Primeira versão publicável da plataforma.

### Adicionado

- **Design system** com 12 cores, 6 tamanhos tipográficos e escala de espaçamentos em variáveis CSS; reset e estilos base.
- **Layout responsivo:** grade de 12 colunas e cinco breakpoints (480, 768, 1024, 1280 e 1536 px), menu hambúrguer e dropdown sem JavaScript.
- **Componentes:** cartões, badges, alertas, toasts, modal, tabela e formulário com estados de foco, erro e sucesso.
- **SPA em JavaScript puro:** roteador por hash, sistema de templates com escape automático (proteção contra XSS) e telas Início, Projetos, Cadastro, Voluntários e 404.
- **Formulário de cadastro** com máscaras (CPF, telefone, CEP), validação em tempo real, validação real dos dígitos do CPF e verificação de CPF duplicado.
- **Persistência** no `localStorage` (cadastros e rascunho automático) com tratamento de JSON corrompido e armazenamento bloqueado.
- **Testes automatizados** (`node --test`): 6 testes de validação e templates.
- **Acessibilidade WCAG 2.1 AA:** link para pular ao conteúdo, foco gerenciado, anúncio de mudança de tela, `autocomplete`, contraste verificado, suporte a `forced-colors` e `prefers-reduced-motion`. Relatório em `docs/ACESSIBILIDADE.md`.
- **Build de produção** (`npm run build`): JS -37%, CSS -28%, HTML -11%.
- **Imagens otimizadas:** WebP com alternativa em JPG (ganho de 76% a 85%), `loading="lazy"` e `fetchpriority`.
- **Documentação e automação:** README, guia de contribuição (GitFlow e commits semânticos), modelo de Pull Request, workflows de CI e de deploy no GitHub Pages.

### Corrigido

- Rolagem horizontal em 320px na tela de cadastros salvos (WCAG 1.4.10).
- Contraste de bordas de campos (1,53:1) e do anel de foco (1,68:1), agora acima de 4,5:1 (WCAG 1.4.11).
- Campos com erro exibidos com borda verde por conflito de especificidade CSS.
- Toasts lidos duas vezes por leitores de tela.

[1.0.0]: https://keepachangelog.com/pt-BR/1.1.0/
