import { NavClient } from './NavClient'
import { getCategories, getSiteSettings } from '@/lib/api/cms'
import { resolveLinkHref } from '@/lib/utils/formatting'

const fallbackLinks = [
  { label: 'Home', href: '/' },
  { label: 'Insights', href: '/insights' },
  { label: 'White Papers', href: '/whitepapers' },
  { label: 'Webinars', href: '/webinars' },
]

const Header = async () => {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories(6)])
  const headerLinks =
    settings?.headerLinks?.map(({ item }) => ({
      label: item.label,
      href: resolveLinkHref(item),
    })) ?? fallbackLinks

  return (
    <NavClient
      siteName={settings?.siteName || 'LeadsBaton'}
      siteTagline={settings?.siteTagline || 'We Speak Your Language'}
      links={headerLinks}
      categories={categories}
    />
  )
}

export default Header
