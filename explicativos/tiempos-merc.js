// Sonidos del video «mercado» (era de la IA y millonarios): [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosMerc(fr, grupos) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  inicios(fr, grupos, []).forEach((t, i) => i > 0 && p(t - 0.2, 'whoosh', 0.3))
  p(W(0, 4), 'shimmer', 0.2)
  ;[0, 1, 2, 3, 4, 5].forEach((k) => p(W(0, 4) + 0.1 + k * 0.1, 'tick', 0.2))
  p(W(0, 7), 'impact', 0.5); p(W(0, 7) + 0.05, 'ding', 0.3)
  ;[7, 9, 11].forEach((n) => p(W(1, n), 'pop', 0.25))
  p(W(1, 12), 'swipe', 0.3); p(W(1, 13), 'click', 0.3)
  p(W(1, 15), 'pop', 0.26); p(W(1, 18), 'ding', 0.3)
  p(W(2, 7), 'swipe', 0.26); p(W(2, 8) + 0.5, 'ding', 0.3)
  p(W(2, 11), 'pop', 0.26); p(W(2, 13), 'pop', 0.26)
  p(W(2, 21), 'swipe', 0.26); p(W(2, 22) + 0.2, 'click', 0.3)
  p(W(3, 3), 'pop', 0.26)
  ;[9, 10, 11].forEach((n, k) => p(W(3, n), 'tick', 0.24 + k * 0.02)); p(W(3, 9), 'impact', 0.4)
  ;[12, 14, 16].forEach((n) => { p(W(3, n), 'pop', 0.24); p(W(3, n) + 0.2, 'tick', 0.24) })
  ;[11, 15, 21].forEach((n) => { p(W(4, n), 'click', 0.36); p(W(4, n) + 0.05, 'pop', 0.22) })
  p(W(4, 9), 'swipe', 0.26); p(W(4, 22), 'impact', 0.42); p(W(4, 22) + 0.1, 'shimmer', 0.2)
  p(W(5, 4), 'shimmer', 0.26); p(W(5, 4) + 0.1, 'click', 0.36)
  p(W(5, 13), 'swipe', 0.28); p(W(5, 14), 'ding', 0.32)
  ;[9, 12, 14].forEach((n) => p(W(6, n), 'impact', 0.4)); p(W(6, 12) + 0.3, 'shimmer', 0.26)
  ;[2, 5, 9].forEach((n) => { p(W(7, n), 'pop', 0.26); p(W(7, n) + 0.06, 'click', 0.3) })
  p(W(7, 13), 'impact', 0.5); p(W(7, 13) + 0.1, 'ding', 0.34)
  p(W(8, 0), 'pop', 0.25); p(W(8, 3) + 0.4, 'click', 0.45); p(W(8, 3) + 0.55, 'ding', 0.32)
  return s.sort((a, b) => a[0] - b[0])
}
