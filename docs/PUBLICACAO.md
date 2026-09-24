# Publicação (deploy)

Hospedagem escolhida: **GitHub Pages**, por ser gratuita para repositórios públicos, servir HTTPS, comprimir as respostas (gzip/Brotli) e integrar com GitHub Actions.

## Fluxo

1. A release (ou hotfix) é mesclada em `main` por Pull Request e recebe uma tag `vX.Y.Z` e uma GitHub Release.
2. O push em `main` dispara `.github/workflows/deploy.yml`. O disparo por tag foi abandonado porque o ambiente `github-pages` só aceita deploys da branch `main` e rejeitava a tag (falha observada na v1.0.2).
3. O workflow roda `npm ci`, `npm test` e `npm run build` (se um teste falhar, nada é publicado).
4. A pasta `dist/` é enviada como artefato e publicada no GitHub Pages.

O endereço final segue o padrão `https://<usuário>.github.io/<repositório>/`. A raiz de `dist/` tem um `index.html` que redireciona para `html/index.html`, onde está a SPA.

## Endereço publicado

- Site: https://andreluisco.github.io/ong-maos-solidarias/ (redireciona para `html/index.html`)
- Repositório: https://github.com/andreluisco/ong-maos-solidarias

Verificação feita na URL publicada em 23/09/2026: respostas HTTP 200 com `Content-Encoding: gzip` para HTML, CSS e JS; imagem principal servida em WebP; axe-core com 0 violações nas rotas Início, Projetos, Cadastro e Voluntários; fluxo de cadastro concluído e gravado no `localStorage`; rota `#/Projetos/` (correção da v1.0.1) abrindo a tela de projetos.

## Primeira publicação (uma vez)

```bash
# 1. Criar o repositório remoto e enviar as branches e tags
gh repo create ong-maos-solidarias --public --source=. --remote=origin
git push -u origin main develop
git push origin --tags   # opcional: publica as tags
```

2. No repositório, abrir **Settings > Pages** e escolher **Source: GitHub Actions**.
3. Rodar o workflow manualmente em **Actions > Deploy no GitHub Pages > Run workflow** (ou fazer um push em `main`).

## Publicar uma nova versão

1. Abrir o Pull Request `release/X.Y.Z` para `main` e aguardar o CI.
2. Ao mesclar, o deploy roda sozinho (aba **Actions**).
3. Criar a tag e a Release: `gh release create vX.Y.Z --target main --notes-file <notas>`.
4. Fazer o back-merge de `main` em `develop`.

## Verificação pós-deploy

- Abrir a URL e navegar pelas quatro telas (Início, Projetos, Voluntários, Cadastro).
- Recarregar em uma rota (`#/cadastro`) para confirmar que o roteamento por hash funciona sem configuração no servidor.
- Conferir no DevTools (aba Network) se as imagens WebP são servidas e se o console está sem erros.
- Executar novamente o axe-core na URL publicada.

## Alternativas consideradas

| Opção | Vantagem | Por que não foi a principal |
|---|---|---|
| Netlify / Vercel | Deploy por Pull Request (preview) | Exige criar conta e conectar o repositório fora do GitHub |
| Servidor próprio | Controle total | Custo e manutenção desnecessários para um site estático |
