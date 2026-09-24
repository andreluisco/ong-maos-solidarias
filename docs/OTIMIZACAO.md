# Otimização para produção

Números medidos com `npm run build` e `./scripts/otimizar-imagens.sh` em 23/09/2026.

## Minificação de arquivos (`npm run build`)

Ferramentas: **esbuild** (JavaScript e CSS) e **html-minifier-terser** (HTML). O script `build.mjs` gera a pasta `dist/` mantendo a mesma estrutura de diretórios.

| Arquivo | Original | Minificado | gzip | Redução |
|---|---|---|---|---|
| JavaScript (8 módulos ES → `main.min.js`) | 25,1 KB | 15,3 KB | 6,0 KB | 39% |
| CSS (`reset.css` + `style.css` → `style.min.css`) | 24,2 KB | 17,7 KB | 4,1 KB | 27% |
| HTML (shell da SPA) | 2,2 KB | 2,0 KB | 1,0 KB | 10% |

O que o build faz:

1. **JavaScript:** agrupa (`bundle`) os 8 módulos em um único arquivo, elimina comentários e espaços, encurta nomes locais e gera `main.min.js.map` para depuração. Uma requisição no lugar de oito.
2. **CSS:** junta o reset e os estilos em um arquivo minificado (uma requisição no lugar de duas).
3. **HTML:** remove comentários e espaços e aponta para os arquivos `.min`.
4. **Ativos:** copia `assets/imagens/` para `dist/`.

Verificação: o site de `dist/` foi aberto no navegador e o fluxo completo funcionou (cadastro, validação, gravação no `localStorage`, imagem WebP e lista de projetos), sem erros no console.

A coluna gzip é o tamanho entregue quando a hospedagem comprime as respostas (o GitHub Pages faz isso por padrão); o servidor local de desenvolvimento não comprime.

## Otimização de imagens (`scripts/otimizar-imagens.sh`)

Conversão com `cwebp` (qualidade 80 para ilustrações, 85 para o logotipo).

| Arquivo | Original | WebP | Ganho |
|---|---|---|---|
| `voluntarios-horta.jpg` | 66,2 KB | 16,5 KB | 76% |
| `horta.jpg` | 24,9 KB | 6,0 KB | 77% |
| `reforco.jpg` | 26,0 KB | 5,4 KB | 80% |
| `logo.png` | 41,0 KB | 6,3 KB | 85% |

Práticas aplicadas no HTML gerado pelos templates:

- `<picture>` com `<source type="image/webp">` e `<img>` em JPG como alternativa para navegadores sem suporte.
- `width` e `height` explícitos em todas as imagens, o que reserva o espaço e evita mudança de layout (CLS).
- `loading="lazy"` nas imagens abaixo da dobra (cartões de projeto); a imagem principal usa `fetchpriority="high"`.
- `decoding="async"` para não bloquear a renderização.
- Texto alternativo descritivo nas imagens de conteúdo e `alt=""` no logotipo do cabeçalho (o link já tem texto).
- Versão vetorial `logo.svg` (0,8 KB) disponível para usos escaláveis.

## Imagens responsivas (`srcset` e `sizes`)

Cada imagem WebP existe em mais de uma largura, e o `<source>` informa as larguras (`srcset` com descritores `w`) e o espaço que a imagem ocupa na tela (`sizes`). O navegador escolhe o menor arquivo que ainda fica nítido para a largura da janela e a densidade de pixels da tela.

| Imagem | Larguras (WebP) | Espaço na tela (`sizes`) |
|---|---|---|
| Principal (`voluntarios-horta`) | 640w (7,8 KB) e 1280w (16,5 KB) | 750px a partir de 1024px; abaixo disso, largura da janela menos 2rem |
| Cartões (`horta`, `reforco`) | 320w (3,1 e 2,9 KB) e 640w (6,0 e 5,4 KB) | 45% da janela a partir de 768px; abaixo disso, largura da janela menos 2rem |

Como foi verificado: em um `<img>` de teste com o cache limpo, o Chrome escolheu o arquivo de 640w para espaços de até 640px e o de 1280w a partir de 700px, com densidade 1x. Em telas 2x (a maioria dos celulares) um espaço de 343px precisa de 686px reais, então o navegador pede a versão maior; a versão menor beneficia telas 1x e janelas estreitas. O `test(imagens)` garante que todo arquivo citado existe em `assets/imagens/`.

Observação: o navegador pode reutilizar uma imagem que já esteja no cache, mesmo que outro tamanho fosse o ideal (permitido pela especificação); por isso medi com URLs novas.

Limite conhecido: não há versões 2x e 3x dedicadas para celulares de alta densidade além dos 1280w e 640w já existentes.

## Peso da página inicial (transferência)

| Recurso | Sem otimização | Com otimização |
|---|---|---|
| HTML + CSS + JS | 51,5 KB | 11,1 KB (gzip) |
| Imagem principal | 66,2 KB (JPG) | 16,5 KB (WebP) |
| Logotipo | 41,0 KB (PNG) | 6,3 KB (WebP) |
| **Total aproximado** | **158,7 KB** | **33,9 KB** |

Redução de cerca de 79% no peso inicial (calculado a partir dos tamanhos dos arquivos, sem contar cabeçalhos HTTP). Em janela de até 640px com densidade 1x, a imagem principal cai para 7,8 KB e o total para cerca de 25,2 KB (redução de 84%).
