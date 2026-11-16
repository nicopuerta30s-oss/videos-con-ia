// Diseño «mano»: interfaz de app simulada (buscador, sliders, tabla comparativa) con una mano cartoon que señala y pulsa, pegatinas
// con borde grueso y trama de puntos tipo halftone. Fondo lila claro, tinta violeta, rosa, amarillo y menta. Transición: banda diagonal.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const H = { bg: '#E9E6FF', bg2: '#DCD6FF', tinta: '#1C1830', vi: '#6D4AFF', viS: '#CFC6FF', rs: '#FF6FA8', rsS: '#FFD3E4', am: '#FFD84D', mt: '#5EE6B0', mtS: '#CFF7E6', blanco: '#FFFFFF', piel: '#F0B98F', pielO: '#D99A6C', gr: '#6E6A88' }
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
const Tx = ({ c = H.tinta, size = 40, w = 700, children, style }) => (
  <div style={{ fontFamily: D, fontWeight: w, fontSize: size, color: c, lineHeight: 1.1, ...style }}>{children}</div>
)
const Tarj = ({ x, y, w, h, o = 1, s = 1, bg = H.blanco, r = 0, children, style }) => (
  <Abs x={x} y={y} o={o} s={s} r={r} style={{ width: w, height: h, borderRadius: 36, background: bg, border: `6px solid ${H.tinta}`, boxShadow: `0 10px 0 ${H.tinta}`, ...style }}>{children}</Abs>
)
const Pega = ({ children, bg = H.am, fg = H.tinta, size = 40, style }) => (
  <div style={{ display: 'inline-block', padding: `${size * 0.25}px ${size * 0.6}px`, borderRadius: size, background: bg, color: fg, fontFamily: D, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', border: `5px solid ${H.tinta}`, boxShadow: `0 7px 0 ${H.tinta}`, ...style }}>{children}</div>
)
const tipea = (txt, t, t0, cps = 26) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((t - t0) * cps))))

// mano cartoon que señala; (px, py) = punta del dedo; pulsa 0..1 la hunde un poco
const Mano = ({ px, py, sc = 1.5, pulsa = 0, o = 1 }) => (
  <div style={{ position: 'absolute', left: px - 95 * sc, top: py - 14 * sc + pulsa * 14, width: 200 * sc, height: 330 * sc, opacity: o, zIndex: 20, filter: 'drop-shadow(0 12px 0 rgba(28,24,48,.25))', transform: `rotate(${-8}deg)`, transformOrigin: `${95 * sc}px ${14 * sc}px` }}>
    <svg width={200 * sc} height={330 * sc} viewBox="0 0 200 330" style={{ display: 'block', overflow: 'visible' }}>
      <g stroke={H.tinta} strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        <rect x="52" y="190" width="104" height="150" rx="14" fill={H.vi} />
        <path d="M50 150 C50 128 62 120 74 124 L74 38 a19 19 0 0 1 38 0 L112 112 C120 104 144 104 148 120 C156 112 176 116 176 134 L176 196 C176 236 150 262 108 262 C70 262 50 236 50 200 Z" fill={H.piel} />
        <path d="M112 118 L112 150 M148 124 L148 150" fill="none" stroke={H.pielO} strokeWidth="5" />
        <path d="M52 150 C34 144 22 160 32 176 C40 190 52 196 60 196" fill={H.piel} />
      </g>
    </svg>
  </div>
)

