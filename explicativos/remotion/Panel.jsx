// Diseño «panel»: un lienzo infinito tipo Figma. Cada escena es un «frame» (artboard) en un lugar del lienzo y la cámara viaja
// entre ellos con zoom-out; cursores con nombre (Nico / IA), tarjetas de interfaz de Meta Ads, azul Meta + verde + ámbar.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const C = { lienzo: '#E4EAF5', pun: '#C9D3E6', az: '#0866FF', azS: '#E5EEFF', ng: '#0F1729', gr: '#5B6478', gris: '#F2F5FB', borde: '#DCE3F0', vd: '#16C47F', vdS: '#DDF7EB', rj: '#F0455A', rjS: '#FDE3E7', am: '#FFB020', amS: '#FFF1D6', blanco: '#FFFFFF' }
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
const Tx = ({ c = C.ng, size = 40, w = 700, f = D, children, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.1, ...style }}>{children}</div>
)
const Tarj = ({ x, y, w, h, o = 1, s = 1, bg = C.blanco, borde = C.borde, children, style }) => (
  <Abs x={x} y={y} o={o} s={s} origen="center" style={{ width: w, height: h, borderRadius: 32, background: bg, border: `3px solid ${borde}`, boxShadow: '0 18px 40px rgba(15,23,41,.10)', ...style }}>{children}</Abs>
)
const Chip = ({ children, bg = C.azS, fg = C.az, size = 34, style }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: `${size * 0.22}px ${size * 0.5}px`, borderRadius: 999, background: bg, color: fg, fontFamily: D, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', ...style }}>{children}</div>
)
const kf = (t, pts) => {
  if (t <= pts[0].t) return pts[0]
  for (let i = 1; i < pts.length; i++) {
    if (t <= pts[i].t) {
      const u = io3(clamp((t - pts[i - 1].t) / (pts[i].t - pts[i - 1].t)))
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * u, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * u, clic: pts[i].clic }
    }
  }
  return pts.at(-1)
}

// cursor estilo Figma con nombre
const Cursor = ({ x, y, nombre, col = C.az, clic = 0, o = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, opacity: o, zIndex: 20, transform: `scale(${1 - 0.15 * clic})`, transformOrigin: '0 0' }}>
    <svg width="46" height="46" viewBox="0 0 24 24" style={{ display: 'block', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.25))' }}><path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.6 L11 13.2 L18 13 Z" fill={col} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>
    <div style={{ position: 'absolute', left: 34, top: 36, padding: '6px 16px', borderRadius: 999, background: col, color: '#fff', fontFamily: D, fontWeight: 700, fontSize: 26, whiteSpace: 'nowrap' }}>{nombre}</div>
    {clic > 0 && <div style={{ position: 'absolute', left: -14, top: -14, width: 44 + clic * 50, height: 44 + clic * 50, borderRadius: '50%', border: `4px solid ${col}`, opacity: 1 - clic, transform: `translate(${-clic * 25}px, ${-clic * 25}px)` }} />}
  </div>
)

