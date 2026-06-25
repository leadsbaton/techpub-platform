import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

import type { Media } from '@/lib/types/cms'
import { getMediaUrl } from '@/lib/utils/formatting'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  // Text nodes: numeric bitmask of bold/italic/etc. Block nodes: alignment string.
  format?: string | number
  // Inline CSS string set by the editor (e.g. "color: #ff0000;font-size: 20px").
  style?: string
  url?: string
  // Payload 3 link nodes store their target under `fields`.
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: string
  }
  // Upload nodes carry the related media doc under `value` (populated when the
  // query depth resolves the relationship).
  relationTo?: string
  value?: Media | string | null
  // Lexical node state (text color / highlight set via the editor's
  // TextStateFeature) is serialized under the "$" key as { color, highlight }.
  $?: Record<string, string | undefined>
  children?: LexicalNode[]
}

// Maps the text-state KEYS stored in the editor JSON back to CSS. Must stay in
// sync with `editorTextColors` / `editorHighlights` in payload.config.ts, since
// the editor only stores the key (e.g. "red"), not the underlying color.
const TEXT_STATE_CSS: Record<string, Record<string, React.CSSProperties>> = {
  color: {
    red: { color: '#FC0203' },
    black: { color: '#111111' },
    gray: { color: '#6B7280' },
    blue: { color: '#1D4ED8' },
    green: { color: '#15803D' },
    orange: { color: '#EA580C' },
    purple: { color: '#7C3AED' },
  },
  highlight: {
    yellow: { backgroundColor: '#FEF08A' },
    green: { backgroundColor: '#BBF7D0' },
    blue: { backgroundColor: '#BFDBFE' },
    red: { backgroundColor: '#FECACA' },
  },
}

// Build a React style object from a text node's "$" state (editor colors).
function stateStyle(state: LexicalNode['$']): React.CSSProperties | undefined {
  if (!state) return undefined
  let out: React.CSSProperties | undefined
  for (const stateKey of Object.keys(state)) {
    const value = state[stateKey]
    const css = value ? TEXT_STATE_CSS[stateKey]?.[value] : undefined
    if (css) out = { ...out, ...css }
  }
  return out
}

// Render-time options threaded through the recursive node walk.
type RenderOptions = {
  // When set, plain "Register Now" text in the body is turned into a red link
  // pointing here (the webinar /access route). Lets editors type "Register Now"
  // without manually styling/linking it every time.
  registerHref?: string
}

// Lexical text-format bitmask flags.
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

function hasFormat(format: string | number | undefined, bit: number, name: string): boolean {
  if (typeof format === 'number') return (format & bit) !== 0
  if (typeof format === 'string') return format.includes(name)
  return false
}

// Convert an inline CSS string ("color: red; font-size: 18px") into a React
// style object so editor-applied colors/sizes survive to the rendered page.
function parseStyleString(style?: string): React.CSSProperties | undefined {
  if (!style || typeof style !== 'string') return undefined
  const out: Record<string, string> = {}
  for (const declaration of style.split(';')) {
    const [rawProp, ...rest] = declaration.split(':')
    const value = rest.join(':').trim()
    const prop = rawProp?.trim()
    if (!prop || !value) continue
    const camel = prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
    out[camel] = value
  }
  return Object.keys(out).length ? (out as React.CSSProperties) : undefined
}

const ALIGNMENTS = new Set(['left', 'center', 'right', 'justify'])

// Block-level nodes (paragraph/heading) carry alignment in `format` as a string.
function blockAlignStyle(node: LexicalNode): React.CSSProperties | undefined {
  if (typeof node.format === 'string' && ALIGNMENTS.has(node.format)) {
    return { textAlign: node.format as React.CSSProperties['textAlign'] }
  }
  return undefined
}

// Find "Register Now" (case-insensitive) inside a plain text run and turn each
// occurrence into a red link to the webinar access page. Returns the original
// string untouched when there is no match, so non-webinar content is unaffected.
const REGISTER_RE = /register now/gi

function linkifyRegister(text: string, href: string, keyPrefix: string): React.ReactNode {
  if (!text || !REGISTER_RE.test(text)) return text
  REGISTER_RE.lastIndex = 0

  const parts: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = REGISTER_RE.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(
      <Link key={`${keyPrefix}-reg-${i}`} href={href} className="font-bold text-[#FC0203] no-underline hover:underline">
        {match[0]}
      </Link>,
    )
    lastIndex = match.index + match[0].length
    i += 1
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts
}

