import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../src/payload.config.js'

const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })

const contentTypes = [
  { label: 'Insight', key: 'insight', routeBase: '/insights', active: true, sortOrder: 1 },
  { label: 'White Paper', key: 'whitepaper', routeBase: '/whitepapers', active: true, sortOrder: 2 },
  { label: 'Webinar', key: 'webinar', routeBase: '/webinars', active: true, sortOrder: 3 },
]

const results = []
for (const item of contentTypes) {
  const existing = await payload.find({
    collection: 'content-types',
    where: { key: { equals: item.key } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'content-types',
      id: existing.docs[0].id,
      data: item,
      depth: 0,
      draft: false,
    })
    results.push({ action: 'updated', id: updated.id, key: item.key })
  } else {
    const created = await payload.create({
      collection: 'content-types',
      data: item,
      depth: 0,
      draft: false,
    })
    results.push({ action: 'created', id: created.id, key: item.key })
  }
}

console.log(JSON.stringify({ ok: true, count: results.length, results }, null, 2))
process.exit(0)
