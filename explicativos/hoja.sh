#!/bin/bash
# Une los cuadros de prueba en hojas de 3 para revisarlos de un vistazo: hoja.sh <carpeta>
cd "$1/build/cuadros" || exit 1
rm -f hoja_*.png grp_*
ls f*.png | split -l 3 - grp_
for g in grp_*; do
  set -- $(cat $g); n=$#; args=(); fc=""; i=0
  for f in "$@"; do args+=(-i "$f"); fc="$fc[$i:v]scale=600:-1[s$i];"; i=$((i+1)); done
  st=""; for ((k=0;k<n;k++)); do st="$st[s$k]"; done
  ffmpeg -y -v error "${args[@]}" -filter_complex "${fc}${st}hstack=inputs=$n" -frames:v 1 hoja_$g.png
done
ls hoja_*
