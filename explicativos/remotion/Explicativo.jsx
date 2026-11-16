import React from 'react'
import { AbsoluteFill, continueRender, delayRender, spring, staticFile, useCurrentFrame } from 'remotion'
import { momentos } from '../tiempos.js'

const FPS = 30
const C = { bg: '#0D0F14', panel: '#151820', panel2: '#1E222C', line: '#2C323F', text: '#F4F1EA', dim: '#4B5060', mute: '#8A90A0', orange: '#E8845C', orangeD: '#C96A44', violet: '#A18BFF', mint: '#6EE7B7', red: '#FF6B6B', yellow: '#FFC857', blue: '#6CB6FF' }
const TITULO = "'Poppins', 'Helvetica Neue', sans-serif"
const UI = "'Inter', 'Helvetica Neue', sans-serif"

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const out3 = (p) => 1 - Math.pow(1 - p, 3)
const io3 = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
// progreso 0→1 que arranca en el segundo t0 y dura dur segundos
const usePr = (t0, dur = 0.5, ease = out3) => ease(clamp((useCurrentFrame() - t0 * FPS) / (dur * FPS)))
// resorte suave (casi sin rebote) para elementos que "aparecen"
const useSp = (t0, damping = 20) => {
  const f = useCurrentFrame()
  return spring({ frame: Math.max(0, f - t0 * FPS), fps: FPS, config: { damping, stiffness: 160, mass: 0.8 } }) * (f >= t0 * FPS ? 1 : 0)
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

/* ───────────── personaje ───────────── */
const Claude = ({ x, y, s = 1, look = [0, 0], mood = 'ok', arms = 0, children }) => {
  const f = useCurrentFrame()
  const bob = Math.sin(f / 18) * 5
  const parpadeo = f % 110 > 104 ? 0.12 : 1
  const boca = { ok: 'M-22 22 Q0 36 22 22', sad: 'M-22 34 Q0 16 22 34', happy: 'M-26 16 Q0 52 26 16 Z' }[mood]
  const mano = (lado) => {
    const ex = lado * (112 + arms * 95)
    const ey = 10 - arms * 70
    return (
      <g key={lado}>
        <path d={`M${lado * 100} 5 Q${lado * (120 + arms * 40)} ${20 - arms * 20} ${ex} ${ey}`} stroke={C.orange} strokeWidth="30" strokeLinecap="round" fill="none" />
        <circle cx={ex} cy={ey} r="27" fill="#F2A27F" />
      </g>
    )
  }
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <ellipse cx="0" cy="92" rx="110" ry="16" fill="#000" opacity="0.28" transform={`translate(0 ${-bob * 0.9})`} />
      {arms > 0 && [-1, 1].map(mano)}
      <line x1="0" y1="-128" x2="0" y2="-172" stroke={C.orange} strokeWidth="9" strokeLinecap="round" />
      <circle cx="0" cy="-184" r="14" fill={C.yellow} />
      <ellipse cx="-48" cy="76" rx="38" ry="20" fill={C.orangeD} />
      <ellipse cx="48" cy="76" rx="38" ry="20" fill={C.orangeD} />
      <rect x="-112" y="-130" width="224" height="204" rx="72" fill={C.orange} />
      <rect x="-92" y="-114" width="184" height="54" rx="27" fill="#fff" opacity="0.13" />
      {[-44, 44].map((ex) => (
        <g key={ex}>
          <ellipse cx={ex} cy="-40" rx="25" ry={27 * parpadeo} fill="#fff" />
          <circle cx={ex + look[0]} cy={-40 + look[1] * parpadeo} r="12" fill="#2A1A12" />
        </g>
      ))}
      <path d={boca} stroke="#2A1A12" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill={mood === 'happy' ? '#2A1A12' : 'none'} />
      {children}
    </g>
  )
}

