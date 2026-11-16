// Sonidos del video «bauhaus» (IA y millonarios v2): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosBaus(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  const todos = grupos.map((_, i) => i).filter((i) => i > 0)
  inicios(fr, grupos, todos).forEach((t, i) => { if (i > 0) { p(t - 0.3, 'swipe', 0.28); p(t - 0.12, 'click', 0.3) } })
  p(W(0, 3), 'impact', 0.4); [5, 6, 7].forEach((n, k) => p(W(0, n) + 0.1, 'pop', 0.24)); p(W(0, 8), 'ding', 0.32)
  ;[6, 10, 15].forEach((n, k) => { p(W(1, n), 'click', 0.36); p(W(1, n) + 0.3, 'pop', 0.2) }); p(W(1, 20), 'whoosh', 0.3)
  p(W(2, 3), 'pop', 0.26); p(W(2, 8), 'impact', 0.4); p(W(2, 13), 'click', 0.3); p(W(2, 16), 'pop', 0.24)
  ;[0, 1, 2, 3, 4, 5, 6, 7].forEach((k) => p(W(2, 20) + k * 0.07, 'tick', 0.2))
  p(W(3, 7), 'swipe', 0.26); p(W(3, 8) + 0.5, 'ding', 0.3)
  ;[9, 12, 15].forEach((n) => { p(W(3, n), 'pop', 0.26); p(W(3, n) + 0.08, 'click', 0.3) })
  p(W(4, 1), 'pop', 0.28); p(W(4, 12), 'swipe', 0.28); p(W(4, 21), 'impact', 0.36); p(W(4, 22), 'whoosh', 0.3); p(W(4, 27), 'ding', 0.34)
  p(W(5, 3), 'pop', 0.28); p(W(5, 7), 'pop', 0.22); p(W(5, 12), 'impact', 0.36)
  ;[2, 4, 8].forEach((n) => { p(W(6, n), 'pop', 0.26); p(W(6, n) + 0.06, 'click', 0.3) })
  p(W(6, 11), 'impact', 0.5); p(W(6, 11) + 0.1, 'ding', 0.34); p(W(6, 12) + 0.7, 'pop', 0.26); p(W(6, 12) + 1.6, 'click', 0.45); p(W(6, 12) + 1.75, 'ding', 0.32)
  return s.sort((a, b) => a[0] - b[0])
}
