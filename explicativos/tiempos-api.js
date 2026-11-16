// Sonidos del video «API, webhook y skill» (diseño cinético): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosApi(fr, grupos, trans) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  inicios(fr, grupos, trans).forEach((t, i) => i > 0 && p(t - 0.3, 'swipe', 0.3))
  // 0 · tres golpes
  ;[4, 6, 9].forEach((n) => { p(W(0, n), 'impact', 0.5); p(W(0, n) + 0.04, 'shimmer', 0.14) })
  // 1 · mesero
  p(W(1, 9), 'pop', 0.26)
  p(W(1, 12), 'whoosh', 0.2)
  ;[0, 1, 2, 3].forEach((k) => p(W(1, 13) + k * 0.7, 'tick', 0.18))
  p(W(1, 18), 'click', 0.4)
  p(W(1, 20), 'whoosh', 0.2)
  p(W(1, 23) + 0.1, 'ding', 0.34)
  p(W(1, 26), 'pop', 0.24)
  // 2 · webhook
  ;[0, 1, 2].forEach((k) => p(W(2, 3) + 0.2 + k * 0.5, 'tick', 0.22))
  p(W(2, 12), 'swipe', 0.22)
  p(W(2, 15), 'ding', 0.5); p(W(2, 15) + 0.35, 'ding', 0.4)
  p(W(2, 22), 'pop', 0.22)
  p(W(2, 26), 'swipe', 0.28); p(W(2, 26) + 0.3, 'ding', 0.4)
  // 3 · juntos
  p(W(3, 3), 'pop', 0.24)
  p(W(3, 5), 'whoosh', 0.22); p(W(3, 5) + 0.7, 'click', 0.4)
  p(W(3, 12), 'whoosh', 0.22); p(W(3, 12) + 0.7, 'click', 0.4)
  p(W(3, 19), 'ding', 0.4)
  // 4 · skill
  ;[0, 1, 2].forEach((k) => p(W(4, 4) + k * 0.7, 'tick', 0.22))
  p(W(4, 10) + 0.5, 'impact', 0.45)
  ;[0, 0.45, 0.9].forEach((d) => p(W(4, 16) + d, 'pop', 0.22))
  p(W(4, 20), 'ding', 0.34)
  // 5 · cierre
  p(W(5, 4) - 0.2, 'shimmer', 0.2)
  p(W(5, 4) + 0.4, 'click', 0.45); p(W(5, 4) + 0.55, 'ding', 0.32)
  return s.sort((a, b) => a[0] - b[0])
}
