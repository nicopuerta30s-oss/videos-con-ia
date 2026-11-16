// Diseño «estudio»: la herramienta por dentro. Ventanas de terminal/código sobre fondo de cuadrícula oscura, una barra de pasos
// (Voz → Texto → Código → Render → Listo) que se va encendiendo y persianas de escáner entre escenas. Mono + Poppins.
import React from 'react'
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion'
import { inicios, mkW } from '../tiempos-pro.js'
import { clamp, io3, out3, outB, pr } from './Pro.jsx'

const FPS = 30
const K = { bg: '#090D13', panel: '#10161F', borde: '#222C3B', cy: '#22D3EE', cyC: '#67E8F9', vi: '#A78BFA', vd: '#4ADE80', na: '#FB923C', rj: '#F87171', am: '#FBBF24', tx: '#E6EDF3', gr: '#7D8A9C' }
const D = "'Poppins', 'Helvetica Neue', sans-serif"
const M = "'SF Mono', 'Menlo', 'Monaco', monospace"
const grad = { background: `linear-gradient(180deg, ${K.cyC}, ${K.cy} 55%, ${K.vi})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }

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
const Tx = ({ c = K.tx, size = 40, w = 700, f = D, children, style }) => (
  <div style={{ fontFamily: f, fontWeight: w, fontSize: size, color: c, lineHeight: 1.1, ...style }}>{children}</div>
)
const Chip = ({ children, c = K.cy, size = 34, solid, style }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: `${size * 0.24}px ${size * 0.55}px`, borderRadius: 999, border: `2px solid ${c}`, background: solid ? c : `${c}22`, color: solid ? '#06141A' : c, fontFamily: D, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', ...style }}>{children}</div>
)
const Ven = ({ x, y, w, h, titulo, o = 1, s = 1, children, style }) => (
  <Abs x={x} y={y} o={o} s={s} style={{ width: w, height: h, borderRadius: 26, background: K.panel, border: `2px solid ${K.borde}`, boxShadow: '0 24px 60px rgba(0,0,0,.55)', overflow: 'hidden', ...style }}>
    <div style={{ height: 58, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', background: '#0D121A', borderBottom: `2px solid ${K.borde}` }}>
      {[K.rj, K.am, K.vd].map((c, i) => (<div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />))}
      <div style={{ marginLeft: 14, fontFamily: M, fontSize: 22, color: K.gr }}>{titulo}</div>
    </div>
    <div style={{ position: 'relative', width: '100%', height: h - 58 }}>{children}</div>
  </Abs>
)
const tipea = (txt, t, t0, cps = 32) => txt.slice(0, Math.max(0, Math.min(txt.length, Math.floor((t - t0) * cps))))
const amp = (i) => 0.22 + 0.78 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))
const mmss = (s) => `0:${s.toFixed(1).padStart(4, '0')}`

/* ───────────── escenas ───────────── */
const T0 = ({ t, W }) => {
  const a = pr(t, 0.05, 0.5, outB), win = pr(t, 0.12, 0.6, outB)
  const x = pr(t, W(0, 5) - 0.05, 0.35, outB), out = pr(t, W(0, 6) + 0.1, 0.45, io3)
  const cero = pr(t, W(0, 8) - 0.05, 0.55, outB)
  const shake = x > 0 && out < 1 ? Math.sin(t * 50) * 7 * (1 - out) : 0
  const pistas = [[K.cy, [[40, 220], [300, 160], [500, 280]]], [K.vi, [[90, 180], [330, 240], [610, 150]]], [K.na, [[20, 120], [180, 200], [420, 120], [600, 220]]], [K.vd, [[130, 260], [430, 190]]]]
  return (
    <>
      <Abs x={0} y={370} o={a} style={{ width: 1080, textAlign: 'center' }}><Chip>$ todos_estos_videos</Chip></Abs>
      <Ven x={90 + shake} y={520} w={900} h={560} titulo="editor-de-video.app" o={win * (1 - out)} s={(0.85 + 0.15 * win) * (1 - 0.2 * out)}>
        <div style={{ position: 'absolute', left: 30, top: 24, width: 840, height: 250, borderRadius: 16, background: '#05080C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 0, height: 0, borderLeft: `60px solid ${K.gr}`, borderTop: '36px solid transparent', borderBottom: '36px solid transparent' }} />
        </div>
        {pistas.map(([c, cl], i) => (
          <div key={i} style={{ position: 'absolute', left: 30, top: 300 + i * 46, width: 840, height: 38, borderRadius: 8, background: '#0B1017' }}>
            {cl.map(([cx, cw], j) => (<div key={j} style={{ position: 'absolute', left: cx, top: 4, width: cw, height: 30, borderRadius: 6, background: c, opacity: 0.85 }} />))}
          </div>
        ))}
        <div style={{ position: 'absolute', left: 30 + 330, top: 290, width: 4, height: 200, background: K.rj }} />
      </Ven>
      <Abs x={270} y={560} o={x * (1 - out)} s={0.4 + 0.6 * x}>
        <svg width="540" height="540" viewBox="-50 -50 100 100"><g stroke={K.rj} strokeWidth="9" strokeLinecap="round"><line x1="-34" y1="-34" x2="34" y2="34" /><line x1="34" y1="-34" x2="-34" y2="34" /></g></svg>
      </Abs>
      <Abs x={0} y={470} o={clamp(cero * 2)} s={0.5 + 0.5 * cero} style={{ width: 1080, textAlign: 'center' }}>
        <Tx size={560} style={{ ...grad, lineHeight: 0.9 }}>0</Tx>
        <Tx size={54} f={M} w={500} c={K.tx} style={{ marginTop: 20 }}>editores abiertos</Tx>
      </Abs>
    </>
  )
}

const T1 = ({ t, W }) => {
  const rec = pr(t, W(1, 0) - 0.1, 0.5, outB), recOn = t > W(1, 0) && t < W(1, 7) + 0.3
  const carp = pr(t, W(1, 8) - 0.1, 0.5, outB), caeA = pr(t, W(1, 9), 0.5, outB)
  const term = pr(t, W(1, 13) - 0.1, 0.5, outB)
  const fl = (t * 3) % 1
  return (
    <>
      <Abs x={90} y={380} o={rec} s={0.9 + 0.1 * rec} style={{ width: 900, height: 250, borderRadius: 26, background: K.panel, border: `2px solid ${K.rj}66` }}>
        <div style={{ position: 'absolute', left: 36, top: 62, width: 126, height: 126, borderRadius: 63, background: K.rj, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: recOn ? `0 0 ${30 + 20 * Math.sin(t * 8)}px ${K.rj}` : 'none' }}>
          <svg width="70" height="70" viewBox="-30 -36 60 72"><rect x="-10" y="-30" width="20" height="38" rx="10" fill="#fff" /><path d="M-20 0 a20 20 0 0 0 40 0 M0 20 v12" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" /></svg>
        </div>
        <div style={{ position: 'absolute', left: 200, top: 0, height: 250, display: 'flex', alignItems: 'center', gap: 9 }}>
          {Array.from({ length: 24 }, (_, i) => (<div key={i} style={{ width: 14, borderRadius: 7, background: K.rj, height: recOn ? 20 + 130 * amp(i + Math.floor(t * 9)) : 20 }} />))}
        </div>
        <Abs x={736} y={24}><Tx size={26} f={M} c={K.gr}>REC ●</Tx></Abs>
      </Abs>
      {[0, 1].map((i) => (<Abs key={i} x={510} y={640 + i * 300} o={(i === 0 ? carp : term) * (1 - fl * 0.6)}><svg width="60" height="50" viewBox="-30 -25 60 50"><polyline points="-22,-14 0,10 22,-14" stroke={K.cy} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${fl * 8})`} /></svg></Abs>))}
      <Abs x={90} y={700} o={carp} s={0.9 + 0.1 * carp} style={{ width: 900, height: 190, borderRadius: 26, background: K.panel, border: `2px solid ${K.am}66` }}>
        <svg width="110" height="90" viewBox="0 0 110 90" style={{ position: 'absolute', left: 40, top: 50 }}><path d="M4 14 h34 l10 12 h58 v58 h-102 z" fill={K.am} /></svg>
        <Abs x={190} y={62}><Tx size={52} f={M} c={K.tx}>voz-propia/</Tx></Abs>
        <Abs x={640} y={-210 + 262 * caeA} o={clamp(caeA * 3)} style={{ zIndex: 5 }}><Chip c={K.rj} size={34}>voz.m4a</Chip></Abs>
      </Abs>
      <Ven x={90} y={950} w={900} h={360} titulo="claude" o={term} s={0.92 + 0.08 * term}>
        <Abs x={34} y={34}><Tx size={44} f={M} c={K.vd}>{tipea('$ claude', t, W(1, 16) - 0.1, 14)}<span style={{ opacity: Math.floor(t * 3) % 2 }}>▍</span></Tx></Abs>
        <Abs x={34} y={120}><Tx size={36} f={M} c={K.tx} style={{ whiteSpace: 'pre' }}>{tipea('› Haz un video con voz.m4a', t, W(1, 17) - 0.05, 22)}</Tx></Abs>
        <Abs x={34} y={190} o={pr(t, W(1, 18) + 0.5, 0.3)}><Tx size={34} f={M} c={K.cy}>● Claude Code · manos a la obra</Tx></Abs>
      </Ven>
    </>
  )
}

