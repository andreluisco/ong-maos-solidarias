# Otimização para produção

Números medidos com `npm run build` e `./scripts/otimizar-imagens.sh` em 23/09/2026.

## Minificação de arquivos (`npm run build`)

Ferramentas: **esbuild** (JavaScript e CSS) e **html-minifier-terser** (HTML). O script `build.mjs` gera a pasta `dist/` mantendo a mesma estrutura de diretórios.

| Arquivo | Original | Minificado | gzip | Redução |
|---|---|---|---|---|
| JavaScript (7 módulos ES → `main.min.js`) | 22,6 KB | 14,3 KB | 5,6 KB | 37% |
| CSS (`reset.css` + `style.css` → `style.min.css`) | 20,5 KB | 14,8 KB | 3,6 KB | 28% |
| HTML (shell da SPA) | 1,8 KB | 1,6 KB | 0,8 KB | 11% |

O que o build faz:

1. **JavaScript:** agrupa (`bundle`) os 7 módulos em um único arquivo, elimina comentários e espaços, encurta nomes locais e gera `main.min.js.map` para depuração. Uma requisição no lugar de sete.
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

## Peso da página inicial (transferência)

| Recurso | Sem otimização | Com otimização |
|---|---|---|
| HTML + CSS + JS | 44,9 KB | 10,0 KB (gzip) |
| Imagem principal | 66,2 KB (JPG) | 16,5 KB (WebP) |
| Logotipo | 41,0 KB (PNG) | 6,3 KB (WebP) |
| **Total aproximado** | **152,1 KB** | **32,8 KB** |

Redução de cerca de 78% no peso inicial (calculado a partir dos tamanhos dos arquivos, sem contar cabeçalhos HTTP).