const Ico = ({ tipo, size = 90, c = C.az, sw = 6 }) => {
  const p = { stroke: c, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  const g = {
    edificio: (<g {...p}><rect x="-30" y="-44" width="60" height="88" rx="6" /><path d="M-14 -28 h8 M6 -28 h8 M-14 -8 h8 M6 -8 h8 M-14 12 h8 M6 12 h8 M-8 44 v-16 h16 v16" /></g>),
    dinero: (<g {...p}><rect x="-44" y="-26" width="88" height="52" rx="8" /><circle r="12" /><circle cx="-30" cy="0" r="2" /><circle cx="30" cy="0" r="2" /></g>),
    salud: (<g {...p}><rect x="-34" y="-34" width="68" height="68" rx="14" /><path d="M0 -16 v32 M-16 0 h32" /></g>),
    escudo: (<g {...p}><path d="M0 -46 L38 -32 V4 C38 28 18 40 0 48 C-18 40 -38 28 -38 4 V-32 Z" /><polyline points="-14,2 -4,14 16,-10" /></g>),
    cohete: (<g {...p}><path d="M0 -50 q26 18 22 56 l-22 14 l-22 -14 q-4 -38 22 -56 z" /><circle cx="0" cy="-12" r="8" /><path d="M-22 14 l-14 14 M22 14 l14 14" /></g>),
    check: (<g {...p}><polyline points="-30,2 -10,24 32,-24" /></g>),
    cruz: (<g {...p}><line x1="-28" y1="-28" x2="28" y2="28" /><line x1="28" y1="-28" x2="-28" y2="28" /></g>),
    usuarios: (<g {...p}><circle cx="0" cy="-18" r="14" /><path d="M-28 34 a28 28 0 0 1 56 0 z" /><circle cx="-38" cy="-4" r="9" /><circle cx="38" cy="-4" r="9" /></g>),
    engranaje: (<g {...p}><circle r="16" /><path d="M0 -44 v14 M0 30 v14 M-44 0 h14 M30 0 h14 M-31 -31 l10 10 M21 21 l10 10 M31 -31 l-10 10 M-21 21 l-10 10" /></g>),
    chat: (<g {...p}><path d="M-42 -34 h84 v56 h-50 l-20 18 v-18 h-14 z" /><path d="M-22 -12 h44 M-22 4 h28" /></g>),
    bandera: (<g {...p}><path d="M-24 46 V-44 M-24 -44 h56 l-12 20 l12 20 h-56" /></g>),
    play: (<g {...p}><polygon points="-18,-26 28,0 -18,26" fill={c} /></g>),
    candado: (<g {...p}><rect x="-26" y="-6" width="52" height="42" rx="8" /><path d="M-16 -6 v-14 a16 16 0 0 1 32 0 v14" /></g>),
    corazon: (<g {...p}><path d="M0 36 C-60 -4 -38 -48 -8 -34 C-2 -30 0 -24 0 -20 C0 -24 2 -30 8 -34 C38 -48 60 -4 0 36 z" /></g>),
  }[tipo]
  return (<svg width={size} height={size} viewBox="-60 -60 120 120" style={{ display: 'block', overflow: 'visible' }}>{g}</svg>)
}
const Meta = ({ size = 120, c = C.az }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 120 60" style={{ display: 'block' }}><path d="M14 30 C14 10 30 4 42 20 L78 40 C90 56 106 50 106 30 C106 10 90 4 78 20 L42 40 C30 56 14 50 14 30 Z" fill="none" stroke={c} strokeWidth="11" strokeLinejoin="round" /></svg>
)

/* ───────────── escenas (coordenadas locales 1080×1920) ───────────── */
const Z0 = ({ t, W }) => {
  const pop = pr(t, 0.1, 0.6, outB)
  const llena = pr(t, W(0, 6) - 0.1, 1.0, io3)
  const flag = pr(t, W(0, 9) - 0.1, 0.4, outB)
  const edad = pr(t, W(0, 11) - 0.1, 0.4, outB)
  const cur = kf(t, [{ t: 0, x: 60, y: 1200 }, { t: W(0, 6), x: 120, y: 860 }, { t: W(0, 9) + 0.1, x: 880, y: 860, clic: 1 }])
  return (
    <>
      <Abs x={0} y={225} o={pr(t, 0.05, 0.4)} style={{ width: 1080, display: 'flex', justifyContent: 'center' }}><Chip bg={C.ng} fg="#fff" size={30}>ESCALANDO MI AGENCIA DE IA</Chip></Abs>
      <Abs x={0} y={360} o={clamp(pop * 2)} s={0.6 + 0.4 * pop} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={380} c={C.az} style={{ letterSpacing: -14, lineHeight: 0.95 }}>DÍA 9</Tx>
      </Abs>
      <div style={{ position: 'absolute', left: 90, top: 880, width: 900, height: 28, borderRadius: 14, background: C.pun, overflow: 'hidden' }}>
        <div style={{ width: `${llena * 14}%`, height: '100%', background: C.az, borderRadius: 14 }} />
      </div>
      <Abs x={90} y={940} o={pr(t, 0.4, 0.3)}><Tx size={42} c={C.ng}>$0</Tx></Abs>
      <Abs x={0} y={940} o={flag} style={{ width: 990, textAlign: 'right' }}><Tx size={42} c={C.vd}>$5.000 USD</Tx></Abs>
      <Abs x={930} y={800} o={flag} s={0.5 + 0.5 * flag} origen="center bottom"><Ico tipo="bandera" size={90} c={C.vd} sw={9} /></Abs>
      <Abs x={560} y={1060} o={edad} s={0.6 + 0.4 * edad} r={-6}><Chip bg={C.am} fg={C.ng} size={64}>20 AÑOS</Chip></Abs>
      <Cursor x={cur.x} y={cur.y} nombre="Nico" clic={cur.clic ? clamp((t - W(0, 9)) / 0.5) : 0} />
    </>
  )
}

const Z1 = ({ t, W }) => {
  const chips = [['dinero', 'Nómina', W(1, 4)], ['salud', 'Salud', W(1, 5)], ['escudo', 'Seguridad social', W(1, 7)]]
  const q = pr(t, W(1, 10) - 0.1, 0.4, outB), r = pr(t, W(1, 12) - 0.05, 0.4, outB), m = pr(t, W(1, 15) - 0.1, 0.5, outB)
  return (
    <>
      <Tarj x={80} y={290} w={920} h={400} o={pr(t, 0.05, 0.4)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '30px 40px 0' }}>
          <div style={{ width: 110, height: 110, borderRadius: 28, background: C.azS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo="edificio" size={80} /></div>
          <div><Tx size={46}>Empresa</Tx><Tx size={32} c={C.gr} f={U} w={600} style={{ marginTop: 8 }}>Terceriza procesos</Tx></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '26px 40px', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            {chips.slice(0, 2).map(([ic, tx, t0], i) => { const k = pr(t, t0 - 0.1, 0.3, outB); return (<div key={i} style={{ opacity: clamp(k * 2), transform: `scale(${0.6 + 0.4 * k})` }}><Chip size={34}><Ico tipo={ic} size={40} sw={9} /> {tx}</Chip></div>) })}
          </div>
          {(() => { const [ic, tx, t0] = chips[2]; const k = pr(t, t0 - 0.1, 0.3, outB); return (<div style={{ opacity: clamp(k * 2), transform: `scale(${0.6 + 0.4 * k})`, transformOrigin: 'left' }}><Chip size={34}><Ico tipo={ic} size={40} sw={9} /> {tx}</Chip></div>) })()}
        </div>
      </Tarj>
      <Abs x={90} y={740} o={clamp(q * 2)} s={0.8 + 0.2 * q} origen="left top">
        <div style={{ padding: '26px 36px', borderRadius: '34px 34px 34px 8px', background: C.gris, border: `3px solid ${C.borde}`, fontFamily: U, fontWeight: 600, fontSize: 38, color: C.ng, maxWidth: 720 }}>Hola Nico, necesitamos clientes 👋</div>
      </Abs>
      <Abs x={990} y={880} o={clamp(r * 2)} s={0.8 + 0.2 * r} origen="right top" style={{ transform: `translateX(-100%) scale(${0.8 + 0.2 * r})` }}>
        <div style={{ padding: '26px 36px', borderRadius: '34px 34px 8px 34px', background: C.az, fontFamily: U, fontWeight: 600, fontSize: 38, color: '#fff', maxWidth: 720 }}>Te los consigo con Meta Ads</div>
      </Abs>
      <Abs x={200} y={1070} o={clamp(m * 2)} s={0.6 + 0.4 * m}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '26px 44px', borderRadius: 40, background: C.ng, boxShadow: `0 0 70px ${C.az}55` }}>
          <Meta size={150} c="#4C9BFF" />
          <Tx size={64} c="#fff">Ads</Tx>
        </div>
      </Abs>
    </>
  )
}

