import ListingPage from '../[contentType]/page'

export const dynamic = 'force-dynamic'
export { generateMetadata } from '../[contentType]/page'

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>
}) {
  return ListingPage({
    params: Promise.resolve({ contentType: 'insights' }),
    searchParams,
  })
}
