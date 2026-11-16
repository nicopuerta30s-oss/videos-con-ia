// Diseño «perfume»: vitrina de lujo. Fondo negro con foco dorado y polvo de oro, frascos dibujados, caja de regalo, sello de original;
// entre escenas pasa una cortina de luz dorada. Serif elegante (Bodoni/Didot) + Poppins.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const P = { negro: '#0B0A0D', carbon: '#17141B', oro: '#D9B25F', oroC: '#F4DC98', oroO: '#8F6E26', crema: '#F6EEDD', vino: '#7A1F3D', rosa: '#E0719A', azul: '#7FD0F0', amb: '#E58B2A', vd: '#3DDC97' }
const S = "'Bodoni 72', 'Didot', 'Playfair Display', Georgia, serif"
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
const Tx = ({ c = P.crema, size = 40, w = 700, f = S, children, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.05, ...style }}>{children}</div>
)
const oroTxt = { background: `linear-gradient(180deg, ${P.oroC}, ${P.oro} 55%, ${P.oroO})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }

const Chispa = ({ size = 60, c = P.oroC }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ display: 'block', overflow: 'visible' }}><path d="M0 -48 C4 -12 12 -4 48 0 C12 4 4 12 0 48 C-4 12 -12 4 -48 0 C-12 -4 -4 -12 0 -48 Z" fill={c} /></svg>
)

// frasco: tipo rect | round | slim; liq = color del líquido
const Frasco = ({ id, tipo = 'rect', liq = P.rosa, w = 220, o = 1, s = 1, r = 0, x = 0, y = 0, nivel = 1 }) => {
  const h = w * 1.8
  const cuerpo = {
    rect: <rect x="30" y="120" width="140" height="220" rx="18" />,
    round: <circle cx="100" cy="245" r="98" />,
    slim: <rect x="52" y="112" width="96" height="232" rx="44" />,
  }[tipo]
  const clip = { rect: [30, 120, 140, 220], round: [2, 147, 196, 196], slim: [52, 112, 96, 232] }[tipo]
  const ly = clip[1] + clip[3] * (1 - 0.72 * nivel)
  const cuello = tipo === 'round' ? { x: 82, w: 36, y: 100, h: 56 } : { x: 80, w: 40, y: 92, h: 36 }
  const tapa = tipo === 'round' ? { x: 68, w: 64, y: 38, h: 70 } : tipo === 'slim' ? { x: 76, w: 48, y: 30, h: 70 } : { x: 62, w: 76, y: 28, h: 68 }
  return (
    <Abs x={x} y={y} o={o} s={s} r={r} style={{ width: w, height: h }}>
      <svg width={w} height={h} viewBox="0 0 200 360" style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={liq} stopOpacity="0.95" /><stop offset="1" stopColor={liq} stopOpacity="0.55" /></linearGradient>
          <linearGradient id={`t${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={P.oroO} /><stop offset="0.35" stopColor={P.oroC} /><stop offset="0.7" stopColor={P.oro} /><stop offset="1" stopColor={P.oroO} /></linearGradient>
          <clipPath id={`c${id}`}>{cuerpo}</clipPath>
        </defs>
        <ellipse cx="100" cy="348" rx="84" ry="10" fill="#000" opacity="0.45" />
        <rect x={cuello.x} y={cuello.y} width={cuello.w} height={cuello.h} fill="#E9E2D2" opacity="0.5" />
        <g fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.55)" strokeWidth="3">{cuerpo}</g>
        <g clipPath={`url(#c${id})`}>
          <rect x="0" y={ly} width="200" height="360" fill={`url(#l${id})`} />
          <rect x="0" y={ly - 3} width="200" height="5" fill="#fff" opacity="0.5" />
          <rect x={clip[0] + 14} y={clip[1] + 14} width="12" height={clip[3] - 30} rx="6" fill="#fff" opacity="0.28" />
        </g>
        <rect x={tipo === 'round' ? 66 : tipo === 'slim' ? 70 : 62} y={tipo === 'round' ? 235 : 215} width={tipo === 'round' ? 68 : tipo === 'slim' ? 60 : 76} height="62" rx="4" fill={P.crema} opacity="0.92" />
        <rect x={tipo === 'round' ? 76 : tipo === 'slim' ? 80 : 72} y={tipo === 'round' ? 252 : 232} width={tipo === 'round' ? 48 : tipo === 'slim' ? 40 : 56} height="4" fill={P.oroO} />
        <rect x={tipo === 'round' ? 82 : tipo === 'slim' ? 86 : 78} y={tipo === 'round' ? 264 : 244} width={tipo === 'round' ? 36 : tipo === 'slim' ? 28 : 44} height="3" fill={P.oroO} opacity="0.6" />
        <rect x={tapa.x} y={tapa.y} width={tapa.w} height={tapa.h} rx="8" fill={`url(#t${id})`} />
        <rect x={tapa.x + 8} y={tapa.y + 8} width="7" height={tapa.h - 16} rx="3" fill="#fff" opacity="0.4" />
      </svg>
    </Abs>
  )
}

