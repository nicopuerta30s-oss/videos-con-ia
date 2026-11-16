// Explicativos animados: guion → voz → tiempos de cada palabra → Remotion → mezcla de voz y sonidos.
// Uso: node explicativos/generar.js <carpeta-del-guion> [--solo-props] [--cuadro N,N,...]
import { spawn } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { bundle } from '@remotion/bundler'
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer'
import { transcribir } from '../src/transcribe.js'
import { rutaSfx } from '../src/sfx.js'
import { FPS, sonidos as sonidosV1 } from './tiempos.js'
import { sonidosPro } from './tiempos-pro.js'
import { sonidosModos } from './tiempos-modos.js'
import { sonidosApi } from './tiempos-api.js'
import { sonidosProd } from './tiempos-prod.js'
import { sonidosMerc } from './tiempos-merc.js'
import { sonidosBaus } from './tiempos-baus.js'
import { sonidosPanel } from './tiempos-panel.js'
import { sonidosPerfume } from './tiempos-perfume.js'
import { sonidosEstudio } from './tiempos-estudio.js'
import { sonidosBalanza } from './tiempos-balanza.js'
import { sonidosMano } from './tiempos-mano.js'

const AQUI = import.meta.dirname
const carpeta = resolve(AQUI, process.argv[2] ?? 'ejemplo')
const SOLO_PROPS = process.argv.includes('--solo-props')
const CUADROS = process.argv.includes('--cuadro') ? process.argv[process.argv.indexOf('--cuadro') + 1].split(',').map(Number) : null
const BUILD = resolve(carpeta, 'build')
mkdirSync(resolve(BUILD, 'voz'), { recursive: true })

const run = (cmd, args) =>
  new Promise((ok, fail) => {
    const p = spawn(cmd, args)
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (c) => (c === 0 ? ok() : fail(new Error(`${cmd}: ${err.slice(-300)}`))))
  })

const guion = JSON.parse(readFileSync(resolve(carpeta, 'guion.json'), 'utf8'))

