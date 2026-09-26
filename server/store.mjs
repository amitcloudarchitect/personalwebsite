import fs from 'node:fs'
import path from 'node:path'

const filePath = path.join(process.cwd(), 'data', 'community.json')
const bucket = process.env.GCS_BUCKET || ''
const objectName = process.env.GCS_OBJECT || 'community.json'

const empty = () => ({
  users: [],
  sessions: [],
  comments: [],
  subscribers: [],
})

function normalize(parsed) {
  return {
    users: Array.isArray(parsed?.users) ? parsed.users : [],
    sessions: Array.isArray(parsed?.sessions) ? parsed.sessions : [],
    comments: Array.isArray(parsed?.comments) ? parsed.comments : [],
    subscribers: Array.isArray(parsed?.subscribers) ? parsed.subscribers : [],
  }
}

function readFile() {
  try {
    return normalize(JSON.parse(fs.readFileSync(filePath, 'utf8')))
  } catch {
    return empty()
  }
}

function writeFile(data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const temporary = `${filePath}.tmp`
  fs.writeFileSync(temporary, JSON.stringify(data))
  fs.renameSync(temporary, filePath)
}

async function accessToken() {
  const response = await fetch(
    'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
    { headers: { 'Metadata-Flavor': 'Google' } },
  )
  if (!response.ok) throw new Error('Cloud Storage credentials are not available')
  const data = await response.json()
  if (!data.access_token) throw new Error('Cloud Storage credentials are not available')
  return data.access_token
}

async function readCloud() {
  const token = await accessToken()
  const response = await fetch(
    `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(objectName)}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  if (response.status === 404) return empty()
  if (!response.ok) throw new Error('Could not read the community store')
  return normalize(await response.json())
}

async function writeCloud(data) {
  const token = await accessToken()
  const response = await fetch(
    `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=media&name=${encodeURIComponent(objectName)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  )
  if (!response.ok) throw new Error('Could not save the community store')
}

async function read() {
  return bucket ? readCloud() : readFile()
}

async function write(data) {
  if (bucket) await writeCloud(data)
  else writeFile(data)
}

let queue = Promise.resolve()

export function withStore(mutate) {
  const run = queue.then(async () => {
    const data = await read()
    const result = mutate(data)
    if (result?.save) await write(data)
    return result?.value
  })
  queue = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}
