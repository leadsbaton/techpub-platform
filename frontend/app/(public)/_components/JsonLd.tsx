// Structured data. Google uses this to understand that a page is an article with a
// title, publisher and date rather than an anonymous block of HTML — which is what
// makes a page eligible to surface for a search on its own headline.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // The payload is our own structured data, never user input rendered as markup.
      // `<` is escaped so a stray character in a title cannot close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