/* ───────────── íconos y tarjetas ───────────── */
const Icono = ({ tipo, c = C.text }) => {
  const p = { stroke: c, strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
  switch (tipo) {
    case 'calendario':
      return (
        <g {...p}>
          <rect x="-46" y="-40" width="92" height="86" rx="14" />
          <line x1="-46" y1="-12" x2="46" y2="-12" />
          <line x1="-22" y1="-54" x2="-22" y2="-30" />
          <line x1="22" y1="-54" x2="22" y2="-30" />
          <circle cx="-20" cy="14" r="3" fill={c} />
          <circle cx="4" cy="14" r="3" fill={c} />
          <circle cx="-20" cy="32" r="3" fill={c} />
        </g>
      )
    case 'carpeta':
      return <path {...p} d="M-50 -30 h34 l14 14 h52 v66 h-100 z" />
    case 'chat':
      return (
        <g {...p}>
          <path d="M-48 -38 h96 v64 h-52 l-24 22 v-22 h-20 z" />
          <circle cx="-20" cy="-6" r="3" fill={c} />
          <circle cx="0" cy="-6" r="3" fill={c} />
          <circle cx="20" cy="-6" r="3" fill={c} />
        </g>
      )
    case 'codigo':
      return (
        <g {...p}>
          <polyline points="-22,-30 -52,0 -22,30" />
          <polyline points="22,-30 52,0 22,30" />
          <line x1="8" y1="-38" x2="-8" y2="38" />
        </g>
      )
    case 'correo':
      return (
        <g {...p}>
          <rect x="-50" y="-34" width="100" height="70" rx="12" />
          <polyline points="-50,-30 0,8 50,-30" />
        </g>
      )
    case 'engranaje':
      return (
        <g {...p}>
          <circle r="18" />
          <circle r="38" />
          {[0, 45, 90, 135].map((a) => (
            <line key={a} x1="0" y1="-38" x2="0" y2="-52" transform={`rotate(${a})`} />
          ))}
          {[180, 225, 270, 315].map((a) => (
            <line key={a} x1="0" y1="-38" x2="0" y2="-52" transform={`rotate(${a})`} />
          ))}
        </g>
      )
    default:
      return null
  }
}

const Tarjeta = ({ x, y, w = 210, h = 190, tipo, etiqueta, color = C.text, s = 1, o = 1, borde = C.line, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="38" fill={C.panel2} stroke={borde} strokeWidth="3" />
    <g transform={`translate(0 ${-h * 0.1})`}>
      <Icono tipo={tipo} c={color} />
    </g>
    <text y={h / 2 - 26} textAnchor="middle" fontFamily={UI} fontWeight="600" fontSize="29" fill={C.text}>
      {etiqueta}
    </text>
    {children}
  </g>
)

const Insignia = ({ x, y, tipo, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {tipo === 'x' ? (
      <>
        <circle r="26" fill={C.red} />
        <path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      </>
    ) : (
      <>
        <path d="M0 -28 L28 22 L-28 22 Z" fill={C.yellow} stroke={C.yellow} strokeWidth="8" strokeLinejoin="round" />
        <path d="M0 -8 V8" stroke="#2A1A12" strokeWidth="6" strokeLinecap="round" />
        <circle cy="16" r="3.2" fill="#2A1A12" />
      </>
    )}
  </g>
)

/* ───────────── marco de cada escena ───────────── */
const Esc = ({ ini, fin, children }) => {
  const f = useCurrentFrame()
  if (f < ini - 2 || f > fin + 2) return null
  const a = clamp((f - ini) / 10)
  const b = clamp((fin - f) / 8)
  return (
    <AbsoluteFill style={{ opacity: Math.min(out3(a), b), transform: `translateY(${(1 - out3(a)) * 36}px)` }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920">
        {children}
      </svg>
    </AbsoluteFill>
  )
}

/* ───────────── 1 · la sala ───────────── */
const Sala = ({ m, fr }) => (
  <g transform="translate(540 960) scale(1.1) translate(-540 -950)">
    <SalaInterior m={m} fr={fr} />
  </g>
)
const SalaInterior = ({ m, fr }) => {
  const f = useCurrentFrame()
  const dibuja = usePr(fr[0].ini - 0.1, 0.9)
  const cerr = useSp(m.sala.cerrojo)
  const mira = fr[1].ini
  const look = f < mira * FPS ? [Math.sin(f / 30) * 7, Math.cos(f / 41) * 3] : [10, 0]
  const tri = f >= mira * FPS
  return (
    <>
      <rect x="70" y="640" width="560" height="620" rx="40" fill={C.panel} opacity={dibuja} />
      <rect x="70" y="640" width="560" height="620" rx="40" fill="none" stroke={C.line} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - dibuja} />
      <rect x="70" y="1150" width="560" height="110" rx="0" fill="#11141A" opacity={dibuja} clipPath="inset(0 round 0 0 40px 40px)" />
      <line x1="70" y1="1150" x2="630" y2="1150" stroke={C.line} strokeWidth="4" opacity={dibuja} />
      <g opacity={dibuja} transform="translate(180 770)">
        <rect x="-50" y="-50" width="100" height="100" rx="14" fill="#0B0D12" stroke={C.line} strokeWidth="5" />
        <circle cx="12" cy="-6" r="22" fill={C.yellow} opacity="0.9" />
        <circle cx="24" cy="-12" r="20" fill="#0B0D12" />
        <line x1="0" y1="-50" x2="0" y2="50" stroke={C.line} strokeWidth="4" />
      </g>
      <rect x="616" y="640" width="28" height="620" rx="8" fill={C.blue} opacity={0.16 * dibuja} stroke={C.blue} strokeWidth="3" />
      <Claude x={340} y={1058} s={0.95} look={look} mood={tri ? 'sad' : 'ok'} />
      <g transform={`translate(630 950) scale(${cerr})`} opacity={clamp(cerr * 3)}>
        <path d="M-22 -26 v-24 a22 22 0 0 1 44 0 v24" fill="none" stroke={C.yellow} strokeWidth="9" strokeLinecap="round" />
        <rect x="-38" y="-28" width="76" height="62" rx="14" fill={C.yellow} />
        <circle cy="0" r="8" fill="#2A1A12" />
        <rect x="-3" y="2" width="6" height="18" rx="3" fill="#2A1A12" />
      </g>
      {[
        ['calendario', 'Calendario', 740],
        ['carpeta', 'Archivos', 990],
        ['engranaje', 'Herramientas', 1240],
      ].map(([tipo, et, y], i) => (
        <Card key={tipo} i={i} tipo={tipo} et={et} y={y} m={m} />
      ))}
    </>
  )
}
const Card = ({ i, tipo, et, y, m }) => {
  const s = useSp(m.sala.tarjetas[i], 22)
  const x = useSp(m.sala.cruces[i], 14)
  return (
    <Tarjeta x={860} y={y} tipo={tipo} etiqueta={et} s={0.6 + 0.4 * s} o={clamp(s * 2)} borde={x > 0.05 ? C.red : C.line} color={C.text}>
      <g transform={`translate(96 -84) scale(${x})`}>
        <Insignia tipo="x" />
      </g>
    </Tarjeta>
  )
}

/* ───────────── 2 · cables a la medida ───────────── */
const COL = [C.orange, C.violet, C.mint, C.yellow]
const YS = [680, 900, 1120, 1340]
const Cables = ({ m, fr }) => {
  const f = useCurrentFrame()
  const e = usePr(m.cables.enredo, 2.2, io3)
  const triste = e > 0.3
  const cable = (i, extra = false) => {
    const A = 130 * e
    const y0 = extra ? 900 + (i - 1.5) * 40 : 960
    const yd = extra ? YS[(i + 2) % 4] : YS[i]
    const c1 = `${430 + Math.sin(f / 10 + i * 1.7) * A * 0.6} ${y0 + Math.cos(f / 13 + i) * A}`
    const c2 = `${630 + Math.cos(f / 11 + i * 2.1) * A * 0.6} ${yd + Math.sin(f / 9 + i * 0.9) * A}`
    return `M335 ${y0} C${c1}, ${c2}, 752 ${yd}`
  }
  const plug = (i, x, y, c, k) => {
    const p = { fill: c }
    if (i === 0) return <circle cx={x} cy={y} r="17" {...p} />
    if (i === 1) return <rect x={x - 16} y={y - 16} width="32" height="32" rx="6" {...p} />
    if (i === 2) return <path d={`M${x - 18} ${y + 16} L${x} ${y - 18} L${x + 18} ${y + 16} Z`} {...p} />
    return <path d={`M${x - 20} ${y} L${x - 10} ${y - 18} L${x + 10} ${y - 18} L${x + 20} ${y} L${x + 10} ${y + 18} L${x - 10} ${y + 18} Z`} {...p} />
  }
  return (
    <>
      <Claude x={200} y={960} s={0.92} look={[14, 0]} mood={triste ? 'sad' : 'ok'} />
      {[0, 1, 2, 3].map((i) => (
        <CableItem key={i} i={i} m={m} d={cable(i)} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <path key={`x${i}`} d={cable(i, true)} stroke={COL[(i + 1) % 4]} strokeWidth="7" strokeLinecap="round" fill="none" opacity={0.75 * e} />
      ))}
      {[
        ['calendario', 'Calendario'],
        ['carpeta', 'Archivos'],
        ['chat', 'Mensajes'],
        ['codigo', 'Código'],
      ].map(([tipo, et], i) => (
        <Tarjeta key={tipo} x={880} y={YS[i]} w={190} h={170} tipo={tipo} etiqueta={et} s={0.8 + 0.2 * Math.min(1, useSp(m.cables.cable[i] - 0.1))} />
      ))}
      {[0, 1, 2].map((i) => (
        <AvisoItem key={i} t={m.cables.aviso[i]} y={YS[i + 1] - 78} />
      ))}
    </>
  )
}
const CableItem = ({ i, m, d }) => {
  const p = usePr(m.cables.cable[i], 0.5)
  const q = useSp(m.cables.cable[i] + 0.4)
  const c = COL[i]
  const forma = [
    <circle key="a" cx="752" cy={YS[i]} r="17" fill={c} />,
    <rect key="b" x="736" y={YS[i] - 16} width="32" height="32" rx="6" fill={c} />,
    <path key="c" d={`M734 ${YS[i] + 16} L752 ${YS[i] - 18} L770 ${YS[i] + 16} Z`} fill={c} />,
    <path key="d" d={`M732 ${YS[i]} L742 ${YS[i] - 18} L762 ${YS[i] - 18} L772 ${YS[i]} L762 ${YS[i] + 18} L742 ${YS[i] + 18} Z`} fill={c} />,
  ][i]
  return (
    <>
      <path d={d} stroke={c} strokeWidth="9" strokeLinecap="round" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
      <g opacity={clamp(q * 2)} transform={`translate(752 ${YS[i]}) scale(${0.4 + 0.6 * q}) translate(-752 ${-YS[i]})`}>{forma}</g>
    </>
  )
}
const AvisoItem = ({ t, y }) => {
  const s = useSp(t, 14)
  return <Insignia tipo="aviso" x={960} y={y} s={s} />
}

/* ───────────── 3 · MCP ───────────── */
const Mcp = ({ m, fr }) => {
  const f = useCurrentFrame()
  const tl = m.mcp.titulo
  const palabras = fr[5].palabras.slice(0, 3)
  const ench = m.mcp.enchufe
  const desliza = usePr(ench - 0.55, 0.65, io3)
  const conecta = useSp(ench + 0.1, 12)
  const brillo = usePr(ench + 0.1, 0.8)
  const subr = usePr(tl + 0.45, 0.6)
  const aparece = useSp(fr[5].ini + 0.7)
  return (
    <>
      {['M', 'C', 'P'].map((ch, i) => (
        <Letra key={ch} ch={ch} i={i} t={tl} />
      ))}
      <line x1="230" y1="1020" x2={230 + 620 * subr} y2="1020" stroke={C.orange} strokeWidth="12" strokeLinecap="round" opacity={subr > 0.01 ? 1 : 0} />
      <text x="540" y="1110" textAnchor="middle" fontFamily={UI} fontWeight="600" fontSize="44" letterSpacing="5">
        {palabras.map((p, i) => (
          <Pal key={i} t={p.t0} txt={p.w.replace(':', '') + ' '} />
        ))}
      </text>
      <g opacity={aparece}>
        <text x="260" y="1470" textAnchor="middle" fontFamily={UI} fontWeight="600" fontSize="34" fill={C.mute}>
          Inteligencia artificial
        </text>
        <text x="790" y="1470" textAnchor="middle" fontFamily={UI} fontWeight="600" fontSize="34" fill={C.mute}>
          Tus herramientas
        </text>
        <g transform={`translate(${150 + desliza * 450} 1350)`}>
          <rect x="-110" y="-46" width="220" height="92" rx="46" fill={C.orange} />
          <rect x="-12" y="-17" width="104" height="34" rx="17" fill="#2A1A12" />
        </g>
        <g transform="translate(770 1350)">
          <rect x="-125" y="-52" width="250" height="104" rx="52" fill="none" stroke={C.violet} strokeWidth="8" />
          <rect x="-86" y="-20" width="172" height="40" rx="20" fill={C.violet} opacity="0.35" />
        </g>
        <g opacity={clamp(brillo * 2) * (1 - brillo)} transform="translate(655 1350)">
          <circle r={40 + 150 * brillo} fill="none" stroke={C.mint} strokeWidth="6" />
        </g>
        <g opacity={conecta > 0.05 ? 1 : 0} transform="translate(655 1350)">
          {[-40, -15, 15, 40].map((a) => (
            <line key={a} x1="0" y1={-70} x2="0" y2={-70 - 26 * conecta} stroke={C.mint} strokeWidth="6" strokeLinecap="round" transform={`rotate(${a})`} />
          ))}
        </g>
      </g>
    </>
  )
}
const Letra = ({ ch, i, t }) => {
  const s = useSp(t + i * 0.09, 18)
  const f = useCurrentFrame()
  const blur = (1 - clamp(s)) * 18
  return (
    <text x={[145, 450, 705][i]} y="960" textAnchor="start" fontFamily={TITULO} fontWeight="700" fontSize="330" fill={[C.orange, C.text, C.violet][i]} opacity={clamp(s * 1.6)} style={{ filter: `blur(${blur}px)` }} transform={`translate(0 ${(1 - clamp(s)) * 50})`}>
      {ch}
    </text>
  )
}
const Pal = ({ t, txt }) => {
  const s = usePr(t - 0.05, 0.35)
  return (
    <tspan fill={C.text} opacity={s} dy={(1 - s) * 10}>
      {txt}
    </tspan>
  )
}

/* ───────────── 4 · el enchufe único ───────────── */
const Hub = ({ m, fr }) => {
  const f = useCurrentFrame()
  const entra = usePr(fr[6].ini + 0.1, 0.5)
  const burb = m.hub.burbuja
  const caps = ['leer eventos', 'crear eventos', 'mover reuniones']
  return (
    <>
      <Claude x={190} y={960} s={0.85} look={[12, 0]} mood="happy" />
      <line x1="300" y1="960" x2={300 + 108 * entra} y2="960" stroke={C.mint} strokeWidth="12" strokeLinecap="round" />
      <g transform="translate(480 960)" opacity={entra}>
        <rect x="-82" y="-150" width="164" height="300" rx="44" fill={C.panel2} stroke={C.violet} strokeWidth="6" />
        <text y="12" textAnchor="middle" fontFamily={TITULO} fontWeight="700" fontSize="48" fill={C.text}>
          MCP
        </text>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx="82" cy={(i - 1.5) * 64} r="9" fill={C.violet} />
        ))}
      </g>
      {[
        ['calendario', 'Calendario'],
        ['carpeta', 'Archivos'],
        ['chat', 'Mensajes'],
        ['codigo', 'Código'],
      ].map(([tipo, et], i) => (
        <HubItem key={tipo} i={i} tipo={tipo} et={et} m={m} />
      ))}
      <g opacity={usePr(burb, 0.4)} transform={`translate(0 ${(1 - usePr(burb, 0.4)) * 30})`}>
        <rect x="120" y="1500" width="840" height="250" rx="44" fill={C.panel2} stroke={C.violet} strokeWidth="4" />
        <text x="160" y="1566" fontFamily={UI} fontWeight="600" fontSize="34" fill={C.mute}>
          El servidor de Calendario le dice a Claude:
        </text>
        {caps.map((c, i) => (
          <Cap key={c} t={burb + 0.35 + i * 0.3} txt={c} x={160 + [0, 235, 490][i]} />
        ))}
      </g>
    </>
  )
}
const HubItem = ({ i, tipo, et, m }) => {
  const t = m.hub.conexion[i]
  const p = usePr(t, 0.4)
  const s = useSp(t + 0.3, 14)
  const pulso = usePr(t + 0.3, 0.7)
  const py = 960 + (i - 1.5) * 64
  const lb = useSp(m.hub.etiquetas[i], 20)
  const y = YS[i]
  return (
    <>
      <path d={`M562 ${py} H640 V${y} H770`} stroke={C.mint} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} />
      <g opacity={(1 - pulso) * clamp(pulso * 8) * 0.8} transform={`translate(770 ${y})`}>
        <circle r={14 + 46 * pulso} fill="none" stroke={C.mint} strokeWidth="5" />
      </g>
      <Tarjeta x={880} y={y} w={190} h={170} tipo={tipo} etiqueta={et} borde={s > 0.2 ? C.mint : C.line} />
      <g opacity={clamp(lb * 2)} transform={`translate(880 ${y + 118}) scale(${0.8 + 0.2 * lb})`}>
        <rect x="-92" y="-22" width="184" height="44" rx="22" fill={C.violet} opacity="0.22" />
        <text y="8" textAnchor="middle" fontFamily={UI} fontWeight="600" fontSize="22" fill={C.violet}>
          servidor MCP
        </text>
      </g>
    </>
  )
}
const Cap = ({ t, txt, x }) => {
  const s = useSp(t, 20)
  return (
    <g opacity={clamp(s * 2)} transform={`translate(${x} ${1640}) scale(${0.85 + 0.15 * s})`}>
      <rect x="0" y="-38" width={txt.length * 15 + 40} height="66" rx="35" fill={C.violet} opacity="0.2" />
      <text x="20" y="9" fontFamily={UI} fontWeight="600" fontSize="26" fill={C.text}>
        {txt}
      </text>
    </g>
  )
}

