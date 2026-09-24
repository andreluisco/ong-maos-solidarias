# Publicação (deploy)

Hospedagem escolhida: **GitHub Pages**, por ser gratuita para repositórios públicos, servir HTTPS, comprimir as respostas (gzip/Brotli) e integrar com GitHub Actions.

## Fluxo

1. A release é mesclada em `main` e recebe uma tag `vX.Y.Z`.
2. O envio da tag dispara `.github/workflows/deploy.yml`.
3. O workflow roda `npm ci`, `npm test` e `npm run build` (se um teste falhar, nada é publicado).
4. A pasta `dist/` é enviada como artefato e publicada no GitHub Pages.

O endereço final segue o padrão `https://<usuário>.github.io/<repositório>/`. A raiz de `dist/` tem um `index.html` que redireciona para `html/index.html`, onde está a SPA.

## Primeira publicação (uma vez)

```bash
# 1. Criar o repositório remoto e enviar as branches e tags
gh repo create ong-maos-solidarias --public --source=. --remote=origin
git push -u origin main develop
git push origin --tags
```

2. No repositório, abrir **Settings > Pages** e escolher **Source: GitHub Actions**.
3. Reenviar a tag (ou rodar o workflow manualmente em **Actions > Deploy no GitHub Pages > Run workflow**).

## Publicar uma nova versão

```bash
git checkout main && git pull
git tag -a v1.1.0 -m "Versão 1.1.0"
git push origin v1.1.0
```

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
