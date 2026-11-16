// Diseño «mercado»: fondo azul noche con una gráfica de dinero que sube durante TODO el video, dorado como acento,
// cortinas doradas que suben entre escenas y subtítulos con la palabra clave en dorado. Para videos de negocio / mentalidad.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const C = { bg: '#0A0E1A', card: '#131A2B', card2: '#1A2338', line: '#27324D', gold: '#F5C451', goldD: '#B98A1E', green: '#34D399', red: '#F87171', mute: '#8B94AB', ink: '#FFFFFF' }
const D = "'Poppins', 'Helvetica Neue', sans-serif"
const U = "'Inter', 'Helvetica Neue', sans-serif"

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

const Abs = ({ x, y, o = 1, s = 1, r = 0, origen = 'center', children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${s}) rotate(${r}deg)`, transformOrigin: origen, ...style }}>{children}</div>
)
const Tx = ({ c = C.ink, size = 40, w = 700, f = D, children, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.08, ...style }}>{children}</div>
)
const Lienzo = ({ children }) => (
  <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>{children}</svg>
)
const miles = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

const Persona = ({ x, y, s = 1, c = C.mute, o = 1, corona = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cx="0" cy="-26" r="17" fill={c} />
    <path d="M-31 40 v-8 a31 31 0 0 1 62 0 v8 z" fill={c} />
    {corona > 0 && <path d="M-20 -50 l5 -26 l15 14 l15 -14 l5 26 z" fill={C.gold} transform={`translate(0 ${(1 - corona) * -40}) scale(${corona})`} opacity={corona} />}
  </g>
)

const Ico = ({ tipo, size = 100, c = C.gold, sw = 6 }) => {
  const p = { stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  const g = {
    moneda: (<g {...p}><circle r="40" /><path d="M10 -18 q-6 -8 -16 -4 q-12 6 0 14 q12 6 0 14 q-10 4 -16 -4 M0 -30 v60" /></g>),
    equipo: (<g {...p}><circle cx="0" cy="-18" r="14" /><path d="M-26 30 a26 26 0 0 1 52 0 z" /><circle cx="-36" cy="-4" r="10" /><circle cx="36" cy="-4" r="10" /></g>),
    reloj: (<g {...p}><circle r="40" /><polyline points="0,-22 0,0 18,12" /></g>),
    rayo: (<g {...p}><path d="M8 -50 L-28 6 H-2 L-8 50 L28 -6 H2 z" /></g>),
    idea: (<g {...p}><path d="M-18 20 q-26 -18 -16 -42 a34 34 0 0 1 68 0 q10 24 -16 42 z" /><line x1="-12" y1="34" x2="12" y2="34" /><line x1="-8" y1="46" x2="8" y2="46" /></g>),
    robot: (<g {...p}><rect x="-34" y="-24" width="68" height="56" rx="14" /><line x1="0" y1="-24" x2="0" y2="-42" /><circle cx="0" cy="-46" r="5" /><circle cx="-14" cy="2" r="5" /><circle cx="14" cy="2" r="5" /><line x1="-12" y1="20" x2="12" y2="20" /></g>),
    flecha: (<g {...p}><polyline points="-34,24 -6,-4 10,12 38,-24" /><polyline points="14,-24 38,-24 38,0" /></g>),
    cohete: (<g {...p}><path d="M0 -50 q26 18 22 56 l-22 14 l-22 -14 q-4 -38 22 -56 z" /><circle cx="0" cy="-12" r="8" /><path d="M-22 14 l-14 14 M22 14 l14 14" /></g>),
    engranaje: (<g {...p}><circle r="16" /><path d="M0 -44 v14 M0 30 v14 M-44 0 h14 M30 0 h14 M-31 -31 l10 10 M21 21 l10 10 M31 -31 l-10 10 M-21 21 l-10 10" /></g>),
    libro: (<g {...p}><path d="M0 -30 q-22 -12 -40 -6 v62 q18 -6 40 6 q22 -12 40 -6 v-62 q-18 -6 -40 6 z" /><line x1="0" y1="-30" x2="0" y2="32" /></g>),
    check: (<g {...p}><polyline points="-30,2 -10,24 32,-24" /></g>),
    cruz: (<g {...p}><line x1="-28" y1="-28" x2="28" y2="28" /><line x1="28" y1="-28" x2="-28" y2="28" /></g>),
    corazon: (<g {...p}><path d="M0 36 C-60 -4 -38 -48 -8 -34 C-2 -30 0 -24 0 -20 C0 -24 2 -30 8 -34 C38 -48 60 -4 0 36 z" /></g>),
    marcador: (<g {...p}><path d="M-28 -46 h56 v94 l-28 -22 l-28 22 z" /></g>),
  }[tipo]
  return (<svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: 'block', overflow: 'visible' }}>{g}</svg>)
}

/* ───────────── fondo: la gráfica que sube todo el video ───────────── */
const curva = (u) => 1500 - 1180 * Math.pow(u, 2.3)
const Fondo = ({ t, total }) => {
  const prog = clamp(t / total)
  const n = 90
  const pts = []
  for (let i = 0; i <= n * prog; i++) { const u = i / n; pts.push([60 + u * 960, curva(u)]) }
  const fin = pts.at(-1) ?? [60, 1500]
  const linea = pts.map((p) => p.join(',')).join(' ')
  const area = pts.length > 1 ? `M${pts[0][0]},1920 L${linea.replace(/ /g, ' L')} L${fin[0]},1920 Z` : ''
  return (
    <Lienzo>
      <defs>
        <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.gold} stopOpacity="0.22" /><stop offset="1" stopColor={C.gold} stopOpacity="0" /></linearGradient>
      </defs>
      {[300, 540, 780, 1020, 1260, 1500, 1740].map((y) => (<line key={y} x1="0" x2="1080" y1={y} y2={y} stroke={C.line} strokeWidth="2" opacity="0.5" />))}
      {[180, 360, 540, 720, 900].map((x) => (<line key={x} y1="0" y2="1920" x1={x} x2={x} stroke={C.line} strokeWidth="2" opacity="0.3" />))}
      {area && <path d={area} fill="url(#gA)" />}
      {pts.length > 1 && <polyline points={linea} fill="none" stroke={C.gold} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />}
      <circle cx={fin[0]} cy={fin[1]} r={26 + Math.sin(t * 6) * 4} fill={C.gold} opacity="0.18" />
      <circle cx={fin[0]} cy={fin[1]} r="10" fill={C.gold} />
    </Lienzo>
  )
}

/* ───────────── escenas ───────────── */
const Tarjeta = ({ x, y, w, h, o = 1, s = 1, borde = C.line, bg = C.card, children, style }) => (
  <Abs x={x} y={y} o={o} s={s} style={{ width: w, height: h, borderRadius: 36, background: bg, border: `3px solid ${borde}`, boxShadow: '0 20px 50px rgba(0,0,0,.4)', ...style }}>{children}</Abs>
)

// 0 · gancho: moneda que gira + contador hasta un millón
const G0 = ({ t, W }) => {
  const tc = W(0, 4), tm = W(0, 7)
  const sx = Math.abs(Math.cos(t * 3.4))
  const q = pr(t, 0.1, 0.6, outB)
  const val = 1000000 * out3(clamp((t - tc) / (tm - tc + 0.5)))
  const slam = pr(t, tm - 0.05, 0.35, outB)
  const chispas = Array.from({ length: 14 }, (_, i) => i)
  return (
    <>
      <Abs x={0} y={290} o={pr(t, 0.15, 0.4)} style={{ width: 1080, display: 'flex', justifyContent: 'center' }}>
        <div style={{ padding: '14px 36px', borderRadius: 60, border: `3px solid ${C.gold}`, color: C.gold, fontFamily: U, fontWeight: 700, fontSize: 36, letterSpacing: 6 }}>LA ERA DE LA IA</div>
      </Abs>
      <Lienzo>
        <g transform={`translate(540 640) scale(${q})`}>
          <ellipse cx="0" cy="250" rx="150" ry="18" fill="#000" opacity="0.35" />
          <g transform={`scale(${sx.toFixed(3)} 1)`}>
            <circle r="210" fill={C.goldD} />
            <circle r="196" fill={C.gold} />
            <circle r="160" fill="none" stroke={C.goldD} strokeWidth="8" />
            <text x="0" y="68" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="210" fill={C.goldD}>$</text>
          </g>
        </g>
        {chispas.map((i) => {
          const p = clamp((t - tm) / 0.9)
          const a = (i / 14) * Math.PI * 2
          const d = 160 + out3(p) * 320
          return p > 0 && p < 1 ? <rect key={i} x={540 + Math.cos(a) * d - 8} y={640 + Math.sin(a) * d - 8} width="16" height="16" fill={i % 2 ? C.gold : '#fff'} opacity={1 - p} transform={`rotate(${i * 30} ${540 + Math.cos(a) * d} ${640 + Math.sin(a) * d})`} /> : null
        })}
      </Lienzo>
      <Abs x={0} y={920} o={pr(t, tc - 0.2, 0.3)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={120} c={C.gold} style={{ letterSpacing: -3 }}>${miles(val)}</Tx>
      </Abs>
      <Abs x={0} y={1078} o={slam} s={0.8 + 0.2 * slam} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={104} c="#fff" style={{ letterSpacing: -2 }}>MILLONARIOS</Tx>
      </Abs>
    </>
  )
}

// 1 · uno: antes vs hoy
const G1 = ({ t, W }) => {
  const filas = [['moneda', 'Dinero', W(1, 7)], ['equipo', 'Un equipo', W(1, 9)], ['reloj', 'Años', W(1, 11)]]
  const tHoy = W(1, 12)
  const tach = pr(t, tHoy - 0.05, 0.5, io3)
  const hoy = pr(t, W(1, 13), 0.5, outB)
  return (
    <>
      <Tarjeta x={60} y={270} w={960} h={560} o={pr(t, 0.1, 0.4)}>
        <Tx size={34} c={C.mute} f={U} w={700} style={{ position: 'absolute', left: 44, top: 28, letterSpacing: 5 }}>ANTES NECESITABAS</Tx>
        {filas.map(([ic, tx, t0], i) => {
          const q = pr(t, t0 - 0.1, 0.35, outB)
          return (
            <div key={i} style={{ position: 'absolute', left: 44, top: 100 + i * 150, width: 870, height: 120, display: 'flex', alignItems: 'center', gap: 30, opacity: q, transform: `translateX(${(1 - q) * -80}px)` }}>
              <Ico tipo={ic} size={92} c={tach > 0.5 ? C.mute : C.ink} />
              <Tx size={64} c={tach > 0.5 ? C.mute : C.ink}>{tx}</Tx>
              <div style={{ position: 'absolute', left: 0, top: 58, height: 8, width: 850 * clamp(tach * 1.4 - i * 0.2), background: C.red, borderRadius: 4 }} />
            </div>
          )
        })}
      </Tarjeta>
      <Tarjeta x={60} y={880} w={960} h={330} o={hoy} s={0.9 + 0.1 * hoy} borde={C.gold} bg="#241D08">
        <Tx size={34} c={C.gold} f={U} w={700} style={{ position: 'absolute', left: 44, top: 28, letterSpacing: 5 }}>HOY</Tx>
        <div style={{ position: 'absolute', left: 44, top: 110, display: 'flex', alignItems: 'center', gap: 28 }}>
          <Ico tipo="idea" size={110} c={C.gold} />
          <Tx size={82} c="#fff" style={{ opacity: pr(t, W(1, 15) - 0.1, 0.3) }}>Idea</Tx>
          <Tx size={82} c={C.gold} style={{ opacity: pr(t, W(1, 16) - 0.05, 0.3) }}>+</Tx>
          <Ico tipo="robot" size={110} c={C.gold} />
          <Tx size={82} c={C.gold} style={{ opacity: pr(t, W(1, 20) - 0.15, 0.3) }}>IA</Tx>
        </div>
      </Tarjeta>
    </>
  )
}

// 2 · dos: 24 horas, sin cansancio, semanas → minutos
const G2 = ({ t, W }) => {
  const t24 = W(2, 7), tN = W(2, 12)
  const arc = clamp((t - (t24 - 0.2)) / 0.9)
  const R = 190
  const L = 2 * Math.PI * R
  const q = pr(t, 0.1, 0.5, outB)
  const chip = (x, y, w, txt, sub, t0, col) => {
    const k = pr(t, t0 - 0.1, 0.35, outB)
    return (
      <Tarjeta x={x} y={y} w={w} h={150} o={k} s={0.85 + 0.15 * k} borde={col}>
        <div style={{ padding: '26px 30px' }}>
          <Tx size={30} c={C.mute} f={U} w={700} style={{ letterSpacing: 3 }}>{sub}</Tx>
          <Tx size={64} c={col}>{txt}</Tx>
        </div>
      </Tarjeta>
    )
  }
  const barA = pr(t, W(2, 18), 0.4)
  const barB = pr(t, W(2, 21), 0.8, io3)
  const barC = pr(t, W(2, 22) + 0.1, 0.5, io3)
  return (
    <>
      <Lienzo>
        <g transform={`translate(540 560) scale(${q})`}>
          <circle r={R} fill={C.card} stroke={C.line} strokeWidth="26" />
          <circle r={R} fill="none" stroke={C.gold} strokeWidth="26" strokeLinecap="round" strokeDasharray={`${L * arc} ${L}`} transform="rotate(-90)" />
          <text x="0" y="40" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="150" fill="#fff" letterSpacing="-4">24/7</text>
          <text x="0" y="104" textAnchor="middle" fontFamily={U} fontWeight="700" fontSize="34" fill={C.gold} letterSpacing="6">TRABAJANDO</text>
        </g>
      </Lienzo>
      {chip(60, 830, 460, 'CERO', 'CANSANCIO', W(2, 11), C.green)}
      {chip(560, 830, 460, '$0', 'NÓMINA', W(2, 13), C.green)}
      <Tarjeta x={60} y={1020} w={960} h={230} o={pr(t, W(2, 16), 0.3)}>
        <Tx size={30} c={C.mute} f={U} w={700} style={{ position: 'absolute', left: 36, top: 22, letterSpacing: 3 }}>TIEMPO PARA TERMINAR</Tx>
        <div style={{ position: 'absolute', left: 36, top: 76, width: 888, height: 54, borderRadius: 27, background: C.card2, overflow: 'hidden' }}>
          <div style={{ width: `${barB * 100}%`, height: '100%', background: C.mute }} />
          <Tx size={30} c="#000" f={U} w={700} style={{ position: 'absolute', left: 24, top: 10, opacity: barA }}>Antes: semanas</Tx>
        </div>
        <div style={{ position: 'absolute', left: 36, top: 148, width: 888, height: 54, borderRadius: 27, background: C.card2, overflow: 'hidden' }}>
          <div style={{ width: `${(0.1 + 0.0 * barC) * 100 * barC}%`, height: '100%', background: C.gold }} />
          <Tx size={30} c="#fff" f={U} w={700} style={{ position: 'absolute', left: 120 + 24, top: 10, opacity: barC }}>Con IA: minutos</Tx>
        </div>
      </Tarjeta>
    </>
  )
}

// 3 · tres: una persona = equipo de veinte
const G3 = ({ t, W }) => {
  const tV = W(3, 9), q = pr(t, W(3, 3) - 0.15, 0.5, outB)
  const m = pr(t, tV - 0.2, 0.55, io3)
  const sx = (i) => 540 + ((i % 5) - 2) * 150
  const sy = (i) => 380 + Math.floor(i / 5) * 140
  const cx = 540, cy = 560, id = 7
  const stats = [['ventas', 'VENTAS', W(3, 12)], ['contenido', 'CONTENIDO', W(3, 14)], ['clientes', 'CLIENTES', W(3, 16)]]
  return (
    <>
      <Abs x={0} y={262} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={50} c={C.mute} f={U} w={700} style={{ opacity: 1 - m, letterSpacing: 4, position: 'absolute', width: 1080 }}>1 PERSONA</Tx>
        <Tx size={50} c={C.gold} f={U} w={700} style={{ opacity: m, letterSpacing: 4, position: 'absolute', width: 1080 }}>= UN EQUIPO DE 20</Tx>
      </Abs>
      <Lienzo>
        {Array.from({ length: 20 }, (_, i) => {
          if (i === id) {
            const s = 2.4 - 1.3 * m
            return <Persona key={i} x={cx + (sx(i) - cx) * m} y={(cy + (sy(i) - cy) * m) + Math.sin(t * 3) * 4} s={s * q} c={C.gold} />
          }
          const d = Math.abs((i % 5) - 2) + Math.abs(Math.floor(i / 5) - 1)
          const k = pr(t, tV + 0.05 + d * 0.06, 0.35, outB)
          return <Persona key={i} x={sx(i)} y={sy(i)} s={1.1 * k} c={C.mute} o={k} />
        })}
      </Lienzo>
      {stats.map(([ic, tx, t0], i) => {
        const k = pr(t, t0 - 0.12, 0.35, outB)
        return (
          <Tarjeta key={i} x={60 + i * 330} y={960} w={300} h={260} o={k} s={0.85 + 0.15 * k} borde={C.green}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 30, gap: 14 }}>
              <Ico tipo="flecha" size={100} c={C.green} />
              <Tx size={36} c="#fff" f={U} w={700} style={{ letterSpacing: 1 }}>{tx}</Tx>
              <Tx size={44} c={C.green}>+{Math.round(300 * out3(clamp((t - t0) / 0.8)))}%</Tx>
            </div>
          </Tarjeta>
        )
      })}
    </>
  )
}

// 4 · cuatro: los grandes cambios (internet → celulares → IA)
const G4 = ({ t, W }) => {
  const t0 = W(4, 9), t1 = W(4, 11), t2 = W(4, 15), t3 = W(4, 21)
  const uMax = clamp((t - (t0 - 0.1)) / (t3 + 0.3 - t0))
  const u = Math.pow(uMax, 1)
  const fx = (v) => 100 + v * 880
  const fy = (v) => 1180 - 840 * Math.pow(v, 3.2)
  const n = 80
  const pts = []
  for (let i = 0; i <= n * u; i++) pts.push(`${fx(i / n)},${fy(i / n)}`)
  const nodo = (v, txt, a, t) => {
    const k = pr(t, a - 0.1, 0.35, outB)
    return (
      <>
        <circle cx={fx(v)} cy={fy(v)} r={16 * k} fill={C.gold} stroke="#0A0E1A" strokeWidth="5" />
        <g opacity={k} transform={`translate(${fx(v) - (v === 1 ? 110 : 0)} ${fy(v) - (v === 1 ? 0 : 70) - (1 - k) * 20})`}>
          <rect x="-110" y="-34" width="220" height="64" rx="32" fill={C.card} stroke={C.gold} strokeWidth="3" />
          <text x="0" y="12" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="36" fill="#fff">{txt}</text>
        </g>
      </>
    )
  }
  const bolt = pr(t, W(4, 22), 0.4, outB)
  return (
    <>
      <Abs x={0} y={262} o={pr(t, 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={50} c={C.mute} f={U} w={700} style={{ letterSpacing: 4 }}>LAS GRANDES FORTUNAS</Tx>
      </Abs>
      <Lienzo>
        <line x1="100" y1="1180" x2="1000" y2="1180" stroke={C.line} strokeWidth="4" />
        {pts.length > 1 && <polyline points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />}
        {nodo(0.25, 'INTERNET', t1, t)}
        {nodo(0.6, 'CELULARES', t2, t)}
        {nodo(1, 'IA', t3, t)}
      </Lienzo>
      <Abs x={100} y={440} o={bolt} s={0.7 + 0.3 * bolt} r={-4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: C.gold, borderRadius: 60, padding: '16px 40px 16px 26px' }}>
          <Ico tipo="rayo" size={70} c="#0A0E1A" sw={9} />
          <Tx size={52} c="#0A0E1A">MUCHO MÁS RÁPIDO</Tx>
        </div>
      </Abs>
    </>
  )
}

// 5 · casi nadie la sabe usar → años de ventaja
const G5 = ({ t, W }) => {
  const tN = W(5, 4), q = pr(t, 0.1, 0.4)
  const k = pr(t, tN - 0.1, 0.5, io3)
  const elegidos = [[5, 1], [2, 2]]
  const barra = pr(t, W(5, 13), 1.1, io3)
  return (
    <>
      <Abs x={0} y={262} o={q} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={50} c={C.mute} f={U} w={700} style={{ letterSpacing: 4 }}>PERSONAS QUE LA DOMINAN</Tx>
      </Abs>
      <Lienzo>
        {Array.from({ length: 32 }, (_, i) => {
          const c = i % 8, r = Math.floor(i / 8)
          const es = elegidos.some(([a, b]) => a === c && b === r)
          const a = pr(t, 0.2 + (c + r) * 0.03, 0.3, outB)
          return <Persona key={i} x={137 + c * 115} y={400 + r * 120} s={0.8 * a * (es ? 1 + 0.35 * k : 1)} c={es ? C.gold : C.mute} o={es ? 1 : 1 - 0.7 * k} />
        })}
      </Lienzo>
      <Abs x={0} y={820} o={pr(t, tN, 0.3)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={46} c={C.gold}>Casi nadie. Estamos en el minuto uno.</Tx>
      </Abs>
      <Tarjeta x={60} y={940} w={960} h={290} o={pr(t, W(5, 10) - 0.1, 0.4)}>
        <Tx size={30} c={C.mute} f={U} w={700} style={{ position: 'absolute', left: 36, top: 24, letterSpacing: 3 }}>TÚ, APRENDIENDO AHORA</Tx>
        <div style={{ position: 'absolute', left: 60, top: 120, width: 840, height: 20, borderRadius: 10, background: C.card2 }} />
        <div style={{ position: 'absolute', left: 60, top: 120, width: 840 * barra, height: 20, borderRadius: 10, background: C.gold }} />
        <div style={{ position: 'absolute', left: 40, top: 100, width: 60, height: 60, borderRadius: 30, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="cohete" size={38} c="#0A0E1A" sw={9} /></div>
        <div style={{ position: 'absolute', left: 860, top: 100, width: 60, height: 60, borderRadius: 30, background: C.mute, opacity: pr(t, W(5, 12), 0.4), display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="equipo" size={40} c="#0A0E1A" sw={9} /></div>
        <Tx size={56} c={C.gold} style={{ position: 'absolute', left: 0, right: 0, top: 184, textAlign: 'center', opacity: pr(t, W(5, 14), 0.3) }}>AÑOS DE VENTAJA</Tx>
      </Tarjeta>
    </>
  )
}

// 6 · la pregunta
const G6 = ({ t, W }) => {
  const lineas = [['¿SERÁS', W(6, 9), '#fff'], ['UNO DE', W(6, 12), '#fff'], ['ELLOS?', W(6, 14), C.gold]]
  const cor = pr(t, W(6, 12), 0.5, outB)
  return (
    <>
      <Abs x={0} y={262} o={pr(t, W(6, 1) - 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={50} c={C.mute} f={U} w={700} style={{ letterSpacing: 4 }}>LA PREGUNTA</Tx>
      </Abs>
      {lineas.map(([tx, t0, col], i) => {
        const k = pr(t, t0 - 0.12, 0.45, outB)
        return (
          <Abs key={i} x={0} y={370 + i * 190} o={clamp(k * 1.6)} s={0.7 + 0.3 * k} style={{ width: 1080, textAlign: 'center' }}>
            <Tx size={176} c={col} style={{ letterSpacing: -6 }}>{tx}</Tx>
          </Abs>
        )
      })}
      <Lienzo>
        {Array.from({ length: 7 }, (_, i) => {
          const es = i === 3
          const a = pr(t, W(6, 6) + i * 0.05, 0.4, outB)
          return <Persona key={i} x={150 + i * 130} y={1120 - (es ? 20 * cor : 0)} s={(es ? 1.2 + 0.5 * cor : 1.15) * a} c={es ? C.gold : '#3A4766'} corona={es ? cor : 0} />
        })}
      </Lienzo>
    </>
  )
}

// 7 · la oferta: conmigo
const G7 = ({ t, W }) => {
  const filas = [['libro', 'APRENDER IA', W(7, 2)], ['cohete', 'ESCALAR PROYECTOS', W(7, 5)], ['engranaje', 'AUTOMATIZAR TU NEGOCIO', W(7, 9)]]
  const tc = W(7, 13) - 0.05
  const k = pr(t, tc, 0.45, outB)
  return (
    <>
      <Abs x={0} y={262} o={pr(t, 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={50} c={C.mute} f={U} w={700} style={{ letterSpacing: 4 }}>SI QUIERES</Tx>
      </Abs>
      {filas.map(([ic, tx, t0], i) => {
        const q = pr(t, t0 - 0.12, 0.4, outB)
        return (
          <Tarjeta key={i} x={60} y={350 + i * 190} w={960} h={156} o={clamp(q * 1.5)} s={1} borde={C.gold} style={{ transform: `translateX(${(1 - q) * 160}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 30, padding: '0 36px', height: '100%' }}>
              <div style={{ width: 96, height: 96, borderRadius: 28, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo={ic} size={66} c="#0A0E1A" sw={9} /></div>
              <Tx size={tx.length > 18 ? 50 : 58} c="#fff" style={{ whiteSpace: 'nowrap' }}>{tx}</Tx>
            </div>
          </Tarjeta>
        )
      })}
      <Abs x={60} y={960} o={clamp(k * 1.6)} s={0.7 + 0.3 * k} style={{ width: 960 }}>
        <div style={{ background: C.gold, borderRadius: 48, padding: '22px 0 30px', textAlign: 'center', boxShadow: `0 0 90px ${C.gold}66` }}>
          <Tx size={44} c="#0A0E1A" f={U} w={700} style={{ letterSpacing: 8 }}>HAZLO</Tx>
          <Tx size={150} c="#0A0E1A" style={{ letterSpacing: -4 }}>CONMIGO</Tx>
        </div>
      </Abs>
    </>
  )
}

