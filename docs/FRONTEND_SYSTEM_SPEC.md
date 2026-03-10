# Frontend System Specification

## App Location

Frontend app root:

- `frontend/`

Primary route group:

- `frontend/app/(public)/`

## Design Direction

Based on the supplied screenshots, the frontend should use:

- light neutral page background
- black primary text
- muted gray metadata
- red as the primary accent
- category-specific accents:
  - Technology: blue
  - Finance: red
  - Marketing: green
- rounded hero banners
- thin divider lines in section headers
- strong image-led cards
- spacious desktop layout with simple, editorial composition

## Frontend Route Map

Required routes:

- `/`
- `/insights`
- `/insights/[slug]`
- `/whitepapers`
- `/whitepapers/[slug]`
- `/webinars`
- `/webinars/[slug]`
- `/categories/[categorySlug]`
- `/authors/[slug]`
- `/tags/[slug]`
- `/search`
- `/contact`
- `/support`
- `/legal`

Optional future routes:

- `/downloads`
- `/privacy`
- `/terms`

## Page Templates

### Home

Sections:

- header
- hero banner or editorial hero
- trending/just-in strip
- top picks by category
- latest insights
- latest white papers
- upcoming webinars
- category discovery
- footer

### Insights Listing

Sections:

- category hero or page title section
- featured or highlighted insight
- listing feed
- sidebar ranked list
- load more or pagination

### Insight Detail

Sections:

- hero image or banner
- title, date, author, category
- rich text body
- optional bullet highlights
- sidebar ranked list
- related content

### White Papers Listing

Sections:

- hero banner
- latest white papers grid/list
- optional trending downloads strip
- sidebar upcoming webinars
- load more

### White Paper Detail

Two supported layouts from supplied designs:

- content-rich detail page with body and CTA
- gated download form landing page

Sections:

- title
- cover image or thumbnail
- summary/body
- download CTA or form
- sidebar with upcoming webinars or popular resources

### Webinars Listing

Sections:

- page title or hero
- upcoming webinar cards
- optional featured webinar block
- don't miss section
- load more

### Webinar Detail

Two supported layouts from supplied designs:

- event detail with rich content and speaker section
- registration form landing page

Sections:

- hero image
- schedule metadata
- title
- summary/body
- speakers
- moderator
- registration button or form
- sidebar favorites

## Component Inventory

### Layout

- `SiteHeader`
- `MainNav`
- `NavDropdown`
- `SearchTrigger`
- `SearchOverlay`
- `SiteFooter`
- `Container`
- `SectionHeader`
- `SidebarPanel`
- `HeroBanner`

### Content Cards

- `InsightCard`
- `WhitePaperCard`
- `WebinarCard`
- `FeaturedCard`
- `MiniCard`
- `RankedListItem`
- `CategoryBadge`
- `PostMeta`

### Editorial Blocks

- `TrendingSection`
- `TopPicksSection`
- `CategoryShowcase`
- `UpcomingWebinarsSection`
- `MostDownloadedPanel`
- `PeoplesFavoritePanel`
- `RelatedContentSection`

### Forms

- `LeadCaptureForm`
- `WebinarRegistrationForm`
- `TextInput`
- `EmailInput`
- `CheckboxField`
- `ConsentNotice`
- `SubmitButton`

## Suggested File Structure

Recommended additions under `frontend/app/(public)/_components/`:

- `Layout/SiteHeader.tsx`
- `Layout/SiteFooter.tsx`
- `Layout/Container.tsx`
- `Navigation/MainNav.tsx`
- `Navigation/NavDropdown.tsx`
- `Search/SearchOverlay.tsx`
- `Hero/HeroBanner.tsx`
- `Sections/SectionHeader.tsx`
- `Sections/TrendingSection.tsx`
- `Sections/TopPicksSection.tsx`
- `Sections/UpcomingWebinarsSection.tsx`
- `Sidebar/SidebarPanel.tsx`
- `Sidebar/RankedList.tsx`
- `Cards/InsightCard.tsx`
- `Cards/WhitePaperCard.tsx`
- `Cards/WebinarCard.tsx`
- `Cards/FeaturedCard.tsx`
- `Forms/LeadCaptureForm.tsx`
- `Forms/WebinarRegistrationForm.tsx`

This can coexist with the current components while the redesign is implemented incrementally.

## Design Tokens

Add or standardize tokens in:

- `frontend/app/globals.css`

Recommended token groups:

- page background
- text colors
- muted text colors
- accent red
- category colors
- border color
- radius scale
- container width
- spacing scale
- heading sizes
- shadow presets

## Data Requirements Per Component

`HeroBanner`

- title
- background image
- optional subtitle
- optional CTA
- optional category color

`InsightCard`

- title
- slug
- category
- image
- date
- excerpt

`WhitePaperCard`

- title
- slug
- category
- cover image
- sponsor/author
- published date
- gated state

`WebinarCard`

- title
- slug
- image
- category
- scheduled time
- sponsor
- status

`RankedListItem`

- rank
- title
- slug
- optional category

## API Contracts Needed by Frontend

Frontend needs fetch helpers for:

- homepage payload
- insights list/detail
- white papers list/detail
- webinars list/detail
- category page content
- related content
- ranked content lists
- lead form submission
- webinar form submission

Current API layer:

- `frontend/lib/api/cms.ts`
- `frontend/lib/api/insights.ts`

This should be extended or split into:

- `frontend/lib/api/home.ts`
- `frontend/lib/api/insights.ts`
- `frontend/lib/api/whitepapers.ts`
- `frontend/lib/api/webinars.ts`
- `frontend/lib/api/forms.ts`

## Responsive Behavior

Desktop:

- two-column layouts for listings with sidebar
- multi-column card grids
- full-width hero banners

Tablet:

- reduced columns
- sidebar may move below main content

Mobile:

- stacked layout
- condensed nav
- scrollable carousels only where necessary
- forms remain single-column

## SEO Requirements

Each page should support:

- title
- meta description
- OG image
- canonical URL
- breadcrumbs where useful

Schema:

- article schema for insights
- event schema for webinars
- organization schema globally

## Frontend Acceptance Criteria

- page shell aligns with supplied visual direction
- all key page types are CMS-driven
- category accents render correctly
- sidebars and ranked lists are reusable
- forms validate and submit successfully
- mobile layout remains readable and navigable
