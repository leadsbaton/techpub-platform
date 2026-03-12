import { NavClient } from './NavClient'
import { getCategoriesForType, getContentTypes, getSiteSettings } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'

const Header = async () => {
  const [settings, contentTypes] = await Promise.all([
    getSiteSettings(),
    getContentTypes(12),
  ])

  const typeCategories = await Promise.all(
    contentTypes.map(async (contentType) => {
      const config = getContentTypeConfigByType(contentType.key, contentTypes)
      const categories = await getCategoriesForType(contentType.key, 8)
      return {
        label: config.pluralLabel,
        href: config.routeBase,
        dropdownEnabled: categories.length > 0,
        categories,
      }
    }),
  )

  const links = [
    { label: 'Home', href: '/', dropdownEnabled: false, categories: [] },
    ...typeCategories,
  ]

  return (
    <NavClient
      siteName={settings?.siteName || 'LeadsBaton'}
      siteTagline={settings?.siteTagline || 'We Speak Your Language'}
      links={links}
    />
  )
}

export default Header
