import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'src')

const MAP = {
  A51D26: 'mk-primary',
  '8E181F': 'mk-primary-hover',
  '9D2932': 'mk-primary-hover',
  '7D171C': 'mk-primary-deep',
  B5262D: 'mk-primary',
  F7EEE7: 'mk-primary-soft',
  FCF5F0: 'mk-primary-soft',
  FFF8F5: 'mk-primary-soft',
  F2DDD5: 'mk-primary-soft',
  D4A373: 'mk-accent',
  B87935: 'mk-accent',
  '351C18': 'mk-ink',
  '493631': 'mk-ink',
  '292725': 'mk-ink-admin',
  '3F3A35': 'mk-ink-admin',
  '806C63': 'mk-muted',
  '9A857B': 'mk-muted',
  '67544D': 'mk-muted',
  '907A70': 'mk-muted',
  '967E74': 'mk-muted',
  A08C82: 'mk-muted',
  '6F6A64': 'mk-muted-admin',
  '6B6258': 'mk-admin',
  '5D554C': 'mk-admin-hover',
  '5A534A': 'mk-admin-hover',
  '625A51': 'mk-admin-hover',
  '99938B': 'mk-subtle',
  '999999': 'mk-subtle',
  '958C84': 'mk-subtle',
  FBF7F2: 'mk-bg',
  FBFAF7: 'mk-bg',
  F8F6F2: 'mk-bg-admin',
  FCFBF9: 'mk-bg-admin',
  FFFDFC: 'mk-card',
  FFFCFA: 'mk-card',
  F1EEE8: 'mk-surface',
  EEEAE4: 'mk-surface',
  F1E7E0: 'mk-surface',
  EEE5DF: 'mk-surface',
  EAE7E1: 'mk-surface',
  ECE9E4: 'mk-surface',
  E8DDD4: 'mk-border',
  E2D5CC: 'mk-border',
  E4DAD3: 'mk-border',
  E4CFC5: 'mk-border',
  CDAFA4: 'mk-border',
  CFA8A0: 'mk-border',
  E3DED6: 'mk-border-admin',
  '3E8B62': 'mk-success',
  '5E6C55': 'mk-success',
  EAEDE7: 'mk-success-soft',
  A44A3F: 'mk-danger',
  F1E7E5: 'mk-danger-soft',
  '8A6A3D': 'mk-warning',
  '806B4F': 'mk-warning',
  '6D5A91': 'mk-info',
  ECE9F5: 'mk-info-soft',
  '888888': 'mk-disabled',
  '777777': 'mk-disabled',
  E8E5E2: 'mk-disabled-bg',
  D9D9D9: 'mk-disabled-bg',
  F3F3F3: 'mk-disabled-bg',
  EDE5DF: 'mk-disabled-bg',

  // Closest-token leftovers from second pass
  A05A16: 'mk-warning',
  '918681': 'mk-subtle',
  F0E9E4: 'mk-surface',
  EAE1DB: 'mk-border',
  CFC8BF: 'mk-border-admin',
  F8F7F6: 'mk-bg-admin',
  F0F8F3: 'mk-success-soft',
  F1EFED: 'mk-surface',
  FFF9ED: 'mk-warning-soft',
  EBD7B7: 'mk-accent',
  F0E7E1: 'mk-primary-soft',
  '34704F': 'mk-success',
  E5E5E5: 'mk-disabled-bg',
  D8C9C0: 'mk-border',
  FBF5F1: 'mk-bg',
  F8EEE8: 'mk-primary-soft',
  A89890: 'mk-muted',
  B7A49B: 'mk-muted',
  '66544D': 'mk-muted',
  B0AAA2: 'mk-subtle',
  E17B7F: 'mk-danger',
  '4A2520': 'mk-ink',
  F2D9D6: 'mk-danger-soft',
  D5E8DA: 'mk-success-soft',
  '9A6A32': 'mk-warning',
  F6E9E0: 'mk-primary-soft',
  F3E3D8: 'mk-primary-soft',
  F7E3DF: 'mk-danger-soft',

  EAE5DE: 'mk-surface',
  D5C2B8: 'mk-border',
  D65A5F: 'mk-danger',
  F4F2EE: 'mk-bg-admin',
  AAA39B: 'mk-subtle',
  E0DBD8: 'mk-border-admin',
  '716762': 'mk-admin',
  B09E95: 'mk-muted',
  DCCFC7: 'mk-border',
  E3D8D1: 'mk-border',
  DCDCDC: 'mk-disabled-bg',
  '681419': 'mk-primary-deep',
  F1E3DC: 'mk-primary-soft',
  '35231F': 'mk-ink',
  D8CCC5: 'mk-border',
  '70529B': 'mk-info',
  FFF5F3: 'mk-danger-soft',
  C7B6AE: 'mk-border',
  E8E3DC: 'mk-border-admin',
  A8978F: 'mk-muted',
  D9B7B2: 'mk-danger-soft',
  E7D2CF: 'mk-danger-soft',
  E3D6CE: 'mk-border',
  '786E69': 'mk-muted-admin',
  EAF6EF: 'mk-success-soft',
  E9E9E9: 'mk-disabled-bg',
  EFE0D7: 'mk-primary-soft',
  FFFCF9: 'mk-card',
  E6DDD7: 'mk-border',
  EFE5DF: 'mk-surface',
  D8CBC4: 'mk-border',
  '467653': 'mk-success',
  '9A3E3A': 'mk-danger',
  AAAAAA: 'mk-disabled',
  E4D5CD: 'mk-border',
  CDBDB5: 'mk-border',
  F7F1E9: 'mk-bg',
  DCCBC1: 'mk-border',
  DDD8D4: 'mk-border-admin',
  F8ECE6: 'mk-primary-soft',
  E7E7E7: 'mk-disabled-bg',
  C9B8AF: 'mk-border',
  E5E0DD: 'mk-border-admin',
  FFF8F3: 'mk-primary-soft',
  F6F2FC: 'mk-info-soft',
  E2DDDA: 'mk-border-admin',
  FFFDF8: 'mk-card',
  A08F8A: 'mk-muted',
  E2DEDB: 'mk-border-admin',
  '737373': 'mk-disabled',
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === 'dist') continue
      walk(p, out)
    } else if (/\.(jsx|js|css)$/.test(ent.name)) {
      out.push(p)
    }
  }
  return out
}

const files = walk(root)
let fileCount = 0
let replaceCount = 0

const re = /\[#([0-9A-Fa-f]{6})(\/[0-9.]+)?\]/g

for (const file of files) {
  // Don't rewrite the theme definition file itself beyond what's already tokens
  if (file.endsWith(`${path.sep}index.css`)) continue

  let text = fs.readFileSync(file, 'utf8')
  const next = text.replace(re, (m, hex, opacity) => {
    const token = MAP[hex.toUpperCase()]
    if (!token) return m
    replaceCount += 1
    return opacity ? `${token}${opacity}` : token
  })

  if (next !== text) {
    fs.writeFileSync(file, next)
    fileCount += 1
  }
}

console.log(`Changed ${fileCount} files, ${replaceCount} color class replacements`)