// Voz fija de la marca: explicativos/voz.json ({ proveedor: 'elevenlabs', voice_id, modelo }); la llave va en .env
const VOZ = existsSync(resolve(AQUI, 'voz.json')) ? JSON.parse(readFileSync(resolve(AQUI, 'voz.json'), 'utf8')) : { proveedor: 'sistema' }
const llave = () => {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY
  const env = existsSync(resolve(AQUI, '../.env')) ? readFileSync(resolve(AQUI, '../.env'), 'utf8') : ''
  return env.match(/^ELEVENLABS_API_KEY=(.+)$/m)?.[1].trim()
}
const elevenlabs = async (texto, salida) => {
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOZ.voice_id}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': llave(), 'content-type': 'application/json' },
    body: JSON.stringify({
      text: texto,
      model_id: VOZ.modelo ?? 'eleven_multilingual_v2',
      language_code: 'es',
      voice_settings: { stability: VOZ.estabilidad ?? 0.5, similarity_boost: VOZ.similitud ?? 0.8, style: VOZ.estilo ?? 0.2, speed: VOZ.velocidad ?? 1 },
    }),
  })
  if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${(await r.text()).slice(0, 300)}`)
  writeFileSync(salida, Buffer.from(await r.arrayBuffer()))
}
const usaEleven = VOZ.proveedor === 'elevenlabs'
if (usaEleven && !llave()) throw new Error('Falta ELEVENLABS_API_KEY en .env')

// 1) Voz por frase (la voz del sistema; cada frase en su archivo para fijar los tiempos exactos)
const voces = []
const norm = (w) => w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
const PROPIA = guion.voz_propia ? resolve(carpeta, guion.voz_propia) : null
let realesPorFrase = null
if (PROPIA) {
  // Tu grabación. Los tiempos de Whisper se desvían tras las pausas largas, así que la verdad es la energía del audio:
  // 1) se parte en tramos de voz; 2) se eligen las pausas que separan las frases (las que dejan cada frase con el largo que le toca por su texto);
  // 3) dentro de cada frase las palabras se reparten por longitud sobre el tiempo realmente hablado.
  const dirW = resolve(BUILD, 'voz', 'propia')
  mkdirSync(dirW, { recursive: true })
  const oidasTodas = (await transcribir(PROPIA, dirW)).filter((p) => norm(p.w))
  const dicho = oidasTodas.length
  const sil = await new Promise((ok) => {
    const pr = spawn('ffmpeg', ['-i', PROPIA, '-af', 'silencedetect=noise=-36dB:d=0.1', '-f', 'null', '-'])
    let e = ''
    pr.stderr.on('data', (d) => (e += d))
    pr.on('close', () => ok([...e.matchAll(/silence_start: ([\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)].map((m) => ({ a: +m[1], b: +m[2] }))))
  })
  const durTotal = await new Promise((ok) => {
    const pr = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', PROPIA])
    let o = ''
    pr.stdout.on('data', (d) => (o += d))
    pr.on('close', () => ok(parseFloat(o)))
  })
  const tramos = []
  let cursor = 0
  for (const z of sil) {
    if (z.a - cursor > 0.05) tramos.push({ a: cursor, b: z.a })
    cursor = z.b
  }
  if (durTotal - cursor > 0.05) tramos.push({ a: cursor, b: durTotal })
  const pesoPal = (w) => norm(w).length + 1.5
  const pesos = guion.frases.map((f) => f.texto.split(/\s+/).reduce((x, w) => x + pesoPal(w), 0))
  const total = pesos.reduce((x, y) => x + y, 0)
  const hablado = tramos.reduce((x, z) => x + (z.b - z.a), 0)
  const nPal = guion.frases.reduce((x, f) => x + f.texto.split(/\s+/).length, 0)
  if (Math.abs(dicho - nPal) > nPal * 0.2) console.log(`  ⚠ en la grabación se oyen ${dicho} palabras y el guion tiene ${nPal}: ¿se repitió o saltó una frase?`)
  const acumT = []
  tramos.reduce((x, z, i) => ((acumT[i] = x + (z.b - z.a)), acumT[i]), 0)
  const pausa = (i) => (i < tramos.length - 1 ? tramos[i + 1].a - tramos[i].b : 0)
  const K = guion.frases.length
  const acumEsp = []
  guion.frases.reduce((x, f, k) => ((acumEsp[k] = x + f.texto.split(/\s+/).length), acumEsp[k]), 0)
  // cortes: tramo en el que termina cada frase (programación dinámica)
  const mejor = Array.from({ length: K }, () => new Map())
  const costo = (k, ini, fin) => {
    const largo = acumT[fin] - (ini > 0 ? acumT[ini - 1] : 0)
    const esperado = (pesos[k] / total) * hablado
    // Whisper acierta bien el ORDEN y, con pausas cortas, casi el tiempo: cuántas palabras suenan antes de cada pausa debe parecerse a las que lleva el guion
    const antes = oidasTodas.filter((q) => q.t0 < tramos[fin].b - 0.05).length
    const dif = k < K - 1 ? antes - acumEsp[k] : 0
    return Math.pow((largo - esperado) / Math.max(1, esperado), 2) * 10 - (k < K - 1 ? pausa(fin) * 2 : 0) + 0.35 * dif * dif
  }
  for (let fin = 0; fin < tramos.length; fin++) mejor[0].set(fin, { c: costo(0, 0, fin), prev: -1 })
  for (let k = 1; k < K; k++)
    for (let fin = k; fin < tramos.length; fin++) {
      let m = null
      for (const [ant, v] of mejor[k - 1]) if (ant < fin) { const c = v.c + costo(k, ant + 1, fin); if (!m || c < m.c) m = { c, prev: ant } }
      if (m) mejor[k].set(fin, m)
    }
  const finales = new Array(K)
  finales[K - 1] = tramos.length - 1
  for (let k = K - 1; k > 0; k--) finales[k - 1] = mejor[k].get(finales[k]).prev
  const TEMPO = guion.tempo ?? 1
  for (const [i, f] of guion.frases.entries()) {
    const id = String(i).padStart(2, '0')
    const wav = resolve(BUILD, 'voz', `${id}.wav`)
    const ini = i === 0 ? 0 : finales[i - 1] + 1
    const piezas = []
    let off = 0
    for (let m = ini; m <= finales[i]; m++) {
      const z = tramos[m]
      const a = Math.max(m > 0 ? (tramos[m - 1].b + z.a) / 2 : 0, z.a - 0.09)
      const b = Math.min(m < tramos.length - 1 ? (z.b + tramos[m + 1].a) / 2 : durTotal, z.b + 0.13)
      piezas.push({ a, b, ca: z.a - a, core: z.b - z.a, off })
      off += b - a
    }
    const filtro = piezas.map((z, k) => `[0:a]atrim=${z.a}:${z.b},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,afade=t=out:st=${z.b - z.a - 0.03}:d=0.03[z${k}]`).join(';') + `;${piezas.map((_, k) => `[z${k}]`).join('')}concat=n=${piezas.length}:v=0:a=1,highpass=f=70${TEMPO !== 1 ? `,atempo=${TEMPO}` : ''}[o]`
    await run('ffmpeg', ['-y', '-v', 'error', '-i', PROPIA, '-filter_complex', filtro, '-map', '[o]', '-ar', '44100', '-ac', '1', wav])
    // palabras sobre el tiempo hablado de la frase
    const toks = f.texto.split(/\s+/)
    const pw = toks.map(pesoPal)
    const suma = pw.reduce((x, y) => x + y, 0)
    const L = piezas.reduce((x, z) => x + z.core, 0)
    const enSalida = (c) => {
      let r = c
      for (const z of piezas) { if (r <= z.core + 1e-9) return z.off + z.ca + r; r -= z.core }
      const u = piezas.at(-1)
      return u.off + u.ca + u.core
    }
    let acum = 0
    const rel = toks.map((w, j) => {
      const t0 = enSalida((acum / suma) * L)
      acum += pw[j]
      return { w, t0: t0 / TEMPO, t1: enSalida((acum / suma) * L) / TEMPO }
    })
    // con las pausas ya recortadas Whisper sí acierta el tiempo de cada palabra: se usa ese; si falla, queda el reparto por longitud
    const dirP = resolve(BUILD, 'voz', `w${id}`)
    mkdirSync(dirP, { recursive: true })
    const oidas = (await transcribir(wav, dirP)).filter((q) => norm(q.w))
    const durWav = await new Promise((ok) => {
      const pr = spawn('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav])
      let o = ''
      pr.stdout.on('data', (d) => (o += d))
      pr.on('close', () => ok(parseFloat(o)))
    })
    const usa = oidas.length >= toks.length * 0.7
    console.log(`  frase ${i + 1}: ${(durWav - 0.1).toFixed(1)} s, ${piezas.length} tramo(s), tiempos ${usa ? 'de Whisper' : 'por longitud'}`)
    voces.push({ id, wav, voz0: 0.04, voz1: durWav - 0.06, rel: usa ? oidas.map((q) => ({ w: q.w, t0: q.t0, t1: q.t1 })) : rel })
  }
}

// Voz sintética: cada frase en su archivo para fijar los tiempos exactos
for (const [i, f] of guion.frases.entries()) {
  if (PROPIA) break
  const id = String(i).padStart(2, '0')
  const aiff = resolve(BUILD, 'voz', `${id}.aiff`)
  const wav = resolve(BUILD, 'voz', `${id}.wav`)
  const hecho = resolve(BUILD, 'voz', `${id}.json`)
  const firma = JSON.stringify(usaEleven ? [f.voz, VOZ] : [f.voz, guion.voz, guion.velocidad])
  let info = existsSync(hecho) ? JSON.parse(readFileSync(hecho, 'utf8')) : null
  if (!info || info.firma !== firma) {
    if (usaEleven) {
      await elevenlabs(f.voz.replace(/\bClaud\b/g, 'Claude'), aiff.replace('.aiff', '.mp3'))
      await run('ffmpeg', ['-y', '-v', 'error', '-i', aiff.replace('.aiff', '.mp3'), '-ar', '44100', '-ac', '1', wav])
    } else {
      await run('say', ['-v', guion.voz, '-r', String(guion.velocidad), '-o', aiff, f.voz])
      await run('ffmpeg', ['-y', '-v', 'error', '-i', aiff, '-ar', '44100', '-ac', '1', wav])
    }
    const dir = resolve(BUILD, 'voz', `w${id}`)
    mkdirSync(dir, { recursive: true })
    const pal = await transcribir(wav, dir)
    info = { firma, voz0: pal[0]?.t0 ?? 0, voz1: pal.at(-1)?.t1 ?? 1 }
    writeFileSync(hecho, JSON.stringify(info))
  }
  voces.push({ id, wav, ...info })
}

// 2) Línea de tiempo: cada frase empieza cuando termina la anterior (+ pausa; más larga entre escenas)
const inicioGrupo = new Set(guion.grupos.map((g) => g.ids[0]))
let t = guion.inicio ?? 0.5
const frases = guion.frases.map((f, i) => {
  if (i > 0) t += inicioGrupo.has(i) ? (guion.grupos.find((g) => g.ids[0] === i).pausaAntes ?? guion.pausaEscena ?? 0.55) : (guion.pausa ?? 0.3)
  const v = voces[i]
  const ini = t
  const fin = ini + (v.voz1 - v.voz0)
  t = fin
  // palabras visibles (con *clave*) repartidas por longitud dentro del tramo hablado
  const pals = f.texto.split(/\s+/).map((w) => ({ w: w.replace(/\*/g, ''), k: /\*/.test(w) }))
  if (v.rel) {
    // casa cada palabra del guion con la que dijiste (por parecido) y reparte las que falten entre sus vecinas
    const t0s = new Array(pals.length).fill(null), t1s = new Array(pals.length).fill(null)
    let p = 0
    pals.forEach((q, j) => {
      const n = norm(q.w)
      for (let k = p; k < Math.min(v.rel.length, p + 3); k++) {
        const m = norm(v.rel[k].w)
        if (m && n && (m === n || (m.length > 2 && n.length > 2 && (m.startsWith(n.slice(0, 3)) || n.startsWith(m.slice(0, 3)))))) { t0s[j] = v.rel[k].t0; t1s[j] = v.rel[k].t1; p = k + 1; break }
      }
    })
    const a0 = v.voz0, a1 = v.voz1
    for (let j = 0; j < pals.length; j++) {
      if (t0s[j] !== null) continue
      let i0 = j - 1; while (i0 >= 0 && t0s[i0] === null) i0--
      let i1 = j + 1; while (i1 < pals.length && t0s[i1] === null) i1++
      const ini0 = i0 >= 0 ? t1s[i0] : a0, fin0 = i1 < pals.length ? t0s[i1] : a1
      const huecos = i1 - i0 - 1, pos = j - i0 - 1
      t0s[j] = ini0 + ((fin0 - ini0) * pos) / huecos
      t1s[j] = ini0 + ((fin0 - ini0) * (pos + 1)) / huecos
    }
    const palabras = pals.map((q, j) => ({ ...q, t0: ini + (t0s[j] - v.voz0), t1: ini + (t1s[j] - v.voz0) }))
    const kw = palabras.find((q) => q.k)?.t0 ?? ini
    return { texto: f.texto.replace(/\*/g, ''), ini, fin, kw, palabras, desfase: ini - v.voz0, voz: v.wav }
  }
  const peso = pals.map((p) => p.w.length + 1.5 + (/[,:.]$/.test(p.w) ? 2.5 : 0))
  const suma = peso.reduce((a, b) => a + b, 0)
  let acum = 0
  const palabras = pals.map((p, j) => {
    const t0 = ini + ((fin - ini) * acum) / suma
    acum += peso[j]
    return { ...p, t0, t1: ini + ((fin - ini) * acum) / suma }
  })
  const kw = palabras.find((p) => p.k)?.t0 ?? ini
  return { texto: f.texto.replace(/\*/g, ''), ini, fin, kw, palabras, desfase: ini - v.voz0, voz: v.wav }
})
const ultima = frases.at(-1)
const total = ultima.fin + (guion.cola ?? 2.2)
const props = { frases, grupos: guion.grupos, fps: FPS, frames: Math.ceil(total * FPS), marca: guion.marca, transiciones: guion.transiciones ?? [], escenas: guion.escenas ?? 'mcp', usuario: guion.usuario ?? null, paleta: guion.paleta ?? null, ancho: 1080, alto: 1920 }
writeFileSync(resolve(BUILD, 'props.json'), JSON.stringify(props, null, 1))
console.log(`guion listo: ${total.toFixed(1)} s, ${frases.length} frases`)
if (SOLO_PROPS) process.exit(0)

// 3) Imágenes
const bundleDir = resolve(AQUI, '.cache-bundle')
const serveUrl = await bundle({ entryPoint: resolve(AQUI, 'remotion/index.jsx'), outDir: bundleDir, publicDir: resolve(AQUI, 'remotion/public') })
const comp = await selectComposition({ serveUrl, id: guion.diseno === 'pro' ? 'Pro' : guion.diseno === 'cinetico' ? 'Cinetico' : guion.diseno === 'producto' ? 'Producto' : guion.diseno === 'mercado' ? 'Mercado' : guion.diseno === 'bauhaus' ? 'Bauhaus' : guion.diseno === 'panel' ? 'Panel' : guion.diseno === 'perfume' ? 'Perfume' : guion.diseno === 'estudio' ? 'Estudio' : guion.diseno === 'balanza' ? 'Balanza' : guion.diseno === 'mano' ? 'Mano' : 'Explicativo', inputProps: props, port: 3986 })

if (CUADROS) {
  mkdirSync(resolve(BUILD, 'cuadros'), { recursive: true })
  for (const c of CUADROS) {
    await renderStill({ composition: comp, serveUrl, inputProps: props, frame: c, output: resolve(BUILD, 'cuadros', `f${String(c).padStart(4, '0')}.png`), port: 3986, logLevel: 'error' })
  }
  console.log(`cuadros: ${CUADROS.length}`)
  process.exit(0)
}

const mudo = resolve(BUILD, 'video-mudo.mp4')
await renderMedia({ composition: comp, serveUrl, inputProps: props, codec: 'h264', crf: 14, pixelFormat: 'yuv420p', x264Preset: 'slow', colorSpace: 'bt709', outputLocation: mudo, port: 3986, logLevel: 'error', concurrency: 4 })

// 4) Audio: voz (−16 LUFS) + sonidos sincronizados con cada animación
const ev = guion.diseno === 'pro' || guion.diseno === 'cinetico' || guion.diseno === 'producto' || guion.diseno === 'mercado' || guion.diseno === 'bauhaus' || guion.diseno === 'panel' || guion.diseno === 'perfume' || guion.diseno === 'estudio' || guion.diseno === 'balanza' || guion.diseno === 'mano' ? ({ mano: sonidosMano, balanza: sonidosBalanza, estudio: sonidosEstudio, perfume: sonidosPerfume, panel: sonidosPanel, baus: sonidosBaus, merc: sonidosMerc, modos: sonidosModos, api: sonidosApi, prod: sonidosProd }[guion.escenas] ?? sonidosPro)(frases, guion.grupos, guion.transiciones ?? []) : sonidosV1(frases, guion.grupos)
const rutas = {}
for (const tipo of new Set(ev.map((e) => e[1]))) rutas[tipo] = await rutaSfx(tipo)
const ent = []
const fil = []
frases.forEach((f, i) => {
  ent.push('-i', f.voz)
  fil.push(`[${i}:a]adelay=${Math.round(Math.max(0, f.desfase) * 1000)}:all=1[v${i}]`)
})
const nv = frases.length
const vozMezcla = `${frases.map((_, i) => `[v${i}]`).join('')}amix=inputs=${nv}:normalize=0,loudnorm=I=${guion.lufs ?? -16}:TP=-1.5:LRA=7[voz]`
ev.forEach(([seg, tipo, vol], j) => {
  ent.push('-i', rutas[tipo])
  fil.push(`[${nv + j}:a]volume=${vol},adelay=${Math.round(seg * 1000)}:all=1[s${j}]`)
})
const sfxMezcla = `${ev.map((_, j) => `[s${j}]`).join('')}amix=inputs=${ev.length}:normalize=0[sfx]`
const audio = resolve(BUILD, 'audio.wav')
await run('ffmpeg', ['-y', '-v', 'error', ...ent, '-filter_complex', [...fil, vozMezcla, sfxMezcla, `[voz][sfx]amix=inputs=2:normalize=0,alimiter=limit=0.95,apad=whole_dur=${total}[a]`].join(';'), '-map', '[a]', '-t', String(total), '-ar', '48000', '-ac', '2', audio])

const final = resolve(carpeta, `${guion.titulo.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')}.mp4`)
await run('ffmpeg', ['-y', '-v', 'error', '-i', mudo, '-i', audio, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', final])
console.log('LISTO →', final)
