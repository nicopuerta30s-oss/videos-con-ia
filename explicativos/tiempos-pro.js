// Tiempos y sonidos del diseño «pro» (estilo claro con escenas de interfaz). Compartido por Remotion y Node.
export const mkW = (fr) => (i, n) => {
  const p = fr[i].palabras
  return p[Math.max(0, Math.min(n, p.length - 1))].t0
}

// Inicio de cada escena: justo antes de que arranque su primera frase
export const inicios = (fr, grupos, trans = []) => grupos.map((g, i) => (i === 0 ? 0 : fr[g.ids[0]].ini - (trans.includes(i) ? 0.02 : 0.14)))

// Sonidos: [segundo, tipo, volumen]
export function sonidosPro(fr, grupos, trans) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  inicios(fr, grupos, trans).forEach((t, i) => i > 0 && p(t - (trans.includes(i) ? 0.3 : 0.1), 'swipe', trans.includes(i) ? 0.26 : 0.16))
  // 0 · gancho
  p(W(0, 4), 'impact', 0.5); p(W(0, 4) + 0.05, 'shimmer', 0.18)
  // 1 · significado
  ;[1, 2, 3].forEach((n) => p(W(1, n), 'pop', 0.22))
  p(W(1, 5), 'pop', 0.2)
  p(W(1, 16) + 0.12, 'click', 0.5)
  ;[0, 1, 2].forEach((k) => p(W(1, 16) + 0.45 + k * 0.18, 'tick', 0.25))
  // 2 · diferencia
  p(W(2, 5) - 0.1, 'pop', 0.25)
  p(W(2, 6) + 0.05, 'click', 0.4)
  ;[10, 12, 15].forEach((n) => { p(W(2, n), 'pop', 0.2); p(W(2, n) + 0.2, 'tick', 0.28) })
  // 3 · ejemplo
  p(W(3, 4) - 0.1, 'pop', 0.22)
  p(W(3, 9) + 0.2, 'pop', 0.24)
  p(W(3, 10) + 0.05, 'swipe', 0.2)
  p(W(3, 10) + 0.5, 'ding', 0.3)
  // 4 · una vez
  p(W(4, 3) + 0.1, 'click', 0.5)
  ;[0, 1, 2, 3, 4, 5].forEach((k) => p(W(4, 8) + k * 0.12, 'tick', 0.26))
  p(W(4, 8) + 0.8, 'ding', 0.28)
  // 5 · sin programar
  p(W(5, 1), 'impact', 0.4)
  ;[0, 1, 2].forEach((k) => p(W(5, 3) + k * 0.22, 'tick', 0.22))
  p(W(5, 6), 'swipe', 0.25)
  p(W(5, 7) + 0.15, 'ding', 0.3)
  // 6 · tú decides
  p(W(6, 1), 'pop', 0.25)
  ;[0, 1, 2].forEach((k) => p(W(6, 2) + k * 0.22, 'pop', 0.16))
  p(W(6, 10), 'click', 0.5); p(W(6, 10) + 0.1, 'tick', 0.3)
  // 7 · manos
  p(W(7, 3) - 0.25, 'whoosh', 0.28); p(W(7, 3), 'impact', 0.45); p(W(7, 3) + 0.05, 'shimmer', 0.2)
  // 8 · cierre
  p(W(8, 0), 'pop', 0.25)
  p(W(8, 4) + 0.35, 'click', 0.45); p(W(8, 4) + 0.5, 'ding', 0.3)
  return s.sort((a, b) => a[0] - b[0])
}
