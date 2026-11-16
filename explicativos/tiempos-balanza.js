// Sonidos del video «balanza» (ejemplo de cuentas): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosBalanza(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  const todos = grupos.map((_, i) => i).filter((i) => i > 0)
  inicios(fr, grupos, todos).forEach((t, i) => { if (i > 0) { p(t - 0.4, 'whoosh', 0.3); p(t - 0.02, 'pop', 0.3) } })
  ;[0, 1, 3, 4].forEach((n) => p(W(0, n), 'pop', 0.3)); p(W(0, 6), 'pop', 0.3); p(W(0, 7), 'click', 0.45); p(W(0, 7) + 0.05, 'ding', 0.3)
  ;[4, 6, 7, 8].forEach((n) => p(W(1, n), 'pop', 0.3)); p(W(1, 9), 'impact', 0.4); ;[0, 1, 2, 3, 4, 5].forEach((k) => p(W(1, 10) + k * 0.15, 'tick', 0.24)); p(W(1, 11), 'hit', 0.4)
  p(W(2, 0), 'drop', 0.4); p(W(2, 1), 'pop', 0.34); p(W(2, 8), 'ding', 0.4); p(W(2, 8) + 0.05, 'shimmer', 0.3)
  ;[0, 1, 2].forEach((n) => p(W(3, n), 'pop', 0.3)); ;[0, 1, 2, 3, 4].forEach((k) => p(W(3, 6) + k * 0.15, 'tick', 0.24)); p(W(3, 7), 'ding', 0.4)
  p(W(4, 3), 'pop', 0.3); p(W(4, 5), 'click', 0.4); p(W(4, 5) + 0.05, 'ding', 0.3); ;[7, 8, 9].forEach((n) => p(W(4, n), 'swipe', 0.3)); p(W(4, 10), 'impact', 0.35)
  p(0.1, 'impact', 0.3); p(W(5, 0), 'pop', 0.3); p(W(5, 5), 'click', 0.45); p(W(5, 5) + 0.1, 'ding', 0.34)
  return s.sort((a, b) => a[0] - b[0])
}
