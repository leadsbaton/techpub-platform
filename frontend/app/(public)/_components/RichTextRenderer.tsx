import React from 'react'

type LexicalNode = {
  type?: string
  tag?: string
  text?: string
  format?: string | number
  url?: string
  children?: LexicalNode[]
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

  const hasBold =
    typeof format === 'string' ? format.includes('bold') : typeof format === 'number' ? (format & 1) !== 0 : false
  const hasItalic =
    typeof format === 'string' ? format.includes('italic') : typeof format === 'number' ? (format & 2) !== 0 : false

  if (hasBold) content = <strong>{content}</strong>
  if (hasItalic) content = <em>{content}</em>

  return content
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'heading': {
      const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
      return <Tag>{renderChildren(node.children)}</Tag>
    }
    case 'paragraph':
      return <p>{renderChildren(node.children)}</p>
    case 'list':
      return node.tag === 'ol' ? <ol>{renderChildren(node.children)}</ol> : <ul>{renderChildren(node.children)}</ul>
    case 'listitem':
      return <li>{renderChildren(node.children)}</li>
    case 'quote':
      return <blockquote>{renderChildren(node.children)}</blockquote>
    case 'link':
      return (
        <a href={node.url} target="_blank" rel="noreferrer">
          {renderChildren(node.children)}
        </a>
      )
    case 'linebreak':
      return <br key={`br-${index}`} />
    case 'text':
    default:
      return renderTextNode(node)
  }
}

type RichTextDocument = {
  root?: {
    children?: LexicalNode[]
  }
}

export function RichTextRenderer({ content }: { content?: RichTextDocument | null }) {
  const children = content?.root?.children
  if (!children?.length) return null
  return <div className="prose prose-slate max-w-none">{renderChildren(children)}</div>
}
