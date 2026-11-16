// Diseño «bauhaus»: fondo crema con cuadrícula y formas geométricas, colores primarios (azul, amarillo, rojo, negro),
// títulos en etiquetas con sombra dura, ilustraciones planas y transición de tres franjas de color. Inspirado en el reel del presupuesto de pauta.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const K = { bg: '#EFE6D2', az: '#1F4FB4', am: '#F2B21B', rj: '#E23B2E', ng: '#14141A', blanco: '#FBF7EC', gris: '#B9B2A0', suave: '#E3D9C0' }
const D = "'Poppins', 'Helvetica Neue', sans-serif"
const U = "'Inter', 'Helvetica Neue', sans-serif"
const COL = [K.az, K.am, K.rj]
const TXT = [K.blanco, K.ng, K.blanco]

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
const Tx = ({ c = K.ng, size = 40, w = 700, f = D, children, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.08, ...style }}>{children}</div>
)
const Lienzo = ({ children }) => (
  <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>{children}</svg>
)

// etiqueta con sombra dura
const Caja = ({ children, bg = K.az, fg = K.blanco, size = 40, sombra = 8, style }) => (
  <div style={{ display: 'inline-block', padding: `${size * 0.14}px ${size * 0.32}px`, background: bg, color: fg, fontFamily: D, fontWeight: 700, fontSize: size, lineHeight: 1.1, boxShadow: `${sombra}px ${sombra}px 0 ${K.ng}`, whiteSpace: 'nowrap', ...style }}>{children}</div>
)

// persona plana
const Pers = ({ x, y, s = 1, c = K.ng, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <circle cx="0" cy="-34" r="22" fill={c} />
    <path d="M-40 30 a40 40 0 0 1 80 0 z" fill={c} />
  </g>
)

const Ico = ({ tipo, size = 100, c = K.ng, sw = 7 }) => {
  const p = { stroke: c, strokeWidth: sw, strokeLinecap: 'square', strokeLinejoin: 'miter', fill: 'none' }
  const g = {
    libro: (<g {...p}><path d="M0 -30 L-40 -36 V26 L0 32 L40 26 V-36 Z" /><line x1="0" y1="-30" x2="0" y2="32" /></g>),
    cohete: (<g {...p}><path d="M0 -50 L22 4 L0 40 L-22 4 Z" /><circle cx="0" cy="-8" r="8" /><path d="M-22 4 L-38 28 M22 4 L38 28" /></g>),
    engranaje: (<g {...p}><circle r="16" /><path d="M0 -44 v14 M0 30 v14 M-44 0 h14 M30 0 h14 M-31 -31 l10 10 M21 21 l10 10 M31 -31 l-10 10 M-21 21 l-10 10" /></g>),
    check: (<g {...p}><polyline points="-30,2 -10,24 32,-24" /></g>),
    cruz: (<g {...p}><line x1="-28" y1="-28" x2="28" y2="28" /><line x1="28" y1="-28" x2="-28" y2="28" /></g>),
    corazon: (<g {...p}><path d="M0 36 C-60 -4 -38 -48 -8 -34 C-2 -30 0 -24 0 -20 C0 -24 2 -30 8 -34 C38 -48 60 -4 0 36 z" /></g>),
  }[tipo]
  return (<svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: 'block', overflow: 'visible' }}>{g}</svg>)
}

/* ───────────── fondo ───────────── */
const Fondo = ({ t }) => (
  <Lienzo>
    {Array.from({ length: 18 }, (_, i) => (<line key={'h' + i} x1="0" x2="1080" y1={i * 120} y2={i * 120} stroke="#D9CFB6" strokeWidth="2" opacity="0.7" />))}
    {Array.from({ length: 10 }, (_, i) => (<line key={'v' + i} y1="0" y2="1920" x1={i * 120} x2={i * 120} stroke="#D9CFB6" strokeWidth="2" opacity="0.7" />))}
    <circle cx={900 + Math.sin(t * 0.4) * 14} cy="330" r="190" fill={K.az} opacity="0.12" />
    <path d={`M${60 + Math.sin(t * 0.5) * 10} 1560 L330 1340 L330 1560 Z`} fill={K.rj} opacity="0.13" />
    <rect x="780" y="1560" width="220" height="220" fill={K.am} opacity="0.16" transform={`rotate(${12 + Math.sin(t * 0.6) * 4} 890 1670)`} />
    <path d="M0 880 a150 150 0 0 1 0 300 z" fill={K.am} opacity="0.16" />
    <rect x="-60" y="1560" width="190" height="190" fill={K.ng} opacity="0.06" transform="rotate(-14 30 1655)" />
  </Lienzo>
)