// caja de regalo con moño; tapa se abre con `ab` (0..1)
const Caja = ({ x, y, w = 380, ab = 0, o = 1, s = 1 }) => {
  const h = w * 0.7
  return (
    <>
      <Abs x={x} y={y} o={o} s={s} style={{ width: w, height: h, zIndex: 5 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: `linear-gradient(135deg, ${P.vino}, #4A1226)`, boxShadow: '0 30px 60px rgba(0,0,0,.6)' }} />
        <div style={{ position: 'absolute', left: w / 2 - 30, top: 0, width: 60, height: h, background: `linear-gradient(90deg, ${P.oroO}, ${P.oroC}, ${P.oro})` }} />
      </Abs>
      <Abs x={x - 22 + ab * 190} y={y - 72 - ab * 90} o={o} s={s} r={ab * 24} origen="left bottom" style={{ width: w + 44, height: 72, zIndex: 6 }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 12, background: `linear-gradient(135deg, #8C2748, ${P.vino})`, boxShadow: '0 12px 26px rgba(0,0,0,.5)' }} />
        <div style={{ position: 'absolute', left: (w + 44) / 2 - 30, top: 0, width: 60, height: 72, background: `linear-gradient(90deg, ${P.oroO}, ${P.oroC}, ${P.oro})` }} />
        <div style={{ position: 'absolute', left: (w + 44) / 2 - 92, top: -52, width: 84, height: 64, borderRadius: '50% 50% 50% 8%', border: `18px solid ${P.oro}`, transform: 'rotate(-12deg)', boxSizing: 'border-box' }} />
        <div style={{ position: 'absolute', left: (w + 44) / 2 + 8, top: -52, width: 84, height: 64, borderRadius: '50% 50% 8% 50%', border: `18px solid ${P.oro}`, transform: 'rotate(12deg)', boxSizing: 'border-box' }} />
      </Abs>
    </>
  )
}

const Icono = ({ tipo, size = 90, c = P.oro }) => {
  const p = { stroke: c, strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  const g = {
    corazon: <path {...p} d="M0 36 C-60 -4 -38 -48 -8 -34 C-2 -30 0 -24 0 -20 C0 -24 2 -30 8 -34 C38 -48 60 -4 0 36 z" />,
    diamante: <g {...p}><path d="M-34 -14 L-18 -38 H18 L34 -14 L0 40 Z" /><path d="M-34 -14 H34 M-8 -14 L0 40 M8 -14 L0 40 M-18 -38 L-8 -14 M18 -38 L8 -14" /></g>,
    sol: <g {...p}><circle r="18" /><path d="M0 -44 v14 M0 30 v14 M-44 0 h14 M30 0 h14 M-31 -31 l10 10 M21 21 l10 10 M31 -31 l-10 10 M-21 21 l-10 10" /></g>,
    luna: <path {...p} d="M22 -40 A44 44 0 1 0 40 22 A34 34 0 0 1 22 -40 z" />,
    check: <polyline {...p} points="-30,2 -10,24 32,-24" />,
    flecha: <g {...p}><path d="M0 40 V-36 M-26 -10 L0 -38 L26 -10" /></g>,
    link: <g {...p}><path d="M-8 12 L8 -12" /><path d="M-6 -22 l12 -12 a16 16 0 0 1 23 23 l-12 12" /><path d="M6 22 l-12 12 a16 16 0 0 1 -23 -23 l12 -12" /></g>,
  }[tipo]
  return <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: 'block', overflow: 'visible' }}>{g}</svg>
}

