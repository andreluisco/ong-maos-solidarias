# Mãos Solidárias

[![CI](https://github.com/andreluisco/ong-maos-solidarias/actions/workflows/ci.yml/badge.svg)](https://github.com/andreluisco/ong-maos-solidarias/actions/workflows/ci.yml)

**Demonstração online:** https://andreluisco.github.io/ong-maos-solidarias/ (publicado no GitHub Pages)

Plataforma web da ONG **Mãos Solidárias**: apresenta os projetos sociais, recebe cadastros de voluntários e doadores e funciona como uma **SPA (Single Page Application)** em JavaScript puro, sem frameworks.

Projeto acadêmico da disciplina *Desenvolvimento Front-End para Web* (Experiências Práticas 1 a 4).

## Funcionalidades

- Navegação sem recarregar a página (roteador por hash) com título e foco atualizados a cada tela.
- Formulário de cadastro com máscaras (CPF, telefone, CEP), validação em tempo real e validação real dos dígitos do CPF.
- Rascunho salvo automaticamente e cadastros persistidos no `localStorage`.
- Design system com variáveis CSS, grade de 12 colunas e 5 breakpoints (480, 768, 1024, 1280 e 1536 px).
- Acessibilidade WCAG 2.1 AA (ver [docs/ACESSIBILIDADE.md](docs/ACESSIBILIDADE.md)).
- Imagens em WebP com alternativa em JPG e build de produção minificado (ver [docs/OTIMIZACAO.md](docs/OTIMIZACAO.md)).

## Tecnologias

HTML5 semântico, CSS3 (Grid, Flexbox, variáveis), JavaScript ES2022 com módulos nativos. Ferramentas de desenvolvimento: Node.js 20+, esbuild e html-minifier-terser (somente no build).

## Estrutura de pastas

```text
ong-maos-solidarias/
├── html/
│   └── index.html            shell da SPA
├── assets/
│   ├── css/                  reset.css e style.css (design system, grid, componentes)
│   ├── imagens/              PNG, JPG, WebP e SVG
│   └── js/
│       ├── main.js           ponto de entrada
│       └── modules/          router, templates, validation, storage, ui, formulario
├── docs/                     ACESSIBILIDADE.md e OTIMIZACAO.md
├── scripts/                  otimizar-imagens.sh
├── build.mjs                 build de produção (gera dist/)
├── teste-validacao.mjs       testes automatizados
└── package.json
```

## Como executar

Requisitos: Node.js 20 ou superior e Python 3 (servidor estático).

```bash
git clone https://github.com/andreluisco/ong-maos-solidarias.git
cd ong-maos-solidarias
npm install
npm run serve            # http://localhost:8080/html/index.html
```

Módulos ES exigem HTTP: abrir o arquivo com `file://` não funciona.

## Scripts

| Comando | O que faz |
|---|---|
| `npm test` | Executa os testes de validação e do sistema de templates (`node --test`) |
| `npm run build` | Gera `dist/` com JS, CSS e HTML minificados |
| `npm run preview` | Serve a pasta `dist/` em http://localhost:8081/html/index.html |
| `npm run serve` | Serve o código-fonte para desenvolvimento |

## Arquitetura

Um módulo por responsabilidade, com dependências em uma só direção:

```text
main.js ──> router.js
        ──> templates.js
        ──> formulario.js ──> validation.js (funções puras)
        │                 ──> storage.js    (localStorage)
        │                 ──> ui.js ──> templates.js (escapar)
        ──> storage.js, ui.js
```

- **router.js:** mapa de rotas, leitura de `location.hash` e renderização em `<main id="app">`.
- **templates.js:** função de tag `html` que escapa os valores interpolados (proteção contra XSS) e as telas.
- **validation.js:** máscaras e regras sem acesso ao DOM, por isso testáveis.
- **storage.js:** único módulo que conhece as chaves do `localStorage`; sempre com `try/catch`.
- **ui.js:** toasts, alertas, região live de anúncio de rota e destaque do menu.
- **formulario.js:** eventos do formulário (`input`, `focusout`, `submit`).

## Testes

```bash
npm test
```

6 testes cobrem: CPF válido/inválido, máscaras, regras por campo, cálculo de idade, formulário completo e escape de HTML nos templates. A interface foi verificada no navegador (fluxo completo, `localStorage` corrompido, tentativa de XSS e rota inexistente) e com o axe-core (0 violações nas 5 rotas).

## Fluxo de trabalho (GitFlow)

- `main`: somente versões publicadas, cada uma com uma tag `vX.Y.Z`.
- `develop`: integração contínua das funcionalidades.
- `feature/*`: uma branch por funcionalidade, criada a partir de `develop`.
- `release/*`: preparação de versão (changelog, versão, build), a partir de `develop`.
- `hotfix/*`: correção urgente a partir de `main`, mesclada em `main` e `develop`.

Detalhes e convenção de commits em [CONTRIBUTING.md](CONTRIBUTING.md). Histórico de versões em [CHANGELOG.md](CHANGELOG.md).

## Publicação

O workflow `.github/workflows/deploy.yml` executa testes, gera o `dist/` e publica no GitHub Pages a cada push em `main` (ou seja, a cada merge de release ou hotfix). Passo a passo em [docs/PUBLICACAO.md](docs/PUBLICACAO.md).

## Aviso sobre dados pessoais

Os cadastros ficam apenas no navegador de quem os preenche (`localStorage`) e servem para demonstração. Em produção, os dados deveriam ir para um back-end com autenticação, criptografia e consentimento formal (LGPD).