/* ───────────── 5 · "mueve mi reunión" ───────────── */
const Chat = ({ m, fr }) => {
  const f = useCurrentFrame()
  const panel = usePr(fr[8].ini - 0.05, 0.5)
  const msg = ['Mueve mi reunión', 'de las 3 a las 4']
  const total = msg.join(' ').length
  const tp = clamp((f / FPS - m.chat.escribe) / Math.max(0.5, m.chat.respuesta - m.chat.escribe - 0.3))
  const n = Math.floor(tp * total)
  const l1 = msg[0].slice(0, n)
  const l2 = msg[1].slice(0, Math.max(0, n - msg[0].length - 1))
  const user = useSp(m.chat.escribe - 0.05, 22)
  const pensando = f / FPS > m.chat.respuesta - 0.7 && f / FPS < m.chat.respuesta
  const resp = useSp(m.chat.respuesta, 22)
  const mover = usePr(m.chat.mover, 0.8, io3)
  const chk = useSp(m.chat.check, 12)
  const ey = 1190 + mover * 100
  return (
    <>
      <g opacity={panel} transform={`translate(0 ${(1 - panel) * 40})`}>
        <rect x="110" y="520" width="860" height="1120" rx="60" fill={C.panel} stroke={C.line} strokeWidth="4" />
        <circle cx="190" cy="600" r="24" fill={C.orange} />
        <text x="232" y="613" fontFamily={UI} fontWeight="600" fontSize="36" fill={C.text}>
          Claude
        </text>
        <line x1="110" y1="650" x2="970" y2="650" stroke={C.line} strokeWidth="3" />
      </g>
      <g opacity={clamp(user * 2)} transform={`translate(${(1 - user) * 40} 0)`}>
        <rect x="360" y="690" width="570" height="170" rx="40" fill={C.text} />
        <text x="400" y="765" fontFamily={UI} fontWeight="600" fontSize="42" fill="#1A1510">
          {l1}
        </text>
        <text x="400" y="823" fontFamily={UI} fontWeight="600" fontSize="42" fill="#1A1510">
          {l2}
        </text>
      </g>
      {pensando && (
        <g transform="translate(150 900)">
          <rect width="190" height="80" rx="40" fill={C.panel2} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={52 + i * 43} cy={40 - Math.abs(Math.sin(f / 5 + i)) * 10} r="9" fill={C.mute} />
          ))}
        </g>
      )}
      <g opacity={clamp(resp * 2)} transform={`translate(150 ${900 + (1 - resp) * 20})`}>
        <rect width="650" height="100" rx="42" fill={C.panel2} />
        <text x="40" y="65" fontFamily={UI} fontWeight="600" fontSize="38" fill={C.text}>
          Listo, ya la moví a las 4:00
        </text>
        <g transform={`translate(590 50) scale(${chk})`} opacity={clamp(chk * 3)}>
          <circle r="26" fill={C.mint} />
          <path d="M-11 0 L-3 9 L12 -9" stroke="#0B2A1F" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <g opacity={clamp(resp * 2)}>
        <rect x="160" y="1050" width="760" height="520" rx="40" fill={C.panel2} />
        {['2 p. m.', '3 p. m.', '4 p. m.', '5 p. m.'].map((h, i) => (
          <g key={h}>
            <text x="200" y={1130 + i * 100} fontFamily={UI} fontWeight="500" fontSize="28" fill={C.mute}>
              {h}
            </text>
            <line x1="330" y1={1116 + i * 100} x2="890" y2={1116 + i * 100} stroke={C.line} strokeWidth="3" />
          </g>
        ))}
        <rect x="350" y={ey - 14} width="500" height="84" rx="20" fill={C.orange} />
        <text x="384" y={ey + 40} fontFamily={UI} fontWeight="600" fontSize="36" fill="#2A1A12">
          Reunión
        </text>
      </g>
    </>
  )
}

