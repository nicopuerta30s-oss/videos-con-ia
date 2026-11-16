// Diseño «cinético»: fondo oscuro, tipografía enorme que golpea, escenas a pantalla completa con cámara en movimiento,
// transición de persianas y subtítulos grandes palabra por palabra. Pensado para verse distinto al diseño «pro».
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { Mascota, clamp, io3, kf, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const K = { bg: '#0A0C12', bg2: '#141829', card: '#171B2B', line: '#2A3050', txt: '#F5F7FF', dim: '#7F86A3', lime: '#C8FF3E', cyan: '#3DE0FF', coral: '#FF5D73', vio: '#9B7CFF', am: '#FFC24A', gr: '#3DDC97' }
const D = "'Poppins', 'Helvetica Neue', sans-serif"
const U = "'Inter', 'Helvetica Neue', sans-serif"
const M = "'SF Mono', Menlo, monospace"

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

const ventana = (t, a, b, d = 0.25) => pr(t, a, d) * (1 - pr(t, b, d, io3))
const pulso = (t, t0, d = 0.5) => Math.sin(clamp((t - t0) / d) * Math.PI)
const Abs = ({ x, y, o = 1, s = 1, r = 0, origen = 'center', children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: o, transform: `scale(${s}) rotate(${r}deg)`, transformOrigin: origen, ...style }}>{children}</div>
)
const Tx = ({ c = K.txt, size = 40, w = 700, f = D, children, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.1, ...style }}>{children}</div>
)
const Panel = ({ x, y, w, h, o = 1, s = 1, r = 36, c = K.card, borde = K.line, glow, children, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: o, transform: `scale(${s})`, background: c, border: `3px solid ${borde}`, borderRadius: r, boxShadow: glow ? `0 0 60px ${glow}55, 0 20px 50px rgba(0,0,0,.45)` : '0 20px 50px rgba(0,0,0,.45)', boxSizing: 'border-box', ...style }}>{children}</div>
)

/* iconos de línea (propios de este diseño) */
const Ico = ({ tipo, size = 90, c = K.txt, sw = 6 }) => {
  const p = { stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  const g = {
    campana: (<g {...p}><path d="M-34 24 V-4 a34 34 0 0 1 68 0 V24 l10 12 h-88 z" /><path d="M-12 50 a14 14 0 0 0 24 0" /><line x1="0" y1="-48" x2="0" y2="-38" /></g>),
    pago: (<g {...p}><rect x="-52" y="-34" width="104" height="70" rx="12" /><line x1="-52" y1="-12" x2="52" y2="-12" /><line x1="-36" y1="16" x2="-6" y2="16" /></g>),
    doc: (<g {...p}><path d="M-34 -50 h46 l26 26 v74 h-72 z" /><polyline points="12,-50 12,-24 38,-24" /><line x1="-20" y1="2" x2="22" y2="2" /><line x1="-20" y1="20" x2="22" y2="20" /></g>),
    libro: (<g {...p}><path d="M-52 -34 q26 -10 52 4 q26 -14 52 -4 v72 q-26 -10 -52 4 q-26 -14 -52 -4 z" /><line x1="0" y1="-30" x2="0" y2="42" /></g>),
    telefono: (<g {...p}><rect x="-30" y="-52" width="60" height="104" rx="14" /><line x1="-8" y1="38" x2="8" y2="38" /></g>),
    engranaje: (<g {...p}><circle r="15" /><circle r="34" />{[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (<line key={a} x1="0" y1="-34" x2="0" y2="-48" transform={`rotate(${a})`} />))}</g>),
    enchufe: (<g {...p}><line x1="-16" y1="-48" x2="-16" y2="-18" /><line x1="16" y1="-48" x2="16" y2="-18" /><path d="M-34 -18 h68 v20 a34 34 0 0 1 -68 0 z" /><line x1="0" y1="32" x2="0" y2="52" /></g>),
    check: (<g {...p}><polyline points="-30,2 -10,24 32,-24" /></g>),
    cruz: (<g {...p}><line x1="-26" y1="-26" x2="26" y2="26" /><line x1="26" y1="-26" x2="-26" y2="26" /></g>),
    corazon: (<g {...p}><path d="M0 36 C-60 -4 -38 -48 -8 -34 C-2 -30 0 -24 0 -20 C0 -24 2 -30 8 -34 C38 -48 60 -4 0 36 z" /></g>),
    marcador: (<g {...p}><path d="M-28 -46 h56 v94 l-28 -22 l-28 22 z" /></g>),
    moneda: (<g {...p}><circle r="38" /><path d="M10 -16 q-6 -8 -18 -4 q-12 6 0 14 q12 6 4 16 q-8 6 -18 -2" /></g>),
    chispa: (<g {...p}><path d="M0 -46 L10 -10 L46 0 L10 10 L0 46 L-10 10 L-46 0 L-10 -10 z" /></g>),
  }[tipo]
  return (<svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: 'block', overflow: 'visible' }}>{g}</svg>)
}

