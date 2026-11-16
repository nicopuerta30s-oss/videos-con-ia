// Escenas del video «Chat vs Cowork vs Claude Code» (diseño pro, paleta morada).
import React from 'react'
import { Caja, Cierre, Check, Cursor, Ic, Mascota, P, Pastilla, Pos, Sello, T, Txt, U, clamp, io3, kf, out3, outB, pop, pr } from './Pro.jsx'

const MONO = "'SF Mono', Menlo, monospace"

const Insignia = ({ x, y, texto, o = 1, s = 1, c = P.or }) => (
  <Pos x={x} y={y} o={o} s={s} style={{ transformOrigin: '0 0' }}>
    <div style={{ background: c, color: '#fff', borderRadius: 50, padding: '12px 34px', fontFamily: T, fontWeight: 700, fontSize: 40, letterSpacing: 1, whiteSpace: 'nowrap', boxShadow: '0 14px 30px rgba(90,60,220,.32)' }}>{texto}</div>
  </Pos>
)

// 0 · los tres, mismo Claude
const M0 = ({ t, W }) => {
  const filas = [
    { n: 'Chat', ic: 'chat', t0: W(0, 0) },
    { n: 'Cowork', ic: 'carpeta', t0: W(0, 1) },
    { n: 'Claude Code', ic: 'codigo', t0: W(0, 3) },
  ]
  const tTres = W(0, 8)
  const tNo = W(0, 10)
  const dif = pop(t, tNo)
  return (
    <>
      {filas.map((f, i) => {
        const q = pop(t, f.t0 - 0.05)
        const tomada = pr(t, tTres + i * 0.15, 0.3, outB)
        return (
          <Caja key={i} x={60} y={470 + i * 290} w={960} h={240} o={q.o} s={q.s} borde={tomada > 0.5 ? P.or : P.line} bw={tomada > 0.5 ? 5 : 3}>
            <div style={{ position: 'absolute', left: 40, top: 55, width: 130, height: 130, borderRadius: 40, background: P.orS, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ic tipo={f.ic} size={88} c={P.orD} />
            </div>
            <Txt f={T} w={700} size={66} style={{ position: 'absolute', left: 210, top: 70 }}>{f.n}</Txt>
            <Txt size={30} w={600} c={P.mute} style={{ position: 'absolute', left: 212, top: 150 }}>{['Conversas', 'Trabaja con tus archivos', 'Programa'][i]}</Txt>
            <div style={{ position: 'absolute', right: 34, top: 30, width: 150, height: 180, opacity: tomada, transform: `scale(${0.6 + 0.4 * tomada})` }}>
              <Mascota x={75} y={100} w={150} h={180} s={0.52} mood="happy" t={t} />
            </div>
          </Caja>
        )
      })}
      <Sello x={340} y={1380} texto="NO HACEN LO MISMO" c={P.rd} rot={-4} o={dif.o} s={dif.s} size={44} />
    </>
  )
}

// 1 · Chat
const M1 = ({ t, W }) => {
  const dices = W(1, 7)
  const preg = ['¿Cómo', 'respondo', 'este', 'correo?']
  const vistas = preg.filter((_, i) => t >= W(1, 7) + i * 0.28)
  const tR = W(1, 9) + 0.1
  const aseso = pop(t, W(1, 12))
  return (
    <>
      <Caja x={60} y={470} w={960} h={820}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '28px 40px', borderBottom: `3px solid ${P.line}` }}>
          <Ic tipo="chat" size={60} c={P.or} />
          <Txt f={T} w={700} size={40}>Chat</Txt>
        </div>
        {vistas.length > 0 && (
          <Caja x={250} y={140} w={660} h={110} bg={P.ink} borde={P.ink} r={40} sombra={false} o={pop(t, dices).o} s={pop(t, dices).s} style={{ transformOrigin: '100% 50%' }}>
            <Txt size={40} w={600} c="#fff" style={{ padding: '32px 38px', whiteSpace: 'nowrap' }}>{vistas.join(' ')}</Txt>
          </Caja>
        )}
        {t >= tR && (
          <Caja x={36} y={290} w={780} h={400} bg={P.orS} borde={P.orS} r={40} sombra={false} o={pop(t, tR).o} s={pop(t, tR).s} style={{ transformOrigin: '0 0' }}>
            <Txt size={36} w={700} f={T} style={{ padding: '34px 40px 14px' }}>Claro, así puedes responderlo:</Txt>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ margin: '18px 40px', height: 24, width: `${[92, 80, 56][i] * clamp((t - tR - 0.3 - i * 0.25) / 0.3)}%`, borderRadius: 12, background: '#fff', opacity: 0.9 }} />
            ))}
            <Txt size={32} w={600} c={P.orD} style={{ padding: '20px 40px' }}>¿Lo quieres más formal?</Txt>
          </Caja>
        )}
        <Caja x={36} y={720} w={888} h={64} bg={P.gris} borde={P.gris} r={32} sombra={false} />
      </Caja>
      <Mascota x={880} y={1420} w={300} h={300} s={0.62} mood="ok" t={t} />
      <Pos x={960} y={1330} o={aseso.o} s={aseso.s}><Ic tipo="idea" size={110} c={P.am} /></Pos>
      <Insignia x={80} y={1360} texto="TU ASESOR" o={aseso.o} s={aseso.s} />
    </>
  )
}

