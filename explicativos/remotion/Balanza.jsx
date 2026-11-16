// Diseño «balanza»: fondo claro (crema, salvia y terracota), ilustración plana con trazo grueso. Una balanza compara lo caro con lo
// inteligente, etiquetas que se pelan, contadores que suben y una transición de iris que se abre desde el centro.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const B = { crema: '#F4EEE3', arena: '#E8DDC8', tinta: '#2B2A28', gris: '#8A8478', ter: '#D9623B', terS: '#F7DDD2', sal: '#3F7D63', salS: '#DCEBE3', blanco: '#FFFDF8', borde: '#2B2A28' }
const D = "'Poppins', 'Helvetica Neue', sans-serif"

function useFuentes() {
  const [h] = React.useState(() => delayRender('fuentes'))
  React.useEffect(() => {
    const caras = [
      new FontFace('Poppins', `url(${staticFile('Poppins-Bold.ttf')})`, { weight: '700' }),
      new FontFace('Poppins', `url(${staticFile('Poppins-Medium.ttf')})`, { weight: '500' }),
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
const Tx = ({ c = B.tinta, size = 40, w = 700, children, style }) => (
  <div style={{ fontFamily: D, fontWeight: w, fontSize: size, color: c, lineHeight: 1.05, ...style }}>{children}</div>
)
const Chip = ({ children, bg = B.sal, fg = '#fff', size = 36, style }) => (
  <div style={{ display: 'inline-flex', padding: `${size * 0.26}px ${size * 0.6}px`, borderRadius: 999, background: bg, color: fg, fontFamily: D, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', border: `4px solid ${B.tinta}`, boxShadow: `0 6px 0 ${B.tinta}`, ...style }}>{children}</div>
)
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
const cuenta = (t, t0, dur, hasta) => hasta * pr(t, t0, dur, io3)

// frasco plano de trazo grueso
const Frasco = ({ x, y, w = 140, liq = B.sal, label = '', o = 1, s = 1, r = 0, tag }) => {
  const h = w * 1.9
  return (
    <Abs x={x} y={y} o={o} s={s} r={r} origen="center bottom" style={{ width: w, height: h }}>
      <svg width={w} height={h} viewBox="0 0 100 190" style={{ display: 'block', overflow: 'visible' }}>
        <rect x="38" y="6" width="24" height="26" rx="4" fill={B.tinta} />
        <rect x="42" y="30" width="16" height="14" fill={B.blanco} stroke={B.tinta} strokeWidth="4" />
        <rect x="8" y="42" width="84" height="140" rx="16" fill={liq} stroke={B.tinta} strokeWidth="5" />
        <rect x="18" y="52" width="9" height="90" rx="4" fill="#fff" opacity="0.45" />
        <rect x="26" y="92" width="52" height="56" rx="4" fill={B.blanco} stroke={B.tinta} strokeWidth="3" />
        <text x="52" y="126" textAnchor="middle" fontFamily={D} fontWeight="700" fontSize={label.length > 7 ? 9 : 11} fill={B.tinta}>{label}</text>
      </svg>
      {tag}
    </Abs>
  )
}

/* ───────────── escenas ───────────── */
const E0 = ({ t, W }) => {
  const lin = [['¿CUÁNTO', W(0, 0), B.tinta], ['GASTAS EN', W(0, 1), B.tinta], ['PERFUME', W(0, 3), B.tinta], ['AL AÑO?', W(0, 4), B.ter]]
  const calc = pr(t, W(0, 6) - 0.1, 0.55, outB), tecla = pr(t, W(0, 7) - 0.05, 0.25)
  const parpadeo = t > W(0, 6) && t < W(0, 7) ? ['$ 0', '$ ?', '$ ...'][Math.floor(t * 12) % 3] : '$ ?'
  return (
    <>
      {lin.map(([tx, t0, c], i) => { const q = pr(t, t0 - 0.1, 0.45, outB); return (<Abs key={i} x={0} y={360 + i * 140} o={clamp(q * 2)} s={0.7 + 0.3 * q} r={(1 - q) * (i % 2 ? 4 : -4)} style={{ width: 1080, textAlign: 'center' }}><Tx size={150} c={c} style={{ letterSpacing: -4 }}>{tx}</Tx></Abs>) })}
      <Abs x={290} y={1000} o={clamp(calc * 2)} s={0.6 + 0.4 * calc} r={(1 - calc) * 10} style={{ width: 500, height: 340, borderRadius: 40, background: B.sal, border: `6px solid ${B.tinta}`, boxShadow: `0 10px 0 ${B.tinta}` }}>
        <div style={{ position: 'absolute', left: 30, top: 30, width: 440, height: 110, borderRadius: 20, background: B.salS, border: `4px solid ${B.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 26px' }}><Tx size={72} w={700}>{parpadeo}</Tx></div>
        {Array.from({ length: 8 }, (_, i) => { const igual = i === 7; return (<div key={i} style={{ position: 'absolute', left: 30 + (i % 4) * 112, top: 170 + Math.floor(i / 4) * 78, width: 98, height: 62, borderRadius: 16, background: igual ? B.ter : B.blanco, border: `4px solid ${B.tinta}`, transform: igual ? `scale(${1 - 0.15 * Math.sin(tecla * Math.PI)})` : 'none' }} />) })}
      </Abs>
    </>
  )
}

const E1 = ({ t, W }) => {
  const tk = [['ENE–MAR', W(1, 4)], ['ABR–JUN', W(1, 6)], ['JUL–SEP', W(1, 7)], ['OCT–DIC', W(1, 8)]]
  const tot = pr(t, W(1, 9) - 0.1, 0.5, outB)
  return (
    <>
      <Abs x={0} y={340} o={pr(t, 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}><Tx size={46} c={B.gris} w={500}>perfume de diseñador</Tx></Abs>
      {tk.map(([mes, t0], i) => {
        const q = pr(t, t0 - 0.12, 0.5, outB)
        return (
          <Abs key={i} x={80 + (i % 2) * 470 + (1 - q) * (i % 2 ? 300 : -300)} y={420 + Math.floor(i / 2) * 210} o={clamp(q * 2)} style={{ width: 450, height: 180, borderRadius: 30, background: B.blanco, border: `5px solid ${B.tinta}`, boxShadow: `0 8px 0 ${B.tinta}` }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 24, borderRadius: '24px 0 0 24px', background: B.ter }} />
            <Abs x={52} y={26}><Tx size={30} c={B.gris}>{mes}</Tx></Abs>
            <Abs x={52} y={76}><Tx size={64} c={B.ter}>$450.000</Tx></Abs>
          </Abs>
        )
      })}
      <Abs x={90} y={900} o={clamp(tot * 2)} s={0.8 + 0.2 * tot} style={{ width: 900, height: 400, borderRadius: 44, background: B.ter, border: `6px solid ${B.tinta}`, boxShadow: `0 12px 0 ${B.tinta}`, textAlign: 'center' }}>
        <Tx size={48} c="#fff" w={500} style={{ marginTop: 50 }}>AL AÑO</Tx>
        <Tx size={150} c="#fff" style={{ marginTop: 14, letterSpacing: -3 }}>${fmt(cuenta(t, W(1, 10) - 0.05, 1.0, 1800000))}</Tx>
      </Abs>
    </>
  )
}

const E2 = ({ t, W }) => {
  const t0 = W(2, 0) - 0.1
  const base = 14 * pr(t, t0, 0.9, outB)
  const adds = [W(2, 1), W(3, 0), W(3, 1), W(3, 2), W(3, 3)]
  const osc = adds.reduce((a, ta) => a + (t > ta ? 2.2 * Math.exp(-(t - ta) * 4) * Math.sin((t - ta) * 14) : 0), 0)
  const cnt = adds.filter((ta) => t >= ta).length
  const th = Math.max(0, base - 0.8 * Math.max(0, cnt - 1) + osc) * Math.PI / 180
  const px = 540, py = 640, Lb = 330
  const L = [px - Lb * Math.cos(th), py + Lb * Math.sin(th)], R = [px + Lb * Math.cos(th), py - Lb * Math.sin(th)]
  const drop = 250
  const pan = (c, color, tit, children) => (
    <>
      <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0 }}><g stroke={B.tinta} strokeWidth="5"><line x1={c[0]} y1={c[1]} x2={c[0] - 150} y2={c[1] + drop} /><line x1={c[0]} y1={c[1]} x2={c[0] + 150} y2={c[1] + drop} /></g></svg>
      <div style={{ position: 'absolute', left: c[0] - 180, top: c[1] + drop - 6, width: 360, height: 76, borderRadius: '0 0 180px 180px', background: color, border: `5px solid ${B.tinta}`, boxSizing: 'border-box' }} />
      <Abs x={c[0] - 200} y={c[1] + drop + 86} style={{ width: 400, textAlign: 'center' }}><Tx size={34} c={B.gris}>{tit}</Tx></Abs>
      {children}
    </>
  )
  const pie = pr(t, t0, 0.5, outB)
  const k = pr(t, t0 + 0.2, 0.6, outB)
  const precio = pr(t, W(2, 8) - 0.1, 0.45, outB)
  const total = pr(t, W(3, 6) - 0.1, 0.5, outB)
  return (
    <>
      <svg width="1080" height="1920" style={{ position: 'absolute', left: 0, top: 0, opacity: pie }}>
        <path d="M470 1190 L540 650 L610 1190 Z" fill={B.arena} stroke={B.tinta} strokeWidth="6" strokeLinejoin="round" />
        <rect x="400" y="1180" width="280" height="40" rx="14" fill={B.tinta} />
        <circle cx={px} cy={py} r="24" fill={B.ter} stroke={B.tinta} strokeWidth="6" />
        <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke={B.tinta} strokeWidth="18" strokeLinecap="round" />
      </svg>
      {pan(L, B.terS, 'DISEÑADOR', (
        <Abs x={L[0] - 160} y={L[1] + drop - 170 + (1 - k) * -300} o={clamp(k * 2)} style={{ width: 320, height: 170, borderRadius: 24, background: B.ter, border: `5px solid ${B.tinta}`, textAlign: 'center' }}>
          <Tx size={28} c="#fff" w={500} style={{ marginTop: 18 }}>4 al año</Tx><Tx size={56} c="#fff" style={{ marginTop: 6 }}>$1.800.000</Tx>
        </Abs>
      ))}
      {pan(R, B.salS, 'TU MARCA', (
        <>
          {[0, 1, 2, 3].map((i) => { const q = pr(t, adds[i] - 0.1, 0.45, outB); return <Frasco key={i} x={R[0] - 156 + i * 84} y={R[1] + drop - 140 - (1 - q) * 300} w={72} liq={B.sal} label="" o={clamp(q * 2)} /> })}
        </>
      ))}
      <Abs x={560} y={380} o={clamp(precio * 2)} s={0.6 + 0.4 * precio}><Chip bg={B.sal} size={44}>desde $49.900</Chip></Abs>
      <Abs x={0} y={1250} o={clamp(total * 2)} s={0.7 + 0.3 * total} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={42} c={B.gris} w={500}>4 fragancias al año</Tx>
        <Tx size={120} c={B.sal} style={{ letterSpacing: -3 }}>${fmt(cuenta(t, W(3, 6) - 0.05, 0.8, 199600))}</Tx>
      </Abs>
    </>
  )
}

const E3 = ({ t, W }) => {
  const orig = pr(t, W(4, 3) - 0.1, 0.55, outB), chk = pr(t, W(4, 5) - 0.05, 0.4, outB)
  const nom = (i) => pr(t, W(4, 6) + i * 0.1, 0.4, outB)
  const pel = (i) => pr(t, W(4, 10) + i * 0.12, 0.5, io3)
  return (
    <>
      <Abs x={0} y={340} o={pr(t, 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}><Tx size={52} c={B.gris} w={500}>no tienes que dejar</Tx></Abs>
      <Frasco x={400} y={420} w={150} liq={B.terS} label="ORIGINAL" o={clamp(orig * 2)} s={0.8 + 0.2 * orig} />
      <Frasco x={540} y={420} w={150} liq={B.terS} label="" o={0} />
      <Abs x={640} y={470} o={chk} s={0.4 + 0.6 * chk}><div style={{ width: 130, height: 130, borderRadius: '50%', background: B.sal, border: `5px solid ${B.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="80" height="80" viewBox="-30 -30 60 60"><polyline points="-18,2 -6,14 18,-12" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Abs>
      <Abs x={0} y={820} o={pr(t, W(4, 6) - 0.1, 0.4)} style={{ width: 1080, textAlign: 'center' }}><Tx size={52} c={B.gris} w={500}>solo no pagar el nombre</Tx></Abs>
      {[0, 1, 2].map((i) => {
        const x = 150 + i * 280, f = nom(i), p = pel(i)
        return (
          <React.Fragment key={i}>
            <Frasco x={x} y={900} w={150} liq={B.salS} label="TU MARCA" o={clamp(f * 2)} s={0.8 + 0.2 * f} />
            <Abs x={x - 22 + p * 160} y={1050 - p * 330} o={clamp(f * 2) * (1 - p)} r={-8 + p * 40}><div style={{ padding: '10px 18px', background: B.ter, border: `4px solid ${B.tinta}`, borderRadius: 12, fontFamily: D, fontWeight: 700, fontSize: 36, color: '#fff', whiteSpace: 'nowrap', boxShadow: `0 6px 0 ${B.tinta}` }}>$ EL NOMBRE</div></Abs>
          </React.Fragment>
        )
      })}
    </>
  )
}

const E4 = ({ t, W }) => {
  const a = pr(t, 0.05, 0.55, outB), btn = pr(t, W(5, 2) - 0.1, 0.5, outB), clic = pr(t, W(5, 5) - 0.05, 0.4)
  const pulso = (t * 1.4) % 1
  return (
    <>
      <Abs x={0} y={360} o={clamp(a * 2)} s={0.7 + 0.3 * a} style={{ width: 1080, textAlign: 'center' }}><Tx size={210} c={B.sal} style={{ letterSpacing: -5 }}>SANTA</Tx><Tx size={210} c={B.ter} style={{ letterSpacing: -5, marginTop: -10 }}>MATI</Tx></Abs>
      {[[160, B.salS, 0.5], [470, B.terS, 0.65], [780, B.salS, 0.8]].map(([x, c, d], i) => (<Frasco key={i} x={x - 20} y={830 - Math.sin(t * 2 + i) * 6} w={120} liq={c} label="" o={pr(t, d, 0.4, outB)} s={0.8 + 0.2 * pr(t, d, 0.5, outB)} />))}
      <Abs x={140} y={1170} o={clamp(btn * 2)} s={(0.7 + 0.3 * btn) * (1 - 0.06 * clic)}>
        <div style={{ position: 'absolute', left: -26 - pulso * 36, top: -26 - pulso * 36, right: -26 - pulso * 36, bottom: -26 - pulso * 36, borderRadius: 120, border: `5px solid ${B.sal}`, opacity: 1 - pulso }} />
        <div style={{ width: 800, height: 170, borderRadius: 90, background: B.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 10px 0 ${B.sal}` }}><Tx size={62} c="#fff" style={{ whiteSpace: 'nowrap' }}>LINK EN LA BIO ↑</Tx></div>
      </Abs>
    </>
  )
}

const ESC = [E0, E1, E2, E3, E4]

/* ───────────── fondo, iris, subtítulos ───────────── */
const Fondo = ({ t }) => (
  <>
    <AbsoluteFill style={{ background: B.crema }} />
    <div style={{ position: 'absolute', left: -200 + Math.sin(t * 0.5) * 40, top: 1100, width: 700, height: 700, borderRadius: '50%', background: B.salS, opacity: 0.8 }} />
    <div style={{ position: 'absolute', left: 650 + Math.cos(t * 0.4) * 40, top: -150, width: 600, height: 600, borderRadius: '50%', background: B.terS, opacity: 0.8 }} />
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${B.arena} 4px, transparent 4.5px)`, backgroundSize: '70px 70px', backgroundPosition: `${(t * 12) % 70}px ${(t * 12) % 70}px`, opacity: 0.8 }} />
  </>
)
const Iris = ({ t, gs }) => {
  const g = gs.find((g, i) => i > 0 && t >= g - 0.4 && t <= g + 0.4)
  if (g === undefined) return null
  const cierra = t < g
  const r = cierra ? out3(clamp((t - (g - 0.4)) / 0.4)) * 1300 : out3(clamp((t - g) / 0.4)) * 1300
  const col = B.sal
  const fondo = cierra ? `radial-gradient(circle at 50% 50%, ${col} ${r}px, transparent ${r + 1}px)` : `radial-gradient(circle at 50% 50%, transparent ${r}px, ${col} ${r + 1}px)`
  return <div style={{ position: 'absolute', inset: 0, background: fondo, zIndex: 25 }} />
}
const Subs = ({ t, fr }) => {
  const trozos = []
  fr.forEach((f, fi) => {
    let cur = []
    f.palabras.forEach((p, j) => {
      cur.push(p)
      const largo = cur.reduce((a, q) => a + q.w.length + 1, 0)
      if (cur.length >= 4 || largo >= 24 || (/[,:.?!]$/.test(p.w) && cur.length >= 3) || j === f.palabras.length - 1) { trozos.push({ p: cur, fi }); cur = [] }
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
    <div style={{ position: 'absolute', left: 40, right: 40, top: 1440, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 16}px)`, zIndex: 30 }}>
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 56, lineHeight: 1.2, whiteSpace: 'nowrap', background: B.tinta, borderRadius: 24, padding: '12px 34px', boxShadow: `0 8px 0 ${B.sal}` }}>
        {z.p.map((p, i) => (<span key={i} style={{ display: 'inline-block', marginRight: 14, color: p.k ? '#FFB394' : '#fff', visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>{p.w}</span>))}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Balanza = ({ frases, grupos }) => {
  useFuentes()
  const f = useCurrentFrame()
  const t = f / FPS
  const W = mkW(frases)
  const all = grupos.map((_, i) => i).filter((i) => i > 0)
  const gs = inicios(frases, grupos, all)
  const total = frases.at(-1).fin + 1.6
  let gi = 0
  gs.forEach((a, i) => { if (t >= a) gi = i })
  const Sc = ESC[Math.min(gi, ESC.length - 1)]
  return (
    <AbsoluteFill style={{ background: B.crema, overflow: 'hidden' }}>
      <Fondo t={t} />
      <Sc t={t} W={W} />
      <Iris t={t} gs={gs} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: B.sal, zIndex: 30 }}>TU MARCA</div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: `${clamp(t / total) * 100}%`, height: 8, background: B.ter, zIndex: 40 }} />
      <Subs t={t} fr={frases} />
    </AbsoluteFill>
  )
}
