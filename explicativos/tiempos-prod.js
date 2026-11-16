// Sonidos del video de producto (diseño «producto»): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosProd(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  const todos = grupos.map((_, i) => i).filter((i) => i > 0)
  inicios(fr, grupos, todos).forEach((t, i) => i > 0 && p(t - 0.45, 'swipe', 0.3))
  p(W(0, 5), 'shimmer', 0.22); p(W(0, 10), 'impact', 0.45)
  p(W(1, 3), 'pop', 0.26); p(W(1, 3) + 0.05, 'shimmer', 0.16)
  ;[0, 1, 2, 3, 4].forEach((k) => p(W(1, 9) + 0.1 + k * 0.2, 'tick', 0.2)); p(W(1, 9) + 1.2, 'ding', 0.3)
  p(W(2, 2), 'pop', 0.24)
  p(W(2, 10), 'click', 0.4); p(W(2, 10) + 0.12, 'ding', 0.32)
  ;[0, 1, 2, 3].forEach((k) => p(W(3, 3) + 0.05 + k * 0.33, 'tick', 0.22)); p(W(3, 3) + 1.4, 'ding', 0.34)
  p(W(3, 8), 'click', 0.36)
  p(W(4, 1), 'click', 0.4); p(W(4, 1) + 0.05, 'shimmer', 0.2)
  p(W(4, 3) + 0.1, 'swipe', 0.26); p(W(4, 3) + 0.3, 'impact', 0.36)
  ;[1, 5, 9].forEach((n) => { p(W(5, n), 'click', 0.4); p(W(5, n) + 0.08, 'pop', 0.2) })
  p(W(6, 1), 'shimmer', 0.24)
  p(W(6, 9) - 0.15, 'whoosh', 0.28); p(W(6, 9) + 0.7, 'ding', 0.28)
  ;[0, 0.25, 0.5, 0.75].forEach((d) => p(W(7, 3) + d, 'pop', 0.22)); p(W(7, 5), 'ding', 0.3)
  p(W(8, 0), 'pop', 0.25); p(W(8, 4) - 0.2, 'shimmer', 0.2); p(W(8, 4) + 0.4, 'click', 0.45); p(W(8, 4) + 0.55, 'ding', 0.32)
  return s.sort((a, b) => a[0] - b[0])
}
