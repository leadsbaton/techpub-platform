// Ad-hoc responsive screenshot harness. Captures key public pages at
// mobile/tablet/desktop widths so we can eyeball real layout breakage.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.SHOOT_BASE || 'http://localhost:3000'
const OUT = process.env.SHOOT_OUT || 'D:/tuchmath/techpub-platform/techpub-platform/payload/shots'
mkdirSync(OUT, { recursive: true })

const widths = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

// Path + a short slug label. Detail-page slugs are discovered at runtime.
const staticPaths = [
  ['/', 'home'],
  ['/insights', 'insights'],
  ['/whitepapers', 'whitepapers'],
  ['/webinars', 'webinars'],
  ['/search', 'search'],
]

async function discoverDetailPaths(page) {
  // Pull one real slug per section from the listing pages so we screenshot
  // actual detail/banner layouts instead of guessing.
  const found = []
  const probes = [
    ['/insights', '/insights/'],
    ['/whitepapers', '/whitepapers/'],
    ['/webinars', '/webinars/'],
  ]
  for (const [listing, prefix] of probes) {
    try {
      await page.goto(`${BASE}${listing}`, { waitUntil: 'networkidle', timeout: 45000 })
      const href = await page.evaluate((pfx) => {
        const a = Array.from(document.querySelectorAll('a[href]')).find((el) => {
          const h = el.getAttribute('href') || ''
          return h.startsWith(pfx) && h.length > pfx.length && !h.includes('?')
        })
        return a ? a.getAttribute('href') : null
      }, prefix)
      if (href) found.push([href, `detail${prefix.replaceAll('/', '-')}`.replace(/-+$/, '')])
    } catch (e) {
      console.error('discover failed', listing, e.message)
    }
  }
  return found
}

const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()

const detailPaths = await discoverDetailPaths(page)
const allPaths = [...staticPaths, ...detailPaths]
console.log('paths:', allPaths.map((p) => p[0]).join(', '))

for (const { name, width, height } of widths) {
  await page.setViewportSize({ width, height })
  for (const [path, label] of allPaths) {
    try {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 45000 })
      await page.waitForTimeout(600)
      // Detect horizontal overflow (the #1 mobile bug) and report it.
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement
        return {
          scrollW: doc.scrollWidth,
          clientW: doc.clientWidth,
          overflowing: doc.scrollWidth > doc.clientWidth + 1,
        }
      })
      const file = `${OUT}/${label}__${name}.png`
      await page.screenshot({ path: file, fullPage: true })
      console.log(
        `${overflow.overflowing ? 'OVERFLOW' : 'ok      '} ${name.padEnd(7)} ${path}  (scrollW=${overflow.scrollW} clientW=${overflow.clientW})`,
      )
    } catch (e) {
      console.error(`FAIL ${name} ${path}: ${e.message}`)
    }
  }
}

await browser.close()
console.log('done ->', OUT)
