// Diseño «pro»: fondo claro, cabecera con progreso y etiqueta, título grande, ilustraciones de interfaz y subtítulos abajo.
// Todo se anima con los tiempos reales de cada palabra (props.frases[i].palabras[n].t0).
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, spring, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { ESCENAS_MODOS } from './escenasModos.jsx'

const FPS = 30
export const P = { bg: '#FBF4EC', ink: '#16120F', mute: '#8C8076', line: '#E6DACB', card: '#FFFFFF', gris: '#EFE7DC', or: '#E8703A', orD: '#C85A28', orS: '#FBE3D3', gr: '#2FB872', grS: '#DDF5E8', rd: '#E5484D', rdS: '#FCE1E2', am: '#F5B83D' }
export const T = "'Poppins', 'Helvetica Neue', sans-serif"
export const U = "'Inter', 'Helvetica Neue', sans-serif"

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const out3 = (p) => 1 - Math.pow(1 - p, 3)
export const io3 = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
export const outB = (p) => 1 + 2.4 * Math.pow(p - 1, 3) + 1.4 * Math.pow(p - 1, 2)
export const pr = (t, t0, d = 0.5, e = out3) => e(clamp((t - t0) / d))
export const pop = (t, t0) => ({ o: clamp((t - t0) / 0.14), s: 0.82 + 0.18 * outB(clamp((t - t0) / 0.4)) })
// recorrido por puntos [{t,x,y}] con suavizado
export const kf = (t, pts) => {
  if (t <= pts[0].t) return pts[0]
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i].t) {
      const u = io3(clamp((t - pts[i - 1].t) / (pts[i].t - pts[i - 1].t)))
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * u, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * u }
    }
  }
  return pts.at(-1)
}

function useFuentes() {
  const [h] = React.useState(() => delayRender('fuentes'))
  React.useEffect(() => {
    const caras = [
      new FontFace('Poppins', `url(${staticFile('Poppins-Bold.ttf')})`, { weight: '700' }),
      new FontFace('Poppins', `url(${staticFile('Poppins-Medium.ttf')})`, { weight: '500' }),
      new FontFace('Inter', `url(${staticFile('Inter.ttf')})`, { weight: '100 900' }),
    ]
    Promise.all(caras.map((c) => c.load()))
      .then((l) => l.forEach((c) => document.fonts.add(c)))
      .catch(() => {})
      .finally(() => continueRender(h))
  }, [h])
}

/* ───────────── piezas ───────────── */
export const Caja = ({ x, y, w, h, o = 1, s = 1, dy = 0, dx = 0, bg = P.card, borde = P.line, bw = 3, r = 36, sombra = true, children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: o, transform: `translate(${dx}px, ${dy}px) scale(${s})`, background: bg, border: `${bw}px solid ${borde}`, borderRadius: r, boxShadow: sombra ? '0 22px 50px rgba(90,45,10,.10)' : 'none', boxSizing: 'border-box', ...style }}>
    {children}
  </div>
)
export const Pos = ({ x, y, o = 1, s = 1, rot = 0, children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: '0 0', ...style }}>{children}</div>
)
export const Txt = ({ children, size = 34, w = 600, c = P.ink, f = U, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.15, ...style }}>{children}</div>
)