/* ───────────── fondo y cámara ───────────── */
const Fondo = ({ t, acento }) => (
  <>
    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(900px 900px at 80% 12%, ${acento}22, transparent 62%), radial-gradient(900px 900px at 10% 90%, ${K.vio}1c, transparent 60%), ${K.bg}` }} />
    <div style={{ position: 'absolute', inset: -60, backgroundImage: `linear-gradient(${K.line}55 1px, transparent 1px), linear-gradient(90deg, ${K.line}55 1px, transparent 1px)`, backgroundSize: '90px 90px', transform: `translate(${(t * 14) % 90}px, ${(t * 8) % 90}px)`, opacity: 0.35, maskImage: 'radial-gradient(circle at 50% 40%, #000 20%, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle at 50% 40%, #000 20%, transparent 75%)' }} />
  </>
)

/* ───────────── subtítulos grandes ───────────── */
const Subs = ({ t, fr }) => {
  const trozos = []
  fr.forEach((f, fi) => {
    let cur = []
    f.palabras.forEach((p, j) => {
      cur.push(p)
      if (cur.length >= 3 || (/[,:.?!]$/.test(p.w) && cur.length >= 2) || j === f.palabras.length - 1) {
        trozos.push({ p: cur, fi })
        cur = []
      }
    })
  })
  const idx = trozos.findIndex((z, i) => {
    const a = z.p[0].t0 - 0.03
    const sig = trozos[i + 1]
    const b = sig && sig.fi === z.fi ? sig.p[0].t0 - 0.03 : fr[z.fi].fin + 0.25
    return t >= a && t < b
  })
  if (idx < 0) return null
  const z = trozos[idx]
  return (
    <div style={{ position: 'absolute', left: 40, right: 40, top: 1500, display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'nowrap' }}>
      {z.p.map((p, i) => {
        const q = pr(t, p.t0 - 0.03, 0.22, outB)
        return (
          <div key={i} style={{ fontFamily: D, fontWeight: 700, fontSize: 78, letterSpacing: -1, whiteSpace: 'nowrap', color: p.k ? K.lime : K.txt, opacity: clamp(q * 1.5), transform: `translateY(${(1 - q) * 30}px) scale(${0.7 + 0.3 * q})`, textShadow: '0 8px 0 rgba(0,0,0,.4)' }}>{p.w}</div>
        )
      })}
    </div>
  )
}

/* ───────────── persianas ───────────── */
const Persianas = ({ t, ts, c }) => {
  const n = 8, h = 1920 / n
  if (t < ts - 0.4 || t > ts + 0.45) return null
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const d = i * 0.035
        const entra = out3(clamp((t - (ts - 0.28) - d) / 0.2))
        const sale = io3(clamp((t - ts - d) / 0.2))
        const izq = -1080 + entra * 1080 + sale * 1080
        return <div key={i} style={{ position: 'absolute', left: izq, top: i * h, width: 1080, height: h + 1, background: i % 2 ? K.lime : '#0A0C12', zIndex: 40 }} />
      })}
    </>
  )
}

/* ───────────── escenas ───────────── */
const Golpe = ({ t, t0, x, y, w, h, texto, c, ic, dir, size = 150 }) => {
  const q = pr(t, t0, 0.35, outB)
  const llegada = (1 - clamp((t - t0) / 0.28)) * dir * 1300
  const shake = t > t0 && t < t0 + 0.25 ? Math.sin((t - t0) * 120) * 10 * (1 - (t - t0) / 0.25) : 0
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: c, borderRadius: 44, transform: `translate(${llegada + shake}px, ${shake * 0.6}px) rotate(${dir * -2}deg)`, opacity: clamp(q * 3), boxShadow: `0 0 80px ${c}66`, display: 'flex', alignItems: 'center', gap: 34, padding: '0 50px', boxSizing: 'border-box' }}>
      <Ico tipo={ic} size={150} c="#0A0C12" sw={7} />
      <Tx c="#0A0C12" size={size} style={{ letterSpacing: -3 }}>{texto}</Tx>
    </div>
  )
}

const C0 = ({ t, W }) => {
  const a = W(0, 4), b = W(0, 6), c = W(0, 9)
  const ini = pr(t, 0.05, 0.4, outB) * (1 - pr(t, a - 0.12, 0.12))
  return (
    <>
      {ini > 0 && (
        <Abs x={0} y={700} o={ini} s={0.8 + 0.2 * ini} style={{ width: 1080, textAlign: 'center' }}>
          <Tx size={190} c={K.txt} style={{ letterSpacing: -4 }}>¿QUÉ ES?</Tx>
        </Abs>
      )}
      <Golpe t={t} t0={a} x={50} y={420} w={980} h={290} texto="API" c={K.lime} ic="enchufe" dir={-1} size={170} />
      <Golpe t={t} t0={b} x={50} y={760} w={980} h={290} texto="WEBHOOK" c={K.cyan} ic="campana" dir={1} size={128} />
      <Golpe t={t} t0={c} x={50} y={1100} w={980} h={290} texto="SKILL" c={K.coral} ic="libro" dir={-1} size={170} />
    </>
  )
}

/* mesero */
const Mesero = ({ x, y, flip = 1, esc = 1, camina = 0, llevando = null, tapa = 0 }) => {
  const paso = Math.sin(camina * 22) * 6
  return (
    <g transform={`translate(${x} ${y}) scale(${flip * esc} ${esc})`}>
      <ellipse cx="0" cy="150" rx="70" ry="12" fill="#000" opacity="0.35" />
      <rect x="-30" y="92" width="22" height={56 + paso} rx="9" fill="#1A1E33" />
      <rect x="8" y="92" width="22" height={56 - paso} rx="9" fill="#1A1E33" />
      <rect x="-46" y="-24" width="92" height="124" rx="26" fill="#F3F5FF" />
      <path d="M-46 4 q0 -28 22 -28 l24 36 l24 -36 q22 0 22 28 v70 q0 26 -22 26 h-48 q-22 0 -22 -26 z" fill="#1A1E33" opacity="0.92" />
      <path d="M-12 -22 l12 12 l12 -12 l-12 -10 z" fill={K.coral} />
      <circle cx="0" cy="-58" r="38" fill="#F2C4A0" />
      <path d="M-38 -62 a38 34 0 0 1 76 0 q-12 -16 -38 -14 q-26 -2 -38 14 z" fill="#2A1F2E" />
      <circle cx="-13" cy="-54" r="4.5" fill="#2A1F2E" />
      <circle cx="13" cy="-54" r="4.5" fill="#2A1F2E" />
      <path d="M-12 -40 q12 10 24 0" stroke="#2A1F2E" strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* brazo con bandeja */}
      <path d="M40 -4 q34 4 44 -34" stroke="#F3F5FF" strokeWidth="22" strokeLinecap="round" fill="none" />
      <circle cx="84" cy="-40" r="13" fill="#F2C4A0" />
      <ellipse cx="86" cy="-48" rx="62" ry="9" fill="#C9CFE6" />
      {llevando === 'orden' && (
        <g transform="translate(86 -54)"><rect x="-28" y="-46" width="56" height="46" rx="6" fill="#fff" transform="rotate(-6)" /><line x1="-16" y1="-32" x2="14" y2="-34" stroke={K.coral} strokeWidth="5" strokeLinecap="round" /><line x1="-16" y1="-18" x2="8" y2="-19" stroke="#9AA0BF" strokeWidth="5" strokeLinecap="round" /></g>
      )}
      {llevando === 'plato' && (
        <g transform={`translate(86 -56)`}>
          <path d="M-42 0 a42 40 0 0 1 84 0 z" fill="#E9ECFA" transform={`translate(0 ${-tapa * 46}) rotate(${-tapa * 16})`} />
          <circle cx="0" cy={-42 - tapa * 46} r="6" fill="#C9CFE6" />
          {tapa > 0.3 && <rect x="-26" y="-18" width="52" height="16" rx="8" fill={K.lime} />}
        </g>
      )}
    </g>
  )
}

const C1 = ({ t, W }) => {
  const tPide = W(1, 9), tLleva = W(1, 12), tCocina = W(1, 18), tTrae = W(1, 20), tLlega = W(1, 23), tApps = W(1, 26)
  const X0 = 400, X1 = 690
  const pos = kf(t, [{ t: tLleva - 0.2, x: X0, y: 0 }, { t: tCocina - 0.1, x: X1, y: 0 }, { t: tTrae - 0.1, x: X1, y: 0 }, { t: tLlega, x: X0, y: 0 }])
  const camina = (t > tLleva - 0.2 && t < tCocina - 0.1) || (t > tTrae - 0.1 && t < tLlega) ? t : 0
  const yendo = t < tTrae - 0.1
  const lleva = t < tLleva - 0.1 ? null : t < tCocina - 0.05 ? 'orden' : t < tTrae - 0.1 ? null : 'plato'
  const tapa = t > tLlega + 0.05 ? out3(clamp((t - tLlega - 0.05) / 0.35)) : 0
  const orden = pr(t, tPide, 0.35, outB) * (t < tLleva - 0.1 ? 1 : 0)
  const respuesta = pr(t, tLlega + 0.25, 0.4, outB)
  const vapor = t > tCocina - 0.05 && t < tTrae ? 1 : 0
  const apps = ventana(t, tApps, 999)
  const Y = 880
  return (
    <>
      {/* cliente */}
      <Panel x={40} y={Y - 215} w={210} h={420} r={40} glow={K.cyan} borde={K.cyan + '88'}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 60, display: 'flex', justifyContent: 'center' }}><Ico tipo="telefono" size={170} c={K.cyan} /></div>
        <Tx size={42} c={K.cyan} style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center' }}>TÚ</Tx>
      </Panel>
      {/* cocina */}
      <Panel x={830} y={Y - 215} w={210} h={420} r={40} glow={K.am} borde={K.am + '88'}>
        <div style={{ position: 'absolute', left: 46, top: 190, width: 118, height: 74, borderRadius: '14px 14px 30px 30px', background: '#2A3050', border: `4px solid ${K.am}` }} />
        <div style={{ position: 'absolute', left: 36, top: 176, width: 138, height: 18, borderRadius: 9, background: K.am }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: 'absolute', left: 70 + i * 30, top: 150 - ((t * 60 + i * 26) % 70) * vapor, width: 22, height: 22, borderRadius: '50%', background: '#fff', opacity: vapor * (0.55 - ((t * 60 + i * 26) % 70) / 140) }} />
        ))}
        <Tx size={36} c={K.am} style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center' }}>COCINA</Tx>
      </Panel>
      {/* camino */}
      <div style={{ position: 'absolute', left: 270, right: 270, top: Y + 205, height: 8, borderRadius: 4, background: `repeating-linear-gradient(90deg, ${K.line} 0 22px, transparent 22px 44px)` }} />
      {/* pedido encima del cliente */}
      {orden > 0 && (
        <Abs x={50} y={Y - 320} o={orden} s={0.6 + 0.4 * orden}>
          <div style={{ background: '#fff', borderRadius: 16, padding: '14px 20px', fontFamily: M, fontWeight: 700, fontSize: 30, color: '#0A0C12', transform: 'rotate(-5deg)' }}>GET /pedido</div>
        </Abs>
      )}
      <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Mesero x={pos.x} y={Y - 30} esc={1.5} flip={yendo ? 1 : -1} camina={camina} llevando={lleva} tapa={tapa} />
      </svg>
      {respuesta > 0 && (
        <Abs x={60} y={Y + 250} o={respuesta} s={0.7 + 0.3 * respuesta}>
          <div style={{ background: K.lime, borderRadius: 20, padding: '14px 24px', fontFamily: M, fontWeight: 700, fontSize: 34, color: '#0A0C12' }}>200 OK  {'{ respuesta }'}</div>
        </Abs>
      )}
      {/* app ⇄ app */}
      {apps > 0 && (
        <Abs x={0} y={1330} o={apps} style={{ width: 1080 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26 }}>
            <div style={{ background: K.card, border: `3px solid ${K.vio}`, borderRadius: 28, padding: '16px 34px', fontFamily: D, fontWeight: 700, fontSize: 44, color: K.vio }}>App A</div>
            <svg width="190" height="70" viewBox="0 0 190 70"><path d="M14 22 H170 M148 6 L174 22 L148 38" stroke={K.lime} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d="M176 50 H20 M42 34 L16 50 L42 66" stroke={K.cyan} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
            <div style={{ background: K.card, border: `3px solid ${K.am}`, borderRadius: 28, padding: '16px 34px', fontFamily: D, fontWeight: 700, fontSize: 44, color: K.am }}>App B</div>
          </div>
        </Abs>
      )}
    </>
  )
}

const C2 = ({ t, W }) => {
  const tAlReves = W(2, 3), tAvisa = W(2, 12), tTimbre = W(2, 15), tLlega = W(2, 22), tPaga = W(2, 26)
  const A = ventana(t, 0, tAvisa - 0.1, 0.3)
  const B = ventana(t, tAvisa - 0.1, tPaga - 0.2, 0.3)
  const timbre = pr(t, tTimbre, 0.3, outB)
  const ring = (k) => clamp((t - tTimbre - 0.1 - k * 0.22) / 0.9)
  const notif = pr(t, tPaga, 0.5, outB)
  const preg = (k) => ventana(t, tAlReves + 0.2 + k * 0.5, tAvisa - 0.25, 0.2)
  return (
    <>
      {/* A: preguntar vs. avisar */}
      <Abs x={0} y={0} o={A} style={{ width: 1080, height: 1500 }}>
        <Panel x={70} y={430} w={940} h={330} glow={K.lime} borde={K.lime + '77'}>
          <Tx size={44} c={K.lime} style={{ position: 'absolute', left: 40, top: 28 }}>API · tú preguntas</Tx>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{ position: 'absolute', left: 40 + k * 300, top: 130 + (k % 2) * 30, background: '#fff', color: '#0A0C12', borderRadius: 30, padding: '14px 26px', fontFamily: U, fontWeight: 700, fontSize: 34, opacity: preg(k), transform: `scale(${0.8 + 0.2 * preg(k)})` }}>¿Ya llegó?</div>
          ))}
          <Tx size={180} c={K.coral} style={{ position: 'absolute', right: 50, top: 70, opacity: pr(t, tAvisa - 0.6, 0.3) }}>?</Tx>
        </Panel>
        <Panel x={70} y={820} w={940} h={330} glow={K.cyan} borde={K.cyan + '77'} o={pr(t, tAlReves + 0.6, 0.4)}>
          <Tx size={44} c={K.cyan} style={{ position: 'absolute', left: 40, top: 28 }}>Webhook · te avisan</Tx>
          <div style={{ position: 'absolute', left: 60, top: 120, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ background: K.bg2, border: `3px solid ${K.cyan}`, borderRadius: 24, padding: '16px 26px', fontFamily: D, fontWeight: 700, fontSize: 38, color: K.cyan }}>Otra app</div>
            <svg width="320" height="60" viewBox="0 0 320 60"><path d="M10 30 H300 M276 12 L304 30 L276 48" stroke={K.cyan} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="22 14" strokeDashoffset={-t * 80} /></svg>
            <Ico tipo="telefono" size={110} c={K.cyan} />
          </div>
        </Panel>
      </Abs>
      {/* B: timbre */}
      <Abs x={0} y={0} o={B} style={{ width: 1080, height: 1500 }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ position: 'absolute', left: 540 - 150, top: 800 - 150, width: 300, height: 300, borderRadius: '50%', border: `5px solid ${K.cyan}`, opacity: (1 - ring(k)) * (ring(k) > 0 ? 1 : 0), transform: `scale(${0.6 + ring(k) * 2.4})` }} />
        ))}
        <Abs x={540 - 130} y={800 - 130} s={timbre} r={t > tTimbre && t < tTimbre + 1.1 ? Math.sin((t - tTimbre) * 38) * 12 * (1 - (t - tTimbre) / 1.1) : 0}>
          <div style={{ width: 260, height: 260, borderRadius: '50%', background: K.cyan, boxShadow: `0 0 90px ${K.cyan}88`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="campana" size={170} c="#0A0C12" sw={8} /></div>
        </Abs>
        <Abs x={0} y={1010} o={pr(t, tTimbre + 0.15, 0.3)} style={{ width: 1080, textAlign: 'center' }}>
          <Tx size={110} c={K.cyan} style={{ letterSpacing: 4 }}>DING-DONG</Tx>
        </Abs>
        {t > tLlega - 0.1 && (
          <Abs x={110} y={1190} o={pr(t, tLlega - 0.1, 0.3)} s={0.8 + 0.2 * pr(t, tLlega - 0.1, 0.4, outB)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, background: K.card, border: `3px solid ${K.line}`, borderRadius: 40, padding: '16px 34px', fontFamily: D, fontWeight: 700, fontSize: 40, color: K.txt }}>
              <Ico tipo="telefono" size={56} c={K.dim} /> Alguien llegó
            </div>
          </Abs>
        )}
      </Abs>
      {/* notificación */}
      {notif > 0 && (
        <Abs x={60} y={380 - (1 - notif) * 260} o={clamp(notif * 2)} style={{ width: 960 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26, background: '#fff', borderRadius: 40, padding: '26px 34px', boxShadow: '0 30px 70px rgba(0,0,0,.55)' }}>
            <div style={{ width: 108, height: 108, borderRadius: 30, background: K.gr, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="moneda" size={80} c="#fff" /></div>
            <div>
              <Tx size={46} c="#0A0C12">Pago recibido</Tx>
              <Tx size={40} c={K.gr} w={700} style={{ marginTop: 6 }}>+ $50.000</Tx>
            </div>
          </div>
        </Abs>
      )}
    </>
  )
}

const Nodo = ({ x, y, o, s = 1, c, ic, titulo, sub, lit }) => (
  <Panel x={x} y={y} w={700} h={190} o={o} s={s} glow={lit > 0.5 ? c : null} borde={lit > 0.5 ? c : K.line} r={44}>
    <div style={{ position: 'absolute', left: 34, top: 34, width: 122, height: 122, borderRadius: 34, background: lit > 0.5 ? c : K.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo={ic} size={84} c={lit > 0.5 ? '#0A0C12' : K.dim} /></div>
    <Tx size={46} style={{ position: 'absolute', left: 184, top: 40, whiteSpace: 'nowrap' }}>{titulo}</Tx>
    <Tx size={30} c={K.dim} w={500} f={U} style={{ position: 'absolute', left: 186, top: 108, whiteSpace: 'nowrap' }}>{sub}</Tx>
  </Panel>
)

const C3 = ({ t, W }) => {
  const tWeb = W(3, 5), tApi = W(3, 12), tFac = W(3, 19)
  const n1 = pr(t, W(3, 3), 0.4, outB)
  const n2 = pr(t, tWeb + 0.3, 0.4, outB)
  const n3 = pr(t, tApi + 0.3, 0.4, outB)
  const l1 = pr(t, tWeb, 0.6, io3)
  const l2 = pr(t, tApi, 0.6, io3)
  const X = 190
  const Linea = ({ y0, y1, p, c, texto }) => (
    <>
      <div style={{ position: 'absolute', left: 540 - 4, top: y0, width: 8, height: (y1 - y0) * p, background: c, borderRadius: 4, boxShadow: `0 0 24px ${c}` }} />
      {p > 0 && p < 1 && <div style={{ position: 'absolute', left: 540 - 18, top: y0 + (y1 - y0) * p - 18, width: 36, height: 36, borderRadius: '50%', background: '#fff', boxShadow: `0 0 40px ${c}` }} />}
      <Abs x={560} y={(y0 + y1) / 2 - 24} o={clamp(p * 3)}><div style={{ background: c, color: '#0A0C12', fontFamily: D, fontWeight: 700, fontSize: 36, borderRadius: 30, padding: '8px 26px', letterSpacing: 2 }}>{texto}</div></Abs>
    </>
  )
  const fac = pr(t, tFac, 0.5, outB)
  return (
    <>
      <Nodo x={X} y={400} o={n1} s={0.85 + 0.15 * n1} c={K.gr} ic="pago" titulo="Te pagan" sub="algo pasó" lit={n1} />
      <Linea y0={590} y1={780} p={l1} c={K.cyan} texto="WEBHOOK" />
      <Nodo x={X} y={780} o={n2} s={0.85 + 0.15 * n2} c={K.vio} ic="engranaje" titulo="Tu automatización" sub="Claude + herramientas" lit={n2 > 0.9 ? 1 : 0} />
      <Linea y0={970} y1={1160} p={l2} c={K.lime} texto="API" />
      <Nodo x={X} y={1160} o={n3} s={0.85 + 0.15 * n3} c={K.lime} ic="doc" titulo="Factura enviada" sub="sin que hagas nada" lit={fac > 0.5 ? 1 : 0} />
      {fac > 0 && (
        <Abs x={X + 650} y={1130} o={fac} s={fac}><div style={{ width: 84, height: 84, borderRadius: '50%', background: K.gr, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="check" size={60} c="#fff" sw={9} /></div></Abs>
      )}
    </>
  )
}

const C4 = ({ t, W }) => {
  const tLee = W(4, 6), tClaude = W(4, 9), tVez = W(4, 10), tTarea = W(4, 16), tManera = W(4, 20)
  const doc = pr(t, W(4, 1) - 0.2, 0.5, outB)
  const lineas = ['Tono: cercano y directo', 'Formato: 3 puntos + cierre', 'Siempre: llamada a la acción']
  const sello = pr(t, tVez + 0.5, 0.35, outB)
  const tareas = [{ n: 'Guion', t0: tTarea }, { n: 'Reporte', t0: tTarea + 0.45 }, { n: 'Post', t0: tTarea + 0.9 }]
  const manera = pr(t, tManera, 0.4, outB)
  return (
    <>
      <Panel x={80} y={420} w={920} h={470} o={doc} s={0.9 + 0.1 * doc} glow={K.coral} borde={K.coral + '99'}>
        <div style={{ position: 'absolute', left: 36, top: 28, display: 'flex', alignItems: 'center', gap: 18 }}>
          <Ico tipo="libro" size={68} c={K.coral} />
          <Tx size={50} c={K.coral} f={M}>SKILL.md</Tx>
        </div>
        <div style={{ position: 'absolute', left: 44, right: 44, top: 140, height: 3, background: K.line }} />
        {lineas.map((l, i) => {
          const n = Math.floor(l.length * clamp((t - (W(4, 4) + i * 0.7)) / 0.6))
          return <Tx key={i} size={40} f={M} w={500} style={{ position: 'absolute', left: 44, top: 175 + i * 82 }} c={K.txt}><span style={{ color: K.coral }}>{'› '}</span>{l.slice(0, n)}</Tx>
        })}
        {sello > 0 && (
          <Abs x={440} y={26} o={sello} s={sello} r={-6}>
            <div style={{ border: `7px solid ${K.gr}`, color: K.gr, borderRadius: 20, padding: '8px 26px', fontFamily: D, fontWeight: 700, fontSize: 50, letterSpacing: 2, background: 'rgba(10,12,18,.8)', whiteSpace: 'nowrap' }}>APRENDIDO 1×</div>
          </Abs>
        )}
      </Panel>
      <div style={{ position: 'absolute', left: 80, top: 980, width: 560 }}>
        {tareas.map((a, i) => {
          const q = pr(t, a.t0, 0.35, outB)
          return (
            <Abs key={a.n} x={0} y={i * 130} o={q} s={0.85 + 0.15 * q} origen="0 50%">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: K.card, border: `3px solid ${K.lime}88`, borderRadius: 60, padding: '14px 40px 14px 20px' }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: K.lime, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="check" size={48} c="#0A0C12" sw={9} /></div>
                <Tx size={46}>{a.n}</Tx>
              </div>
            </Abs>
          )
        })}
      </div>
      <Mascota x={830} y={1130} w={420} h={420} s={0.95} mood={manera > 0.5 ? 'happy' : 'ok'} look={[-6, 4]} t={t} />
      {manera > 0 && (
        <Abs x={560} y={870} o={manera} s={manera} r={5}>
          <div style={{ background: K.lime, color: '#0A0C12', fontFamily: D, fontWeight: 700, fontSize: 40, borderRadius: 30, padding: '10px 30px', whiteSpace: 'nowrap' }}>a tu manera</div>
        </Abs>
      )}
    </>
  )
}

const C5 = ({ t, W, handle }) => {
  const tS = W(5, 4)
  const letras = handle.split('')
  const sig = clamp((t - tS - 0.45) / 0.2)
  const cur = kf(t, [{ t: tS - 0.5, x: 880, y: 1230 }, { t: tS + 0.35, x: 640, y: 1010 }])
  const flotan = [{ ic: 'corazon', c: K.coral, x: 160, t0: W(5, 0) }, { ic: 'marcador', c: K.lime, x: 860, t0: W(5, 0) + 0.2 }, { ic: 'chispa', c: K.am, x: 480, t0: W(5, 2) }, { ic: 'corazon', c: K.vio, x: 740, t0: W(5, 5) }, { ic: 'marcador', c: K.cyan, x: 300, t0: W(5, 7) }]
  return (
    <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 98, letterSpacing: -2, whiteSpace: 'nowrap' }}>
        {letras.map((l, i) => {
          const q = pr(t, tS - 0.2 + i * 0.045, 0.3, outB)
          return <span key={i} style={{ display: 'inline-block', color: i === 0 ? K.coral : K.lime, opacity: clamp(q * 2), transform: `translateY(${(1 - q) * 70}px)`, textShadow: `0 0 40px ${K.lime}66` }}>{l}</span>
        })}
      </div>
      <Abs x={0} y={800} o={pr(t, tS + 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={46} c={K.dim} f={U} w={600}>tips de Claude · cada semana</Tx>
      </Abs>
      <Abs x={290} y={950} o={pr(t, tS, 0.4)} s={0.9 + 0.1 * pr(t, tS, 0.4, outB)}>
        <div style={{ width: 500, height: 120, borderRadius: 60, background: sig > 0.5 ? K.card : K.lime, border: `4px solid ${K.lime}`, color: sig > 0.5 ? K.lime : '#0A0C12', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontFamily: D, fontWeight: 700, fontSize: 52, letterSpacing: 2 }}>
          {sig > 0.5 ? (<><Ico tipo="check" size={56} c={K.lime} sw={9} /> SIGUIENDO</>) : 'SEGUIR'}
        </div>
      </Abs>
      <div style={{ position: 'absolute', left: cur.x, top: cur.y, zIndex: 20 }}>
        <svg width="62" height="70" viewBox="0 0 28 42" style={{ transform: `scale(${1 - 0.12 * pulso(t, tS + 0.4, 0.3)})`, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.6))' }}><path d="M2 2 L2 34 L10 27 L16 40 L22 37 L16 25 L27 25 Z" fill="#fff" stroke="#0A0C12" strokeWidth="2.5" strokeLinejoin="round" /></svg>
      </div>
      {flotan.map((f, i) => {
        const p = clamp((t - f.t0) / 2.2)
        return p > 0 && p < 1 ? (
          <Abs key={i} x={f.x} y={1360 - p * 760} o={Math.sin(p * Math.PI)} s={0.7 + p * 0.5}><Ico tipo={f.ic} size={110} c={f.c} /></Abs>
        ) : null
      })}
    </>
  )
}

const ESC = [C0, C1, C2, C3, C4, C5]
const ACENTOS = [K.lime, K.lime, K.cyan, K.vio, K.coral, K.lime]

export const Cinetico = ({ frases, grupos, marca, transiciones = [], usuario }) => {
  useFuentes()
  const f = useCurrentFrame()
  const t = f / FPS
  const W = mkW(frases)
  const gs = inicios(frases, grupos, transiciones)
  const total = frases.at(-1).fin + 1.6
  const ge = grupos.map((_, i) => (i < grupos.length - 1 ? gs[i + 1] : total))
  let gi = 0
  gs.forEach((a, i) => { if (t >= a) gi = i })
  const g = grupos[gi]
  const Sc = ESC[gi]
  const local = t - gs[gi]
  const dur = ge[gi] - gs[gi]
  // cámara: golpe de zoom al entrar y avance lento
  const zoom = 1 + 0.1 * Math.pow(1 - clamp(local / 0.45), 3) + 0.035 * (local / dur)
  const handle = usuario || marca
  return (
    <AbsoluteFill style={{ background: K.bg, overflow: 'hidden' }}>
      <Fondo t={t} acento={ACENTOS[gi]} />
      {/* palabra gigante de fondo, solo contorno */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: Math.min(520, 1500 / Math.max(2, g.fondo.length)), color: 'transparent', WebkitTextStroke: `3px ${ACENTOS[gi]}`, opacity: 0.1 * pr(t, gs[gi], 0.6), letterSpacing: -6, lineHeight: 1, transform: `scale(${1 + local * 0.02})` }}>{g.fondo}</div>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: '50% 45%' }}>
        <Sc t={t} W={W} a={gs[gi]} handle={handle} />
      </div>
      {/* cabecera mínima y progreso inferior */}
      <div style={{ position: 'absolute', left: 48, right: 48, top: 64, display: 'flex', justifyContent: 'space-between', fontFamily: M, fontWeight: 700, fontSize: 26, letterSpacing: 2 }}>
        <div style={{ color: ACENTOS[gi] }}>{'// '}{g.etiqueta}</div>
        <div style={{ color: K.txt, opacity: 0.85 }}>{handle}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, bottom: 0, width: `${clamp(t / total) * 100}%`, height: 10, background: ACENTOS[gi] }} />
      <Subs t={t} fr={frases} />
      {transiciones.map((i) => (<Persianas key={i} t={t} ts={gs[i]} />))}
    </AbsoluteFill>
  )
}
