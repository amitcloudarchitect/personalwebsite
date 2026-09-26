import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const api = spawn(process.execPath, ['server/index.mjs'], { cwd: root, stdio: 'inherit' })
const vite = spawn(process.execPath, [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')], {
  cwd: root,
  stdio: 'inherit',
})

function stop() {
  api.kill()
  vite.kill()
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

vite.on('exit', (code) => {
  api.kill()
  process.exit(code ?? 0)
})

api.on('exit', (code) => {
  if (code && code !== 0) {
    vite.kill()
    process.exit(code)
  }
})
