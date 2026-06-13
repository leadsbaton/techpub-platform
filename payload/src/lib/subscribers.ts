import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

type SubscriberData = RequiredDataFromCollectionSlug<'subscribers'>

/**
 * Race-safe create for a subscriber.
 *
 * All public routes do `find by email → create if missing`, which has a TOCTOU
 * window: two concurrent first-time requests for the same email both miss the
 * find, both call create, and the second hits the unique-email index and throws
 * an unhandled 500. This helper performs the create and, if it fails (most
 * likely because a concurrent request won the race), re-finds the row and
 * updates it instead — so the operation is idempotent under concurrency.
 */
export async function createOrUpdateSubscriber(payload: Payload, data: SubscriberData) {
  try {
    return await payload.create({
      collection: 'subscribers',
      data,
      overrideAccess: true,
    })
  } catch (error) {
    const existing = await payload.find({
      collection: 'subscribers',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        email: {
          equals: data.email,
        },
      },
    })

    if (existing.docs[0]) {
      return payload.update({
        collection: 'subscribers',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    }

    // Not a duplicate-email race — surface the original error.
    throw error
  }
}
