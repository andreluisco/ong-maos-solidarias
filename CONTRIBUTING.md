# Guia de contribuição

## Branches (GitFlow)

| Branch | Origem | Destino | Uso |
|---|---|---|---|
| `main` | - | - | Código em produção; cada commit é uma versão com tag `vX.Y.Z` |
| `develop` | `main` | - | Integração das funcionalidades prontas |
| `feature/<assunto>` | `develop` | `develop` | Nova funcionalidade (`feature/formulario-validacao`) |
| `release/<versão>` | `develop` | `main` e `develop` | Preparo de versão: changelog, número de versão e build |
| `hotfix/<versão>` | `main` | `main` e `develop` | Correção urgente em produção |

Regras:

1. Nunca commitar direto em `main` ou `develop`.
2. Mesclar sempre com `git merge --no-ff`, para o histórico mostrar a branch da funcionalidade.
3. Um Pull Request por branch, com o modelo de `.github/PULL_REQUEST_TEMPLATE.md` preenchido.
4. `npm test` e `npm run build` devem passar antes de abrir o PR.

## Commits semânticos (Conventional Commits)

Formato: `tipo(escopo): descrição no imperativo, em português`

| Tipo | Quando usar | Efeito na versão |
|---|---|---|
| `feat` | Nova funcionalidade | minor (1.**1**.0) |
| `fix` | Correção de bug | patch (1.0.**1**) |
| `perf` | Melhoria de desempenho | patch |
| `docs` | Somente documentação | nenhum |
| `test` | Testes | nenhum |
| `build` | Build e dependências | nenhum |
| `chore` | Manutenção sem impacto no código | nenhum |
| `refactor` | Reestruturação sem mudar comportamento | nenhum |

Mudança que quebra compatibilidade: `feat!:` ou rodapé `BREAKING CHANGE:` (major, **2**.0.0).

Exemplos reais do projeto:

```text
feat(validation): regras, máscaras e validação real dos dígitos do CPF
fix(a11y): tabela de cadastros não gera rolagem horizontal da página em 320px
perf(imagens): lazy loading nas imagens abaixo da dobra e fetchpriority na principal
```

## Versionamento (SemVer)

`MAJOR.MINOR.PATCH`. Cada release recebe uma tag anotada (`git tag -a v1.0.0`) e uma entrada em [CHANGELOG.md](CHANGELOG.md).

## Passo a passo de uma funcionalidade

```bash
git checkout develop && git pull
git checkout -b feature/minha-funcionalidade
# ... commits semânticos ...
npm test && npm run build
git push -u origin feature/minha-funcionalidade   # e abrir o Pull Request para develop
```

## Passo a passo de uma release

```bash
git checkout develop && git checkout -b release/1.1.0
# atualizar versão no package.json e CHANGELOG.md, rodar npm test e npm run build
git checkout main && git merge --no-ff release/1.1.0
git tag -a v1.1.0 -m "Versão 1.1.0"
git checkout develop && git merge --no-ff release/1.1.0
```
