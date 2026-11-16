// Sonidos del video «Chat vs Cowork vs Claude Code»: [segundo, tipo, volumen]
import { inicios, mkW } from './tiempos-pro.js'

export function sonidosModos(fr, grupos, trans) {
  const W = mkW(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  inicios(fr, grupos, trans).forEach((t, i) => i > 0 && p(t - (trans.includes(i) ? 0.3 : 0.1), 'swipe', trans.includes(i) ? 0.26 : 0.16))
  // 0 · los tres
  ;[0, 1, 3].forEach((n) => p(W(0, n), 'pop', 0.24))
  ;[0, 1, 2].forEach((k) => p(W(0, 8) + k * 0.15, 'tick', 0.26))
  p(W(0, 10), 'impact', 0.45)
  // 1 · chat
  p(W(1, 7) - 0.05, 'pop', 0.22)
  ;[0, 1, 2, 3].forEach((k) => p(W(1, 7) + k * 0.28, 'tick', 0.16))
  p(W(1, 9) + 0.1, 'pop', 0.25)
  p(W(1, 12), 'ding', 0.3)
  // 2 · cowork
  p(W(2, 7) - 0.1, 'pop', 0.25)
  ;[0, 1, 2, 3, 4, 5].forEach((k) => p(W(2, 9) + 0.1 + k * 0.1, 'tick', 0.22))
  p(W(2, 9) + 0.95, 'ding', 0.28)
  p(W(2, 11), 'pop', 0.24); p(W(2, 13), 'pop', 0.24)
  p(W(2, 17), 'impact', 0.4)
  // 3 · code
  p(W(3, 6), 'tick', 0.3); p(W(3, 6) + 0.7, 'ding', 0.2)
  ;[0, 1, 2, 3].forEach((k) => p(W(3, 9) + 0.2 + k * 0.28, 'tick', 0.24))
  p(W(3, 13) + 0.5, 'ding', 0.32)
  p(W(3, 15), 'impact', 0.4)
  // 4 · cuál usar
  ;[0, 4, 11].forEach((n) => p(W(4, n) - 0.05, 'pop', 0.22))
  ;[3, 10, 16].forEach((n) => { p(W(4, n) - 0.05, 'click', 0.4); p(W(4, n) + 0.1, 'ding', 0.26) })
  // 5 · cierre
  p(W(5, 0), 'pop', 0.25)
  p(W(5, 4) + 0.35, 'click', 0.45); p(W(5, 4) + 0.5, 'ding', 0.3)
  return s.sort((a, b) => a[0] - b[0])
}