/* ───────────── 6 · permisos ───────────── */
const Permisos = ({ m, fr }) => {
  const f = useCurrentFrame()
  const panel = usePr(fr[9].ini - 0.05, 0.5)
  const apaga = usePr(m.permisos.apaga, 0.25)
  const cur = usePr(m.permisos.cursor, Math.max(0.3, m.permisos.apaga - m.permisos.cursor), io3)
  const filas = [
    ['calendario', 'Calendario'],
    ['carpeta', 'Archivos'],
    ['correo', 'Correo'],
  ]
  const nota = usePr(m.permisos.apaga + 0.3, 0.5)
  return (
    <>
      <g opacity={panel} transform={`translate(0 ${(1 - panel) * 40})`}>
        <rect x="120" y="560" width="840" height="900" rx="56" fill={C.panel} stroke={C.line} strokeWidth="4" />
        <g transform="translate(220 680)">
          <path d="M0 -40 L38 -26 V8 C38 30 20 44 0 52 C-20 44 -38 30 -38 8 V-26 Z" fill="none" stroke={C.mint} strokeWidth="7" strokeLinejoin="round" />
          <path d="M-14 6 L-4 16 L16 -8" fill="none" stroke={C.mint} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <text x="290" y="696" fontFamily={TITULO} fontWeight="700" fontSize="46" fill={C.text}>
          Permisos de Claude
        </text>
        <line x1="120" y1="770" x2="960" y2="770" stroke={C.line} strokeWidth="3" />
      </g>
      {filas.map(([tipo, et], i) => (
        <Fila key={tipo} i={i} tipo={tipo} et={et} m={m} apaga={i === 2 ? apaga : 0} />
      ))}
      <g transform={`translate(${860 - (1 - cur) * 120} ${1240 - cur * 150 - (cur > 0 ? 0 : 0)})`} opacity={clamp(cur * 4)}>
        <path d="M0 0 L0 62 L16 48 L28 76 L42 70 L30 42 L52 40 Z" fill={C.text} stroke="#111" strokeWidth="4" strokeLinejoin="round" />
      </g>
      <text x="540" y="1560" textAnchor="middle" fontFamily={UI} fontWeight="600" fontSize="38" fill={C.mute} opacity={nota}>
        Tú tienes el control
      </text>
    </>
  )
}
const Fila = ({ i, tipo, et, m, apaga }) => {
  const s = useSp(m.permisos.filas[i], 22)
  const y = 900 + i * 160
  const on = 1 - apaga
  return (
    <g opacity={clamp(s * 2) * (0.55 + 0.45 * on)} transform={`translate(${(1 - s) * 60} 0)`}>
      <rect x="170" y={y - 56} width="740" height="112" rx="34" fill={C.panel2} />
      <g transform={`translate(250 ${y}) scale(0.62)`}>
        <Icono tipo={tipo} c={C.text} />
      </g>
      <text x="330" y={y + 13} fontFamily={UI} fontWeight="600" fontSize="38" fill={C.text}>
        {et}
      </text>
      <g transform={`translate(780 ${y})`}>
        <rect x="-62" y="-34" width="124" height="68" rx="34" fill={apaga > 0.5 ? '#3A3F4D' : C.mint} />
        <circle cx={-28 + 56 * on} cy="0" r="26" fill="#fff" />
      </g>
      {apaga > 0.5 && (
        <g transform={`translate(666 ${y}) scale(${apaga})`}>
          <Insignia tipo="x" s={0.9} />
        </g>
      )}
    </g>
  )
}

