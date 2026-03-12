import 'dotenv/config'

const payloadURL = process.env.PAYLOAD_PUBLIC_URL || 'http://localhost:5000'
const secret = process.env.PAYLOAD_SECRET

if (!secret) {
  console.error('PAYLOAD_SECRET is missing in payload/.env')
  process.exit(1)
}

const response = await fetch(payloadURL + '/api/seed-demo', {
  method: 'POST',
  headers: {
    Authorization: 'Bearer ' + secret,
  },
})

const body = await response.json().catch(() => null)

if (!response.ok) {
  console.error('Seed failed:', body || response.statusText)
  process.exit(1)
}

console.log(JSON.stringify(body, null, 2))
