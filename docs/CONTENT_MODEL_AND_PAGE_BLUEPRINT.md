# Content Model and Page Blueprint

## Final Content Types

### Insights

Use for:

- articles
- editorial analysis
- category-specific stories

Frontend surfaces:

- homepage rails
- insights listing
- insight detail
- category pages
- sidebar ranked lists

### White Papers

Use for:

- downloadable resources
- lead generation assets
- guides and reports

Frontend surfaces:

- homepage rails
- white papers listing
- white paper detail
- gated form landing pages
- trending downloads

### Webinars

Use for:

- upcoming events
- on-demand webinar pages
- registration pages

Frontend surfaces:

- homepage rails
- webinars listing
- webinar detail
- registration form landing pages
- sidebar upcoming/favorite lists

## Page-by-Page Blueprint

### Home

Content inputs:

- primary hero
- hero CTAs
- trending cards
- top picks by category
- latest insights
- latest white papers
- upcoming webinars
- category discovery cards

### Insights Listing

Content inputs:

- page hero image by category or site default
- list of insights
- sidebar `Most Downloaded White Papers`

### Insight Detail

Content inputs:

- title
- category
- hero image
- date
- author
- body
- sidebar `People's Favorite` or `Most Downloaded`

### White Papers Listing

Content inputs:

- hero image by category
- featured/trending downloads
- paginated white paper cards
- sidebar `Upcoming Webinars`

### White Paper Detail

Supported variants:

- rich content preview with CTA
- gated form page

Content inputs:

- title
- category
- cover image
- summary/body
- sponsor
- publish date
- form copy
- sidebar `Upcoming Webinars`

### Webinars Listing

Content inputs:

- featured upcoming webinar
- list of upcoming events
- `Don't Miss` content row

### Webinar Detail

Supported variants:

- event detail content page
- direct registration form page

Content inputs:

- hero image
- title
- date/time
- timezone
- sponsor
- speakers
- moderator
- detail body
- registration CTA or form
- sidebar `People's Favorite`

## Sidebar Modules

Reusable sidebar modules:

- `People's Favorite`
- `Most Downloaded White Papers`
- `Upcoming Webinars`

Each sidebar module should support:

- title
- optional accent word
- ranked items
- target links

## Category Taxonomy

Primary categories from designs:

- Technology
- Finance
- Marketing

Each category should have:

- name
- slug
- color
- hero image
- optional description

## Form Field Blueprint

### White Paper Download Form

Fields:

- name
- email
- job title
- company
- country
- newsletter opt-in
- privacy/terms consent

### Webinar Registration Form

Fields:

- name
- email
- job title
- company
- country
- newsletter opt-in
- privacy/terms consent

## Asset Requirements

Editors need to manage:

- site logo
- social icons or links
- hero banners per category
- content cover images
- webinar speaker photos
- downloadable white paper files

## Editorial Ranking Data

To support sidebars and homepage callouts, content should support:

- `featured`
- `trending`
- `manualRank`
- `mostDownloaded` derivation or manual override

## Implementation Notes for Current Repo

Current homepage in:

- `frontend/app/(public)/page.tsx`

Current generic content path:

- `frontend/app/(public)/[contentType]/page.tsx`
- `frontend/app/(public)/[contentType]/[slug]/page.tsx`

Recommended direction:

- replace or reduce generic catch-all templates
- use dedicated routes for:
  - insights
  - whitepapers
  - webinars

Reason:

- page layouts differ too much between content types
- dedicated routes will keep styling and data logic simpler

## Final Outcome

The target system is not just a blog.

It is a structured media platform with:

- editorial content
- gated demand-generation assets
- webinar/event marketing pages
- category-led discovery
- reusable UI and CMS-controlled merchandising
