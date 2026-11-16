// Diseño «producto»: bloques de color a pantalla completa (uno por razón), el producto dibujado en grande con animaciones de cada función,
// transición circular (iris) y subtítulos con resaltador. Pensado para videos de producto / reseñas.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const I = { ink: '#14141A', mute: '#6B6F80', blanco: '#FFFFFF', sombra: 'rgba(20,20,40,.14)', gr: '#22B573', rd: '#F0484E' }
const D = "'Poppins', 'Helvetica Neue', sans-serif"
const U = "'Inter', 'Helvetica Neue', sans-serif"
// fondo y acento de cada escena
const ESC_COL = [
  { bg: '#101114', ac: '#7DF9C6' },
  { bg: '#FFE0D1', ac: '#F2672B' },
  { bg: '#D3F5E2', ac: '#12A361' },
  { bg: '#D5EAFF', ac: '#2C7BF2' },
  { bg: '#E6DDFF', ac: '#7A4DF0' },
  { bg: '#FFF0B3', ac: '#E09A00' },
  { bg: '#FFD5DE', ac: '#E5365A' },
  { bg: '#D9F2F6', ac: '#0E8FA6' },
  { bg: '#101114', ac: '#7DF9C6' },
]

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
const Tx = ({ c = I.ink, size = 40, w = 700, f = D, children, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.08, ...style }}>{children}</div>
)
const ventana = (t, a, b, d = 0.3) => pr(t, a, d) * (1 - pr(t, b, d, io3))

/* ───────────── dibujos ───────────── */
const Pod = ({ x, y, s = 1, rot = 0, xray = 0, ac = '#2C7BF2', luz = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx="0" cy="250" rx="90" ry="14" fill="#000" opacity="0.12" />
    <rect x="-21" y="10" width="42" height="215" rx="21" fill="#FAFBFE" stroke="#D5DAE8" strokeWidth="4" />
    <ellipse cx="0" cy="-48" rx="80" ry="90" fill="#FFFFFF" stroke="#D5DAE8" strokeWidth="4" />
    <path d="M-52 -96 q40 -34 92 -4" stroke="#EEF1F8" strokeWidth="14" strokeLinecap="round" fill="none" />
    <ellipse cx="-86" cy="-14" rx="42" ry="48" fill="#EEF1F8" stroke="#D5DAE8" strokeWidth="4" />
    <circle cx="-98" cy="-14" r="17" fill="#CBD2E3" />
    <circle cx="34" cy="-112" r="5" fill="#C5CCDD" />
    <circle cx="0" cy="206" r="5" fill="#C5CCDD" />
    <circle cx="0" cy="190" r="4" fill="#C5CCDD" />
    {luz > 0 && <ellipse cx="0" cy="-48" rx="96" ry="106" fill="none" stroke={ac} strokeWidth="8" opacity={luz} />}
    {xray > 0 && (
      <g opacity={xray}>
        <ellipse cx="0" cy="-48" rx="80" ry="90" fill={ac} opacity="0.12" />
        {[-26, -8, 10, 28].map((v) => (<g key={v}><line x1={v} y1="-96" x2={v} y2="-86" stroke={ac} strokeWidth="5" strokeLinecap="round" /><line x1={v} y1="-10" x2={v} y2="0" stroke={ac} strokeWidth="5" strokeLinecap="round" /></g>))}
        <rect x="-38" y="-86" width="76" height="76" rx="12" fill={ac} />
        <rect x="-22" y="-70" width="44" height="44" rx="6" fill="none" stroke="#fff" strokeWidth="5" />
        <circle cx="0" cy="-48" r="8" fill="#fff" />
      </g>
    )}
  </g>
)

const Estuche = ({ x, y, s = 1, led = I.gr, abierta = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="140" rx="190" ry="16" fill="#000" opacity="0.12" />
    <rect x="-170" y="-90" width="340" height="220" rx="76" fill="#FFFFFF" stroke="#D5DAE8" strokeWidth="5" />
    <path d={`M-168 -22 H168`} stroke="#E3E7F2" strokeWidth="5" />
    <rect x="-44" y="-40" width="88" height="14" rx="7" fill="#EEF1F8" />
    <circle cx="0" cy="62" r="9" fill={led} />
    <rect x="-170" y="-90" width="340" height={68} rx="34" fill="#FFFFFF" opacity={abierta} />
  </g>
)

const Onda = ({ x, y, w, h, ruido, t, c = '#12A361', grosor = 6 }) => {
  const n = 64
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n
    const base = Math.sin(u * Math.PI * 6 + t * 7) * 0.55
    const asp = Math.sin(u * 91 + t * 38) * 0.5 + Math.sin(u * 47 - t * 23) * 0.4
    const env = Math.sin(u * Math.PI)
    return `${x + u * w},${y + (base + asp * ruido) * h * 0.5 * env}`
  })
  return <polyline points={pts.join(' ')} fill="none" stroke={c} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" />
}

