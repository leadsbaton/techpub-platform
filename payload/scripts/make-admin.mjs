import 'dotenv/config'

// Usage: node scripts/make-admin.mjs you@example.com
// Grants the `admin` role to the given user so they can create/edit/delete in the
// CMS. Targets PAYLOAD_PUBLIC_URL (or localhost:5000) and authenticates with
// PAYLOAD_SECRET from payload/.env.

const payloadURL = process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:5000'
const secret = process.env.PAYLOAD_SECRET
const email = process.argv[2]

if (!secret) {
  console.error('PAYLOAD_SECRET is missing in payload/.env')
  process.exit(1)
}

if (!email) {
  console.error('Usage: node scripts/make-admin.mjs <email>')
  process.exit(1)
}

const response = await fetch(payloadURL + '/api/promote-admin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + secret,
  },
  body: JSON.stringify({ email }),
})

const body = await response.json().catch(() => null)

if (!response.ok) {
  console.error('Failed:', body || response.statusText)
  process.exit(1)
}

console.log('Done:', JSON.stringify(body, null, 2))
console.log('Log out and back in to the admin for the new role to take effect.')
