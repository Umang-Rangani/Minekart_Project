import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'src')

const TOKENS = {
  'mk-primary': 'A51D26',
  'mk-primary-hover': '8E181F',
  'mk-primary-deep': '7D171C',
  'mk-primary-soft': 'F7EEE7',
  'mk-accent': 'D4A373',
  'mk-ink': '351C18',
  'mk-ink-admin': '292725',
  'mk-muted': '806C63',
  'mk-muted-admin': '6F6A64',
  'mk-subtle': '99938B',
  'mk-bg': 'FBF7F2',
  'mk-bg-admin': 'F8F6F2',
  'mk-card': 'FFFDFC',
  'mk-surface': 'F1EEE8',
  'mk-border': 'E8DDD4',
  'mk-border-admin': 'E3DED6',
  'mk-admin': '6B6258',
  'mk-admin-hover': '5D554C',
  'mk-success': '3E8B62',
  'mk-success-soft': 'EAEDE7',
  'mk-danger': 'A44A3F',
  'mk-danger-soft': 'F1E7E5',
  'mk-warning': '8A6A3D',
  'mk-warning-soft': 'F1EEE8',
  'mk-info': '6D5A91',
  'mk-info-soft': 'ECE9F5',
  'mk-disabled': '888888',
  'mk-disabled-bg': 'E8E5E2',
}

function parseHex(hex) {
  return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
}

const tokenRgb = Object.entries(TOKENS).map(([name, hex]) => [name, parseHex(hex)])

function nearest(hex) {
  const [r, g, b] = parseHex(hex)
  let best = tokenRgb[0][0]
  let bestDist = Infinity
  for (const [name, [tr, tg, tb]] of tokenRgb) {
    const d = (r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2
    if (d < bestDist) {
      bestDist = d
      best = name
    }
  }
  return best
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'dist') continue
      walk(p, out)
    } else if (/\.(jsx|js)$/.test(ent.name)) {
      out.push(p)
    }
  }
  return out
}

const re = /\[#([0-9A-Fa-f]{6})(\/[0-9.]+)?\]/g
let fileCount = 0
let replaceCount = 0

for (const file of walk(root)) {
  let text = fs.readFileSync(file, 'utf8')
  const next = text.replace(re, (m, hex, opacity) => {
    replaceCount += 1
    const token = nearest(hex.toUpperCase())
    return opacity ? `${token}${opacity}` : token
  })
  if (next !== text) {
    fs.writeFileSync(file, next)
    fileCount += 1
  }
}

console.log(`Nearest-mapped ${replaceCount} leftovers across ${fileCount} files`)