export const Icono = ({ tipo, c = P.ink }) => {
  const p = { stroke: c, strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  switch (tipo) {
    case 'calendario':
      return (<g {...p}><rect x="-46" y="-40" width="92" height="86" rx="14" /><line x1="-46" y1="-12" x2="46" y2="-12" /><line x1="-22" y1="-54" x2="-22" y2="-30" /><line x1="22" y1="-54" x2="22" y2="-30" /><circle cx="-20" cy="14" r="3" fill={c} /><circle cx="4" cy="14" r="3" fill={c} /><circle cx="-20" cy="32" r="3" fill={c} /></g>)
    case 'carpeta':
      return <path {...p} d="M-50 -30 h34 l14 14 h52 v66 h-100 z" />
    case 'chat':
      return (<g {...p}><path d="M-48 -38 h96 v64 h-52 l-24 22 v-22 h-20 z" /><circle cx="-20" cy="-6" r="3" fill={c} /><circle cx="0" cy="-6" r="3" fill={c} /><circle cx="20" cy="-6" r="3" fill={c} /></g>)
    case 'codigo':
      return (<g {...p}><polyline points="-22,-30 -52,0 -22,30" /><polyline points="22,-30 52,0 22,30" /><line x1="8" y1="-38" x2="-8" y2="38" /></g>)
    case 'correo':
      return (<g {...p}><rect x="-50" y="-34" width="100" height="70" rx="12" /><polyline points="-50,-30 0,8 50,-30" /></g>)
    case 'engranaje':
      return (<g {...p}><circle r="16" /><circle r="36" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (<line key={a} x1="0" y1="-36" x2="0" y2="-50" transform={`rotate(${a})`} />))}</g>)
    case 'enchufe':
      return (<g {...p}><line x1="-18" y1="-52" x2="-18" y2="-20" /><line x1="18" y1="-52" x2="18" y2="-20" /><path d="M-36 -20 h72 v22 a36 36 0 0 1 -72 0 z" /><line x1="0" y1="34" x2="0" y2="56" /></g>)
    case 'candado':
      return (<g {...p}><rect x="-38" y="-8" width="76" height="60" rx="14" /><path d="M-22 -8 v-16 a22 22 0 0 1 44 0 v16" /></g>)
    case 'marcador':
      return <path {...p} d="M-30 -48 h60 v100 l-30 -24 l-30 24 z" />
    case 'enviar':
      return (<g {...p}><path d="M-52 -4 L52 -48 L22 52 L2 8 Z" /><line x1="2" y1="8" x2="52" y2="-48" /></g>)
    case 'abierto':
      return (<g {...p}><rect x="-38" y="-8" width="76" height="60" rx="14" /><path d="M-22 -8 v-16 a22 22 0 0 1 44 0" /></g>)
    case 'idea':
      return (<g {...p}><path d="M-20 22 v-10 a40 40 0 1 1 40 0 v10 z" /><line x1="-16" y1="40" x2="16" y2="40" /><line x1="-8" y1="54" x2="8" y2="54" /></g>)
    case 'cerebro':
      return (<g {...p}><circle cx="0" cy="0" r="44" /><circle cx="-16" cy="-6" r="5" fill={c} /><circle cx="16" cy="-6" r="5" fill={c} /><path d="M-20 18 Q0 32 20 18" /></g>)
    default:
      return null
  }
}
export const Ic = ({ tipo, size = 90, c = P.ink }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: 'block' }}>
    <Icono tipo={tipo} c={c} />
  </svg>
)
export const Check = ({ size = 48, c = P.gr, o = 1, s = 1 }) => (
  <svg width={size} height={size} viewBox="-30 -30 60 60" style={{ opacity: o, transform: `scale(${s})`, display: 'block' }}>
    <circle r="27" fill={c} />
    <polyline points="-12,0 -4,9 13,-9" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
)
export const Cruz = ({ size = 48, c = P.rd }) => (
  <svg width={size} height={size} viewBox="-30 -30 60 60" style={{ display: 'block' }}>
    <circle r="27" fill={c} />
    <path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#fff" strokeWidth="7" strokeLinecap="round" />
  </svg>
)
export const Interruptor = ({ x, y, on, w = 130, h = 70 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: h, background: on > 0.5 ? P.gr : '#CFC4B6', transition: 'none', boxSizing: 'border-box' }}>
    <div style={{ position: 'absolute', top: 7, left: 7 + on * (w - h), width: h - 14, height: h - 14, borderRadius: '50%', background: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,.25)' }} />
  </div>
)
export const Cursor = ({ x, y, clic = 0 }) => (
  <div style={{ position: 'absolute', left: x, top: y, zIndex: 20, pointerEvents: 'none' }}>
    {clic > 0 && clic < 1 && <div style={{ position: 'absolute', left: -26, top: -26, width: 52, height: 52, borderRadius: '50%', border: `4px solid ${P.or}`, opacity: 1 - clic, transform: `scale(${0.5 + clic * 1.2})` }} />}
    <svg width="54" height="62" viewBox="0 0 28 42" style={{ transform: `scale(${1 - 0.12 * Math.sin(clic * Math.PI)})`, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.25))' }}>
      <path d="M2 2 L2 34 L10 27 L16 40 L22 37 L16 25 L27 25 Z" fill={P.ink} stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  </div>
)
export const Sello = ({ x, y, texto, c = P.rd, rot = -8, o = 1, s = 1, size = 52 }) => (
  <Pos x={x} y={y} o={o} s={s} rot={rot} style={{ transformOrigin: 'center' }}>
    <div style={{ border: `7px solid ${c}`, color: c, borderRadius: 18, padding: '6px 26px', fontFamily: T, fontWeight: 700, fontSize: size, letterSpacing: 2, background: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap' }}>{texto}</div>
  </Pos>
)
export const Pastilla = ({ x, y, texto, c = P.or, bg = P.orS, o = 1, s = 1, size = 38, icono }) => (
  <Pos x={x} y={y} o={o} s={s} style={{ transformOrigin: '0 50%' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: bg, border: `3px solid ${c}`, color: c, borderRadius: 60, padding: '10px 28px', fontFamily: T, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap' }}>
      {icono && <Ic tipo={icono} size={size + 8} c={c} />}
      {texto}
    </div>
  </Pos>
)

/* personaje (mi mascota, no es el logo oficial): siempre naranja, aunque cambie la paleta del video */
const MO = '#E8703A', MOD = '#C85A28'
export const Claude = ({ x, y, s = 1, mood = 'ok', arms = 0, look = [0, 0], t }) => {
  const f = Math.round(t * FPS)
  const bob = Math.sin(f / 18) * 5
  const parpadeo = f % 110 > 104 ? 0.12 : 1
  const boca = { ok: 'M-22 22 Q0 36 22 22', sad: 'M-22 34 Q0 16 22 34', happy: 'M-26 16 Q0 52 26 16 Z' }[mood]
  const mano = (lado) => {
    const ex = lado * (112 + arms * 85)
    const ey = 10 - arms * 90
    return (
      <g key={lado}>
        <path d={`M${lado * 100} 5 Q${lado * (125 + arms * 40)} ${20 - arms * 30} ${ex} ${ey}`} stroke={MO} strokeWidth="30" strokeLinecap="round" fill="none" />
        <circle cx={ex} cy={ey} r="27" fill="#F2A27F" />
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx="0" cy="92" rx="110" ry="16" fill="#000" opacity="0.10" transform={`translate(0 ${-bob * 0.9})`} />
      {arms > 0 && [-1, 1].map(mano)}
      <line x1="0" y1="-128" x2="0" y2="-172" stroke={MO} strokeWidth="9" strokeLinecap="round" />
      <circle cx="0" cy="-184" r="14" fill="#F5B83D" />
      <ellipse cx="-48" cy="76" rx="38" ry="20" fill={MOD} />
      <ellipse cx="48" cy="76" rx="38" ry="20" fill={MOD} />
      <rect x="-112" y="-130" width="224" height="204" rx="72" fill={MO} />
      <rect x="-92" y="-114" width="184" height="54" rx="27" fill="#fff" opacity="0.18" />
      {[-44, 44].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy="-40" rx="25" ry={27 * parpadeo} fill="#fff" />
          <circle cx={ex + look[0]} cy={-40 + look[1] * parpadeo} r="12" fill="#2A1A12" />
        </g>
      ))}
      <path d={boca} stroke="#2A1A12" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill={mood === 'happy' ? '#2A1A12' : 'none'} />
    </g>
  )
}
export const Mascota = ({ x, y, w = 300, h = 300, s = 1, ...r }) => (
  <svg style={{ position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible' }} width={w} height={h} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
    <Claude x={0} y={0} s={s} {...r} />
  </svg>
)

/* ───────────── cabecera ───────────── */
const Cabecera = ({ t, gi, gs, ge, grupos, marca, W, fr }) => {
  const g = grupos[gi]
  const n = grupos.length
  const ancho = (1080 - 72 - (n - 1) * 8) / n
  const entra = pr(t, gs[gi], 0.45)
  const sale = gi < n - 1 ? pr(t, ge[gi] - 0.18, 0.18, io3) : 0
  let titulo = g.titulo
  if (g.titulo2 && t >= W(g.titulo2.frase, g.titulo2.palabra) - 0.05) titulo = g.titulo2.texto
  const t0 = g.titulo2 && t >= W(g.titulo2.frase, g.titulo2.palabra) - 0.05 ? W(g.titulo2.frase, g.titulo2.palabra) - 0.05 : gs[gi]
  const palabras = titulo.split(' ')
  let clave = false
  return (
    <>
      <div style={{ position: 'absolute', left: 36, top: 34, right: 36, display: 'flex', gap: 8 }}>
        {grupos.map((_, i) => (
          <div key={i} style={{ width: ancho, height: 9, borderRadius: 5, background: P.line, overflow: 'hidden' }}>
            <div style={{ width: `${clamp((t - gs[i]) / (ge[i] - gs[i])) * 100}%`, height: '100%', background: P.ink }} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 48, top: 72, right: 48, display: 'flex', justifyContent: 'space-between', opacity: entra * (1 - sale), fontFamily: U, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: P.mute }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: P.or }} />
          {g.etiqueta}
        </div>
        <div>{marca}</div>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 132, width: 960, fontFamily: T, fontWeight: 700, fontSize: 76, lineHeight: 1.04, textTransform: 'uppercase', color: P.ink, opacity: 1 - sale, letterSpacing: -1 }}>
        {palabras.map((w, i) => {
          const k = /^\*/.test(w) || clave
          const abre = /^\*/.test(w), cierra = /\*[,.:;]?$/.test(w)
          if (abre && !cierra) clave = true
          if (cierra) clave = false
          const lim = w.replace(/\*/g, '')
          const q = pr(t, t0 + i * 0.07, 0.4)
          return (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', marginRight: '0.26em', paddingBottom: 6, marginBottom: -6 }}>
              <span style={{ display: 'inline-block', transform: `translateY(${(1 - q) * 105}%)`, color: k ? P.or : P.ink }}>{lim}</span>
            </span>
          )
        })}
      </div>
    </>
  )
}

/* ───────────── subtítulos ───────────── */
const Subtitulos = ({ t, fr }) => {
  const trozos = []
  fr.forEach((f, fi) => {
    let cur = []
    f.palabras.forEach((p, j) => {
      cur.push(p)
      const corta = /[,:.?!]$/.test(p.w) && cur.length >= 3
      if (cur.length >= 6 || corta || j === f.palabras.length - 1) {
        trozos.push({ p: cur, fi })
        cur = []
      }
    })
  })
  const idx = trozos.findIndex((z, i) => {
    const a = z.p[0].t0 - 0.04
    const sig = trozos[i + 1]
    const b = sig && sig.fi === z.fi ? sig.p[0].t0 - 0.04 : fr[z.fi].fin + 0.3
    return t >= a && t < b
  })
  if (idx < 0) return null
  const z = trozos[idx]
  const q = pr(t, z.p[0].t0 - 0.04, 0.18)
  return (
    <div style={{ position: 'absolute', left: 50, top: 1545, width: 980, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 14}px)` }}>
      <div style={{ background: 'rgba(255,255,255,.88)', border: `2px solid ${P.line}`, borderRadius: 30, padding: '20px 34px', textAlign: 'center', whiteSpace: 'nowrap', fontFamily: U, fontWeight: 600, fontSize: 48, lineHeight: 1.25, color: P.ink, boxShadow: '0 12px 30px rgba(90,45,10,.08)' }}>
        {z.p.map((p, i) => (
          <span key={i} style={{ visibility: t >= p.t0 - 0.02 ? 'visible' : 'hidden', fontWeight: p.k ? 800 : 600, color: p.k ? P.orD : P.ink, textDecoration: p.k ? 'underline' : 'none', textDecorationColor: P.or, textDecorationThickness: 6, textUnderlineOffset: 9 }}>
            {p.w}
            {i < z.p.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────────── transición de puntos ───────────── */
const Puntos = ({ t, ts }) => {
  const cols = 10, filas = 18, c = 108
  const rel = (t - ts) / 0.7
  if (Math.abs(rel) > 1.1) return null
  const circ = []
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < filas; j++) {
      const dd = ((i + j * 0.4) / (cols + filas * 0.4) - 0.5) * 0.32
      const u = (t - ts - dd) / 0.62 + 0.5
      const r = 80 * clamp(2.6 * (1 - Math.abs(2 * u - 1)))
      if (r > 0.5) circ.push(<circle key={i * 40 + j} cx={i * c + c / 2} cy={j * 107 + 54} r={r} fill={P.ink} />)
    }
  }
  return (
    <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0, zIndex: 30 }}>
      {circ}
    </svg>
  )
}

/* ───────────── escenas ───────────── */
const Num = ({ t, g, a }) =>
  g.num ? (
    <div style={{ position: 'absolute', right: 20, top: 1090, fontFamily: T, fontWeight: 700, fontSize: 520, lineHeight: 1, color: P.or, opacity: 0.07 * pr(t, a, 0.6), letterSpacing: -20 }}>{g.num}</div>
  ) : null

// 0 · gancho
const S0 = ({ t, W }) => {
  const k = W(0, 4)
  const q = pr(t, k, 0.5, outB)
  const letras = ['M', 'C', 'P']
  return (
    <>
      <Mascota x={540} y={880 + q * 190} s={1.7 - q * 0.35} mood={t > k ? 'happy' : 'ok'} look={[0, -4]} t={t} />
      {[0, 1, 2].map((i) => {
        const o = pr(t, W(0, 1) + i * 0.4, 0.3)
        return o < 0.99 && t < k ? (
          <Pos key={i} x={400 + i * 140} y={540 - o * 40 + (i % 2) * 30} o={o * (1 - pr(t, k - 0.15, 0.15))} s={0.8 + o * 0.5}>
            <Txt size={150} w={700} f={T} c={P.or}>?</Txt>
          </Pos>
        ) : null
      })}
      {letras.map((l, i) => {
        const pp = pop(t, k + i * 0.09)
        const caida = (1 - outB(clamp((t - k - i * 0.09) / 0.45))) * -260
        return t >= k ? (
          <Caja key={l} x={85 + i * 305} y={470 + (i === 1 ? 0 : 20)} w={270} h={310} bg={P.or} borde={P.orD} r={64} o={pp.o} dy={caida} s={pp.s}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: T, fontWeight: 700, fontSize: 210, color: '#fff' }}>{l}</div>
          </Caja>
        ) : null
      })}
    </>
  )
}

// 1 · significado
const S1 = ({ t, W, a }) => {
  const tU = W(1, 15)
  const sale = pr(t, tU - 0.25, 0.4, io3)
  const filas = [
    { n: 'Model', d: 'Modelo: el cerebro, Claude', ic: 'cerebro', t0: W(1, 1) },
    { n: 'Context', d: 'Contexto: tus datos y apps', ic: 'carpeta', t0: W(1, 2) },
    { n: 'Protocol', d: 'Protocolo: reglas para conectar', ic: 'enchufe', t0: W(1, 3) },
  ]
  const tP = W(1, 16)
  const enchufe = pr(t, tP - 0.45, 0.5, io3)
  const conectado = t > tP + 0.12
  const brillo = pr(t, tP + 0.1, 0.6)
  const herr = ['calendario', 'carpeta', 'correo', 'codigo', 'chat', 'engranaje']
  const aparecen = pr(t, tU, 0.5)
  return (
    <>
      {filas.map((f, i) => {
        const q = pop(t, f.t0 - 0.05)
        return (
          <Caja key={i} x={60} y={470 + i * 250} w={960} h={210} o={q.o * (1 - sale)} s={q.s} dx={-sale * 160}>
            <div style={{ position: 'absolute', left: 36, top: 40, width: 130, height: 130, borderRadius: 40, background: i === 0 ? P.or : P.orS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic tipo={f.ic} size={88} c={i === 0 ? '#fff' : P.orD} />
            </div>
            <Txt f={T} w={700} size={58} style={{ position: 'absolute', left: 200, top: 38 }}>{f.n}</Txt>
            <Txt size={33} w={600} c={P.mute} style={{ position: 'absolute', left: 200, top: 118 }}>{f.d}</Txt>
          </Caja>
        )
      })}
      <Pastilla x={60} y={1250} texto="ESTÁNDAR ABIERTO" icono="abierto" o={pop(t, W(1, 5)).o * (1 - sale)} s={pop(t, W(1, 5)).s} />
      {/* USB-C */}
      <Caja x={50} y={690} w={300} h={350} o={aparecen} dx={(1 - aparecen) * -80}>
        <Mascota x={150} y={185} s={0.8} mood="happy" t={t} />
        <Txt f={T} w={700} size={36} style={{ position: 'absolute', left: 0, width: 300, textAlign: 'center', top: 290 }}>Claude</Txt>
      </Caja>
      <Caja x={650} y={560} w={380} h={620} o={aparecen} dx={(1 - aparecen) * 80}>
        <Txt f={T} w={700} size={34} style={{ position: 'absolute', left: 0, width: 380, textAlign: 'center', top: 26 }}>Tus herramientas</Txt>
        {herr.map((h, i) => {
          const luz = clamp((t - (tP + 0.4 + i * 0.12)) / 0.2)
          return (
            <div key={h} style={{ position: 'absolute', left: 36 + (i % 2) * 150, top: 100 + Math.floor(i / 2) * 170, width: 130, height: 140, borderRadius: 30, background: luz > 0 ? P.grS : P.gris, border: `3px solid ${luz > 0 ? P.gr : P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic tipo={h} size={74} c={luz > 0 ? P.gr : P.mute} />
              {luz > 0 && <div style={{ position: 'absolute', right: -12, top: -12 }}><Check size={40} s={outB(luz)} /></div>}
            </div>
          )
        })}
        <div style={{ position: 'absolute', left: -10, top: 295, width: 26, height: 34, borderRadius: 8, background: P.ink }} />
      </Caja>
      {aparecen > 0.3 && (
        <>
          <div style={{ position: 'absolute', left: 350, top: 862, width: 90 + enchufe * 160, height: 16, background: P.ink, borderRadius: 8, opacity: aparecen }} />
          <div style={{ position: 'absolute', left: 436 + enchufe * 160, top: 836, width: 120, height: 70, borderRadius: 18, background: P.ink, opacity: aparecen, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 64, height: 22, borderRadius: 12, background: '#5E554C' }} />
          </div>
          {conectado && <div style={{ position: 'absolute', left: 600, top: 815, width: 110, height: 110, borderRadius: '50%', border: `6px solid ${P.or}`, opacity: 1 - brillo, transform: `scale(${0.6 + brillo * 1.1})` }} />}
          <Pastilla x={420} y={730} texto="USB-C" o={pop(t, tP - 0.1).o} s={pop(t, tP - 0.1).s} />
        </>
      )}
    </>
  )
}

