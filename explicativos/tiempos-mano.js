// Sonidos del video «mano» (ejemplo de UI con mano): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosMano(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  const todos = grupos.map((_, i) => i).filter((i) => i > 0)
  inicios(fr, grupos, todos).forEach((t, i) => { if (i > 0) { p(t - 0.4, 'swipe', 0.35); p(t - 0.03, 'hit', 0.3) } })
  p(0.1, 'pop', 0.3); ;[0, 1, 2, 3].forEach((k) => p(0.3 + k * 0.35, 'tick', 0.2)); p(W(0, 4), 'pop', 0.34); p(W(0, 6), 'swipe', 0.3); p(W(0, 7), 'click', 0.5); p(W(0, 7) + 0.08, 'ding', 0.34); p(W(0, 7) + 0.25, 'swipe', 0.3)
  p(W(1, 3), 'pop', 0.3); p(W(1, 6), 'ding', 0.34); p(W(1, 8), 'pop', 0.3); p(W(1, 10), 'ding', 0.34); ;[4, 6, 9, 10].forEach((n) => p(W(1, n) + 0.3, 'drop', 0.2))
  ;[4, 5, 6].forEach((n) => { p(W(2, n), 'pop', 0.3); p(W(2, n) + 0.05, 'tick', 0.24) }); p(W(3, 1), 'impact', 0.4); p(W(3, 9), 'swipe', 0.3); p(W(3, 9) + 0.1, 'pop', 0.34); p(W(3, 11), 'pop', 0.3)
  p(W(3, 3), 'click', 0.45); ;[0, 1, 2, 3].forEach((k) => p(W(3, 3) + 0.05 + k * 0.05, 'shimmer', 0.1)); p(W(3, 6), 'riser', 0.25); p(W(3, 13), 'impact', 0.45); p(W(3, 13) + 0.05, 'ding', 0.34)
  p(W(5, 0), 'pop', 0.3); p(W(5, 2), 'swipe', 0.3); p(W(5, 5), 'click', 0.5); p(W(5, 5) + 0.1, 'ding', 0.34)
  return s.sort((a, b) => a[0] - b[0])
}
