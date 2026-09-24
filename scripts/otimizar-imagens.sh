#!/usr/bin/env bash
# Gera versões WebP (cwebp) em várias larguras e mostra o ganho de peso.
# Uso: ./scripts/otimizar-imagens.sh
# Larguras: imagem principal 640w e 1280w; cartões 320w e 640w. O JPG/PNG continua como alternativa.
set -euo pipefail
cd "$(dirname "$0")/../assets/imagens"

# Imagem principal (origem 1280 px) e cartões (origem 640 px)
cwebp -quiet -q 80 voluntarios-horta.jpg -o voluntarios-horta.webp                  # 1280w
cwebp -quiet -q 80 -resize 640 0 voluntarios-horta.jpg -o voluntarios-horta-640.webp
for base in horta reforco; do
  cwebp -quiet -q 80 "$base.jpg" -o "$base.webp"                                    # 640w
  cwebp -quiet -q 80 -resize 320 0 "$base.jpg" -o "$base-320.webp"
done
cwebp -quiet -q 85 logo.png -o logo.webp

printf '%-30s %10s\n' Arquivo Tamanho
for f in voluntarios-horta.jpg voluntarios-horta.webp voluntarios-horta-640.webp horta.jpg horta.webp horta-320.webp reforco.jpg reforco.webp reforco-320.webp logo.png logo.webp; do
  printf '%-30s %7.1f KB\n' "$f" "$(echo "$(wc -c < "$f")/1024" | bc -l)"
done