const IcoD = ({ tipo, size = 120, c = I.ink, sw = 6 }) => {
  const p = { stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  const g = {
    telefono: (<g {...p}><rect x="-26" y="-48" width="52" height="96" rx="12" /><line x1="-8" y1="36" x2="8" y2="36" /></g>),
    laptop: (<g {...p}><rect x="-46" y="-36" width="92" height="60" rx="8" /><path d="M-60 36 H60 l-8 -12 H-52 z" /></g>),
    tablet: (<g {...p}><rect x="-40" y="-48" width="80" height="96" rx="12" /><line x1="-8" y1="36" x2="8" y2="36" /></g>),
    reloj: (<g {...p}><rect x="-28" y="-30" width="56" height="60" rx="16" /><path d="M-16 -30 l4 -18 h24 l4 18 M-16 30 l4 18 h24 l4 -18" /></g>),
    rayo: (<g {...p}><path d="M8 -50 L-28 6 H-2 L-8 50 L28 -6 H2 z" /></g>),
    nota: (<g {...p}><path d="M-10 30 V-40 L30 -50 V20" /><circle cx="-22" cy="32" r="14" /><circle cx="18" cy="22" r="14" /></g>),
    check: (<g {...p}><polyline points="-30,2 -10,24 32,-24" /></g>),
    cruz: (<g {...p}><line x1="-28" y1="-28" x2="28" y2="28" /><line x1="28" y1="-28" x2="-28" y2="28" /></g>),
    reloj2: (<g {...p}><circle r="40" /><polyline points="0,-22 0,0 18,12" /></g>),
    mundo: (<g {...p}><circle r="42" /><ellipse rx="18" ry="42" /><line x1="-42" y1="0" x2="42" y2="0" /></g>),
    pierde: (<g {...p}><path d="M-44 -6 a44 44 0 0 1 88 0 v18 h-88 z" /><line x1="-20" y1="28" x2="20" y2="28" /></g>),
    nube: (<g {...p}><path d="M-40 24 a22 22 0 0 1 2 -44 a30 30 0 0 1 58 -6 a24 24 0 0 1 12 50 z" /></g>),
    corazon: (<g {...p}><path d="M0 36 C-60 -4 -38 -48 -8 -34 C-2 -30 0 -24 0 -20 C0 -24 2 -30 8 -34 C38 -48 60 -4 0 36 z" /></g>),
    marcador: (<g {...p}><path d="M-28 -46 h56 v94 l-28 -22 l-28 22 z" /></g>),
  }[tipo]
  return (<svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: 'block', overflow: 'visible' }}>{g}</svg>)
}

const Lienzo = ({ children }) => (
  <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>{children}</svg>
)

