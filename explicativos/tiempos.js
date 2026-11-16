// Tiempos compartidos entre las escenas (Remotion) y el diseño de sonido (Node): una sola fuente de verdad.
export const FPS = 30
export const F = (s) => Math.round(s * FPS)

// fr: frases con { ini, fin, kw (segundos de la palabra clave), palabras }
export function momentos(fr) {
  const g = (i) => fr[i]
  return {
    sala: { cerrojo: g(0).kw, tarjetas: [g(1).ini + 0.15, g(1).ini + 0.75, g(1).ini + 1.35], cruces: [g(1).ini + 0.5, g(1).ini + 1.1, g(1).kw] },
    cables: { cable: [0, 1, 2, 3].map((i) => g(2).ini + 0.2 + i * 0.55), enredo: g(3).ini, aviso: [0, 1, 2].map((i) => g(3).ini + 0.35 + i * 0.4) },
    mcp: { titulo: g(4).kw, etiqueta: g(5).ini, enchufe: (g(5).palabras.find((p) => /^USB/.test(p.w)) ?? { t0: g(5).kw }).t0 },
    hub: { conexion: [0, 1, 2, 3].map((i) => g(6).kw + 0.15 + i * 0.4), etiquetas: [0, 1, 2, 3].map((i) => g(7).kw + i * 0.3), burbuja: g(7).kw + 0.9 },
    chat: { escribe: g(8).ini + 0.1, respuesta: g(8).kw - 0.15, mover: g(8).kw, check: g(8).kw + 0.5 },
    permisos: { filas: [0, 1, 2].map((i) => g(9).ini + 0.2 + i * 0.35), cursor: g(9).kw - 0.5, apaga: g(9).kw + 0.35 },
    cierre: { manos: g(10).kw - 0.2, cta: g(11).ini },
  }
}

// Sonidos: [segundo, tipo, volumen]. Cada acción visual lleva su sonido en el mismo instante.
export function sonidos(fr, grupos) {
  const m = momentos(fr)
  const s = []
  const p = (t, tipo, v) => s.push([Math.max(0, t), tipo, v])
  grupos.forEach((gr, i) => i > 0 && p(fr[gr.ids[0]].ini - 0.12, 'swipe', 0.22))
  p(m.sala.cerrojo, 'click', 0.5)
  m.sala.tarjetas.forEach((t) => p(t, 'pop', 0.2))
  m.sala.cruces.forEach((t) => p(t + 0.35, 'tick', 0.3))
  m.cables.cable.forEach((t) => p(t + 0.3, 'click', 0.35))
  p(m.cables.enredo, 'reverse', 0.2)
  m.cables.aviso.forEach((t) => p(t, 'tick', 0.35))
  p(m.mcp.titulo, 'impact', 0.5)
  p(m.mcp.titulo + 0.05, 'shimmer', 0.18)
  p(m.mcp.etiqueta, 'pop', 0.2)
  p(m.mcp.enchufe + 0.1, 'click', 0.5)
  m.hub.conexion.forEach((t) => p(t + 0.25, 'click', 0.4))
  m.hub.etiquetas.forEach((t) => p(t, 'pop', 0.18))
  p(m.hub.burbuja, 'pop', 0.25)
  p(m.chat.respuesta, 'pop', 0.22)
  p(m.chat.mover, 'swipe', 0.2)
  p(m.chat.check, 'ding', 0.3)
  m.permisos.filas.forEach((t) => p(t, 'tick', 0.3))
  p(m.permisos.apaga, 'click', 0.5)
  p(m.cierre.manos, 'whoosh', 0.25)
  p(m.cierre.manos + 0.4, 'click', 0.45)
  p(m.cierre.cta, 'shimmer', 0.2)
  return s.sort((a, b) => a[0] - b[0])
}