/* ───────────── escenas ───────────── */
const frase0 = '¿Los perfumes inspirados huelen a barato?'
const E0 = ({ t, W }) => {
  const bus = pr(t, 0.05, 0.5, outB)
  const ini = 0.2, fin = W(0, 5) + 0.15
  const txt = tipea(frase0, t, ini, frase0.length / (fin - ini))
  const bar = pr(t, W(0, 4) - 0.1, 0.45, outB)
  const btn = pr(t, W(0, 6) - 0.1, 0.5, outB)
  const press = pr(t, W(0, 7) - 0.05, 0.25)
  const done = pr(t, W(0, 7) + 0.05, 0.35, outB)
  const tacha = pr(t, W(0, 7) + 0.25, 0.4, io3)
  const hx = 540 + (1 - pr(t, W(0, 6) - 0.2, 0.7, out3)) * 260, hy = 1010 + (1 - pr(t, W(0, 6) - 0.2, 0.7, out3)) * 620
  return (
    <>
      <Tarj x={80} y={400} w={920} h={230} o={clamp(bus * 2)} s={0.9 + 0.1 * bus} r={(1 - bus) * -4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: '100%', padding: '0 34px' }}>
          <svg width="70" height="70" viewBox="-30 -30 60 60" style={{ flexShrink: 0 }}><circle cx="-6" cy="-6" r="18" fill="none" stroke={H.vi} strokeWidth="8" /><path d="M8 8 L24 24" stroke={H.vi} strokeWidth="8" strokeLinecap="round" /></svg>
          <Tx size={46} style={{ flex: 1 }}>{txt}<span style={{ opacity: Math.floor(t * 3) % 2, color: H.vi }}>|</span></Tx>
        </div>
      </Tarj>
      <Abs x={120} y={700} o={clamp(bar * 2)} s={0.5 + 0.5 * bar} r={-7}><Pega bg={H.am} size={90}>¿BARATO?</Pega></Abs>
      <div style={{ position: 'absolute', left: 90, top: 770, width: `${tacha * 600}px`, height: 14, background: H.rs, borderRadius: 7, transform: 'rotate(-7deg)', transformOrigin: 'left center', opacity: tacha > 0 ? 1 : 0, zIndex: 6 }} />
      <Abs x={240} y={920} o={clamp(btn * 2)} s={(0.7 + 0.3 * btn) * (1 - 0.06 * press)}>
        <div style={{ width: 600, height: 150, borderRadius: 75, background: done > 0.5 ? H.mt : H.vi, border: `6px solid ${H.tinta}`, boxShadow: `0 ${10 - 6 * press}px 0 ${H.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Tx size={58} c={done > 0.5 ? H.tinta : '#fff'}>{done > 0.5 ? '✓ RESPONDIDO' : 'RESPONDER'}</Tx>
        </div>
      </Abs>
      <Mano px={hx} py={hy} pulsa={press} o={clamp(btn * 3)} />
    </>
  )
}

const Slider = ({ x, y, titulo, v, col, valor, o = 1 }) => (
  <Tarj x={x} y={y} w={900} h={230} o={o}>
    <Abs x={40} y={30}><Tx size={36} c={H.gr}>{titulo}</Tx></Abs>
    <div style={{ position: 'absolute', left: 40, top: 120, width: 820, height: 30, borderRadius: 15, background: H.bg2, border: `4px solid ${H.tinta}`, overflow: 'hidden' }}><div style={{ width: `${v * 100}%`, height: '100%', background: col }} /></div>
    <div style={{ position: 'absolute', left: 40 + 820 * v - 34, top: 100, width: 68, height: 68, borderRadius: 34, background: '#fff', border: `6px solid ${H.tinta}`, boxShadow: `0 5px 0 ${H.tinta}` }} />
    <Abs x={640} y={26} o={pr(valor, 0.001, 0.2)}><Pega bg={H.mt} size={30}>ALTA ✓</Pega></Abs>
  </Tarj>
)
const E1 = ({ t, W }) => {
  const a = pr(t, W(1, 3) - 0.1, W(1, 6) - W(1, 3) + 0.5, io3)
  const b = pr(t, W(1, 8) - 0.1, W(1, 10) - W(1, 8) + 0.5, io3)
  const c1 = pr(t, 0.05, 0.5, outB), c2 = pr(t, W(1, 7) - 0.15, 0.5, outB)
  const nivel = 0.18 + 0.72 * (0.5 * a + 0.5 * b)
  const gotas = [W(1, 4), W(1, 6), W(1, 9), W(1, 10)]
  return (
    <>
      <Slider x={90} y={400 + (1 - c1) * 60} o={clamp(c1 * 2)} titulo="CALIDAD DE LA ESENCIA" v={0.15 + 0.78 * a} col={H.rs} valor={a > 0.95 ? 1 : 0} />
      <Slider x={90} y={670 + (1 - c2) * 60} o={clamp(c2 * 2)} titulo="CONCENTRACIÓN" v={0.2 + 0.7 * b} col={H.vi} valor={b > 0.95 ? 1 : 0} />
      <Abs x={340} y={950} o={clamp(c2 * 2)} style={{ width: 400, height: 460 }}>
        <svg width="400" height="460" viewBox="0 0 400 460" style={{ display: 'block', overflow: 'visible' }}>
          <defs><clipPath id="mf"><path d="M150 30 H250 V150 L360 380 C372 410 352 440 322 440 H78 C48 440 28 410 40 380 L150 150 Z" /></clipPath></defs>
          <g clipPath="url(#mf)"><rect x="0" y={440 - 330 * nivel} width="400" height="460" fill={H.rs} /><rect x="0" y={440 - 330 * nivel} width="400" height="12" fill="#fff" opacity="0.5" /></g>
          <path d="M150 30 H250 V150 L360 380 C372 410 352 440 322 440 H78 C48 440 28 410 40 380 L150 150 Z" fill="none" stroke={H.tinta} strokeWidth="10" strokeLinejoin="round" />
          <rect x="136" y="14" width="128" height="26" rx="8" fill={H.am} stroke={H.tinta} strokeWidth="8" />
          <circle cx="110" cy="360" r="12" fill="#fff" opacity="0.7" /><circle cx="150" cy="330" r="7" fill="#fff" opacity="0.7" />
        </svg>
        {gotas.map((g, i) => { const q = clamp((t - g) / 0.5); return q > 0 && q < 1 ? <div key={i} style={{ position: 'absolute', left: 190, top: -150 + q * 330, width: 22, height: 30, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: H.vi, border: `4px solid ${H.tinta}` }} /> : null })}
      </Abs>
    </>
  )
}

const FILAS = ['SALIDA', 'CORAZÓN', 'FONDO']
const E2 = ({ t, W }) => {
  const tab = pr(t, 0.05, 0.5, outB)
  const ok = FILAS.map((_, i) => pr(t, W(2, 4 + i) - 0.05, 0.35, outB))
  const q = pr(t, W(3, 1) - 0.1, 0.5, outB)
  const dif = pr(t, W(3, 9) - 0.05, 0.4, outB), ch = pr(t, W(3, 11) - 0.1, 0.5, outB)
  const lupa = pr(t, W(3, 8), 0.6, io3)
  return (
    <>
      <Tarj x={90} y={390} w={900} h={620} o={clamp(tab * 2)} s={0.92 + 0.08 * tab}>
        <div style={{ position: 'absolute', left: 300, top: 0, width: 280, height: 110, borderRadius: '0 0 0 0', background: H.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tx size={38} c="#fff">ORIGINAL</Tx></div>
        <div style={{ position: 'absolute', left: 580, top: 0, width: 314, height: 110, background: H.vi, borderRadius: '0 30px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tx size={38} c="#fff">INSPIRADO</Tx></div>
        {FILAS.map((f, i) => {
          const mal = i === 2 && dif > 0.5
          return (
            <div key={f} style={{ position: 'absolute', left: 0, top: 110 + i * 168, width: 894, height: 168, borderTop: `4px solid ${H.tinta}` }}>
              <Abs x={34} y={58}><Tx size={36}>{f}</Tx></Abs>
              <Abs x={400} y={34} o={clamp(ok[i] * 2)} s={0.4 + 0.6 * ok[i]}><div style={{ width: 100, height: 100, borderRadius: 50, background: H.mt, border: `6px solid ${H.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tx size={60}>✓</Tx></div></Abs>
              <Abs x={680} y={34} o={clamp(ok[i] * 2)} s={0.4 + 0.6 * ok[i]}><div style={{ width: 100, height: 100, borderRadius: 50, background: mal ? H.am : H.mt, border: `6px solid ${H.tinta}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Tx size={60}>{mal ? '≈' : '✓'}</Tx></div></Abs>
            </div>
          )
        })}
        <Abs x={640 - 150 * (1 - lupa) + 30} y={400 + 40 * (1 - lupa)} o={lupa} s={1}><svg width="150" height="150" viewBox="-30 -30 60 60"><circle cx="-6" cy="-6" r="18" fill="#fff" fillOpacity="0.35" stroke={H.tinta} strokeWidth="6" /><path d="M8 8 L26 26" stroke={H.tinta} strokeWidth="8" strokeLinecap="round" /></svg></Abs>
      </Tarj>
      <Abs x={0} y={1060} o={clamp(q * 2)} s={0.4 + 0.6 * q} r={(1 - q) * 30 - 3} style={{ width: 1080, textAlign: 'center' }}><Pega bg={H.am} size={74}>¿IDÉNTICO?</Pega></Abs>
      <Abs x={0} y={1260} o={clamp(ch * 2)} s={0.8 + 0.2 * ch} style={{ width: 1080, textAlign: 'center' }}><Pega bg={H.rsS} size={44}>pequeñas diferencias</Pega></Abs>
    </>
  )
}

const E3 = ({ t, W }) => {
  const brazo = pr(t, 0.05, 0.6, outB)
  const spray = W(3, 3)
  const tope = Math.sin(clamp((t - spray) / 0.3) * Math.PI)
  const etapas = ['SALIDA', 'CORAZÓN', 'FONDO']
  const prog = pr(t, W(3, 6), W(3, 11) - W(3, 6), io3)
  const sello = pr(t, W(3, 13) - 0.1, 0.5, outB)
  const piel = pr(t, W(3, 10) - 0.1, 0.4, outB)
  return (
    <>
      <Abs x={90 - (1 - brazo) * 600} y={660} style={{ width: 900, height: 180, borderRadius: 90, background: H.piel, border: `6px solid ${H.tinta}`, boxShadow: `0 10px 0 ${H.tinta}` }}>
        <div style={{ position: 'absolute', right: -6, top: -6, width: 180, height: 180, borderRadius: '0 90px 90px 0', background: H.pielO, opacity: 0.35 }} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (<div key={i} style={{ position: 'absolute', left: 120 + i * 100, top: 50 + (i % 2) * 50, width: 10, height: 10, borderRadius: 5, background: H.pielO }} />))}
      </Abs>
      <Abs x={440} y={430} o={clamp(brazo * 2)} r={-18} origen="center bottom">
        <svg width="200" height="250" viewBox="0 0 200 250" style={{ display: 'block', overflow: 'visible' }}>
          <g stroke={H.tinta} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round">
            <rect x="52" y="104" width="100" height="130" rx="22" fill={H.rs} />
            <rect x="86" y="76" width="32" height="30" fill={H.am} />
            <rect x="74" y={44 + tope * 22} width="56" height="34" rx="10" fill={H.vi} />
            <path d="M74 56 H44" fill="none" />
          </g>
          <rect x="70" y="150" width="64" height="46" rx="6" fill="#fff" stroke={H.tinta} strokeWidth="4" />
        </svg>
      </Abs>
      {Array.from({ length: 16 }, (_, i) => { const q = clamp((t - spray - 0.05 - i * 0.012) / 0.6); return q > 0 && q < 1 ? (<div key={i} style={{ position: 'absolute', left: 430 - q * (60 + (i % 5) * 50) + (i % 3) * 18, top: 520 + q * (170 + (i % 4) * 20), width: 18 - q * 8, height: 18 - q * 8, borderRadius: '50%', background: i % 2 ? H.rs : H.vi, opacity: 1 - q * 0.7 }} />) : null })}
      <Abs x={90} y={590} o={piel} s={0.7 + 0.3 * piel}><Pega bg={H.am} size={34}>TU PIEL</Pega></Abs>
      <Tarj x={90} y={930} w={900} h={230} o={clamp(brazo * 2)}>
        <div style={{ position: 'absolute', left: 80, top: 104, width: 720, height: 22, borderRadius: 11, background: H.bg2, border: `4px solid ${H.tinta}`, overflow: 'hidden' }}><div style={{ width: `${prog * 100}%`, height: '100%', background: `linear-gradient(90deg, ${H.rs}, ${H.vi})` }} /></div>
        {etapas.map((e, i) => { const on = prog >= i / 2 - 0.001 && prog > 0; return (<React.Fragment key={e}><div style={{ position: 'absolute', left: 80 + i * 360 - 28, top: 87, width: 56, height: 56, borderRadius: 28, background: on ? H.mt : '#fff', border: `6px solid ${H.tinta}` }} /><Abs x={80 + i * 360 - 90} y={34} style={{ width: 180, textAlign: 'center' }}><Tx size={30} c={on ? H.tinta : H.gr}>{e}</Tx></Abs></React.Fragment>) })}
        <Abs x={60} y={160}><Tx size={32} c={H.gr} w={500}>cómo se asienta</Tx></Abs>
      </Tarj>
      <Abs x={0} y={1230} o={clamp(sello * 2)} s={1.6 - 0.6 * sello} r={-4} style={{ width: 1080, textAlign: 'center' }}><Pega bg={H.mt} size={62}>✓ AHÍ SE DECIDE</Pega></Abs>
    </>
  )
}

const E4 = ({ t, W }) => {
  const a = pr(t, 0.05, 0.55, outB), btn = pr(t, W(5, 2) - 0.1, 0.5, outB), tap = pr(t, W(5, 5) - 0.1, 0.25)
  const mano = pr(t, W(5, 2), 0.7, out3)
  return (
    <>
      <Abs x={0} y={360} o={clamp(a * 2)} s={0.7 + 0.3 * a} r={(1 - a) * -6} style={{ width: 1080, textAlign: 'center' }}><Tx size={200} c={H.vi} style={{ letterSpacing: -5 }}>SANTA</Tx><Tx size={200} c={H.rs} style={{ letterSpacing: -5, marginTop: -10 }}>MATI</Tx></Abs>
      {[[100, 810, H.am], [900, 760, H.mt], [840, 520, H.rsS]].map(([x, y, c], i) => (<Abs key={i} x={x} y={y + Math.sin(t * 2 + i) * 8} o={pr(t, 0.4 + i * 0.15, 0.4)}><div style={{ width: 70, height: 70, borderRadius: '50%', background: c, border: `6px solid ${H.tinta}` }} /></Abs>))}
      <Abs x={140} y={940} o={clamp(btn * 2)} s={(0.7 + 0.3 * btn) * (1 - 0.06 * tap)}>
        <div style={{ width: 800, height: 170, borderRadius: 90, background: H.tinta, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 ${12 - 8 * tap}px 0 ${H.vi}` }}><Tx size={62} c="#fff" style={{ whiteSpace: 'nowrap' }}>LINK EN LA BIO ↑</Tx></div>
      </Abs>
      <Mano px={540 + (1 - mano) * 300} py={1030 + (1 - mano) * 560} pulsa={tap} o={clamp(mano * 3)} />
    </>
  )
}

const ESC = [E0, E1, E2, E3, E4]

/* ───────────── fondo, banda, subtítulos ───────────── */
const Fondo = ({ t }) => (
  <>
    <AbsoluteFill style={{ background: H.bg }} />
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${H.viS} 5px, transparent 5.5px)`, backgroundSize: '56px 56px', backgroundPosition: `${(t * 14) % 56}px ${(t * 14) % 56}px` }} />
    <div style={{ position: 'absolute', left: -150, top: 1250, width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(${H.rs} 6px, transparent 6.5px)`, backgroundSize: '26px 26px', opacity: 0.35, transform: `rotate(${t * 6}deg)` }} />
    <div style={{ position: 'absolute', left: 700, top: -120, width: 560, height: 560, borderRadius: '50%', background: `radial-gradient(${H.vi} 6px, transparent 6.5px)`, backgroundSize: '26px 26px', opacity: 0.3, transform: `rotate(${-t * 6}deg)` }} />
  </>
)
const Banda = ({ t, gs }) => {
  const g = gs.find((g, i) => i > 0 && t >= g - 0.38 && t <= g + 0.38)
  if (g === undefined) return null
  const u = (t - (g - 0.38)) / 0.76
  const left = -2400 + u * 3480
  return (
    <>
      <div style={{ position: 'absolute', left: left - 150, top: -300, width: 2400, height: 2520, background: H.am, transform: 'skewX(-20deg)', zIndex: 24 }} />
      <div style={{ position: 'absolute', left, top: -300, width: 2400, height: 2520, background: H.vi, transform: 'skewX(-20deg)', zIndex: 25 }} />
    </>
  )
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
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 56, lineHeight: 1.2, whiteSpace: 'nowrap', background: '#fff', border: `6px solid ${H.tinta}`, borderRadius: 28, padding: '8px 32px', boxShadow: `0 8px 0 ${H.tinta}` }}>
        {z.p.map((p, i) => (<span key={i} style={{ display: 'inline-block', marginRight: 14, color: p.k ? H.vi : H.tinta, visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>{p.w}</span>))}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Mano_ = ({ frases, grupos }) => {
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
    <AbsoluteFill style={{ background: H.bg, overflow: 'hidden' }}>
      <Fondo t={t} />
      <Sc t={t} W={W} />
      <Banda t={t} gs={gs} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: H.vi, zIndex: 30 }}>TU MARCA</div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: `${clamp(t / total) * 100}%`, height: 10, background: H.rs, zIndex: 40 }} />
      <Subs t={t} fr={frases} />
    </AbsoluteFill>
  )
}