/* ───────────── escenas ───────────── */
const P0 = ({ t, W }) => {
  const tPods = 0.15
  const q = pr(t, tPods, 0.8, outB)
  const flota = Math.sin(t * 2.2) * 14
  const letras = 'AirPods Pro 2'.split('')
  const tTit = W(0, 5) - 0.1
  const tSiete = W(0, 10)
  const c = ESC_COL[0].ac
  return (
    <>
      <div style={{ position: 'absolute', left: 140, top: 520, width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${c}33, transparent 65%)`, opacity: q }} />
      <Lienzo>
        <Pod x={380} y={800 + flota} s={1.15 * q} rot={-14} ac={c} luz={0} />
        <Pod x={700} y={820 - flota} s={1.15 * q} rot={14} ac={c} />
      </Lienzo>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 118, letterSpacing: -3, color: '#fff', whiteSpace: 'nowrap' }}>
        {letras.map((l, i) => {
          const p = pr(t, tTit + i * 0.04, 0.35, outB)
          return <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 60}px)`, color: i > 6 ? c : '#fff' }}>{l}</span>
        })}
      </div>
      {t > tSiete - 0.1 && (
        <Abs x={0} y={1180} o={pr(t, tSiete - 0.1, 0.3)} s={0.8 + 0.2 * pr(t, tSiete - 0.1, 0.4, outB)} style={{ width: 1080, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: c, color: '#101114', fontFamily: D, fontWeight: 700, fontSize: 64, borderRadius: 70, padding: '12px 54px', letterSpacing: 2 }}>7 RAZONES</div>
        </Abs>
      )}
    </>
  )
}

// 1 · chip
const P1 = ({ t, W, a }) => {
  const ac = ESC_COL[1].ac
  const entra = pr(t, a, 0.6, outB)
  const xray = pr(t, W(1, 3) - 0.1, 0.5)
  const tPot = W(1, 9)
  const barra = pr(t, tPot, 1.1, io3)
  const etq = pr(t, W(1, 3), 0.4, outB)
  return (
    <>
      <Lienzo>
        <Pod x={540} y={640} s={1.45 * (0.8 + 0.2 * entra)} xray={xray} ac={ac} />
        {etq > 0 && (<><line x1="610" y1="520" x2={610 + 140 * etq} y2={520 - 60 * etq} stroke={ac} strokeWidth="6" strokeLinecap="round" /><circle cx="610" cy="520" r="10" fill={ac} /></>)}
      </Lienzo>
      <Abs x={770} y={400} o={etq} s={0.8 + 0.2 * etq} origen="0 50%"><div style={{ background: ac, color: '#fff', fontFamily: D, fontWeight: 700, fontSize: 52, borderRadius: 24, padding: '8px 26px' }}>CHIP</div></Abs>
      {barra > 0 && (
        <Abs x={90} y={1130} o={pr(t, tPot, 0.3)} style={{ width: 900 }}>
          <Tx size={40} w={600} c={I.mute} f={U} style={{ marginBottom: 14 }}>Potencia</Tx>
          <div style={{ height: 64, borderRadius: 32, background: 'rgba(20,20,40,.1)', overflow: 'hidden' }}>
            <div style={{ width: `${barra * 100}%`, height: '100%', borderRadius: 32, background: ac, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 22, fontFamily: D, fontWeight: 700, fontSize: 36, color: '#fff' }}>{barra > 0.5 ? '+ más' : ''}</div>
          </div>
        </Abs>
      )}
    </>
  )
}

