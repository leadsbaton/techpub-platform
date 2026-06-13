import React from 'react'
import Image from 'next/image'

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
  children?: LexicalNode[]
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

function renderChildren(children?: LexicalNode[]) {
  return children?.map((child, index) => (
    <React.Fragment key={`${child.type ?? 'node'}-${index}`}>
      {renderNode(child, index)}
    </React.Fragment>
  ))
}

function renderTextNode(node: LexicalNode) {
  let content: React.ReactNode = node.text ?? ''
  const format = node.format

  // Innermost first so wrappers nest cleanly.
  if (hasFormat(format, IS_CODE, 'code')) content = <code>{content}</code>
  if (hasFormat(format, IS_BOLD, 'bold')) content = <strong>{content}</strong>
  if (hasFormat(format, IS_ITALIC, 'italic')) content = <em>{content}</em>
  if (hasFormat(format, IS_UNDERLINE, 'underline')) content = <u>{content}</u>
  if (hasFormat(format, IS_STRIKETHROUGH, 'strikethrough')) content = <s>{content}</s>
  if (hasFormat(format, IS_SUBSCRIPT, 'subscript')) content = <sub>{content}</sub>
  if (hasFormat(format, IS_SUPERSCRIPT, 'superscript')) content = <sup>{content}</sup>

  // Inline color / font-size / etc. set in the editor.
  const style = parseStyleString(node.style)
  if (style) {
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

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
      return <Tag style={blockAlignStyle(node)}>{renderChildren(node.children)}</Tag>
    }
    case 'paragraph':
      return <p style={blockAlignStyle(node)}>{renderChildren(node.children)}</p>
    case 'list':
      return node.tag === 'ol' ? <ol>{renderChildren(node.children)}</ol> : <ul>{renderChildren(node.children)}</ul>
    case 'listitem':
      return <li>{renderChildren(node.children)}</li>
    case 'quote':
      return <blockquote style={blockAlignStyle(node)}>{renderChildren(node.children)}</blockquote>
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
          {renderChildren(node.children)}
        </a>
      )
    }
    case 'upload':
      return renderUploadNode(node)
    case 'linebreak':
      return <br key={`br-${index}`} />
    case 'text':
    default:
      return renderTextNode(node)
  }
}

export type RichTextDocument = {
  root?: {
    children?: LexicalNode[]
  }
}

export function RichTextRenderer({ content }: { content?: RichTextDocument | null }) {
  const children = content?.root?.children
  if (!children?.length) return null
  return <div className="prose prose-slate max-w-none break-words">{renderChildren(children)}</div>
}