/* ───────────── escenas ───────────── */
// título: líneas [texto, color 0|1|2] con entrada escalonada
const Titulo = ({ t, t0, lineas }) => (
  <div style={{ position: 'absolute', left: 60, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
    {lineas.map(([tx, ci], i) => {
      const q = pr(t, t0 + i * 0.12, 0.35, outB)
      const size = Math.min(78, 930 / (tx.length * 0.68))
      return <div key={tx} style={{ opacity: clamp(q * 2), transform: `translateX(${(1 - q) * -120}px)` }}><Caja bg={COL[ci]} fg={TXT[ci]} size={size}>{tx}</Caja></div>
    })}
  </div>
)

const Marca = ({ x, y, tx, ci = 1, o = 1, s = 1, size = 34, r = 0 }) => (
  <Abs x={x} y={y} o={o} s={s} r={r} origen="left top"><Caja bg={COL[ci]} fg={TXT[ci]} size={size} sombra={6}>{tx}</Caja></Abs>
)

// 0 · miedo vs construir
const B0 = ({ t, W }) => {
  const tM = W(0, 3), tF = W(0, 8)
  const bloques = [[0, 0, K.az], [1, 0, K.am], [0, 1, K.rj], [1, 1, K.az], [0, 2, K.am]]
  return (
    <>
      <Titulo t={t} t0={tM - 0.15} lineas={[['MIEDO', 2]]} />
      {t > tF - 0.1 && (<div style={{ position: 'absolute', left: 60, top: 395, opacity: pr(t, tF - 0.1, 0.3) }}><Caja bg={K.am} fg={K.ng} size={78}>FORTUNAS</Caja></div>)}
      <Lienzo>
        {/* izquierda: persona con miedo */}
        <g transform={`translate(${270 + Math.sin(t * 28) * (t > tM && t < tM + 1.6 ? 3 : 0)} 960)`} opacity={pr(t, 0.3, 0.4)}>
          <Pers x={0} y={0} s={2.2} c={K.gris} />
          <circle cx="62" cy="-110" r="34" fill={K.rj} opacity={pr(t, tM, 0.3)} />
          <text x="62" y="-96" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="48" fill="#fff" opacity={pr(t, tM, 0.3)}>?</text>
          <path d="M-44 -90 q-8 18 0 26 q8 -8 0 -26z" fill={K.az} opacity={pr(t, tM + 0.2, 0.3)} />
        </g>
        {/* derecha: persona construyendo una torre de bloques */}
        <Pers x={780} y={960} s={2.2} c={K.ng} o={pr(t, 0.5, 0.4)} />
        {bloques.map(([cx, cy, col], i) => {
          const q = pr(t, W(0, 5) + i * 0.16, 0.35, outB)
          return <rect key={i} x={640 + cx * 90} y={760 - cy * 90 - (1 - q) * 160} width="86" height="86" fill={col} stroke={K.ng} strokeWidth="5" opacity={clamp(q * 2)} />
        })}
        {(() => { const q = pr(t, tF, 0.4, outB); return (<g transform={`translate(730 ${470 - (1 - q) * 120})`} opacity={clamp(q * 2)}><circle r="52" fill={K.am} stroke={K.ng} strokeWidth="6" /><text x="0" y="22" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="64" fill={K.ng}>$</text></g>) })()}
      </Lienzo>
    </>
  )
}

// 1 · cada revolución crea millonarios: tres barras
const B1 = ({ t, W }) => {
  const barras = [['INTERNET', 220, K.az, W(1, 6)], ['CELULARES', 400, K.am, W(1, 10)], ['IA', 620, K.rj, W(1, 15)]]
  const q = pr(t, W(1, 20), 0.4, outB)
  return (
    <>
      <Titulo t={t} t0={0.1} lineas={[['CADA REVOLUCIÓN', 0], ['CREA MILLONARIOS', 1]]} />
      <Lienzo>
        <line x1="80" x2="1000" y1="1230" y2="1230" stroke={K.ng} strokeWidth="8" />
        {barras.map(([nm, h, col, t0], i) => {
          const g = pr(t, t0 - 0.1, 0.6, io3)
          const x = 130 + i * 300
          return (
            <g key={nm}>
              <rect x={x} y={1230 - h * g} width="240" height={h * g} fill={col} stroke={K.ng} strokeWidth="6" />
              <text x={x + 120} y="1290" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="34" fill={K.ng} opacity={g}>{nm}</text>
              {g > 0.9 && Array.from({ length: i + 1 }, (_, k) => (<g key={k} transform={`translate(${x + 120} ${1230 - h - 40 - k * 6})`}><circle r="26" fill={K.am} stroke={K.ng} strokeWidth="4" transform={`translate(${(k - i / 2) * 46} ${-k * 0})`} /></g>))}
            </g>
          )
        })}
      </Lienzo>
      <Marca x={300} y={560} tx="MÁS RÁPIDO →" ci={0} o={q} s={0.6 + 0.4 * q} r={-5} size={46} />
    </>
  )
}

// 2 · primero: ya no cuesta millones / 1 persona = equipo
const B2 = ({ t, W }) => {
  const tach = pr(t, W(2, 8), 0.4, io3)
  const eq = pr(t, W(2, 13), 0.5, outB)
  return (
    <>
      <Titulo t={t} t0={W(2, 2) - 0.15} lineas={[['1· CREAR UN NEGOCIO', 0], ['YA NO CUESTA MILLONES', 2]]} />
      <Abs x={60} y={640} o={pr(t, W(2, 3), 0.3)} origen="left top">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Caja bg={K.ng} fg={K.am} size={92} sombra={0}>$ MILLONES</Caja>
          <div style={{ position: 'absolute', left: -14, top: 56, height: 14, width: `${tach * 108}%`, background: K.rj, transform: 'rotate(-4deg)', transformOrigin: 'left' }} />
        </div>
      </Abs>
      <Lienzo>
        <Pers x={230} y={1080} s={2.6} c={K.az} o={eq} />
        <text x="430" y="1060" fontFamily={D} fontWeight="700" fontSize="120" fill={K.ng} opacity={pr(t, W(2, 16), 0.3)}>=</text>
        {Array.from({ length: 8 }, (_, i) => {
          const c = i % 4, r = Math.floor(i / 4)
          const q = pr(t, W(2, 20) + i * 0.07, 0.3, outB)
          return <Pers key={i} x={560 + c * 120} y={1020 + r * 130} s={0.8 * q} c={i % 3 === 0 ? K.am : i % 3 === 1 ? K.az : K.rj} o={q} />
        })}
      </Lienzo>
      <Marca x={560} y={1220} tx="1 PERSONA + IA" ci={1} o={pr(t, W(2, 22), 0.3)} size={34} />
    </>
  )
}

// 3 · segundo: 24 horas
const B3 = ({ t, W }) => {
  const arc = clamp((t - (W(3, 7) - 0.2)) / 1.0)
  const R = 190, L = 2 * Math.PI * R
  const mano = t * 260
  const filas = [['NO SE CANSA', W(3, 9)], ['NO COBRA', W(3, 12)], ['NO PIDE VACACIONES', W(3, 15)]]
  return (
    <>
      <Titulo t={t} t0={0.1} lineas={[['2· TRABAJA POR TI', 1], ['24 HORAS AL DÍA', 0]]} />
      <Lienzo>
        <g transform="translate(540 760)">
          <circle r={R + 20} fill={K.blanco} stroke={K.ng} strokeWidth="8" />
          {Array.from({ length: 24 }, (_, i) => (<line key={i} x1="0" y1={-R + 6} x2="0" y2={-R + (i % 6 === 0 ? 34 : 18)} stroke={K.ng} strokeWidth={i % 6 === 0 ? 8 : 5} transform={`rotate(${i * 15})`} />))}
          <circle r={R - 40} fill="none" stroke={K.suave} strokeWidth="26" />
          <circle r={R - 40} fill="none" stroke={K.am} strokeWidth="26" strokeDasharray={`${2 * Math.PI * (R - 40) * arc} ${L}`} transform="rotate(-90)" />
          <line x1="0" y1="0" x2="0" y2={-R + 60} stroke={K.rj} strokeWidth="10" strokeLinecap="round" transform={`rotate(${mano})`} />
          <circle r="16" fill={K.ng} />
          <text x="0" y="104" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="46" fill={K.ng}>24 H</text>
        </g>
      </Lienzo>
      {filas.map(([tx, t0], i) => {
        const q = pr(t, t0 - 0.1, 0.35, outB)
        return (
          <Abs key={i} x={110} y={1030 + i * 78} o={clamp(q * 2)} origen="left top" style={{ transform: `translateX(${(1 - q) * -160}px)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, background: K.az, boxShadow: `5px 5px 0 ${K.ng}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="check" size={40} c="#fff" sw={12} /></div>
              <Caja bg={K.blanco} fg={K.ng} size={38} sombra={5}>{tx}</Caja>
            </div>
          </Abs>
        )
      })}
    </>
  )
}

// 4 · tercero: casi nadie … gana el que llega primero
const B4 = ({ t, W }) => {
  const tB = W(4, 12) - 0.2
  const parte2 = t >= tB
  const pie = pr(t, W(4, 1), 0.5, outB)
  const salida = pr(t, tB - 0.1, 0.3, io3)
  const carr = pr(t, W(4, 22), 1.2, io3)
  const tr = (n) => 150 + n * 130
  const Meta = pr(t, W(4, 27), 0.3, outB)
  return (
    <>
      {!parte2 && <Titulo t={t} t0={0.1} lineas={[['3· CASI NADIE', 2], ['SABE USAR LA IA', 0]]} />}
      {parte2 && <Titulo t={t} t0={tB + 0.05} lineas={[['EL DINERO ES DEL', 1], ['QUE LLEGA PRIMERO', 2]]} />}
      <Lienzo>
        {!parte2 && (
          <g transform={`translate(540 880) scale(${pie * (1 - salida)})`}>
            <circle r="260" fill={K.az} stroke={K.ng} strokeWidth="8" />
            <path d="M0 0 L0 -260 A260 260 0 0 1 60 -253 Z" fill={K.am} stroke={K.ng} strokeWidth="6" />
            <text x="0" y="22" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="62" fill="#fff">TODOS</text>
            <g transform="translate(210 -330)"><rect x="-130" y="-34" width="270" height="62" fill={K.am} stroke={K.ng} strokeWidth="5" /><text x="5" y="10" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="34" fill={K.ng}>LOS QUE SABEN</text></g>
          </g>
        )}
        {parte2 && (
          <g opacity={pr(t, tB + 0.1, 0.3)}>
            {[0, 1, 2].map((i) => (<line key={i} x1="90" x2="990" y1={tr(i) + 780} y2={tr(i) + 780} stroke={K.ng} strokeWidth="4" strokeDasharray="14 12" />))}
            <line x1="120" x2="120" y1="780" y2="1200" stroke={K.ng} strokeWidth="8" />
            <g transform={`translate(930 ${780})`}><line x1="0" y1="0" x2="0" y2="430" stroke={K.ng} strokeWidth="8" />{Array.from({ length: 6 }, (_, r) => Array.from({ length: 2 }, (_, c) => (<rect key={r + '-' + c} x={c * 24} y={r * 24 + 0} width="24" height="24" fill={(r + c) % 2 ? K.ng : K.blanco} stroke={K.ng} strokeWidth="2" />)))}</g>
            {[[0, K.gris, 0.55], [1, K.gris, 0.7], [2, K.am, 1]].map(([i, col, v]) => {
              const x = 190 + carr * v * 640
              return (
                <g key={i} transform={`translate(${x} ${tr(i) + 780 - 40})`}>
                  <circle r="46" fill={col} stroke={K.ng} strokeWidth="6" />
                  {i === 2 && <path d="M-60 0 h-70 M-60 18 h-50 M-60 -18 h-50" stroke={K.ng} strokeWidth="6" strokeLinecap="round" opacity={carr > 0.02 && carr < 0.97 ? 1 : 0} />}
                </g>
              )
            })}
            <g transform={`translate(150 ${tr(1) + 780 - 190}) scale(${pr(t, W(4, 21), 0.3, outB)})`} opacity={pr(t, W(4, 21), 0.3)}>
              <rect x="-10" y="-40" width="300" height="70" fill={K.blanco} stroke={K.ng} strokeWidth="5" />
              <text x="140" y="8" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="36" fill={K.ng}>MÁS INTELIGENTE</text>
              <line x1="-10" y1="-40" x2="290" y2="30" stroke={K.rj} strokeWidth="8" />
            </g>
          </g>
        )}
      </Lienzo>
      {parte2 && <Marca x={640} y={1230} tx="🏆 GANA" ci={1} o={Meta} s={0.6 + 0.4 * Meta} size={44} r={4} />}
    </>
  )
}

// 5 · aprende hoy
const B5 = ({ t, W }) => {
  const cal = pr(t, W(5, 3) - 0.1, 0.5, outB)
  const multitud = pr(t, W(5, 7), 0.4)
  const tach = pr(t, W(5, 12), 0.35, io3)
  return (
    <>
      <Titulo t={t} t0={0.1} lineas={[['LLEGAR PRIMERO', 1], ['ES APRENDER HOY', 0]]} />
      <Abs x={90} y={700} o={cal} s={0.7 + 0.3 * cal} origen="left top">
        <div style={{ width: 400, height: 460, background: K.blanco, border: `7px solid ${K.ng}`, boxShadow: `12px 12px 0 ${K.ng}` }}>
          <div style={{ height: 110, background: K.rj, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `7px solid ${K.ng}` }}><Tx size={50} c="#fff">HOY</Tx></div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 330 }}><Ico tipo="check" size={230} c={K.az} sw={14} /></div>
        </div>
      </Abs>
      <Lienzo>
        {Array.from({ length: 12 }, (_, i) => {
          const c = i % 4, r = Math.floor(i / 4)
          return <Pers key={i} x={620 + c * 100} y={820 + r * 130} s={0.7} c={K.gris} o={multitud} />
        })}
        <line x1="570" y1="720" x2={570 + 440 * tach} y2={720 + 420 * tach} stroke={K.rj} strokeWidth="16" strokeLinecap="round" />
        <line x1="1010" y1="720" x2={1010 - 440 * tach} y2={720 + 420 * tach} stroke={K.rj} strokeWidth="16" strokeLinecap="round" />
      </Lienzo>
      <Marca x={620} y={1190} tx="CUANDO TODOS" ci={1} o={multitud} size={38} />
    </>
  )
}

// 6 · oferta + perfil
const B6 = ({ t, W, handle }) => {
  const fichas = [['libro', 'APRENDER IA', K.az, W(6, 2)], ['cohete', 'ESCALAR', K.am, W(6, 4)], ['engranaje', 'AUTOMATIZAR', K.rj, W(6, 8)]]
  const tc = W(6, 11)
  const k = pr(t, tc, 0.4, outB)
  const tp = W(6, 12) + 0.7
  const p = pr(t, tp, 0.5, outB)
  const sig = clamp((t - tp - 0.9) / 0.2)
  return (
    <>
      <Titulo t={t} t0={0.1} lineas={[['SI QUIERES…', 1]]} />
      {fichas.map(([ic, tx, col, t0], i) => {
        const q = pr(t, t0 - 0.1, 0.4, outB)
        return (
          <Abs key={i} x={60 + i * 330} y={420} o={clamp(q * 2)} s={0.6 + 0.4 * q} origen="top left">
            <div style={{ width: 300, height: 330, background: col, border: `6px solid ${K.ng}`, boxShadow: `10px 10px 0 ${K.ng}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
              <Ico tipo={ic} size={130} c={col === K.am ? K.ng : '#fff'} sw={8} />
              <Tx size={tx.length > 8 ? 36 : 44} c={col === K.am ? K.ng : '#fff'}>{tx}</Tx>
            </div>
          </Abs>
        )
      })}
      <Abs x={60} y={830} o={clamp(k * 2)} s={0.7 + 0.3 * k} origen="left top">
        <div style={{ width: 960, background: K.ng, padding: '8px 0 24px', textAlign: 'center', boxShadow: `10px 10px 0 ${K.am}` }}>
          <Tx size={40} c={K.am} f={U} w={700} style={{ letterSpacing: 8 }}>HAZLO</Tx>
          <Tx size={140} c="#fff" style={{ letterSpacing: -4 }}>CONMIGO</Tx>
        </div>
      </Abs>
      <Abs x={110} y={1090} o={clamp(p * 2)} s={1} origen="left top" style={{ transform: `translateY(${(1 - p) * 120}px)` }}>
        <div style={{ width: 860, background: K.blanco, border: `6px solid ${K.ng}`, boxShadow: `10px 10px 0 ${K.ng}`, display: 'flex', alignItems: 'center', gap: 24, padding: '18px 26px' }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: K.az, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D, fontWeight: 700, fontSize: 40, border: `5px solid ${K.ng}` }}>NP</div>
          <div style={{ flex: 1 }}><Tx size={40}>{handle}</Tx><Tx size={24} c="#6B6554" f={U} w={600}>IA · Proyectos · Automatización</Tx></div>
          <div style={{ padding: '14px 28px', background: sig > 0.5 ? K.blanco : K.rj, color: sig > 0.5 ? K.ng : '#fff', border: `5px solid ${K.ng}`, fontFamily: D, fontWeight: 700, fontSize: 32 }}>{sig > 0.5 ? '✓ SIGUIENDO' : 'SEGUIR'}</div>
        </div>
      </Abs>
    </>
  )
}

const ESC = [B0, B1, B2, B3, B4, B5, B6]

/* ───────────── subtítulos con cajitas de color ───────────── */
const Subs = ({ t, fr }) => {
  const trozos = []
  fr.forEach((f, fi) => {
    let cur = []
    f.palabras.forEach((p, j) => {
      cur.push(p)
      const largo = cur.reduce((a, q) => a + q.w.length + 1, 0)
      if (cur.length >= 4 || largo >= 22 || (/[,:.?!]$/.test(p.w) && cur.length >= 3) || j === f.palabras.length - 1) { trozos.push({ p: cur, fi }); cur = [] }
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
  let n = 0
  return (
    <div style={{ position: 'absolute', left: 40, right: 40, top: 1340, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 16}px)` }}>
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 62, lineHeight: 1.45, color: K.ng, whiteSpace: 'nowrap' }}>
        {z.p.map((p, i) => {
          const ci = p.k ? n++ % 3 : -1
          const s = p.k ? 1 + 0.08 * pr(t, p.t0, 0.25, outB) : 1
          return (
            <span key={i} style={{ display: 'inline-block', marginRight: 14, padding: p.k ? '0 14px' : 0, background: p.k ? COL[ci] : 'transparent', color: p.k ? TXT[ci] : K.ng, boxShadow: p.k ? `5px 5px 0 ${K.ng}` : 'none', transform: `scale(${s})`, visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>{p.w}</span>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Bauhaus = ({ frases, grupos, marca, usuario }) => {
  useFuentes()
  const f = useCurrentFrame()
  const t = f / FPS
  const W = mkW(frases)
  const all = grupos.map((_, i) => i).filter((i) => i > 0)
  const gs = inicios(frases, grupos, all)
  const total = frases.at(-1).fin + 2.2
  let gi = 0
  gs.forEach((a, i) => { if (t >= a) gi = i })
  const Sc = ESC[gi]
  const handle = usuario || marca
  const n = grupos.length
  return (
    <AbsoluteFill style={{ background: K.bg, overflow: 'hidden' }}>
      <Fondo t={t} />
      <div style={{ position: 'absolute', inset: 0 }}>
        <Sc t={t} W={W} handle={handle} />
      </div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 128, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: U, fontWeight: 700, fontSize: 28, color: K.ng }}><div style={{ width: 16, height: 16, background: K.rj }} />{handle}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {grupos.map((_, i) => (<div key={i} style={{ width: 54, height: 8, background: i < gi ? K.ng : i === gi ? COL[i % 3] : '#CFC6AE' }} />))}
        </div>
      </div>
      <Subs t={t} fr={frases} />
      {/* transición: tres franjas de color que cruzan la pantalla */}
      {gs.map((c, i) => {
        if (i === 0) return null
        return [0, 1, 2].map((k) => {
          const a = c - 0.3 + k * 0.06, b = c + k * 0.06
          const cubre = clamp((t - a) / 0.18), destapa = clamp((t - b) / 0.2)
          if (cubre <= 0 || destapa >= 1) return null
          const izq = destapa > 0 ? 1080 * io3(destapa) : 0
          const ancho = destapa > 0 ? 1080 - izq : 1080 * io3(cubre)
          return <div key={i + '-' + k} style={{ position: 'absolute', left: izq, width: ancho, top: k * 640, height: 640, background: COL[k], zIndex: 40 }} />
        })
      })}
    </AbsoluteFill>
  )
}