const Tarj = ({ x, y, w, h, o = 1, s = 1, children, style }) => (
  <Abs x={x} y={y} o={o} s={s} style={{ width: w, height: h, borderRadius: 30, background: 'rgba(30,25,38,.88)', border: `2px solid ${P.oro}`, boxShadow: '0 20px 50px rgba(0,0,0,.5)', ...style }}>{children}</Abs>
)

/* ───────────── escenas ───────────── */
const E0 = ({ t, W }) => {
  const a = pr(t, 0.05, 0.5, outB), b = pr(t, W(0, 3) - 0.1, 0.5, outB), c = pr(t, W(0, 4) - 0.1, 0.5, outB)
  const sale = pr(t, W(0, 6) - 0.05, 0.9, out3)
  const ab = pr(t, W(0, 6) - 0.1, 0.5, outB)
  const tiembla = t < W(0, 6) - 0.1 ? Math.sin(t * 22) * 3 * pr(t, 0.4, 0.2) : 0
  const check = pr(t, W(0, 9) - 0.05, 0.4, outB)
  return (
    <>
      <Abs x={0} y={340} o={a} s={0.8 + 0.2 * a} style={{ width: 1080, textAlign: 'center' }}><Tx size={46} w={500} c={P.oroC} style={{ letterSpacing: 10 }}>SI NO SABES</Tx></Abs>
      <Abs x={0} y={400} o={clamp(b * 2)} s={0.6 + 0.4 * b} style={{ width: 1080, textAlign: 'center' }}><Tx size={170} style={{ ...oroTxt, letterSpacing: -2 }}>¿QUÉ</Tx></Abs>
      <Abs x={0} y={565} o={clamp(c * 2)} s={0.6 + 0.4 * c} style={{ width: 1080, textAlign: 'center' }}><Tx size={170} style={{ ...oroTxt, letterSpacing: -2 }}>REGALAR?</Tx></Abs>
      {sale > 0 && <Abs x={140} y={560} o={sale * 0.8} s={1 + sale * 0.5}><div style={{ width: 800, height: 800, borderRadius: '50%', background: `radial-gradient(circle, ${P.oroC}55, transparent 62%)` }} /></Abs>}
      <Frasco id="e0" tipo="rect" liq={P.rosa} w={250} x={415} y={1190 - sale * 390} o={sale > 0 ? 1 : 0} s={0.85 + 0.15 * sale} />
      <Caja x={350 + tiembla} y={1130} ab={ab} />
      {[0, 1, 2, 3, 4].map((i) => { const q = pr(t, W(0, 6) + i * 0.07, 0.7, out3); return q > 0 ? (<Abs key={i} x={540 + (i - 2) * 150 - 30} y={1000 - q * (160 + i * 22)} o={1 - q * 0.7} s={0.6 + (i % 2) * 0.4}><Chispa size={60} /></Abs>) : null })}
      <Abs x={745} y={760} o={check} s={0.4 + 0.6 * check}><div style={{ width: 120, height: 120, borderRadius: '50%', background: P.vd, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(61,220,151,.6)' }}><Icono tipo="check" size={76} c="#06210F" /></div></Abs>
    </>
  )
}

const E1 = ({ t, W }) => {
  const filas = [['corazon', 'PERSONAL', W(1, 1)], ['diamante', 'ELEGANTE', W(1, 2)], ['sol', 'TODOS LOS DÍAS', W(1, 5)]]
  const f = pr(t, W(1, 13) - 0.1, 0.5, outB)
  const tacha = pr(t, W(1, 15) - 0.05, 0.4, io3)
  return (
    <>
      {filas.map(([ic, tx, t0], i) => {
        const q = pr(t, t0 - 0.1, 0.5, outB)
        return (
          <Tarj key={i} x={110 + (1 - q) * -500} y={340 + i * 230} w={860} h={190} o={clamp(q * 2)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 34, height: '100%', padding: '0 46px' }}>
              <Icono tipo={ic} size={100} />
              <Tx size={tx.length > 9 ? 56 : 70} style={{ ...oroTxt, whiteSpace: 'nowrap', letterSpacing: 2 }}>{tx}</Tx>
            </div>
          </Tarj>
        )
      })}
      <Abs x={0} y={1060} o={clamp(f * 2)} s={0.8 + 0.2 * f} style={{ width: 1080, textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Tx size={120} c={P.crema} style={{ letterSpacing: 2 }}>UNA FORTUNA</Tx>
          <div style={{ position: 'absolute', left: -20, top: 54, height: 12, width: `${tacha * 106}%`, background: '#E8475F', borderRadius: 6, transform: 'rotate(-3deg)', boxShadow: '0 0 20px #E8475F88' }} />
        </div>
      </Abs>
      {[0, 1, 2, 3, 4, 5].map((i) => { const q = clamp((t - W(1, 15) - i * 0.06) / 1.0); return q > 0 && q < 1 ? (<Abs key={i} x={240 + i * 120} y={1220 + q * 200} o={1 - q} r={q * 200}><div style={{ width: 54, height: 54, borderRadius: '50%', background: P.oro, border: `5px solid ${P.oroC}` }} /></Abs>) : null })}
    </>
  )
}

const E2 = ({ t, W }) => {
  const h = pr(t, W(2, 3) - 0.1, 0.4, outB)
  const d = pr(t, W(2, 6) - 0.1, 0.6, outB), n = pr(t, W(2, 10) - 0.1, 0.6, outB)
  return (
    <>
      <Abs x={0} y={330} o={h} s={0.85 + 0.15 * h} style={{ width: 1080, textAlign: 'center' }}><Tx size={50} w={500} c={P.oroC} style={{ letterSpacing: 8 }}>SEGÚN LA PERSONA</Tx></Abs>
      <Abs x={80 - (1 - d) * 1100} y={420} style={{ width: 920, height: 430, borderRadius: 36, overflow: 'hidden', background: 'linear-gradient(135deg, #CDEFFF, #FFF6DC)', border: `2px solid ${P.oroC}` }}>
        <Frasco id="e2a" tipo="rect" liq={P.azul} w={200} x={60} y={30} />
        <Abs x={560} y={50} r={t * 30}><Icono tipo="sol" size={120} c="#E39A1C" /></Abs>
        <Abs x={300} y={180}><Tx size={92} c="#0F3A5A">FRESCA</Tx><Tx size={42} f={D} w={500} c="#2E5C7A" style={{ marginTop: 10 }}>para el día</Tx></Abs>
      </Abs>
      <Abs x={80 + (1 - n) * 1100} y={890} style={{ width: 920, height: 430, borderRadius: 36, overflow: 'hidden', background: 'linear-gradient(135deg, #1B1233, #3B1230)', border: `2px solid ${P.oro}` }}>
        {[[620, 40], [820, 130], [700, 300], [380, 30], [250, 340]].map(([sx, sy], i) => (<Abs key={i} x={sx} y={sy} o={0.5 + 0.5 * Math.sin(t * 4 + i * 2)}><Chispa size={28} /></Abs>))}
        <Frasco id="e2b" tipo="round" liq={P.vino} w={210} x={650} y={30} />
        <Abs x={60} y={60}><Icono tipo="luna" size={110} c={P.oroC} /></Abs>
        <Abs x={60} y={190}><Tx size={66} style={{ ...oroTxt, whiteSpace: 'nowrap' }}>DULCE · INTENSA</Tx><Tx size={42} f={D} w={500} c={P.crema} style={{ marginTop: 10 }}>para la noche</Tx></Abs>
      </Abs>
    </>
  )
}

const E3 = ({ t, W }) => {
  const sello = pr(t, W(3, 3) - 0.1, 0.45, outB)
  const fac = pr(t, W(3, 5) - 0.1, 0.6, out3)
  const calma = pr(t, W(3, 10) - 0.05, 0.5, outB)
  return (
    <>
      <Abs x={290} y={330} o={clamp(sello * 3)} s={2.2 - 1.2 * sello} r={-14 + 14 * sello}>
        <div style={{ width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${P.oroC}, ${P.oro} 55%, ${P.oroO})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 60px rgba(0,0,0,.6), inset 0 0 0 14px rgba(0,0,0,.12)' }}>
          <div style={{ width: 410, height: 410, borderRadius: '50%', border: '6px dashed #5A4310', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Chispa size={70} c="#5A4310" />
            <Tx size={110} c="#3A2B08" style={{ marginTop: 6 }}>100%</Tx>
            <Tx size={62} c="#3A2B08" style={{ letterSpacing: 6 }}>ORIGINAL</Tx>
          </div>
        </div>
      </Abs>
      <Abs x={290 + (1 - fac) * 800} y={880} o={clamp(fac * 2)} r={-3 + (1 - fac) * 10} style={{ width: 500, height: 440, borderRadius: 12, background: P.crema, boxShadow: '0 24px 50px rgba(0,0,0,.55)', padding: '34px 40px', boxSizing: 'border-box' }}>
        <Tx size={50} c="#1A1410" style={{ letterSpacing: 6 }}>FACTURA</Tx>
        <div style={{ height: 4, background: '#1A1410', margin: '16px 0 24px' }} />
        {[0.9, 0.7, 0.8, 0.5].map((w, i) => (<div key={i} style={{ height: 16, width: `${w * pr(t, W(3, 5) + 0.2 + i * 0.1, 0.3) * 100}%`, background: '#C9BFA8', borderRadius: 8, marginBottom: 20 }} />))}
        <Abs x={300} y={290} o={pr(t, W(3, 5) + 0.7, 0.3)} s={0.4 + 0.6 * pr(t, W(3, 5) + 0.7, 0.4, outB)}><div style={{ width: 110, height: 110, borderRadius: '50%', background: P.vd, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icono tipo="check" size={70} c="#06210F" /></div></Abs>
      </Abs>
      {[0, 1, 2].map((i) => { const q = clamp((t - W(3, 10) - i * 0.25) / 1.1); return q > 0 && q < 1 ? (<Abs key={i} x={540 - 300 * (0.3 + q)} y={1100 - 300 * (0.3 + q)} o={(1 - q) * calma}><div style={{ width: 600 * (0.3 + q), height: 600 * (0.3 + q), borderRadius: '50%', border: `4px solid ${P.oroC}` }} /></Abs>) : null })}
    </>
  )
}

const E4 = ({ t, W }) => {
  const a = pr(t, 0.05, 0.5, outB), b = pr(t, W(4, 4) - 0.05, 0.6, outB)
  const barrido = pr(t, W(4, 4) + 0.2, 0.9, io3)
  const fr = [['rect', P.rosa, 230, 70], ['slim', P.amb, 250, 380], ['round', P.azul, 230, 690]]
  return (
    <>
      <Abs x={0} y={340} o={a} s={0.85 + 0.15 * a} style={{ width: 1080, textAlign: 'center' }}><Tx size={50} w={500} c={P.oroC} style={{ letterSpacing: 8 }}>REGALOS CON ESTILO</Tx></Abs>
      <Abs x={0} y={440} o={clamp(b * 2)} s={0.7 + 0.3 * b} style={{ width: 1080, textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', overflow: 'hidden' }}>
          <Tx size={150} style={{ ...oroTxt, letterSpacing: -2 }}>TU</Tx>
          <Tx size={150} style={{ ...oroTxt, letterSpacing: -2 }}>MARCA</Tx>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${-30 + barrido * 140}%`, width: '22%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,.75), transparent)' }} />
        </div>
      </Abs>
      <div style={{ position: 'absolute', left: 340, top: 800, width: 400 * pr(t, W(4, 4) + 0.1, 0.6, io3), height: 5, background: P.oro }} />
      {fr.map(([tp, col, w, x], i) => { const q = pr(t, W(4, 2) + i * 0.12, 0.7, outB); return <Frasco key={i} id={`e4${i}`} tipo={tp} liq={col} w={w} x={x} y={900 + (1 - q) * 500 - Math.sin(t * 2 + i) * 8} o={q} s={0.8 + 0.2 * q} /> })}
    </>
  )
}

const E5 = ({ t, W }) => {
  const a = pr(t, 0.05, 0.5, outB), btn = pr(t, W(5, 0) - 0.05, 0.5, outB)
  const clic = pr(t, W(5, 3) - 0.05, 0.4)
  const pulso = (t * 1.4) % 1
  return (
    <>
      <Abs x={0} y={380} o={a} style={{ width: 1080, textAlign: 'center' }}><Tx size={150} style={oroTxt}>¿LISTO?</Tx></Abs>
      {[0, 1, 2].map((i) => (<Abs key={i} x={540 - 40} y={760 - i * 90 - ((t * 120) % 90)} o={(0.9 - i * 0.28) * btn}><Icono tipo="flecha" size={80} c={P.oroC} /></Abs>))}
      <Abs x={140} y={1010} o={clamp(btn * 2)} s={(0.7 + 0.3 * btn) * (1 - 0.06 * clic)}>
        <div style={{ position: 'absolute', left: -30 - pulso * 40, top: -30 - pulso * 40, right: -30 - pulso * 40, bottom: -30 - pulso * 40, borderRadius: 120, border: `4px solid ${P.oroC}`, opacity: 1 - pulso }} />
        <div style={{ width: 800, height: 180, borderRadius: 100, background: `linear-gradient(135deg, ${P.oroC}, ${P.oro} 60%, ${P.oroO})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, boxShadow: '0 24px 60px rgba(217,178,95,.4)' }}>
          <Icono tipo="link" size={80} c="#2A1D05" />
          <Tx size={64} f={D} c="#2A1D05" style={{ whiteSpace: 'nowrap' }}>LINK EN LA BIO</Tx>
        </div>
      </Abs>
    </>
  )
}

const ESC = [E0, E1, E2, E3, E4, E5]

/* ───────────── fondo, cortina, subtítulos ───────────── */
const Fondo = ({ t }) => {
  const polvo = Array.from({ length: 38 }, (_, i) => {
    const sx = (i * 197) % 1080, v = 18 + (i * 13) % 40, sz = 4 + (i * 7) % 9
    const y = (((i * 331) % 1920) - t * v * 3 + 1920 * 10) % 1920
    return <div key={i} style={{ position: 'absolute', left: sx + Math.sin(t * 0.8 + i) * 20, top: y, width: sz, height: sz, borderRadius: '50%', background: P.oroC, opacity: 0.15 + 0.35 * ((i * 17) % 10) / 10 }} />
  })
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 1100px at 50% 40%, #2A2118 0%, ${P.negro} 70%)` }} />
      <div style={{ position: 'absolute', left: 140, top: -100, width: 800, height: 1400, background: 'linear-gradient(180deg, rgba(244,220,152,.20), transparent 85%)', clipPath: 'polygon(36% 0, 64% 0, 100% 100%, 0 100%)', opacity: 0.7 + 0.2 * Math.sin(t * 1.5) }} />
      {polvo}
    </>
  )
}

const Cortina = ({ t, gs }) => {
  let u = -1
  gs.forEach((g, i) => { if (i > 0 && t >= g - 0.38 && t <= g + 0.38) u = (t - (g - 0.38)) / 0.76 })
  if (u < 0) return null
  const cy = 1920 + 1300 - u * (1920 + 2600)
  return <div style={{ position: 'absolute', left: 0, right: 0, top: cy - 1300, height: 2600, background: `linear-gradient(180deg, transparent 0%, ${P.oroC} 38%, ${P.oro} 50%, ${P.oroC} 62%, transparent 100%)`, zIndex: 25, opacity: 0.96 }} />
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
    <div style={{ position: 'absolute', left: 40, right: 40, top: 1420, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 16}px)`, zIndex: 30 }}>
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 56, lineHeight: 1.2, whiteSpace: 'nowrap', background: 'rgba(11,10,13,.82)', border: `2px solid ${P.oro}`, borderRadius: 28, padding: '12px 34px', boxShadow: '0 12px 30px rgba(0,0,0,.5)' }}>
        {z.p.map((p, i) => (<span key={i} style={{ display: 'inline-block', marginRight: 14, color: p.k ? P.oroC : P.crema, visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>{p.w}</span>))}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Perfume = ({ frases, grupos, marca, usuario }) => {
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
  const handle = usuario || marca
  return (
    <AbsoluteFill style={{ background: P.negro, overflow: 'hidden' }}>
      <Fondo t={t} />
      <Sc t={t} W={W} />
      <Cortina t={t} gs={gs} />
      <div style={{ position: 'absolute', left: 60, right: 60, top: 258, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30 }}>
        <div style={{ fontFamily: S, fontWeight: 700, fontSize: 30, letterSpacing: 6, ...oroTxt }}>TU MARCA</div>
        {handle ? <div style={{ fontFamily: D, fontWeight: 500, fontSize: 26, color: P.crema, opacity: 0.85 }}>{handle}</div> : null}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: `${clamp(t / total) * 100}%`, height: 6, background: P.oro, zIndex: 40 }} />
      <Subs t={t} fr={frases} />
    </AbsoluteFill>
  )
}
