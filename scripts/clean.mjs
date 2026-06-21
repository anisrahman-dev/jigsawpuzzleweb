#!/usr/bin/env node
// Robust `dist/` removal. The prerender step writes 30k+ files, and a single
// rm of that tree intermittently fails with ENOTEMPTY on networked/slow
// volumes - so we retry a few times before giving up.
import { rmSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

for (let attempt = 1; attempt <= 6; attempt++) {
  try {
    rmSync(dist, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 })
  } catch {
    /* retry below */
  }
  if (!existsSync(dist)) process.exit(0)
}

console.error(`Could not fully remove ${dist} after retries.`)
process.exit(1)
