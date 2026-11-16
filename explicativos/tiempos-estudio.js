// Sonidos del video «estudio» (cómo se hacen estos videos): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosEstudio(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  const todos = grupos.map((_, i) => i).filter((i) => i > 0)
  inicios(fr, grupos, todos).forEach((t, i) => { if (i > 0) { p(t - 0.4, 'swipe', 0.3); p(t - 0.05, 'click', 0.2) } })
  p(0.12, 'pop', 0.3); p(W(0, 5), 'hit', 0.5); p(W(0, 6) + 0.15, 'reverse', 0.3); p(W(0, 8), 'impact', 0.5); p(W(0, 8) + 0.05, 'shimmer', 0.25)
  p(W(1, 0), 'pop', 0.3); p(W(1, 8), 'pop', 0.3); p(W(1, 9) + 0.4, 'click', 0.4); p(W(1, 13), 'pop', 0.3); ;[16, 17].forEach((n) => p(W(1, n), 'tick', 0.26)); p(W(1, 18) + 0.5, 'ding', 0.3)
  p(W(2, 1), 'pop', 0.26); p(W(2, 4), 'swipe', 0.4); p(W(2, 4) + 0.05, 'click', 0.4); ;[8, 9, 10, 11, 12, 13, 14].forEach((n) => p(W(2, n), 'tick', 0.24))
  ;[2, 4, 6, 9].forEach((n) => p(W(3, n), 'tick', 0.24)); ;[4, 6, 9].forEach((n) => p(W(3, n) + 0.1, 'pop', 0.28)); p(W(3, 12), 'click', 0.4); p(W(3, 12) + 0.1, 'ding', 0.36)
  ;[0, 1, 2, 3, 4, 5].forEach((i) => p(0.15 + i * 0.12, 'pop', 0.2)); p(W(4, 10), 'shimmer', 0.3); p(W(4, 15), 'shimmer', 0.3)
  p(W(5, 8), 'riser', 0.25); ;[9, 11, 13].forEach((n) => p(W(5, n), 'ding', 0.26)); p(W(5, 15), 'impact', 0.45); p(W(5, 17), 'click', 0.45)
  p(W(6, 8), 'impact', 0.5); ;[9, 11, 15].forEach((n) => p(W(6, n), 'pop', 0.3))
  p(W(7, 7), 'pop', 0.3); p(W(7, 10), 'impact', 0.45); ;[0, 1, 2, 3, 4, 5].forEach((k) => p(W(7, 10) + 0.2 + k * 0.11, 'tick', 0.22)); p(W(7, 12), 'click', 0.45); p(W(7, 13), 'ding', 0.4); p(W(7, 13) + 0.1, 'shimmer', 0.3)
  return s.sort((a, b) => a[0] - b[0])
}
