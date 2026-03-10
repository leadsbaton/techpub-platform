import type { FieldHook } from 'payload'

const formatSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const slugHook =
  (fallbackField = 'title'): FieldHook =>
  ({ data, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return formatSlug(value)
    }

    const fallbackValue = data?.[fallbackField]
    if (typeof fallbackValue === 'string' && fallbackValue.length > 0) {
      return formatSlug(fallbackValue)
    }

    return value
  }
