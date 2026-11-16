import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const MODELO = resolve(import.meta.dirname, '..', 'models', 'ggml-small.bin')

function run(cmd, args) {
  return new Promise((ok, fail) => {
    const p = spawn(cmd, args)
    let err = ''
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (c) => (c === 0 ? ok() : fail(new Error(`${cmd}: ${err.split('\n').slice(-5).join(' ')}`))))
  })
}

export async function tieneAudio(ruta) {
  const out = await new Promise((ok) => {
    const p = spawn('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_type', '-of', 'csv=p=0', ruta])
    let o = ''
    p.stdout.on('data', (d) => (o += d))
    p.on('close', () => ok(o))
  })
  return out.trim() === 'audio'
}

// Devuelve palabras con tiempos: [{ t0, t1, w }] (segundos)
export async function transcribir(video, dir, idioma = 'es') {
  const wav = resolve(dir, 'audio.wav')
  await run('ffmpeg', ['-y', '-i', video, '-vn', '-ar', '16000', '-ac', '1', wav])
  const base = resolve(dir, 'trans')
  await run('whisper-cli', ['-m', MODELO, '-f', wav, '-l', idioma, '-ml', '1', '-sow', '-oj', '-of', base, '-np'])
  const j = JSON.parse(readFileSync(`${base}.json`, 'utf8'))
  return j.transcription
    .map((s) => ({ t0: s.offsets.from / 1000, t1: s.offsets.to / 1000, w: s.text.trim() }))
    .filter((p) => p.w && !/^\[.*\]$/.test(p.w))
}