const T2 = ({ t, W }) => {
  const aud = pr(t, 0.05, 0.5, outB)
  const corte = pr(t, W(2, 4) - 0.05, 0.6, io3)
  const sil = new Set([5, 6, 7, 17, 18, 29, 30, 31])
  const trans = pr(t, W(2, 1) - 0.05, 0.5, outB)
  const pal = ['sabe', 'en', 'qué', 'segundo', 'digo', 'cada', 'palabra']
  return (
    <>
      <Ven x={90} y={380} w={900} h={380} titulo="voz.m4a" o={aud} s={0.9 + 0.1 * aud}>
        <div style={{ position: 'absolute', left: 40, top: 40, height: 200, display: 'flex', alignItems: 'center' }}>
          {Array.from({ length: 40 }, (_, i) => { const s = sil.has(i); const w = s ? 14 * (1 - corte) : 14; return (<div key={i} style={{ width: w, marginRight: s ? 7.5 * (1 - corte) : 7.5, borderRadius: 7, height: s ? 16 : 30 + 150 * amp(i), background: s ? K.rj : K.cy, opacity: s ? 1 - corte * 0.5 : 1 }} />) })}
        </div>
        <Abs x={40} y={262} o={pr(t, W(2, 4) - 0.05, 0.3, outB)} s={0.6 + 0.4 * pr(t, W(2, 4) - 0.05, 0.4, outB)}><Chip c={K.rj} size={32}>✂ silencios fuera</Chip></Abs>
      </Ven>
      <Ven x={90} y={810} w={900} h={520} titulo="transcripcion.txt" o={trans} s={0.9 + 0.1 * trans}>
        {[0.9, 0.7, 0.8].map((w, i) => (<div key={i} style={{ position: 'absolute', left: 40, top: 36 + i * 34, height: 14, borderRadius: 7, background: '#2A3547', width: `${w * pr(t, W(2, 1) + i * 0.15, 0.5) * 820}px` }} />))}
        <div style={{ position: 'absolute', left: 40, top: 160, width: 820, display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {pal.map((p, i) => { const q = pr(t, W(2, 8 + i) - 0.05, 0.3, outB); return (<div key={i} style={{ opacity: q, transform: `scale(${0.6 + 0.4 * q})`, textAlign: 'center' }}><Chip c={K.vd} size={40}>{p}</Chip><Tx size={24} f={M} c={K.gr} style={{ marginTop: 8 }}>{mmss(W(2, 8 + i))}</Tx></div>) })}
        </div>
      </Ven>
    </>
  )
}

const L = [
  [W3 => W3(3, 2), [['<Escena ', K.cy], ['voz', K.vi], ['=', K.gr], ['"voz.m4a"', K.na], ['>', K.cy]]],
  [W3 => W3(3, 4), [['  <Animaciones ', K.cy], ['tipo', K.vi], ['=', K.gr], ['"caja"', K.na], [' />', K.cy]]],
  [W3 => W3(3, 6), [['  <Subtitulos ', K.cy], ['palabra', K.vi], ['=', K.gr], ['"auto"', K.na], [' />', K.cy]]],
  [W3 => W3(3, 9), [['  <Sonidos ', K.cy], ['pop whoosh ding', K.vi], [' />', K.cy]]],
  [W3 => W3(3, 10), [['</Escena>', K.cy]]],
]
const T3 = ({ t, W }) => {
  const cod = pr(t, 0.05, 0.5, outB)
  const snap = pr(t, W(3, 12) - 0.1, 0.5, outB), tl = pr(t, W(3, 11) - 0.2, 0.5, outB)
  const play = clamp((t - W(3, 11)) / (W(3, 15) + 0.9 - W(3, 11)))
  const lanes = [[K.cy, [60, 260, 520, 720], 130], [K.vi, [110, 380, 640], 150], [K.na, [170, 450, 600, 780], 60]]
  return (
    <>
      <Ven x={90} y={370} w={900} h={450} titulo="Escena.jsx" o={cod} s={0.9 + 0.1 * cod}>
        <div style={{ position: 'absolute', left: 34, top: 30, fontFamily: M, fontSize: 34, lineHeight: '58px', whiteSpace: 'pre' }}>
          {L.map(([f, segs], li) => {
            let n = Math.max(0, Math.floor((t - f(W)) * 38))
            return (<div key={li} style={{ height: 58 }}>{segs.map(([tx, c], si) => { const v = tx.slice(0, n); n = Math.max(0, n - tx.length); return <span key={si} style={{ color: c }}>{v}</span> })}</div>)
          })}
        </div>
      </Ven>
      <div style={{ position: 'absolute', left: 90, top: 860, width: 900, display: 'flex', justifyContent: 'space-between' }}>
        {[['Animaciones', K.cy, W(3, 4)], ['Subtítulos', K.vi, W(3, 6)], ['Sonidos', K.na, W(3, 9)]].map(([tx, c, t0], i) => { const q = pr(t, t0 - 0.05, 0.4, outB); return (<div key={i} style={{ opacity: clamp(q * 2), transform: `scale(${0.6 + 0.4 * q})` }}><Chip c={c} size={38} solid>{tx}</Chip></div>) })}
      </div>
      <Ven x={90} y={990} w={900} h={400} titulo="linea-de-tiempo" o={tl} s={0.9 + 0.1 * tl}>
        <div style={{ position: 'absolute', left: 40, top: 26, display: 'flex', alignItems: 'center', gap: 5, height: 50 }}>
          {Array.from({ length: 60 }, (_, i) => (<div key={i} style={{ width: 9, height: 8 + 40 * amp(i + 3), borderRadius: 4, background: '#3A475C' }} />))}
        </div>
        {lanes.map(([c, xs, w], li) => (
          <div key={li} style={{ position: 'absolute', left: 0, top: 100 + li * 54, width: 900, height: 40 }}>
            {xs.map((x, j) => (<div key={j} style={{ position: 'absolute', left: 40 + x * 0.92 + (1 - snap) * (((j * 71 + li * 37) % 90) - 45), top: 0, width: w * 0.9, height: 40, borderRadius: 8, background: c }} />))}
          </div>
        ))}
        <div style={{ position: 'absolute', left: 40 + play * 820, top: 10, width: 4, height: 240, background: K.tx, opacity: play > 0 && play < 1 ? 1 : 0 }} />
        <Abs x={40} y={282} o={pr(t, W(3, 12) + 0.2, 0.3)} s={0.6 + 0.4 * pr(t, W(3, 12) + 0.2, 0.4, outB)}><Chip c={K.vd} size={30}>✓ sincronizado con tu voz</Chip></Abs>
      </Ven>
    </>
  )
}

const Mini = ({ tipo }) => {
  const caja = { width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }
  if (tipo === 'perfume') return (<div style={{ ...caja, background: '#0B0A0D' }}><div style={{ position: 'absolute', left: 60, top: 70, width: 150, height: 150, borderRadius: 75, background: 'radial-gradient(circle, #D9B25F66, transparent 70%)' }} /><div style={{ position: 'absolute', left: 110, top: 140, width: 50, height: 120, borderRadius: 10, background: '#E0719A' }} /><div style={{ position: 'absolute', left: 120, top: 112, width: 30, height: 32, background: '#D9B25F', borderRadius: 4 }} /><div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: "'Didot', serif", fontSize: 30, color: '#D9B25F', letterSpacing: 3 }}>PERFUME</div></div>)
  if (tipo === 'bauhaus') return (<div style={{ ...caja, background: '#EFE6D2' }}><div style={{ position: 'absolute', left: 24, top: 40, width: 110, height: 110, background: '#1F4FB4' }} /><div style={{ position: 'absolute', left: 120, top: 120, width: 110, height: 110, borderRadius: 55, background: '#F2B21B' }} /><div style={{ position: 'absolute', left: 24, top: 260, width: 220, height: 34, background: '#E23B2E' }} /><div style={{ position: 'absolute', left: 24, top: 310, width: 150, height: 34, background: '#14141A' }} /></div>)
  if (tipo === 'mercado') return (<div style={{ ...caja, background: '#0A0E1A' }}><svg width="270" height="480" viewBox="0 0 270 480"><polyline points="10,420 80,360 130,380 190,240 262,110" fill="none" stroke="#F5C451" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" /></svg><div style={{ position: 'absolute', left: 24, top: 36, fontFamily: D, fontWeight: 700, fontSize: 40, color: '#F5C451' }}>$1M</div></div>)
  if (tipo === 'panel') return (<div style={{ ...caja, background: '#E4EAF5' }}><div style={{ position: 'absolute', left: 20, top: 50, width: 230, height: 120, borderRadius: 16, background: '#fff', border: '2px solid #DCE3F0' }} /><div style={{ position: 'absolute', left: 20, top: 200, width: 150, height: 150, borderRadius: 16, background: '#0866FF' }} /><div style={{ position: 'absolute', left: 150, top: 300, width: 0, height: 0, borderLeft: '24px solid #0F1729', borderTop: '16px solid transparent', borderBottom: '16px solid transparent', transform: 'rotate(-20deg)' }} /></div>)
  if (tipo === 'cinetico') return (<div style={{ ...caja, background: '#111' }}><div style={{ position: 'absolute', left: 24, top: 60, fontFamily: D, fontWeight: 700, fontSize: 68, lineHeight: 1.0, color: '#fff' }}>TEXTO<br /><span style={{ color: '#FF3D81' }}>EN</span><br />MOVI-<br />MIENTO</div></div>)
  return (<div style={{ ...caja, background: 'linear-gradient(160deg, #3B2A7A, #12102A)' }}>{[[50, 90], [200, 160], [90, 280], [210, 340]].map(([x, y], i) => (<div key={i} style={{ position: 'absolute', left: x, top: y, width: 44, height: 44, borderRadius: 22, background: i % 2 ? '#22D3EE' : '#A78BFA' }} />))}<svg width="270" height="480" style={{ position: 'absolute', inset: 0 }}><polyline points="72,112 222,182 112,302 232,362" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="4" /></svg></div>)
}
const T4 = ({ t, W }) => {
  const ds = ['perfume', 'bauhaus', 'mercado', 'panel', 'cinetico', 'nodos']
  const caja = pr(t, W(4, 10) - 0.1, 0.5, outB) * (1 - pr(t, W(4, 14), 0.4)), fig = pr(t, W(4, 15) - 0.1, 0.5, outB)
  return (
    <>
      {ds.map((d, i) => {
        const q = pr(t, 0.1 + i * 0.12, 0.55, outB)
        const r = d === 'perfume' ? caja : d === 'panel' ? fig : 0
        const col = d === 'perfume' ? '#D9B25F' : '#0866FF'
        return (
          <Abs key={d} x={80 + (i % 3) * 325} y={380 + Math.floor(i / 3) * 520 + (1 - q) * 120} o={clamp(q * 2)} s={(0.8 + 0.2 * q) * (1 + 0.1 * r)} style={{ width: 270, height: 480, borderRadius: 36, border: `5px solid ${r > 0 ? col : '#2A3446'}`, overflow: 'hidden', boxShadow: r > 0 ? `0 0 ${50 * r}px ${col}` : '0 18px 40px rgba(0,0,0,.5)', zIndex: r > 0 ? 5 : 1 }}>
            <Mini tipo={d} />
          </Abs>
        )
      })}
    </>
  )
}

const T5 = ({ t, W }) => {
  const term = pr(t, 0.05, 0.5, outB)
  const prog = pr(t, W(5, 8), W(5, 15) - W(5, 8) + 0.3, io3)
  const listo = pr(t, W(5, 15) - 0.1, 0.6, outB)
  const clic = pr(t, W(5, 17) - 0.05, 0.4)
  const logs = [['✓ voz alineada', W(5, 9)], ['✓ animaciones listas', W(5, 11)], ['✓ sonidos mezclados', W(5, 13)]]
  return (
    <>
      <Ven x={90} y={370} w={900} h={440} titulo="terminal" o={term} s={0.9 + 0.1 * term}>
        <Abs x={34} y={30}><Tx size={36} f={M} c={K.vd}>{tipea('$ node generar.js mi-video/', t, W(5, 1), 24)}</Tx></Abs>
        {logs.map(([tx, t0], i) => (<Abs key={i} x={34} y={96 + i * 50} o={pr(t, t0, 0.25)}><Tx size={32} f={M} c={K.tx}>{tx}</Tx></Abs>))}
        <div style={{ position: 'absolute', left: 34, top: 270, width: 830, height: 36, borderRadius: 18, background: '#1B2433', overflow: 'hidden' }}><div style={{ width: `${prog * 100}%`, height: '100%', background: `linear-gradient(90deg, ${K.cy}, ${K.vi})`, borderRadius: 18 }} /></div>
        <Abs x={34} y={320}><Tx size={30} f={M} c={K.gr}>render {Math.round(prog * 100)}%</Tx></Abs>
      </Ven>
      <Abs x={90} y={870 + (1 - listo) * 200} o={clamp(listo * 2)} s={0.92 + 0.08 * listo} style={{ width: 900, height: 450, borderRadius: 26, background: K.panel, border: `2px solid ${K.vd}` }}>
        <div style={{ position: 'absolute', left: 40, top: 40, width: 200, height: 360, borderRadius: 28, background: 'linear-gradient(160deg, #1B2A5C, #0B0F20)', border: '4px solid #2A3446', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 0, height: 0, borderLeft: `46px solid ${K.tx}`, borderTop: '28px solid transparent', borderBottom: '28px solid transparent' }} /></div>
        <Abs x={290} y={50}><Tx size={46} f={M}>video.mp4</Tx><Tx size={30} f={M} c={K.vd} style={{ marginTop: 10 }}>✓ 1080×1920 · listo</Tx></Abs>
        <Abs x={290} y={240} s={1 - 0.06 * clic}><div style={{ padding: '24px 40px', borderRadius: 24, background: 'linear-gradient(90deg, #F58529, #DD2A7B, #8134AF)', fontFamily: D, fontWeight: 700, fontSize: 42, color: '#fff', whiteSpace: 'nowrap', boxShadow: clic > 0 ? '0 0 50px #DD2A7B88' : 'none' }}>Subir a Reels</div></Abs>
      </Abs>
    </>
  )
}

const T6 = ({ t, W }) => {
  const rep = pr(t, 0.05, 0.5, outB)
  const arch = [['📁', 'remotion/', 0.5], ['📁', 'voz-propia/', 0.7], ['📄', 'generar.js', 0.9], ['📄', 'README.md', 1.1]]
  const gh = pr(t, W(6, 8) - 0.1, 0.5, outB)
  const badges = [['GRATIS', K.vd, W(6, 9)], ['ABIERTO', K.cy, W(6, 11)], ['ÚSALA', K.am, W(6, 15)]]
  return (
    <>
      <Ven x={90} y={370} w={900} h={640} titulo="repositorio · herramienta de videos con IA" o={rep} s={0.9 + 0.1 * rep}>
        <Abs x={34} y={30}><svg width="50" height="50" viewBox="-25 -25 50 50"><g stroke={K.tx} strokeWidth="4" fill="none"><circle cx="-10" cy="-14" r="6" /><circle cx="-10" cy="14" r="6" /><circle cx="12" cy="-6" r="6" /><path d="M-10 -8 V8 M-10 4 C-10 -4 12 4 12 0" /></g></svg></Abs>
        <Abs x={100} y={34}><Tx size={40} f={M}>mi-herramienta</Tx></Abs>
        <Abs x={660} y={30}><Chip c={K.vd} size={28}>PÚBLICO</Chip></Abs>
        {arch.map(([ic, nm, d], i) => { const q = pr(t, d, 0.3, outB); return (<Abs key={i} x={34 + (1 - q) * -80} y={130 + i * 90} o={q} style={{ width: 830, height: 70, borderRadius: 14, background: '#0D121A', border: `2px solid ${K.borde}`, display: 'flex', alignItems: 'center', paddingLeft: 24 }}><Tx size={38} f={M} c={K.tx}>{ic}&nbsp; {nm}</Tx></Abs>) })}
        <Abs x={34} y={500} o={pr(t, 1.6, 0.4)}><Tx size={32} f={M} c={K.gr}>Tu voz + Claude Code = videos</Tx></Abs>
      </Ven>
      <Abs x={0} y={1050} o={clamp(gh * 2)} s={0.6 + 0.4 * gh} style={{ width: 1080, textAlign: 'center' }}><Tx size={150} style={{ ...grad, letterSpacing: -4 }}>GitHub</Tx></Abs>
      <div style={{ position: 'absolute', left: 0, top: 1240, width: 1080, display: 'flex', justifyContent: 'center', gap: 20 }}>
        {badges.map(([tx, c, t0], i) => { const q = pr(t, t0 - 0.05, 0.4, outB); return (<div key={i} style={{ opacity: clamp(q * 2), transform: `scale(${0.5 + 0.5 * q})` }}><Chip c={c} size={38} solid>{tx}</Chip></div>) })}
      </div>
    </>
  )
}

const T7 = ({ t, W }) => {
  const a = pr(t, 0.05, 0.5, outB), pal = pr(t, W(7, 10) - 0.1, 0.5, outB)
  const com = pr(t, W(7, 7) - 0.1, 0.5, outB)
  const env = pr(t, W(7, 12) - 0.05, 0.3), resp = pr(t, W(7, 13) - 0.1, 0.5, outB)
  const escribe = tipea('GitHub', t, W(7, 10) + 0.2, 9)
  return (
    <>
      <Abs x={0} y={370} o={a} s={0.8 + 0.2 * a} style={{ width: 1080, textAlign: 'center' }}><Tx size={130} style={{ letterSpacing: -2 }}>COMENTA</Tx></Abs>
      <Abs x={0} y={520} o={clamp(pal * 2)} s={0.5 + 0.5 * pal} style={{ width: 1080, textAlign: 'center' }}><Tx size={220} f={M} style={{ ...grad, letterSpacing: -6 }}>GitHub</Tx></Abs>
      <Abs x={90} y={850} o={com} s={0.9 + 0.1 * com} style={{ width: 900, height: 150, borderRadius: 75, background: K.panel, border: `2px solid ${K.cy}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 24 }}>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: `linear-gradient(135deg, ${K.vi}, ${K.cy})`, flexShrink: 0 }} />
        <Tx size={50} f={M} w={500} style={{ flex: 1 }}>{escribe}<span style={{ opacity: Math.floor(t * 3) % 2, color: K.cy }}>|</span></Tx>
        <div style={{ width: 90, height: 90, borderRadius: 45, background: env > 0 ? K.vd : K.borde, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.15 * Math.sin(env * Math.PI)})` }}><svg width="46" height="46" viewBox="-20 -20 40 40"><path d="M-16 -2 L16 -16 L2 16 L-2 4 Z" fill={env > 0 ? '#06210F' : K.gr} /></svg></div>
      </Abs>
      <Abs x={90} y={1060 + (1 - resp) * 60} o={clamp(resp * 2)} s={0.9 + 0.1 * resp} style={{ width: 900, height: 200, borderRadius: 32, background: K.panel, border: `2px solid ${K.vd}`, display: 'flex', alignItems: 'center', padding: '0 30px', gap: 24 }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: `linear-gradient(135deg, ${K.cy}, ${K.vd})`, flexShrink: 0 }} />
        <div><Tx size={34} f={M} c={K.gr}>@nicopuerta_30</Tx><Tx size={46} style={{ marginTop: 8 }}>Te lo comparto 🔗</Tx></div>
      </Abs>
    </>
  )
}

