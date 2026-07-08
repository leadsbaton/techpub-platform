import { NavClient } from './NavClient'
import { getCategories, getContentTypes, getSiteSettings } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'

const Header = async () => {
  const [settings, contentTypes, categories] = await Promise.all([
    getSiteSettings(),
    getContentTypes(12),
    getCategories(50),
  ])

  const typeCategories = contentTypes.map((contentType) => {
      const config = getContentTypeConfigByType(contentType.key, contentTypes)
      return {
        label: config.pluralLabel,
        href: config.routeBase,
        dropdownEnabled: categories.length > 0,
        categories,
      }
    })

  const links = [
    { label: 'Home', href: '/', dropdownEnabled: false, categories: [] },
    ...typeCategories,
  ]

  return (
    <NavClient
      siteName={settings?.siteName || 'LeadsBaton'}
      links={links}
    />
  )
}

export default Header