/* ───────────── 7 · las manos de Claude + cierre ───────────── */
const Cierre = ({ m, fr, marca }) => {
  const f = useCurrentFrame()
  const manos = usePr(m.cierre.manos, 0.7, io3)
  const items = useSp(m.cierre.manos + 0.5)
  const cta = usePr(m.cierre.cta - 0.05, 0.7, io3)
  const sube = io3(cta)
  const cy = 980 - sube * 110
  const sc = 1.35 - sube * 0.45
  const etq = useSp(m.cierre.manos - 0.6, 20)
  return (
    <>
      <Claude x={540} y={cy} s={sc} look={[0, -4]} mood="happy" arms={manos}>
        <g transform={`translate(${-100 - manos * 110 - 0} ${10 - manos * 70}) scale(${items})`} opacity={clamp(items * 2)}>
          <g transform="translate(0 -70) scale(0.9)">
            <Icono tipo="calendario" c={C.text} />
          </g>
        </g>
        <g transform={`translate(${100 + manos * 110} ${10 - manos * 70}) scale(${items})`} opacity={clamp(items * 2)}>
          <g transform="translate(0 -70) scale(0.9)">
            <Icono tipo="carpeta" c={C.text} />
          </g>
        </g>
      </Claude>
      <g opacity={clamp(etq * 2) * (1 - sube)} transform={`translate(540 ${cy - 330 * sc}) scale(${0.8 + 0.2 * etq})`}>
        <rect x="-118" y="-44" width="236" height="88" rx="44" fill={C.violet} />
        <text y="16" textAnchor="middle" fontFamily={TITULO} fontWeight="700" fontSize="50" fill="#1B1330">
          MCP
        </text>
      </g>
      <g opacity={cta} transform={`translate(0 ${(1 - cta) * 50})`}>
        <rect x="150" y="1180" width="780" height="360" rx="56" fill={C.panel2} stroke={C.line} strokeWidth="4" />
        <text x="540" y="1306" textAnchor="middle" fontFamily={TITULO} fontWeight="700" fontSize="74" fill={C.text}>
          {marca}
        </text>
        <text x="540" y="1370" textAnchor="middle" fontFamily={UI} fontWeight="500" fontSize="36" fill={C.mute}>
          Claude explicado, paso a paso
        </text>
        <rect x="360" y="1415" width="360" height="82" rx="41" fill={C.orange} />
        <text x="540" y="1470" textAnchor="middle" fontFamily={TITULO} fontWeight="700" fontSize="40" fill="#2A1A12">
          Sígueme
        </text>
      </g>
    </>
  )
}