function renderChildren(children: LexicalNode[] | undefined, opts: RenderOptions) {
  return children?.map((child, index) => (
    <React.Fragment key={`${child.type ?? 'node'}-${index}`}>
      {renderNode(child, index, opts)}
    </React.Fragment>
  ))
}

function renderTextNode(node: LexicalNode, index: number, opts: RenderOptions) {
  const raw = node.text ?? ''
  let content: React.ReactNode = opts.registerHref
    ? linkifyRegister(raw, opts.registerHref, `t-${index}`)
    : raw
  const format = node.format

  // Innermost first so wrappers nest cleanly.
  if (hasFormat(format, IS_CODE, 'code')) content = <code>{content}</code>
  if (hasFormat(format, IS_BOLD, 'bold')) content = <strong>{content}</strong>
  if (hasFormat(format, IS_ITALIC, 'italic')) content = <em>{content}</em>
  if (hasFormat(format, IS_UNDERLINE, 'underline')) content = <u>{content}</u>
  if (hasFormat(format, IS_STRIKETHROUGH, 'strikethrough')) content = <s>{content}</s>
  if (hasFormat(format, IS_SUBSCRIPT, 'subscript')) content = <sub>{content}</sub>
  if (hasFormat(format, IS_SUPERSCRIPT, 'superscript')) content = <sup>{content}</sup>

  // Inline color / font-size from a raw style string, plus editor text-state
  // colors/highlights (stored under "$"). Merge both into one wrapping span.
  const style = { ...stateStyle(node.$), ...parseStyleString(node.style) }
  if (Object.keys(style).length) {
    content = <span style={style}>{content}</span>
  }

  return content
}

function renderUploadNode(node: LexicalNode) {
  const src = getMediaUrl(node.value ?? null)
  if (!src) return null

  const media = node.value && typeof node.value === 'object' ? node.value : null
  const alt = media?.alt || ''
  const width = media?.width
  const height = media?.height

  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 720px"
        className="h-auto w-full rounded-lg"
      />
    )
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className="h-auto w-full rounded-lg" />
}

function renderNode(node: LexicalNode, index: number, opts: RenderOptions): React.ReactNode {
  switch (node.type) {
    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
      return <Tag style={blockAlignStyle(node)}>{renderChildren(node.children, opts)}</Tag>
    }
    case 'paragraph':
      return <p style={blockAlignStyle(node)}>{renderChildren(node.children, opts)}</p>
    case 'list':
      return node.tag === 'ol' ? <ol>{renderChildren(node.children, opts)}</ol> : <ul>{renderChildren(node.children, opts)}</ul>
    case 'listitem':
      return <li>{renderChildren(node.children, opts)}</li>
    case 'quote':
      return <blockquote style={blockAlignStyle(node)}>{renderChildren(node.children, opts)}</blockquote>
    case 'link': {
      const href = node.fields?.url ?? node.url ?? '#'
      // Open external links in a new tab; keep internal links in the same tab.
      const isExternal = /^https?:\/\//i.test(href)
      const openNewTab = node.fields?.newTab ?? isExternal
      return (
        <a
          href={href}
          target={openNewTab ? '_blank' : undefined}
          rel={openNewTab ? 'noreferrer' : undefined}
        >
          {renderChildren(node.children, opts)}
        </a>
      )
    }
    case 'horizontalrule':
    case 'horizontalRule':
      return <hr key={`hr-${index}`} className="my-6 border-t border-[#d1d5db]" />
    case 'upload':
      return renderUploadNode(node)
    case 'linebreak':
      return <br key={`br-${index}`} />
    case 'text':
    default:
      return renderTextNode(node, index, opts)
  }
}

export type RichTextDocument = {
  root?: {
    children?: LexicalNode[]
  }
}

export function RichTextRenderer({
  content,
  registerHref,
}: {
  content?: RichTextDocument | null
  registerHref?: string
}) {
  const children = content?.root?.children
  if (!children?.length) return null
  return (
    <div className="prose prose-slate max-w-none break-words">
      {renderChildren(children, { registerHref })}
    </div>
  )
}
