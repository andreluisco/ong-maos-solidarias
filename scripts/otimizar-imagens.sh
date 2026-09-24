#!/usr/bin/env bash
# Gera versões WebP (cwebp) e mostra o ganho de peso em relação ao JPG/PNG de origem.
# Uso: ./scripts/otimizar-imagens.sh
set -euo pipefail
cd "$(dirname "$0")/../assets/imagens"

for jpg in *.jpg; do cwebp -quiet -q 80 "$jpg" -o "${jpg%.jpg}.webp"; done
cwebp -quiet -q 85 logo.png -o logo.webp

printf '%-28s %10s %10s %8s\n' Arquivo Original WebP Ganho
for base in voluntarios-horta horta reforco; do
  o=$(wc -c < "$base.jpg"); w=$(wc -c < "$base.webp")
  printf '%-28s %8.1f KB %7.1f KB %7d%%\n' "$base.jpg" "$(echo "$o/1024" | bc -l)" "$(echo "$w/1024" | bc -l)" "$(echo "100-100*$w/$o" | bc)"
done
o=$(wc -c < logo.png); w=$(wc -c < logo.webp)
printf '%-28s %8.1f KB %7.1f KB %7d%%\n' logo.png "$(echo "$o/1024" | bc -l)" "$(echo "$w/1024" | bc -l)" "$(echo "100-100*$w/$o" | bc)"