/* ───────────── subtítulos arriba, con la palabra clave resaltada ───────────── */
function trozos(palabras) {
  if (palabras.length <= 6) return [palabras]
  let mejor = Math.ceil(palabras.length / 2)
  let pun = -1
  for (let i = 3; i <= palabras.length - 3; i++) if (/[,:]$/.test(palabras[i - 1].w) && Math.abs(i - palabras.length / 2) < Math.abs(mejor - palabras.length / 2)) (mejor = i), (pun = i)
  return [palabras.slice(0, mejor), palabras.slice(mejor)].flatMap((t) => (t.length > 6 ? trozos(t) : [t]))
}
const Subtitulos = ({ frases }) => {
  const f = useCurrentFrame()
  const t = f / FPS
  let activo = null
  frases.forEach((fr, i) => {
    const ts = trozos(fr.palabras)
    ts.forEach((tr, j) => {
      const ini = tr[0].t0
      const fin = j + 1 < ts.length ? ts[j + 1][0].t0 : fr.fin + 0.4
      if (t >= ini - 0.02 && t < fin) activo = { tr, ini }
    })
  })
  if (!activo) return null
  const a = out3(clamp((t - activo.ini) * FPS / 6))
  return (
    <div style={{ position: 'absolute', top: 175, left: 70, right: 70, textAlign: 'center', fontFamily: TITULO, fontWeight: 700, fontSize: 68, lineHeight: 1.22, opacity: a, transform: `translateY(${(1 - a) * 16}px)` }}>
      {activo.tr.map((p, i) => {
        const dicha = t >= p.t0 - 0.02
        const pop = p.k ? spring({ frame: Math.max(0, f - p.t0 * FPS), fps: FPS, config: { damping: 16, stiffness: 200, mass: 0.7 } }) : 1
        return (
          <span key={i} style={{ display: 'inline-block', margin: '0 0.13em', padding: p.k && dicha ? '0 0.22em' : '0', borderRadius: 18, background: p.k && dicha ? C.orange : 'transparent', color: p.k && dicha ? '#1B1208' : dicha ? C.text : C.dim, transform: p.k && dicha ? `scale(${0.88 + 0.12 * pop})` : 'none' }}>
            {p.w}
          </span>
        )
      })}
    </div>
  )
}