// 2 · Cowork
const M2 = ({ t, W }) => {
  const tCarp = W(2, 7)
  const tOrg = W(2, 9)
  const tDoc = W(2, 11)
  const tHoja = W(2, 13)
  const tAsis = W(2, 17)
  const archivos = [
    { n: 'factura.pdf', c: P.rd, dest: 0, x0: 120, y0: 560, r: -8 },
    { n: 'foto.png', c: P.am, dest: 1, x0: 470, y0: 640, r: 6 },
    { n: 'notas.txt', c: P.gr, dest: 2, x0: 780, y0: 570, r: -4 },
    { n: 'cuenta.pdf', c: P.rd, dest: 0, x0: 240, y0: 760, r: 7 },
    { n: 'logo.png', c: P.am, dest: 1, x0: 600, y0: 800, r: -9 },
    { n: 'ideas.txt', c: P.gr, dest: 2, x0: 860, y0: 740, r: 5 },
  ]
  const destinos = [{ n: 'Facturas', x: 30 }, { n: 'Fotos', x: 345 }, { n: 'Notas', x: 660 }]
  const mover = pr(t, tOrg, 0.9, io3)
  const orden = [0, 0, 0]
  const caja = pop(t, tCarp - 0.1)
  const doc = pop(t, tDoc)
  const hoja = pop(t, tHoja)
  const asis = pop(t, tAsis)
  return (
    <>
      <Caja x={50} y={470} w={980} h={520} o={caja.o} s={caja.s} bg="#fff">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 36px', borderBottom: `3px solid ${P.line}` }}>
          <Ic tipo="carpeta" size={56} c={P.or} />
          <Txt f={T} w={700} size={36}>Mi carpeta de trabajo</Txt>
          {mover >= 1 && <div style={{ marginLeft: 'auto' }}><Check size={46} /></div>}
        </div>
        {destinos.map((d, i) => (
          <div key={d.n} style={{ position: 'absolute', left: d.x, top: 330, width: 290, height: 170, borderRadius: 28, background: P.gris, border: `3px dashed ${P.line}`, opacity: mover }}>
            <Txt f={T} w={700} size={32} c={P.mute} style={{ textAlign: 'center', paddingTop: 12 }}>{d.n}</Txt>
          </div>
        ))}
        {archivos.map((a, i) => {
          const k = orden[a.dest]++
          const xd = destinos[a.dest].x + 16
          const yd = 330 + 56 + k * 52
          const x = a.x0 - 50 + (xd - (a.x0 - 50)) * clamp(mover * (1 + i * 0.0) - i * 0.0)
          const y = a.y0 - 470 + (yd - (a.y0 - 470)) * mover
          return (
            <div key={a.n} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${a.r * (1 - mover)}deg)`, background: '#fff', border: `3px solid ${a.c}`, borderRadius: 14, padding: '8px 14px', fontFamily: U, fontWeight: 700, fontSize: 24, color: P.ink, boxShadow: '0 8px 18px rgba(60,40,140,.12)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: a.c }} />
              {a.n}
            </div>
          )
        })}
      </Caja>
      <Caja x={50} y={1010} w={470} h={380} o={doc.o} s={doc.s} bg="#fff">
        <Txt f={T} w={700} size={30} style={{ padding: '22px 28px' }}>Informe.docx</Txt>
        {[88, 100, 72, 94, 60].map((w, i) => (
          <div key={i} style={{ margin: '14px 28px', height: 20, width: `${w * clamp((t - tDoc - 0.15 - i * 0.18) / 0.3) * 0.88}%`, borderRadius: 10, background: i === 0 ? P.or : P.gris }} />
        ))}
      </Caja>
      <Caja x={560} y={1010} w={470} h={380} o={hoja.o} s={hoja.s} bg="#fff">
        <Txt f={T} w={700} size={30} style={{ padding: '22px 28px' }}>Ventas.xlsx</Txt>
        <div style={{ position: 'absolute', left: 36, bottom: 40, display: 'flex', alignItems: 'flex-end', gap: 22, height: 240 }}>
          {[0.4, 0.65, 0.5, 0.85, 1].map((h, i) => (
            <div key={i} style={{ width: 58, height: 230 * h * out3(clamp((t - tHoja - 0.1 - i * 0.12) / 0.4)), borderRadius: '12px 12px 4px 4px', background: i === 4 ? P.or : P.orS }} />
          ))}
        </div>
      </Caja>
      <Insignia x={600} y={1430} texto="TU ASISTENTE" o={asis.o} s={asis.s} />
      <Mascota x={230} y={1500} w={300} h={300} s={0.55} mood="happy" arms={0.5 * pr(t, tOrg, 0.5)} t={t} />
    </>
  )
}

// 3 · Claude Code
const M3 = ({ t, W }) => {
  const tLee = W(3, 6)
  const tEsc = W(3, 9)
  const tPrueba = W(3, 13)
  const tProg = W(3, 15)
  const linea = (t0, txt, c = '#E9E6FF', extra = null) => {
    const v = clamp((t - t0) / 0.25)
    return (
      <div style={{ opacity: v, transform: `translateX(${(1 - v) * 18}px)`, color: c, whiteSpace: 'pre' }}>
        {txt}
        {extra}
      </div>
    )
  }
  const codigo = [
    ['function', P.or, ' login(usuario) {'],
    ['  validar', '#7FD3A5', '(usuario.clave)'],
    ['  return', P.or, ' sesion.crear()'],
    ['}', '#E9E6FF', ''],
  ]
  const prog = pop(t, tProg)
  const ok = t > tPrueba + 0.5
  return (
    <>
      <Caja x={50} y={470} w={980} h={820} bg="#14122B" borde="#14122B">
        <div style={{ display: 'flex', gap: 12, padding: '26px 32px' }}>{['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (<div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />))}</div>
        <div style={{ padding: '6px 44px', fontFamily: MONO, fontSize: 38, lineHeight: 1.7 }}>
          {linea(0, '> claude', '#B7A9FF')}
          {linea(tLee, '● Leyendo proyecto…', '#E9E6FF', t > tLee + 0.7 ? <span style={{ color: '#7FD3A5' }}> ✓ 42 archivos</span> : null)}
          {linea(tEsc - 0.1, '● Escribiendo login.js', '#E9E6FF')}
          <div style={{ margin: '10px 0 10px 16px', padding: '12px 24px', borderLeft: `6px solid ${P.or}`, background: 'rgba(255,255,255,.06)', borderRadius: 10, fontSize: 34, lineHeight: 1.6 }}>
            {codigo.map(([a, c, b], i) => {
              const v = clamp((t - (tEsc + 0.2 + i * 0.28)) / 0.2)
              return (<div key={i} style={{ opacity: v, whiteSpace: 'pre' }}><span style={{ color: '#7FD3A5' }}>+ </span><span style={{ color: c }}>{a}</span><span style={{ color: '#E9E6FF' }}>{b}</span></div>)
            })}
          </div>
          {linea(tPrueba, '● Probando…', '#E9E6FF', ok ? <span style={{ color: '#7FD3A5' }}> ✓ 12 pruebas pasan</span> : null)}
        </div>
      </Caja>
      <Insignia x={80} y={1360} texto="TU PROGRAMADOR" o={prog.o} s={prog.s} />
      <Mascota x={880} y={1480} w={300} h={300} s={0.6} mood={ok ? 'happy' : 'ok'} t={t} />
    </>
  )
}

// 4 · ¿cuál usar?
const M4 = ({ t, W }) => {
  const filas = [
    { q: '¿Necesitas una respuesta?', r: 'Chat', ic: 'chat', tq: W(4, 0), ta: W(4, 3) },
    { q: '¿Una tarea con tus archivos?', r: 'Cowork', ic: 'carpeta', tq: W(4, 4), ta: W(4, 10) },
    { q: '¿Construir un software?', r: 'Claude Code', ic: 'codigo', tq: W(4, 11), ta: W(4, 16) },
  ]
  return (
    <>
      {filas.map((f, i) => {
        const q = pop(t, f.tq - 0.05)
        const a = pop(t, f.ta - 0.05)
        const activa = t >= f.ta - 0.05 && (i === 2 || t < filas[i + 1].tq)
        return (
          <Caja key={i} x={60} y={470 + i * 330} w={960} h={290} o={q.o} s={q.s} borde={activa ? P.or : P.line} bw={activa ? 5 : 3}>
            <Txt f={T} w={700} size={44} style={{ position: 'absolute', left: 44, top: 36, width: 800 }}>{f.q}</Txt>
            <div style={{ position: 'absolute', left: 44, top: 140, opacity: a.o, transform: `scale(${a.s})`, transformOrigin: '0 50%', display: 'flex', alignItems: 'center', gap: 20, background: P.or, borderRadius: 60, padding: '12px 36px 12px 22px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Ic tipo={f.ic} size={56} c={P.orD} /></div>
              <Txt f={T} w={700} size={56} c="#fff">{f.r}</Txt>
            </div>
            {a.o > 0.5 && <div style={{ position: 'absolute', right: 40, top: 150, transform: `scale(${a.s})` }}><Check size={84} /></div>}
          </Caja>
        )
      })}
    </>
  )
}

const M5 = (r) => <Cierre {...r} k={5} />

export const ESCENAS_MODOS = [M0, M1, M2, M3, M4, M5]