const ESC = [T0, T1, T2, T3, T4, T5, T6, T7]
const PASOS = ['VOZ', 'TEXTO', 'CÓDIGO', 'RENDER', 'LISTO']
const LIT = [0, 1, 2, 3, 3, 4, 5, 5]

/* ───────────── fondo, persianas, subtítulos ───────────── */
const Fondo = ({ t }) => (
  <>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 900px 900px at 50% 35%, #12202E 0%, ${K.bg} 70%)` }} />
    <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${K.borde}55 2px, transparent 2px), linear-gradient(90deg, ${K.borde}55 2px, transparent 2px)`, backgroundSize: '90px 90px', backgroundPosition: `0px ${(t * 30) % 90}px`, opacity: 0.55 }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: ((t * 260) % 2200) - 150, height: 140, background: `linear-gradient(180deg, transparent, ${K.cy}14, transparent)` }} />
  </>
)
const Persianas = ({ t, gs }) => {
  const n = 12, h = 1920 / n
  const g = gs.find((g, i) => i > 0 && t >= g - 0.4 && t <= g + 0.4)
  if (g === undefined) return null
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const d = i * 0.014
        const en = clamp((t - (g - 0.4) - d) / 0.26), sa = clamp((t - g - 0.02 - d) / 0.26)
        const x = sa > 0 ? out3(sa) * 1080 : -1080 + out3(en) * 1080
        return <div key={i} style={{ position: 'absolute', left: x, top: i * h, width: 1080, height: h + 1, background: '#0C121B', borderBottom: `3px solid ${K.cy}`, zIndex: 25 }} />
      })}
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
    <div style={{ position: 'absolute', left: 40, right: 40, top: 1430, display: 'flex', justifyContent: 'center', opacity: q, transform: `translateY(${(1 - q) * 16}px)`, zIndex: 30 }}>
      <div style={{ textAlign: 'center', fontFamily: D, fontWeight: 700, fontSize: 56, lineHeight: 1.2, whiteSpace: 'nowrap', background: 'rgba(9,13,19,.92)', border: `2px solid ${K.cy}`, borderRadius: 24, padding: '12px 34px', boxShadow: `0 0 30px ${K.cy}33` }}>
        {z.p.map((p, i) => (<span key={i} style={{ display: 'inline-block', marginRight: 14, color: p.k ? K.cyC : K.tx, visibility: t >= p.t0 - 0.03 ? 'visible' : 'hidden' }}>{p.w}</span>))}
      </div>
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Estudio = ({ frases, grupos, marca, usuario }) => {
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
  const lit = LIT[Math.min(gi, LIT.length - 1)]
  const handle = usuario || marca
  return (
    <AbsoluteFill style={{ background: K.bg, overflow: 'hidden' }}>
      <Fondo t={t} />
      <Sc t={t} W={W} />
      <Persianas t={t} gs={gs} />
      <div style={{ position: 'absolute', left: 50, right: 50, top: 256, display: 'flex', justifyContent: 'space-between', zIndex: 30 }}>
        {PASOS.map((p, i) => (<div key={p} style={{ fontFamily: M, fontWeight: 700, fontSize: 22, padding: '8px 18px', borderRadius: 999, border: `2px solid ${i < lit ? K.cy : K.borde}`, background: i < lit ? `${K.cy}2E` : 'rgba(9,13,19,.8)', color: i < lit ? K.cyC : K.gr, boxShadow: i === lit - 1 ? `0 0 18px ${K.cy}` : 'none' }}>{i < lit ? '✓ ' : ''}{p}</div>))}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 322, textAlign: 'center', fontFamily: M, fontSize: 22, color: K.gr, zIndex: 30 }}>{handle}</div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: `${clamp(t / total) * 100}%`, height: 6, background: K.cy, zIndex: 40 }} />
      <Subs t={t} fr={frases} />
    </AbsoluteFill>
  )
}