// 2 · micrófono
const P2 = ({ t, W, a }) => {
  const ac = ESC_COL[2].ac
  const entra = pr(t, a, 0.6, outB)
  const tMic = W(2, 2), tClara = W(2, 10)
  const ruido = 1 - pr(t, tClara - 0.2, 0.6, io3)
  const llam = pr(t, W(2, 7) - 0.3, 0.5, outB)
  const ring = (k) => clamp((t - tMic - k * 0.3) / 1.1)
  return (
    <>
      <Lienzo>
        <Pod x={540} y={500} s={1.1 * (0.8 + 0.2 * entra)} ac={ac} />
        {t > tMic && [0, 1, 2].map((k) => (
          <circle key={k} cx="540" cy={500 + 200 * 1.1} r={30 + ring(k) * 220} fill="none" stroke={ac} strokeWidth="6" opacity={(1 - ring(k)) * (ring(k) > 0 ? 0.8 : 0)} />
        ))}
      </Lienzo>
      {llam > 0 && (
        <Abs x={90} y={960} o={llam} s={0.9 + 0.1 * llam} style={{ width: 900 }}>
          <div style={{ background: '#fff', borderRadius: 48, padding: '30px 40px', boxShadow: '0 24px 60px rgba(20,20,40,.14)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 84, height: 84, borderRadius: '50%', background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoD tipo="telefono" size={70} c="#fff" /></div>
              <div><Tx size={42}>En llamada</Tx><Tx size={32} c={I.mute} w={500} f={U}>02:14</Tx></div>
              <div style={{ marginLeft: 'auto', fontFamily: D, fontWeight: 700, fontSize: 40, color: ruido < 0.2 ? ac : I.rd }}>{ruido < 0.2 ? 'Voz clara' : 'Ruido'}</div>
            </div>
            <svg width="820" height="150" viewBox="0 0 820 150" style={{ marginTop: 10 }}><Onda x={0} y={75} w={820} h={140} ruido={ruido} t={t} c={ruido < 0.2 ? ac : I.rd} /></svg>
          </div>
        </Abs>
      )}
    </>
  )
}

// 3 · batería
const P3 = ({ t, W, a }) => {
  const ac = ESC_COL[3].ac
  const tH = W(3, 3), tSin = W(3, 8)
  const llena = pr(t, a + 0.1, 1.6, io3)
  const cont = pr(t, tH - 0.1, 1.4, io3)
  const horas = (cont * 4).toFixed(0)
  const cruz = pr(t, tSin, 0.4, outB)
  const notas = [0, 1, 2, 3].map((k) => clamp((t - a - 0.4 - k * 0.7) / 2.4))
  return (
    <>
      <Abs x={140} y={500} o={pr(t, a, 0.4)}>
        <div style={{ position: 'relative', width: 760, height: 330, borderRadius: 70, border: `14px solid ${I.ink}`, padding: 20, boxSizing: 'border-box', background: 'rgba(255,255,255,.6)' }}>
          <div style={{ width: `${llena * 100}%`, height: '100%', borderRadius: 44, background: ac }} />
          <div style={{ position: 'absolute', right: -44, top: 100, width: 30, height: 110, borderRadius: '0 18px 18px 0', background: I.ink }} />
        </div>
      </Abs>
      <Abs x={0} y={880} o={pr(t, tH - 0.15, 0.3)} s={0.85 + 0.15 * pr(t, tH - 0.15, 0.4, outB)} style={{ width: 1080, textAlign: 'center' }}>
        <div style={{ fontFamily: D, fontWeight: 700, fontSize: 230, color: ac, letterSpacing: -6, lineHeight: 1 }}>{cont >= 0.99 ? '4+' : horas}<span style={{ fontSize: 110, color: I.ink, letterSpacing: 0 }}> horas</span></div>
      </Abs>
      {notas.map((p, k) => p > 0 && p < 1 && (
        <Abs key={k} x={150 + k * 220} y={820 - p * 330} o={Math.sin(p * Math.PI) * 0.9} s={0.7 + p * 0.4}><IcoD tipo="nota" size={96} c={ac} sw={7} /></Abs>
      ))}
      {cruz > 0 && (
        <Abs x={300} y={1130} o={cruz} s={cruz}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#fff', borderRadius: 60, padding: '14px 40px', fontFamily: D, fontWeight: 700, fontSize: 46, color: I.ink, boxShadow: '0 16px 40px rgba(20,20,40,.12)' }}>
            <IcoD tipo="rayo" size={64} c={I.rd} sw={8} /> sin parar
          </div>
        </Abs>
      )}
    </>
  )
}

// 4 · carga inalámbrica
const P4 = ({ t, W, a }) => {
  const ac = ESC_COL[4].ac
  const tCarga = W(4, 1), tCables = W(4, 3)
  const baja = pr(t, a + 0.1, 0.8, outB)
  const onda = (k) => clamp((t - tCarga - k * 0.35) / 1.2)
  const cable = pr(t, tCables - 0.2, 0.4)
  const cruz = pr(t, tCables + 0.1, 0.35, outB)
  const carga = pr(t, tCarga, 2.5)
  return (
    <>
      <Lienzo>
        {/* base de carga */}
        <ellipse cx="540" cy="1000" rx="300" ry="38" fill="#2A2748" />
        <ellipse cx="540" cy="990" rx="300" ry="38" fill="#3A3664" />
        <ellipse cx="540" cy="990" rx="214" ry="24" fill="none" stroke={ac} strokeWidth="6" opacity={0.5 + 0.5 * Math.sin(t * 5) * (t > tCarga ? 1 : 0)} />
        {t > tCarga && [0, 1, 2].map((k) => (
          <ellipse key={k} cx="540" cy={970 - onda(k) * 160} rx={120 + onda(k) * 120} ry={14 + onda(k) * 10} fill="none" stroke={ac} strokeWidth="6" opacity={(1 - onda(k)) * (onda(k) > 0 ? 0.9 : 0)} />
        ))}
        <Estuche x={540} y={700 - (1 - baja) * 160 + 120} s={1.2} led={t > tCarga ? '#F5A623' : '#C9CEDD'} />
      </Lienzo>
      {t > tCarga && (
        <Abs x={440} y={420} o={pr(t, tCarga, 0.4)} s={0.8 + 0.2 * pr(t, tCarga, 0.4, outB)}>
          <div style={{ width: 200, height: 200, borderRadius: '50%', background: ac, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 20px 50px ${ac}66` }}><IcoD tipo="rayo" size={130} c="#fff" sw={8} /></div>
        </Abs>
      )}
      {cable > 0 && (
        <Abs x={80} y={1160} o={cable} style={{ width: 920 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
            <svg width="600" height="90" viewBox="0 0 600 90"><path d="M10 45 q80 -60 160 0 t160 0 t160 0 t100 0" fill="none" stroke={I.ink} strokeWidth="10" strokeLinecap="round" /><rect x="560" y="28" width="38" height="34" rx="8" fill={I.ink} /></svg>
            {cruz > 0 && <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(-50%, -50%) scale(${cruz})` }}><svg width="620" height="120" viewBox="0 0 620 120"><line x1="30" y1="10" x2="590" y2="110" stroke={I.rd} strokeWidth="18" strokeLinecap="round" /><line x1="590" y1="10" x2="30" y2="110" stroke={I.rd} strokeWidth="18" strokeLinecap="round" /></svg></div>}
          </div>
        </Abs>
      )}
    </>
  )
}

// 5 · modos de sonido
const P5 = ({ t, W, a }) => {
  const ac = ESC_COL[5].ac
  const modos = [
    { n: 'Cancelación', ic: 'pierde', t0: W(5, 1) },
    { n: 'Transparencia', ic: 'mundo', t0: W(5, 5) },
    { n: 'Adaptativo', ic: 'nube', t0: W(5, 9) },
  ]
  const act = modos.reduce((m, f, i) => (t >= f.t0 - 0.05 ? i : m), -1)
  const entra = pr(t, a, 0.5, outB)
  return (
    <>
      {modos.map((m, i) => {
        const q = pr(t, a + 0.1 + i * 0.12, 0.4, outB)
        const on = act === i
        const pulso = on ? 1 + 0.03 * Math.sin((t - m.t0) * 8) : 1
        return (
          <Abs key={i} x={90} y={450 + i * 260} o={q} s={(0.9 + 0.1 * q) * pulso} origen="0 50%" style={{ width: 900 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 34, background: on ? ac : '#fff', borderRadius: 70, padding: '26px 44px', boxShadow: on ? `0 26px 60px ${ac}66` : '0 14px 36px rgba(20,20,40,.1)', transition: 'none' }}>
              <div style={{ width: 130, height: 130, borderRadius: '50%', background: on ? '#fff' : 'rgba(20,20,40,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcoD tipo={m.ic} size={96} c={on ? ac : I.mute} sw={7} /></div>
              <Tx size={62} c={on ? '#fff' : I.ink}>{m.n}</Tx>
              <div style={{ marginLeft: 'auto', width: 74, height: 74, borderRadius: '50%', background: on ? '#fff' : 'transparent', border: on ? 'none' : `5px solid ${I.mute}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{on && <IcoD tipo="check" size={56} c={ac} sw={10} />}</div>
            </div>
          </Abs>
        )
      })}
    </>
  )
}

// 6 · cancelación activa de ruido
const P6 = ({ t, W, a }) => {
  const ac = ESC_COL[6].ac
  const tCanc = W(6, 1), tDesp = W(6, 9)
  const apaga = pr(t, tDesp - 0.1, 1.0, io3)
  const escudo = pr(t, tCanc, 0.6, outB)
  const barras = Array.from({ length: 11 }, (_, i) => {
    const h = (0.35 + 0.65 * Math.abs(Math.sin(t * 6 + i * 1.7) * Math.cos(t * 3.1 + i))) * 330
    return h * (1 - apaga)
  })
  const mundo = 1 - apaga
  return (
    <>
      <Lienzo>
        <Pod x={540} y={560} s={1.05} ac={ac} luz={escudo * (0.6 + 0.4 * Math.sin(t * 6))} />
        {escudo > 0 && <circle cx="540" cy="620" r={220 * escudo} fill="none" stroke={ac} strokeWidth="8" strokeDasharray="22 16" opacity={0.7} transform={`rotate(${t * 40} 540 620)`} />}
        {barras.map((h, i) => (
          <rect key={i} x={95 + i * 82} y={1240 - h} width="52" height={Math.max(h, 8)} rx="26" fill={apaga > 0.8 ? '#fff' : I.ink} opacity={apaga > 0.8 ? 0.3 : 0.88} />
        ))}
      </Lienzo>
      <Abs x={0} y={1290} o={pr(t, a + 0.2, 0.4)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={54} c={apaga > 0.8 ? ac : I.mute} w={700}>{apaga > 0.8 ? 'Silencio' : 'Ruido del mundo'}</Tx>
      </Abs>
      <Abs x={440} y={940} o={mundo * 0.9} s={mundo}><IcoD tipo="mundo" size={200} c={I.ink} sw={6} /></Abs>
    </>
  )
}

// 7 · compatible
const P7 = ({ t, W, a }) => {
  const ac = ESC_COL[7].ac
  const cx = 540, cy = 830
  const disp = [
    { ic: 'telefono', x: 190, y: 560, t0: W(7, 3) },
    { ic: 'laptop', x: 890, y: 560, t0: W(7, 3) + 0.25 },
    { ic: 'tablet', x: 190, y: 1100, t0: W(7, 3) + 0.5 },
    { ic: 'reloj', x: 890, y: 1100, t0: W(7, 3) + 0.75 },
  ]
  const centro = pr(t, a, 0.5, outB)
  const cual = pr(t, W(7, 5), 0.4, outB)
  return (
    <>
      <Lienzo>
        {disp.map((d, i) => {
          const p = pr(t, d.t0, 0.5, io3)
          return <line key={i} x1={cx} y1={cy} x2={cx + (d.x - cx) * p} y2={cy + (d.y - cy) * p} stroke={ac} strokeWidth="7" strokeLinecap="round" strokeDasharray="4 16" strokeDashoffset={-t * 60} />
        })}
        <Pod x={cx} y={cy - 190} s={0.85 * centro} ac={ac} />
      </Lienzo>
      {disp.map((d, i) => {
        const q = pr(t, d.t0 - 0.1, 0.45, outB)
        return (
          <Abs key={i} x={d.x - 105} y={d.y - 105} o={q} s={0.7 + 0.3 * q}>
            <div style={{ width: 210, height: 210, borderRadius: 52, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 46px rgba(20,20,40,.12)', position: 'relative' }}>
              <IcoD tipo={d.ic} size={130} c={ac} sw={7} />
              <div style={{ position: 'absolute', right: -12, top: -12, width: 60, height: 60, borderRadius: '50%', background: I.gr, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${pr(t, d.t0 + 0.3, 0.3, outB)})` }}><IcoD tipo="check" size={42} c="#fff" sw={10} /></div>
            </div>
          </Abs>
        )
      })}
      {cual > 0 && (
        <Abs x={0} y={1235} o={cual} s={0.8 + 0.2 * cual} style={{ width: 1080, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: ac, color: '#fff', fontFamily: D, fontWeight: 700, fontSize: 62, borderRadius: 60, padding: '10px 50px' }}>Cualquier dispositivo</div>
        </Abs>
      )}
    </>
  )
}

// 8 · cierre
const P8 = ({ t, W, handle }) => {
  const ac = ESC_COL[8].ac
  const tS = W(8, 4)
  const letras = handle.split('')
  const sig = clamp((t - tS - 0.45) / 0.2)
  const flota = Math.sin(t * 2.2) * 12
  const flot = [
    { ic: 'corazon', x: 170, t0: W(8, 0) }, { ic: 'marcador', x: 860, t0: W(8, 0) + 0.3 }, { ic: 'corazon', x: 520, t0: W(8, 3) },
  ]
  return (
    <>
      <Lienzo>
        <Pod x={380} y={1030 + flota} s={0.6} rot={-12} ac={ac} />
        <Pod x={700} y={1040 - flota} s={0.6} rot={12} ac={ac} />
      </Lienzo>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 98, letterSpacing: -2, whiteSpace: 'nowrap' }}>
        {letras.map((l, i) => {
          const p = pr(t, tS - 0.3 + i * 0.045, 0.3, outB)
          return <span key={i} style={{ display: 'inline-block', color: i === 0 ? '#fff' : ac, opacity: clamp(p * 2), transform: `translateY(${(1 - p) * 70}px)` }}>{l}</span>
        })}
      </div>
      <Abs x={0} y={620} o={pr(t, tS + 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={46} c="#9DA3B8" f={U} w={600}>más tecnología, cada semana</Tx>
      </Abs>
      <Abs x={290} y={730} o={pr(t, tS, 0.4)}>
        <div style={{ width: 500, height: 118, borderRadius: 60, background: sig > 0.5 ? 'transparent' : ac, border: `4px solid ${ac}`, color: sig > 0.5 ? ac : '#101114', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, fontFamily: D, fontWeight: 700, fontSize: 52, letterSpacing: 2 }}>
          {sig > 0.5 ? (<><IcoD tipo="check" size={54} c={ac} sw={10} /> SIGUIENDO</>) : 'SEGUIR'}
        </div>
      </Abs>
      {flot.map((f, i) => {
        const p = clamp((t - f.t0) / 2.2)
        return p > 0 && p < 1 ? (<Abs key={i} x={f.x} y={1000 - p * 480} o={Math.sin(p * Math.PI)} s={0.7 + p * 0.5}><IcoD tipo={f.ic} size={110} c={ac} sw={7} /></Abs>) : null
      })}
    </>
  )
}

const ESC = [P0, P1, P2, P3, P4, P5, P6, P7, P8]
const TITULOS = [null, ['Chip', 'actualizado'], ['Micrófono', 'actualizado'], ['Música', 'continua'], ['Carga', 'inalámbrica'], ['Modos', 'de sonido'], ['Cancelación', 'activa de ruido'], ['Compatible', 'con todo'], null]

/* ───────────── subtítulos con resaltador ───────────── */
const Subs = ({ t, fr, ac, oscuro }) => {
  const trozos = []
  fr.forEach((f, fi) => {
    let cur = []
    f.palabras.forEach((p, j) => {
      cur.push(p)
      if (cur.length >= 5 || (/[,:.?!]$/.test(p.w) && cur.length >= 3) || j === f.palabras.length - 1) {
        trozos.push({ p: cur, fi })
        cur = []
      }
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
    <div style={{ position: 'absolute', left: 60, right: 60, top: 1390, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 16}px)` }}>
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 60, lineHeight: 1.3, color: oscuro ? '#fff' : I.ink, whiteSpace: 'nowrap' }}>
        {z.p.map((p, i) => {
          const marca = p.k ? pr(t, p.t0, 0.25) : 0
          return (
            <span key={i} style={{ position: 'relative', display: 'inline-block', marginRight: 16, visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>
              {p.k && <span style={{ position: 'absolute', left: -8, right: -8, top: '18%', bottom: '4%', borderRadius: 12, background: ac, opacity: oscuro ? 0.9 : 0.45, transform: `scaleX(${marca})`, transformOrigin: '0 50%', zIndex: 0 }} />}
              <span style={{ position: 'relative', zIndex: 1, color: p.k && oscuro ? '#101114' : undefined }}>{p.w}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Producto = ({ frases, grupos, marca, usuario, transiciones = [] }) => {
  useFuentes()
  const f = useCurrentFrame()
  const t = f / FPS
  const W = mkW(frases)
  const all = grupos.map((_, i) => i).filter((i) => i > 0)
  const gs = inicios(frases, grupos, all)
  const total = frases.at(-1).fin + 1.6
  let gi = 0
  gs.forEach((a, i) => { if (t >= a) gi = i })
  const col = ESC_COL[gi]
  const oscuro = gi === 0 || gi === 8
  const Sc = ESC[gi]
  const handle = usuario || marca
  const tit = TITULOS[gi]
  const local = t - gs[gi]
  // iris hacia la escena siguiente (color de la siguiente), desde el centro de la ilustración
  const sig = gi < grupos.length - 1 ? gi + 1 : null
  const irisP = sig !== null ? clamp((t - (gs[sig] - 0.45)) / 0.45) : 0
  const irisEntra = clamp(1 - local / 0.4)
  const radio = (p) => Math.pow(p, 1.4) * 1500
  return (
    <AbsoluteFill style={{ background: col.bg, overflow: 'hidden' }}>
      {/* manchas suaves de fondo */}
      <div style={{ position: 'absolute', left: -200, top: -150, width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${col.ac}${oscuro ? '26' : '22'}, transparent 65%)` }} />
      <div style={{ position: 'absolute', right: -240, bottom: 200, width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, ${col.ac}${oscuro ? '1c' : '18'}, transparent 65%)` }} />
      {/* número gigante */}
      {gi > 0 && gi < 8 && (
        <div style={{ position: 'absolute', right: 40, top: 150, fontFamily: D, fontWeight: 700, fontSize: 420, lineHeight: 1, color: col.ac, opacity: 0.16 * pr(t, gs[gi], 0.5), letterSpacing: -10 }}>{gi}</div>
      )}
      {/* contenido de la escena */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Sc t={t} W={W} a={gs[gi]} handle={handle} />
      </div>
      {/* título de la razón */}
      {tit && (
        <div style={{ position: 'absolute', left: 60, top: 200, display: 'flex', alignItems: 'center', gap: 28, opacity: 1 - pr(t, (gs[gi + 1] ?? total) - 0.5, 0.2) }}>
          <div style={{ width: 128, height: 128, borderRadius: '50%', background: col.ac, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D, fontWeight: 700, fontSize: 76, transform: `scale(${0.4 + 0.6 * pr(t, gs[gi], 0.5, outB)})` }}>{gi}</div>
          <div style={{ overflow: 'hidden' }}>
            {tit.map((l, i) => (<div key={i} style={{ fontFamily: D, fontWeight: 700, fontSize: 72, lineHeight: 1.02, color: I.ink, letterSpacing: -1.5, transform: `translateY(${(1 - pr(t, gs[gi] + 0.1 + i * 0.1, 0.4)) * 100}%)` }}>{l}</div>))}
          </div>
        </div>
      )}
      {/* cabecera: usuario */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 118, display: 'flex', justifyContent: 'space-between', fontFamily: U, fontWeight: 700, fontSize: 28, letterSpacing: 1, color: oscuro ? '#9DA3B8' : I.mute }}>
        <div>{gi > 0 && gi < 8 ? `RAZÓN ${gi} DE 7` : 'AIRPODS PRO 2'}</div>
        <div>{handle}</div>
      </div>
      <Subs t={t} fr={frases} ac={col.ac} oscuro={oscuro} />
      {/* iris de salida: círculo del color de la escena siguiente */}
      {sig !== null && irisP > 0 && (
        <div style={{ position: 'absolute', left: 540 - radio(irisP), top: 860 - radio(irisP), width: radio(irisP) * 2, height: radio(irisP) * 2, borderRadius: '50%', background: ESC_COL[sig].bg, zIndex: 30 }} />
      )}
      {/* iris de entrada: anillo del color que se contrae desde la escena anterior */}
      {gi > 0 && irisEntra > 0 && (
        <div style={{ position: 'absolute', left: 540 - 1500 * irisEntra, top: 860 - 1500 * irisEntra, width: 3000 * irisEntra, height: 3000 * irisEntra, borderRadius: '50%', background: ESC_COL[gi - 1].bg, zIndex: 29, opacity: 0 }} />
      )}
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: `${clamp(t / total) * 100}%`, height: 10, background: col.ac, zIndex: 31 }} />
    </AbsoluteFill>
  )
}