// 2 · sin / con MCP
const S2 = ({ t, W }) => {
  const tc = W(2, 5)
  const pB = pr(t, tc - 0.15, 0.55, io3)
  const on = pr(t, tc, 0.25)
  const items = [
    { ic: 'calendario', n: 'Calendario', t0: W(2, 10) },
    { ic: 'carpeta', n: 'Archivos', t0: W(2, 12) },
    { ic: 'correo', n: 'Correos', t0: W(2, 15) },
  ]
  return (
    <>
      <Caja x={60} y={700 - pB * 235} w={960} h={420} bg={P.gris} borde={P.line} o={1 - pB * 0.35} sombra={false}>
        <Mascota x={200} y={225} s={0.85} mood="sad" look={[-6, 4]} t={t} />
        <Caja x={400} y={110} w={500} h={130} bg="#fff" r={44} sombra={false} borde={P.line}>
          <Txt size={38} w={600} c={P.mute} style={{ padding: '38px 40px' }}>Hola, ¿en qué te ayudo?</Txt>
        </Caja>
        <Pastilla x={40} y={330} texto="SOLO CONVERSA" c={P.mute} bg="#fff" size={32} />
        <Interruptor x={790} y={310} on={0} w={120} h={64} />
        <Txt size={28} w={700} c={P.mute} style={{ position: 'absolute', left: 720, top: 322, width: 60, textAlign: 'right' }}>OFF</Txt>
      </Caja>
      {pB > 0.01 && (
        <Caja x={60} y={950} w={960} h={450} o={pB} dy={(1 - pB) * 80} borde={P.or} bw={5}>
          <Mascota x={185} y={235} s={0.9} mood="happy" arms={0.6 * pr(t, tc, 0.5)} t={t} />
          {items.map((it, i) => {
            const q = pop(t, it.t0 - 0.1)
            const ok = t > it.t0 + 0.15
            return (
              <div key={i} style={{ position: 'absolute', left: 390 + i * 190, top: 80, width: 165, height: 200, borderRadius: 34, background: ok ? P.grS : P.gris, border: `3px solid ${ok ? P.gr : P.line}`, opacity: q.o, transform: `scale(${q.s})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Ic tipo={it.ic} size={78} c={ok ? P.gr : P.mute} />
                <Txt size={26} w={700} c={ok ? '#1E8F57' : P.mute}>{it.n}</Txt>
                {ok && <div style={{ position: 'absolute', right: -12, top: -14 }}><Check size={44} s={outB(clamp((t - it.t0 - 0.15) / 0.3))} /></div>}
              </div>
            )
          })}
          <Pastilla x={40} y={355} texto="ACTÚA" c={P.gr} bg={P.grS} size={32} />
          <Interruptor x={790} y={340} on={on} w={120} h={64} />
          <Txt size={28} w={700} c={P.gr} style={{ position: 'absolute', left: 730, top: 352, width: 50, textAlign: 'right', opacity: on }}>ON</Txt>
        </Caja>
      )}
    </>
  )
}

// 3 · ejemplo en chat
const S3 = ({ t, W }) => {
  const dice = W(3, 4)
  const pal = ['mueve', 'mi', 'reunión', 'a', 'las', 'cuatro']
  const vistas = pal.filter((_, i) => t >= W(3, 4 + i) - 0.02)
  const tR = W(3, 9) + 0.2
  const tH = W(3, 10) + 0.05
  const mueve = pr(t, tH, 0.45, io3)
  const hecho = t > tH + 0.45
  return (
    <>
      <Caja x={60} y={470} w={960} h={990} bg="#fff">
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 100, borderBottom: `3px solid ${P.line}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 36px' }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: P.gr }} />
          <Txt size={34} w={700} f={T}>Claude + Calendario</Txt>
        </div>
        {vistas.length > 0 && (
          <Caja x={250} y={140} w={660} h={110} bg={P.ink} borde={P.ink} r={40} sombra={false} o={pop(t, dice).o} s={pop(t, dice).s} style={{ transformOrigin: '100% 50%' }}>
            <Txt size={42} w={600} c="#fff" style={{ padding: '30px 38px', whiteSpace: 'nowrap' }}>{vistas.join(' ')}</Txt>
          </Caja>
        )}
        {t >= tR && (
          <>
            <Caja x={36} y={300} w={720} h={140} bg={P.orS} borde={P.orS} r={40} sombra={false} o={pop(t, tR).o} s={pop(t, tR).s} style={{ transformOrigin: '0 50%' }}>
              <Txt size={38} w={600} style={{ padding: '36px 40px' }}>{hecho ? 'Listo, reunión movida a las 4.' : 'Voy a moverla…'}</Txt>
            </Caja>
            <Caja x={36} y={480} w={888} h={360} bg="#fff" r={36} o={pop(t, tR + 0.15).o} s={pop(t, tR + 0.15).s} style={{ transformOrigin: '0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '26px 34px' }}>
                <Ic tipo="calendario" size={72} c={P.or} />
                <Txt size={36} w={700} f={T}>Calendario · Hoy</Txt>
              </div>
              <div style={{ position: 'absolute', left: 34, right: 34, top: 130, height: 3, background: P.line }} />
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: 'absolute', left: 34, top: 160 + i * 64, width: 120, height: 26, borderRadius: 13, background: P.gris }} />
              ))}
              <div style={{ position: 'absolute', left: 200, right: 34, top: 150, height: 170 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 330, height: 130, borderRadius: 28, background: P.or, color: '#fff', padding: '24px 28px', boxSizing: 'border-box', transform: `translateX(${mueve * 298}px)`, boxShadow: '0 14px 26px rgba(232,112,58,.35)' }}>
                  <Txt size={34} w={700} c="#fff" f={T}>Reunión</Txt>
                  <Txt size={32} w={600} c="#fff" style={{ opacity: 0.95 }}>{mueve > 0.5 ? '4:00 PM' : '3:00 PM'}</Txt>
                </div>
              </div>
              {hecho && <div style={{ position: 'absolute', right: 40, top: 28 }}><Check size={64} s={outB(clamp((t - tH - 0.4) / 0.35))} /></div>}
            </Caja>
          </>
        )}
        <Caja x={36} y={880} w={888} h={80} bg={P.gris} borde={P.gris} r={40} sombra={false}>
          <Txt size={30} w={500} c={P.mute} style={{ padding: '24px 36px' }}>{vistas.length === 0 ? 'Escríbele a Claude…' : ''}{vistas.length === 0 && Math.floor(t * 2) % 2 === 0 ? '|' : ''}</Txt>
        </Caja>
      </Caja>
    </>
  )
}

// 4 · una sola vez
const S4 = ({ t, W }) => {
  const t1 = W(4, 3)
  const tF = W(4, 8)
  const herr = ['calendario', 'carpeta', 'correo', 'codigo', 'chat', 'engranaje']
  const R = 330
  const cx = 540, cy = 930
  const q = pop(t, t1)
  const uno = pop(t, W(4, 5))
  return (
    <>
      {herr.map((h, i) => {
        const ang = (-90 + i * 60) * (Math.PI / 180)
        const x = cx + Math.cos(ang) * R, y = cy + Math.sin(ang) * R
        const luz = clamp((t - (tF + i * 0.12)) / 0.25)
        const linea = pr(t, t1 + 0.15 + i * 0.1, 0.3)
        return (
          <React.Fragment key={h}>
            <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0 }}>
              <line x1={cx} y1={cy} x2={cx + (x - cx) * linea} y2={cy + (y - cy) * linea} stroke={luz > 0 ? P.gr : '#CFC4B6'} strokeWidth="8" strokeLinecap="round" strokeDasharray={luz > 0 ? '0' : '2 16'} />
            </svg>
            <div style={{ position: 'absolute', left: x - 85, top: y - 85, width: 170, height: 170, borderRadius: 42, background: luz > 0 ? P.grS : '#fff', border: `4px solid ${luz > 0 ? P.gr : P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: linea, transform: `scale(${0.7 + 0.3 * linea + 0.08 * Math.sin(luz * Math.PI)})`, boxShadow: '0 16px 36px rgba(90,45,10,.10)' }}>
              <Ic tipo={h} size={96} c={luz > 0 ? P.gr : P.mute} />
              {luz > 0 && <div style={{ position: 'absolute', right: -14, top: -14 }}><Check size={48} s={outB(luz)} /></div>}
            </div>
          </React.Fragment>
        )
      })}
      <div style={{ position: 'absolute', left: cx - 130, top: cy - 130, width: 260, height: 260, borderRadius: '50%', background: P.or, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: q.o, transform: `scale(${q.s})`, boxShadow: '0 24px 50px rgba(232,112,58,.4)' }}>
        <Ic tipo="enchufe" size={110} c="#fff" />
        <Txt f={T} w={700} size={44} c="#fff">MCP</Txt>
      </div>
      <Sello x={cx - 260} y={cy + 440} texto="1 SOLA VEZ" c={P.ink} rot={-5} o={uno.o} s={uno.s} size={58} />
    </>
  )
}

// 5 · sin programar
const S5 = ({ t, W, a }) => {
  const tNo = W(5, 1)
  const tCod = W(5, 3)
  const tX = W(5, 6)
  const tOk = W(5, 7)
  const lineas = [
    [['const', '#E8703A'], [' cliente', '#F2EDE6'], [' = ', '#9A8F85'], ['nuevo', '#E8703A'], ['()', '#F2EDE6']],
    [['conectar', '#7FD3A5'], ['(calendario, {', '#F2EDE6']],
    [['  token', '#F2EDE6'], [': ', '#9A8F85'], ['"•••••••"', '#F5B83D'], [',', '#F2EDE6']],
    [['  permisos', '#F2EDE6'], [': ', '#9A8F85'], ['[', '#F2EDE6'], ['"leer"', '#F5B83D'], [']', '#F2EDE6']],
    [['})', '#F2EDE6']],
    [['// a la medida…', '#8C8076']],
  ]
  const x = pr(t, tX, 0.35)
  const ok = pop(t, tOk)
  const caja = pr(t, a + 0.05, 0.4)
  return (
    <>
      <Caja x={60} y={500} w={960} h={600} bg="#1D1A17" borde="#1D1A17" o={caja * (1 - ok.o * 0.0)} dy={(1 - caja) * 50}>
        <div style={{ display: 'flex', gap: 12, padding: '26px 30px' }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (<div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />))}</div>
        <div style={{ padding: '10px 44px', fontFamily: "'SF Mono', Menlo, monospace", fontSize: 40, lineHeight: 1.75, whiteSpace: 'pre' }}>
          {lineas.map((l, i) => {
            const v = clamp((t - (tCod + i * 0.2)) / 0.2)
            return (<div key={i} style={{ opacity: v, transform: `translateX(${(1 - v) * 20}px)` }}>{l.map(([s, c], j) => (<span key={j} style={{ color: c }}>{s}</span>))}</div>)
          })}
        </div>
        {x > 0 && (
          <svg width="960" height="600" style={{ position: 'absolute', left: 0, top: 0 }}>
            <line x1="60" y1="70" x2={60 + 840 * x} y2={70 + 460 * x} stroke={P.rd} strokeWidth="22" strokeLinecap="round" opacity="0.92" />
            <line x1="900" y1="70" x2={900 - 840 * x} y2={70 + 460 * x} stroke={P.rd} strokeWidth="22" strokeLinecap="round" opacity="0.92" />
          </svg>
        )}
      </Caja>
      <Sello x={640} y={430} texto="NO" rot={10} o={pop(t, tNo).o} s={pop(t, tNo).s} size={70} />
      {t >= tOk && (
        <Caja x={140} y={1170} w={800} h={200} bg={P.grS} borde={P.gr} bw={5} o={ok.o} s={ok.s}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '40px 50px' }}>
            <Check size={110} />
            <div>
              <Txt f={T} w={700} size={50}>Solo conectas</Txt>
              <Txt size={34} w={600} c={P.mute}>y Claude ya sabe usarlo</Txt>
            </div>
          </div>
        </Caja>
      )}
    </>
  )
}

// 6 · tú decides
const S6 = ({ t, W }) => {
  const tD = W(6, 2)
  const tC = W(6, 10)
  const filas = [{ ic: 'calendario', n: 'Calendario' }, { ic: 'carpeta', n: 'Archivos' }, { ic: 'correo', n: 'Correos' }]
  const off = pr(t, tC, 0.3)
  const c = kf(t, [{ t: W(6, 4), x: 900, y: 1400 }, { t: tC - 0.1, x: 880, y: 1076 }])
  return (
    <>
      <Caja x={60} y={480} w={960} h={800}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '30px 40px', borderBottom: `3px solid ${P.line}` }}>
          <Ic tipo="candado" size={62} c={P.ink} />
          <Txt f={T} w={700} size={42}>Permisos de Claude</Txt>
        </div>
        {filas.map((f, i) => {
          const q = pop(t, tD + i * 0.2)
          const bloq = i === 2 && off > 0.5
          return (
            <div key={i} style={{ position: 'absolute', left: 30, right: 30, top: 150 + i * 200, height: 170, borderRadius: 34, background: bloq ? P.rdS : P.gris, border: `3px solid ${bloq ? P.rd : P.line}`, opacity: q.o, transform: `scale(${q.s})`, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 26 }}>
              <Ic tipo={f.ic} size={84} c={bloq ? P.rd : P.ink} />
              <div style={{ flex: 1 }}>
                <Txt f={T} w={700} size={44}>{f.n}</Txt>
                <Txt size={30} w={600} c={bloq ? P.rd : '#1E8F57'}>{bloq ? 'Bloqueado' : 'Permitido'}</Txt>
              </div>
              <div style={{ position: 'relative', width: 130, height: 70 }}><Interruptor x={0} y={0} on={i === 2 ? 1 - off : 1} w={130} h={70} /></div>
            </div>
          )
        })}
      </Caja>
      <Sello x={600} y={400} texto="TÚ MANDAS" c={P.or} rot={7} o={pop(t, W(6, 1)).o} s={pop(t, W(6, 1)).s} size={46} />
      {t >= W(6, 4) && <Cursor x={c.x} y={c.y} clic={clamp((t - tC) / 0.5)} />}
    </>
  )
}

// 7 · manos
const S7 = ({ t, W }) => {
  const tM = W(7, 3)
  const q = pr(t, tM - 0.3, 0.6, outB)
  const glow = pr(t, tM, 0.8)
  const tarjetas = [
    { ic: 'calendario', x: 40, y: 560 },
    { ic: 'correo', x: 810, y: 560 },
    { ic: 'carpeta', x: 40, y: 1130 },
    { ic: 'codigo', x: 810, y: 1130 },
  ]
  return (
    <>
      {glow > 0 && <div style={{ position: 'absolute', left: 540 - 380, top: 900 - 380, width: 760, height: 760, borderRadius: '50%', background: `radial-gradient(circle, ${P.orS} 0%, rgba(251,227,211,0) 68%)`, opacity: glow }} />}
      <Mascota x={540} y={900} w={900} h={900} s={1.55} mood="happy" arms={q} look={[0, -3]} t={t} />
      {tarjetas.map((c, i) => {
        const p2 = pop(t, tM + 0.1 + i * 0.12)
        return (
          <Caja key={i} x={c.x} y={c.y + Math.sin(t * 2 + i) * 8} w={230} h={230} o={p2.o} s={p2.s}>
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic tipo={c.ic} size={120} c={P.or} /></div>
          </Caja>
        )
      })}
      <Pastilla x={430} y={1260} texto="MCP" size={56} o={pr(t, tM, 0.3)} s={0.9 + 0.1 * pr(t, tM, 0.4, outB)} />
    </>
  )
}

// 8 · cierre
export const Cierre = ({ t, W, fr, marca, k = 8 }) => {
  const tG = W(k, 0), tS = W(k, 4)
  const q = pop(t, tG)
  const sigue = clamp((t - tS - 0.35) / 0.2)
  const cur = kf(t, [{ t: tS - 0.8, x: 900, y: 1250 }, { t: tS + 0.3, x: 790, y: 1035 }])
  const bm = 1 + 0.12 * Math.sin(clamp((t - tG) / 0.6) * Math.PI)
  return (
    <>
      <div style={{ position: 'absolute', left: 340, top: 500, width: 150, height: 150, borderRadius: '50%', background: '#fff', border: `4px solid ${P.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: q.o, transform: `scale(${q.s * bm})`, boxShadow: '0 16px 34px rgba(90,45,10,.12)' }}>
        <Ic tipo="marcador" size={90} c={P.ink} />
      </div>
      <div style={{ position: 'absolute', left: 590, top: 500, width: 150, height: 150, borderRadius: '50%', background: '#fff', border: `4px solid ${P.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: q.o, transform: `scale(${q.s})` }}>
        <Ic tipo="enviar" size={84} c={P.mute} />
      </div>
      <Caja x={70} y={780} w={940} h={340} o={pop(t, tG + 0.2).o} s={pop(t, tG + 0.2).s}>
        <div style={{ position: 'absolute', left: 40, top: 40, width: 150, height: 150, borderRadius: '50%', background: P.or, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `5px dashed ${P.ink}`, boxSizing: 'border-box' }}>
          <svg width="110" height="110" viewBox="-60 -60 120 120"><Claude x={0} y={6} s={0.32} t={t} /></svg>
        </div>
        <Txt f={T} w={700} size={50} style={{ position: 'absolute', left: 230, top: 54 }}>{marca}</Txt>
        <Txt size={30} w={600} c={P.mute} style={{ position: 'absolute', left: 230, top: 124 }}>Aprende a usar Claude</Txt>
        <div style={{ position: 'absolute', left: 40, right: 40, top: 230, height: 76, borderRadius: 40, background: sigue > 0.5 ? P.gris : P.ink, color: sigue > 0.5 ? P.ink : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: U, fontWeight: 800, fontSize: 34, letterSpacing: 2 }}>
          {sigue > 0.5 ? (<><Check size={40} c={P.gr} /> SIGUIENDO</>) : 'SEGUIR'}
        </div>
      </Caja>
      <Cursor x={cur.x} y={cur.y} clic={clamp((t - tS - 0.3) / 0.5)} />
      <Txt f={T} w={700} size={72} style={{ position: 'absolute', left: 0, width: 1080, textAlign: 'center', top: 1220, opacity: pr(t, tS + 0.5, 0.5) }}>
        <span style={{ color: P.or }}>●</span> {marca}
      </Txt>
    </>
  )
}

const S8 = (r) => <Cierre {...r} k={8} />
const ESCENAS_MCP = [S0, S1, S2, S3, S4, S5, S6, S7, S8]

/* ───────────── composición ───────────── */
export const Pro = ({ frases, grupos, marca, transiciones = [], escenas = 'mcp', paleta = null }) => {
  useFuentes()
  if (paleta) Object.assign(P, paleta)
  const ESCENAS = escenas === 'modos' ? ESCENAS_MODOS : ESCENAS_MCP
  const f = useCurrentFrame()
  const t = f / FPS
  const W = mkW(frases)
  const gs = inicios(frases, grupos, transiciones)
  const total = frases.at(-1).fin + 1.5
  const ge = grupos.map((_, i) => (i < grupos.length - 1 ? gs[i + 1] : total))
  let gi = 0
  gs.forEach((a, i) => { if (t >= a) gi = i })
  return (
    <AbsoluteFill style={{ background: P.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${P.line} 2px, transparent 2.4px)`, backgroundSize: '54px 54px', opacity: 0.55 }} />
      <Num t={t} g={grupos[gi]} a={gs[gi]} />
      {grupos.map((g, i) => {
        const Sc = ESCENAS[i]
        const a = gs[i], b = ge[i]
        if (!Sc || t < a - 0.01 || t > b + 0.01) return null
        const entraHT = transiciones.includes(i), saleHT = transiciones.includes(i + 1)
        const ent = entraHT ? 1 : pr(t, a, 0.35)
        const ext = saleHT || i === grupos.length - 1 ? 0 : pr(t, b - 0.2, 0.2, io3)
        return (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: ent * (1 - ext), transform: `translateY(${(1 - ent) * 40 - ext * 26}px)` }}>
            <Sc t={t} W={W} a={a} fr={frases} marca={marca} />
          </div>
        )
      })}
      <Cabecera t={t} gi={gi} gs={gs} ge={ge} grupos={grupos} marca={marca} W={W} fr={frases} />
      <Subtitulos t={t} fr={frases} />
      {transiciones.map((i) => (<Puntos key={i} t={t} ts={gs[i]} />))}
    </AbsoluteFill>
  )
}
