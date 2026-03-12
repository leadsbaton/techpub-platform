import ContentDetailPage from '../../[contentType]/[slug]/page'

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return ContentDetailPage({
    params: Promise.resolve({ contentType: 'insights', slug }),
  })
}
