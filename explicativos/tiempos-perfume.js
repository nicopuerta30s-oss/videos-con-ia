// Sonidos del video «perfume» (ejemplo de perfumería): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosPerfume(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  const todos = grupos.map((_, i) => i).filter((i) => i > 0)
  inicios(fr, grupos, todos).forEach((t, i) => { if (i > 0) { p(t - 0.35, 'whoosh', 0.3); p(t - 0.05, 'shimmer', 0.2) } })
  p(0.1, 'impact', 0.4); p(W(0, 3), 'pop', 0.3); p(W(0, 4), 'pop', 0.34); p(W(0, 6) - 0.1, 'riser', 0.22); p(W(0, 6) + 0.15, 'pop', 0.4); p(W(0, 6) + 0.2, 'shimmer', 0.3); p(W(0, 9), 'ding', 0.4)
  p(W(1, 1), 'pop', 0.3); p(W(1, 2), 'pop', 0.3); p(W(1, 5), 'pop', 0.3); p(W(1, 13), 'tick', 0.26); p(W(1, 14), 'tick', 0.26); p(W(1, 15), 'click', 0.4); p(W(1, 15) + 0.05, 'ding', 0.3)
  p(W(2, 3), 'pop', 0.26); p(W(2, 6), 'swipe', 0.3); p(W(2, 6) + 0.1, 'pop', 0.3); p(W(2, 10), 'swipe', 0.3); p(W(2, 10) + 0.1, 'pop', 0.3)
  p(W(3, 3), 'hit', 0.5); p(W(3, 3) + 0.05, 'impact', 0.3); p(W(3, 5), 'swipe', 0.3); p(W(3, 5) + 0.15, 'click', 0.3); p(W(3, 10), 'ding', 0.4); p(W(3, 10) + 0.05, 'shimmer', 0.3)
  p(W(4, 0), 'pop', 0.26); p(W(4, 4) - 0.05, 'riser', 0.2); p(W(4, 4) + 0.1, 'impact', 0.4); p(W(4, 4) + 0.15, 'shimmer', 0.35)
  p(W(5, 0), 'pop', 0.3); p(W(5, 3), 'click', 0.45); p(W(5, 3) + 0.1, 'ding', 0.34)
  return s.sort((a, b) => a[0] - b[0])
}
