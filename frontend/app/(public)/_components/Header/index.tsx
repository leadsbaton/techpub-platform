import { NavClient } from './NavClient'
import { getCategories, getContentTypes, getSiteSettings } from '@/lib/api/cms'
import { getContentTypeConfigByType } from '@/lib/utils/contentTypes'

const Header = async () => {
  const [settings, categories, contentTypes] = await Promise.all([
    getSiteSettings(),
    getCategories(6),
    getContentTypes(12),
  ])

  const dynamicLinks = [
    { label: 'Home', href: '/', dropdownEnabled: false },
    ...contentTypes.map((contentType) => {
      const config = getContentTypeConfigByType(contentType.key, contentTypes)
      return {
        label: config.pluralLabel,
        href: config.routeBase,
        dropdownEnabled: true,
      }
    }),
  ]

  const links = dynamicLinks.length > 1
    ? dynamicLinks
    : [
        { label: 'Home', href: '/', dropdownEnabled: false },
        { label: 'Insights', href: '/insights', dropdownEnabled: true },
        { label: 'White Papers', href: '/whitepapers', dropdownEnabled: true },
        { label: 'Webinars', href: '/webinars', dropdownEnabled: true },
      ]

  return (
    <NavClient
      siteName={settings?.siteName || 'LeadsBaton'}
      siteTagline={settings?.siteTagline || 'We Speak Your Language'}
      links={links}
      categories={categories}
    />
  )
}

export default Header