/* ───────────── composición ───────────── */
export const Explicativo = ({ frases, grupos, marca }) => {
  useFuentes()
  if (!frases.length) return <AbsoluteFill style={{ background: C.bg }} />
  const m = momentos(frases)
  const total = frases.at(-1).fin + 2.2
  const escenas = { sala: Sala, cables: Cables, mcp: Mcp, hub: Hub, chat: Chat, permisos: Permisos, cierre: Cierre }
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 0%, #1A1F2B 0%, ${C.bg} 62%)` }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(#ffffff0d 2px, transparent 2px)', backgroundSize: '54px 54px' }} />
      <div style={{ position: 'absolute', top: 88, width: '100%', textAlign: 'center', fontFamily: UI, fontWeight: 600, fontSize: 24, letterSpacing: 6, color: C.dim }}>APRENDE CLAUDE · MCP EXPLICADO</div>
      {grupos.map((g, gi) => {
        const E = escenas[g.escena]
        const ini = Math.round((frases[g.ids[0]].ini - 0.2) * FPS)
        const fin = gi + 1 < grupos.length ? Math.round((frases[grupos[gi + 1].ids[0]].ini - 0.2) * FPS) + 6 : Math.round(total * FPS)
        return (
          <Esc key={gi} ini={ini} fin={fin}>
            <E m={m} fr={frases} marca={marca} />
          </Esc>
        )
      })}
      <Subtitulos frases={frases} />
    </AbsoluteFill>
  )
}