// 8 · cierre
const G8 = ({ t, W, handle }) => {
  const tS = W(8, 3)
  const letras = handle.split('')
  const sig = clamp((t - tS - 0.6) / 0.2)
  const flot = [{ ic: 'corazon', x: 170, t0: W(8, 0) }, { ic: 'marcador', x: 860, t0: W(8, 0) + 0.3 }, { ic: 'corazon', x: 520, t0: W(8, 5) }]
  return (
    <>
      <Abs x={0} y={330} o={pr(t, 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={40} c={C.gold} f={U} w={700} style={{ letterSpacing: 6 }}>IA · PROYECTOS · AUTOMATIZACIÓN</Tx>
      </Abs>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 98, letterSpacing: -2, whiteSpace: 'nowrap' }}>
        {letras.map((l, i) => {
          const p = pr(t, tS - 0.3 + i * 0.045, 0.3, outB)
          return <span key={i} style={{ display: 'inline-block', color: i === 0 ? '#fff' : C.gold, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 70}px)` }}>{l}</span>
        })}
      </div>
      <Abs x={290} y={680} o={pr(t, tS, 0.4)}>
        <div style={{ width: 500, height: 118, borderRadius: 60, background: sig > 0.5 ? 'transparent' : C.gold, border: `4px solid ${C.gold}`, color: sig > 0.5 ? C.gold : '#0A0E1A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: D, fontWeight: 700, fontSize: 52, letterSpacing: 2 }}>
          {sig > 0.5 ? (<><Ico tipo="check" size={54} c={C.gold} sw={10} /> SIGUIENDO</>) : 'SEGUIR'}
        </div>
      </Abs>
      {flot.map((f, i) => {
        const p = clamp((t - f.t0) / 2.2)
        return p > 0 && p < 1 ? (<Abs key={i} x={f.x} y={1100 - p * 480} o={Math.sin(p * Math.PI)} s={0.7 + p * 0.5}><Ico tipo={f.ic} size={110} c={C.gold} sw={7} /></Abs>) : null
      })}
    </>
  )
}

const ESC = [G0, G1, G2, G3, G4, G5, G6, G7, G8]

/* ───────────── subtítulos: la palabra clave se pone dorada ───────────── */
const Subs = ({ t, fr }) => {
  const trozos = []
  fr.forEach((f, fi) => {
    let cur = []
    f.palabras.forEach((p, j) => {
      cur.push(p)
      if (cur.length >= 4 || (/[,:.?!]$/.test(p.w) && cur.length >= 3) || j === f.palabras.length - 1) { trozos.push({ p: cur, fi }); cur = [] }
    })
  })
  const idx = trozos.findIndex((z, i) => {
    const a = z.p[0].t0 - 0.04
    const sig = trozos[i + 1]
    const b = sig && sig.fi === z.fi ? sig.p[0].t0 - 0.04 : fr[z.fi].fin + 0.28
    return t >= a && t < b
  })
  if (idx < 0) return null
  const z = trozos[idx]
  const q = pr(t, z.p[0].t0 - 0.04, 0.18)
  return (
    <div style={{ position: 'absolute', left: 50, right: 50, top: 1340, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 16}px)` }}>
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 64, lineHeight: 1.3, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 4px 24px rgba(0,0,0,.7)' }}>
        {z.p.map((p, i) => {
          const s = p.k ? 1 + 0.12 * pr(t, p.t0, 0.25, outB) : 1
          return <span key={i} style={{ display: 'inline-block', marginRight: 16, color: p.k ? C.gold : '#fff', transform: `scale(${s})`, visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>{p.w}</span>
        })}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Mercado = ({ frases, grupos, marca, usuario }) => {
  useFuentes()
  const f = useCurrentFrame()
  const t = f / FPS
  const W = mkW(frases)
  const gs = inicios(frases, grupos, [])
  const total = frases.at(-1).fin + 1.6
  let gi = 0
  gs.forEach((a, i) => { if (t >= a) gi = i })
  const Sc = ESC[gi]
  const handle = usuario || marca
  const local = t - gs[gi]
  const entra = pr(t, gs[gi] + 0.05, 0.4)
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: 'hidden' }}>
      <Fondo t={t} total={total} />
      <div style={{ position: 'absolute', inset: 0, opacity: gi === 0 ? 1 : entra, transform: `translateY(${gi === 0 ? 0 : (1 - entra) * 60}px)` }}>
        <Sc t={t} W={W} handle={handle} />
      </div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 130, display: 'flex', justifyContent: 'space-between', fontFamily: U, fontWeight: 700, fontSize: 28, letterSpacing: 2, color: C.mute }}>
        <div>{gi > 0 && gi < 8 ? `ERA DE LA IA · ${gi}/7` : 'ERA DE LA IA'}</div>
        <div>{handle}</div>
      </div>
      <Subs t={t} fr={frases} />
      {gs.map((c, i) => {
        if (i === 0) return null
        const p = (t - (c - 0.26)) / 0.52
        if (p <= 0 || p >= 1) return null
        const top = p < 0.5 ? 1920 * (1 - io3(p * 2)) : 0
        const h = p < 0.5 ? 1920 - top : 1920 * (1 - io3((p - 0.5) * 2))
        return <div key={i} style={{ position: 'absolute', left: 0, width: 1080, top, height: h, background: C.gold, zIndex: 40, borderTop: p < 0.5 ? `10px solid #fff` : 'none' }} />
      })}
      <div style={{ position: 'absolute', left: 0, top: 0, width: `${clamp(t / total) * 100}%`, height: 8, background: C.gold, zIndex: 41 }} />
    </AbsoluteFill>
  )
}