const Z2 = ({ t, W }) => {
  const g0 = pr(t, W(2, 2) - 0.1, 0.35, outB)
  const a = pr(t, W(2, 10) - 0.1, 0.45, outB), b = pr(t, W(2, 16) - 0.1, 0.45, outB), c = pr(t, W(2, 22) - 0.1, 0.45, outB)
  const nodo = (x, y, tx, col, k) => (<g key={tx + x}><rect x={x - 62} y={y - 24} width="124" height="48" rx="14" fill={col} opacity={k} /><text x={x} y={y + 9} textAnchor="middle" fontFamily={D} fontWeight="700" fontSize="24" fill="#fff" opacity={k}>{tx}</text></g>)
  const tn = (i) => pr(t, W(2, 12) + i * 0.12, 0.3, outB)
  const pains = [['Tiempo perdido', W(2, 18)], ['Errores', W(2, 19)], ['Multas', W(2, 20)]]
  const filas = [['Tamaño de la empresa', W(2, 24)], ['Necesita el servicio', W(2, 26)], ['Presupuesto', W(2, 28)]]
  return (
    <>
      <Abs x={0} y={250} o={g0} s={0.7 + 0.3 * g0} style={{ width: 1080, display: 'flex', justifyContent: 'center' }}><Chip bg={C.ng} fg="#fff" size={40}>$0 gastado en pauta</Chip></Abs>
      <Tarj x={50} y={350} w={980} h={285} o={a} s={0.85 + 0.15 * a}>
        <Abs x={34} y={26}><Chip size={28}>1</Chip></Abs>
        <Abs x={34} y={90}><Tx size={44}>Estructura de la campaña</Tx></Abs>
        <svg width="980" height="285" style={{ position: 'absolute', left: 0, top: 0 }}>
          <g opacity={tn(0)}><path d="M740 120 V160 M600 160 H880 M600 160 V190 M880 160 V190" stroke={C.borde} strokeWidth="5" fill="none" /></g>
          {nodo(740, 96, 'Campaña', C.az, tn(0))}
          {nodo(600, 215, 'Conjunto', '#4C9BFF', tn(1))}
          {nodo(880, 215, 'Conjunto', '#4C9BFF', tn(2))}
        </svg>
      </Tarj>
      <Tarj x={50} y={665} w={980} h={285} o={b} s={0.85 + 0.15 * b}>
        <Abs x={34} y={26}><Chip size={28}>2</Chip></Abs>
        <Abs x={34} y={90}><Tx size={44}>Dolores a atacar</Tx></Abs>
        <div style={{ position: 'absolute', left: 34, top: 170, display: 'flex', gap: 14 }}>
          {pains.map(([tx, t0], i) => { const k = pr(t, t0 - 0.1, 0.3, outB); return (<div key={i} style={{ opacity: clamp(k * 2), transform: `scale(${0.6 + 0.4 * k})` }}><Chip bg={C.rjS} fg={C.rj} size={32}><Ico tipo="cruz" size={32} c={C.rj} sw={12} />{tx}</Chip></div>) })}
        </div>
      </Tarj>
      <Tarj x={50} y={980} w={980} h={285} o={c} s={0.85 + 0.15 * c}>
        <Abs x={34} y={26}><Chip size={28}>3</Chip></Abs>
        <Abs x={34} y={90}><Tx size={44}>Encuesta que califica leads</Tx></Abs>
        <div style={{ position: 'absolute', left: 34, top: 160, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filas.map(([tx, t0], i) => { const k = pr(t, t0 - 0.05, 0.25, outB); return (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: pr(t, W(2, 22), 0.3) }}><div style={{ width: 30, height: 30, borderRadius: 8, background: k > 0.5 ? C.vd : C.borde, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{k > 0.5 && <Ico tipo="check" size={26} c="#fff" sw={14} />}</div><Tx size={30} c={C.gr} f={U} w={600}>{tx}</Tx></div>) })}
        </div>
        <Abs x={600} y={170} o={pr(t, W(2, 30) - 0.2, 0.4, outB)} s={0.6 + 0.4 * pr(t, W(2, 30) - 0.2, 0.4, outB)}><Chip bg={C.vdS} fg={C.vd} size={36}><Ico tipo="check" size={36} c={C.vd} sw={12} />Lead calificado</Chip></Abs>
      </Tarj>
    </>
  )
}

const Z3 = ({ t, W }) => {
  const tL = W(3, 5)
  const lanz = pr(t, tL, 0.35)
  const cur = kf(t, [{ t: 0, x: 700, y: 1100 }, { t: tL - 0.3, x: 640, y: 440 }, { t: tL, x: 640, y: 440, clic: 1 }, { t: W(3, 12), x: 600, y: 760 }])
  const k1 = pr(t, W(3, 13) - 0.1, 0.4, outB), k2 = pr(t, W(3, 18) - 0.1, 0.4, outB)
  const flujo = ['Anuncio', 'Encuesta', 'Lead calificado', 'Equipo comercial']
  const tm = W(3, 23)
  const pulso = 0.5 + 0.5 * Math.sin(t * 7)
  return (
    <>
      <Abs x={140} y={330} style={{ width: 800 }}>
        <div style={{ height: 130, borderRadius: 66, background: lanz > 0.5 ? C.vd : C.az, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: D, fontWeight: 700, fontSize: 54, boxShadow: `0 16px 40px ${lanz > 0.5 ? C.vd : C.az}66`, transform: `scale(${1 - 0.06 * Math.sin(Math.PI * clamp((t - tL) / 0.3))})` }}>
          {lanz > 0.5 ? (<><div style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', opacity: 0.4 + pulso * 0.6 }} />PAUTA EN VIVO</>) : (<><Ico tipo="cohete" size={64} c="#fff" sw={9} />Publicar campaña</>)}
        </div>
      </Abs>
      <Tarj x={50} y={560} w={470} h={300} o={clamp(k1 * 2)} s={0.8 + 0.2 * k1} borde={C.az}>
        <Abs x={30} y={30}><Tx size={30} c={C.gr} f={U} w={700}>COSTO POR CONTACTO</Tx></Abs>
        <Abs x={30} y={110}><Tx size={110} c={C.az}>$ ?</Tx></Abs>
        <Abs x={30} y={238}><div style={{ height: 14, width: 380, borderRadius: 7, background: C.azS, overflow: 'hidden' }}><div style={{ width: `${40 + 30 * Math.sin(t * 3)}%`, height: '100%', background: C.az, borderRadius: 7 }} /></div></Abs>
      </Tarj>
      <Tarj x={560} y={560} w={470} h={300} o={clamp(k2 * 2)} s={0.8 + 0.2 * k2} borde={C.vd}>
        <Abs x={30} y={30}><Tx size={30} c={C.gr} f={U} w={700}>CLIENTES POTENCIALES</Tx></Abs>
        <Abs x={30} y={110}><Tx size={110} c={C.vd}>?</Tx></Abs>
        <Abs x={30} y={238}><div style={{ display: 'flex', gap: 10 }}>{[0, 1, 2, 3, 4].map((i) => (<Ico key={i} tipo="usuarios" size={44} c={C.borde} sw={9} />))}</div></Abs>
      </Tarj>
      <div style={{ position: 'absolute', left: 50, top: 940, width: 980 }}>
        <Tx size={30} c={C.gr} f={U} w={700} style={{ letterSpacing: 3, marginBottom: 16, opacity: pr(t, tm - 0.4, 0.3) }}>NUESTRO MÉTODO</Tx>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {flujo.map((f, i) => {
            const k = pr(t, tm - 0.1 + i * 0.35, 0.35, outB)
            return (
              <React.Fragment key={f}>
                <div style={{ opacity: clamp(k * 2), transform: `scale(${0.7 + 0.3 * k})`, padding: '22px 14px', width: 205, textAlign: 'center', borderRadius: 24, background: i === 3 ? C.az : i === 2 ? C.vdS : C.gris, color: i === 3 ? '#fff' : i === 2 ? C.vd : C.ng, border: `3px solid ${i === 3 ? C.az : C.borde}`, fontFamily: D, fontWeight: 700, fontSize: 30, lineHeight: 1.1 }}>{f}</div>
                {i < 3 && <div style={{ fontFamily: D, fontWeight: 700, fontSize: 40, color: C.az, opacity: k }}>›</div>}
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <Cursor x={cur.x} y={cur.y} nombre="Nico" clic={cur.clic ? clamp((t - tL) / 0.5) : 0} />
    </>
  )
}

const Z4 = ({ t, W }) => {
  const dias = ['DÍA 9', 'DÍA 10', 'DÍA 11', 'DÍA 12']
  const pl = pr(t, W(4, 0) - 0.1, 0.5, outB)
  return (
    <>
      <Abs x={0} y={330} o={pl} s={0.6 + 0.4 * pl} style={{ width: 1080, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 300, height: 300, borderRadius: '50%', background: C.az, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 0 ${20 + Math.sin(t * 6) * 8}px ${C.azS}` }}><Ico tipo="play" size={170} c="#fff" /></div>
      </Abs>
      <Abs x={0} y={760} o={pr(t, W(4, 3) - 0.1, 0.3)} style={{ width: 1080, textAlign: 'center' }}><Tx size={64}>Todo el proceso</Tx></Abs>
      <div style={{ position: 'absolute', left: 80, top: 960, width: 920 }}>
        <div style={{ position: 'absolute', left: 60, right: 60, top: 36, height: 8, background: C.pun, borderRadius: 4 }} />
        <div style={{ position: 'absolute', left: 60, top: 36, width: 800 * pr(t, W(4, 3), 0.9, io3) * 0.0 + 0, height: 8, background: C.az }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {dias.map((d, i) => { const k = pr(t, W(4, 3) + i * 0.15, 0.3, outB); return (<div key={d} style={{ width: 160, textAlign: 'center', opacity: clamp(k * 2), transform: `scale(${0.6 + 0.4 * k})` }}><div style={{ width: 80, height: 80, margin: '0 auto', borderRadius: '50%', background: i === 0 ? C.az : C.blanco, border: `6px solid ${i === 0 ? C.az : C.pun}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i === 0 ? <Ico tipo="check" size={44} c="#fff" sw={13} /> : <Ico tipo="candado" size={40} c={C.pun} sw={9} />}</div><Tx size={30} c={i === 0 ? C.az : C.gr} style={{ marginTop: 14 }}>{d}</Tx></div>) })}
        </div>
      </div>
    </>
  )
}

const Z5 = ({ t, W }) => {
  const filas = [['usuarios', 'Más clientes', W(5, 5)], ['engranaje', 'Automatizar procesos', W(5, 7)], ['chat', 'Consultoría', W(5, 9)]]
  const dm = pr(t, W(5, 10) - 0.05, 0.4, outB)
  return (
    <>
      <Abs x={0} y={250} o={pr(t, 0.1, 0.4)} style={{ width: 1080, display: 'flex', justifyContent: 'center' }}><Chip bg={C.ng} fg="#fff" size={40}>¿Tu negocio necesita…?</Chip></Abs>
      {filas.map(([ic, tx, t0], i) => {
        const k = pr(t, t0 - 0.2, 0.4, outB)
        return (<Tarj key={i} x={80} y={360 + i * 190} w={920} h={160} o={clamp(k * 2)} s={1} style={{ transform: `translateX(${(1 - k) * 200}px)` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30, padding: '0 40px', height: '100%' }}><div style={{ width: 100, height: 100, borderRadius: 28, background: C.azS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ico tipo={ic} size={70} /></div><Tx size={50}>{tx}</Tx></div>
        </Tarj>)
      })}
      <Abs x={140} y={980} o={clamp(dm * 2)} s={0.7 + 0.3 * dm}>
        <div style={{ width: 800, height: 120, borderRadius: 60, background: C.az, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, fontFamily: D, fontWeight: 700, fontSize: 52, boxShadow: `0 16px 40px ${C.az}66` }}><Ico tipo="chat" size={60} c="#fff" sw={8} />Escríbeme</div>
      </Abs>
    </>
  )
}

const Z6 = ({ t, W, handle }) => {
  const tS = W(6, 1)
  const p = pr(t, 0.1, 0.5, outB)
  const sig = clamp((t - tS - 0.55) / 0.2)
  const prox = pr(t, W(6, 3) - 0.1, 0.5, outB)
  const flot = [{ x: 150, t0: W(6, 0) }, { x: 880, t0: W(6, 0) + 0.3 }, { x: 520, t0: W(6, 3) }]
  const cur = kf(t, [{ t: 0, x: 900, y: 1200 }, { t: tS + 0.3, x: 760, y: 600, clic: 1 }])
  return (
    <>
      <Tarj x={80} y={300} w={920} h={230} o={clamp(p * 2)} s={0.8 + 0.2 * p}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '0 36px', height: '100%' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: C.az, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D, fontWeight: 700, fontSize: 52 }}>NP</div>
          <div style={{ flex: 1 }}><Tx size={42}>{handle}</Tx><Tx size={26} c={C.gr} f={U} w={600} style={{ marginTop: 6 }}>Agencia de IA · Meta Ads</Tx></div>
          <div style={{ padding: '18px 34px', borderRadius: 999, background: sig > 0.5 ? C.blanco : C.az, color: sig > 0.5 ? C.ng : '#fff', border: `4px solid ${C.az}`, fontFamily: D, fontWeight: 700, fontSize: 34, whiteSpace: 'nowrap' }}>{sig > 0.5 ? '✓ Siguiendo' : 'Seguir'}</div>
        </div>
      </Tarj>
      <Tarj x={80} y={600} w={920} h={420} o={clamp(prox * 2)} s={0.85 + 0.15 * prox} bg={C.gris}>
        <div style={{ textAlign: 'center', paddingTop: 70 }}>
          <Ico tipo="candado" size={110} c={C.pun} sw={8} />
          <Tx size={70} c={C.gr} style={{ marginTop: 24 }}>DÍA 10</Tx>
          <Tx size={40} c={C.gr} f={U} w={600} style={{ marginTop: 10 }}>Los resultados de la pauta</Tx>
        </div>
      </Tarj>
      {flot.map((f, i) => { const q = clamp((t - f.t0) / 2.2); return q > 0 && q < 1 ? (<Abs key={i} x={f.x} y={1150 - q * 450} o={Math.sin(q * Math.PI)} s={0.7 + q * 0.5}><Ico tipo="corazon" size={100} c={C.rj} sw={7} /></Abs>) : null })}
      <Cursor x={cur.x} y={cur.y} nombre="Tú" col={C.vd} clic={cur.clic ? clamp((t - tS - 0.3) / 0.5) : 0} />
    </>
  )
}

const ESC = [Z0, Z1, Z2, Z3, Z4, Z5, Z6]
const POS = (i) => ({ x: i * 1260, y: (i % 2) * 340 - (i % 3) * 120 })

/* ───────────── subtítulos ───────────── */
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
  return (
    <div style={{ position: 'absolute', left: 40, right: 40, top: 1350, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 16}px)`, zIndex: 30 }}>
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 58, lineHeight: 1.2, color: '#fff', whiteSpace: 'nowrap', background: 'rgba(15,23,41,.92)', borderRadius: 28, padding: '12px 34px', boxShadow: '0 12px 30px rgba(15,23,41,.3)' }}>
        {z.p.map((p, i) => (<span key={i} style={{ display: 'inline-block', marginRight: 14, color: p.k ? '#6FB0FF' : '#fff', visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>{p.w}</span>))}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Panel = ({ frases, grupos, marca, usuario }) => {
  useFuentes()
  const f = useCurrentFrame()
  const t = f / FPS
  const W = mkW(frases)
  const all = grupos.map((_, i) => i).filter((i) => i > 0)
  const gs = inicios(frases, grupos, all)
  const total = frases.at(-1).fin + 1.6
  let gi = 0
  gs.forEach((a, i) => { if (t >= a) gi = i })
  // cámara: viaja del frame anterior al siguiente con zoom-out
  let cam = POS(gi), esc = 1
  if (gi < grupos.length - 1 || true) {
    const sig = gi + 1
    if (sig < grupos.length) {
      const a = gs[sig] - 0.5, u = clamp((t - a) / 0.62)
      if (u > 0) { const A = POS(gi), B = POS(sig), e = io3(u); cam = { x: A.x + (B.x - A.x) * e, y: A.y + (B.y - A.y) * e }; esc = 1 - 0.3 * Math.sin(Math.PI * u) }
    }
  }
  const handle = usuario || marca
  const nZ = grupos.length
  return (
    <AbsoluteFill style={{ background: C.lienzo, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(${C.pun} 3px, transparent 3.5px)`, backgroundSize: '60px 60px', backgroundPosition: `${-cam.x * esc * 0.6}px ${-cam.y * esc * 0.6}px` }} />
      <div style={{ position: 'absolute', left: 540, top: 960, width: 0, height: 0, transform: `scale(${esc})`, transformOrigin: '0 0' }}>
        {Array.from({ length: nZ }, (_, i) => i).filter((i) => Math.abs(i - gi) <= 1).map((i) => {
          const P = POS(i), Sc = ESC[i]
          return (
            <div key={i} style={{ position: 'absolute', left: P.x - cam.x - 540, top: P.y - cam.y - 960, width: 1080, height: 1920 }}>
              <div style={{ position: 'absolute', left: 0, top: -64, fontFamily: U, fontWeight: 700, fontSize: 30, color: C.az }}>{String(i + 1).padStart(2, '0')} · {['Hook', 'La empresa', 'Antes de la pauta', 'Lanzamiento', 'El proceso', 'Contacto', 'Seguir'][i]}</div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 40, background: i % 2 ? '#FAFCFF' : '#FFFFFF', border: `3px solid ${C.borde}`, boxShadow: '0 30px 80px rgba(15,23,41,.15)', overflow: 'hidden' }}>
                <Sc t={t} W={W} handle={handle} />
              </div>
            </div>
          )
        })}
      </div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 128, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 30 }}>
        <div style={{ fontFamily: D, fontWeight: 700, fontSize: 30, color: C.ng, background: 'rgba(255,255,255,.85)', padding: '8px 22px', borderRadius: 999 }}>Día 9</div>
        <div style={{ fontFamily: U, fontWeight: 700, fontSize: 28, color: C.ng, background: 'rgba(255,255,255,.85)', padding: '8px 22px', borderRadius: 999 }}>{handle}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: `${clamp(t / total) * 100}%`, height: 8, background: C.az, zIndex: 40 }} />
      <Subs t={t} fr={frases} />
    </AbsoluteFill>
  )
}
