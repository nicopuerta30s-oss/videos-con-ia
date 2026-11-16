// Sonidos del video «panel» (Día 9, agencia de IA): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosPanel(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  const todos = grupos.map((_, i) => i).filter((i) => i > 0)
  inicios(fr, grupos, todos).forEach((t, i) => { if (i > 0) { p(t - 0.5, 'whoosh', 0.3); p(t - 0.05, 'swipe', 0.2) } })
  p(0.1, 'impact', 0.45); p(W(0, 6), 'riser', 0.2); p(W(0, 9), 'click', 0.4); p(W(0, 9) + 0.05, 'ding', 0.32); p(W(0, 11), 'pop', 0.3)
  ;[4, 5, 7].forEach((n) => p(W(1, n), 'pop', 0.26)); p(W(1, 10), 'pop', 0.3); p(W(1, 12), 'pop', 0.3); p(W(1, 15), 'impact', 0.4)
  p(W(2, 2), 'pop', 0.28); ;[10, 16, 22].forEach((n) => { p(W(2, n), 'click', 0.36); p(W(2, n) + 0.05, 'pop', 0.22) })
  ;[12, 13, 14].forEach((n, k) => p(W(2, 12) + k * 0.12, 'tick', 0.22)); p(W(2, 30), 'ding', 0.34)
  p(W(3, 5), 'click', 0.5); p(W(3, 5) + 0.1, 'shimmer', 0.26); p(W(3, 13), 'pop', 0.28); p(W(3, 18), 'pop', 0.28)
  ;[0, 1, 2, 3].forEach((k) => p(W(3, 23) + k * 0.35, 'tick', 0.26))
  p(W(4, 0), 'pop', 0.3); ;[0, 1, 2, 3].forEach((k) => p(W(4, 3) + k * 0.15, 'tick', 0.22))
  ;[5, 7, 9].forEach((n) => p(W(5, n), 'pop', 0.26)); p(W(5, 10), 'click', 0.4); p(W(5, 10) + 0.1, 'ding', 0.3)
  p(W(6, 0), 'pop', 0.25); p(W(6, 1) + 0.85, 'click', 0.45); p(W(6, 1) + 1.0, 'ding', 0.32)
  return s.sort((a, b) => a[0] - b[0])
}
