# TechPub Redesign Implementation Plan

## Objective

Rebuild the TechPub platform as a CMS-driven publishing system with:

- a public Next.js frontend in `frontend/`
- a Payload CMS backend in `payload/`
- reusable UI for insights, white papers, webinars, categories, and static pages
- lead capture and webinar registration flows
- shared navigation, footer, hero, card, sidebar, and editorial blocks

This document is the execution plan for the redesign reflected in the supplied design screenshots.

## Current Repo Baseline

Frontend:

- `frontend/app/(public)/page.tsx`
- `frontend/app/(public)/insights/page.tsx`
- `frontend/app/(public)/insights/[slug]/page.tsx`
- `frontend/app/(public)/categories/[categorySlug]/page.tsx`
- `frontend/app/(public)/authors/[slug]/page.tsx`
- `frontend/app/(public)/tags/[slug]/page.tsx`
- `frontend/app/(public)/_components/`
- `frontend/lib/api/cms.ts`
- `frontend/lib/api/insights.ts`

Backend:

- `payload/src/payload.config.ts`
- `payload/src/collections/Posts.ts`
- `payload/src/collections/Categories.ts`
- `payload/src/collections/Authors.ts`
- `payload/src/collections/Tags.ts`
- `payload/src/collections/Pages.ts`
- `payload/src/collections/Subscribers.ts`
- `payload/src/globals/SiteSettings.ts`

## System Scope

Core product areas:

- Home
- Insights listing and detail
- White papers listing and detail
- Webinar listing and detail
- Category landing pages
- Search
- Contact, support, legal pages
- CMS-managed navigation and footer
- CMS-managed featured sections and hero banners
- gated forms for white paper downloads
- registration forms for webinars

## Delivery Phases

### Phase 1: Foundation

- define final content model in Payload
- add missing collections for white papers, webinars, leads, and registrations
- extend site settings and homepage/global configuration
- standardize frontend design tokens and layout shell

### Phase 2: Shared UI

- rebuild header and footer from design
- create section headers, hero banners, ranked sidebars, and content cards
- create common metadata and category badge components
- create form fields and consent UI blocks

### Phase 3: Core Pages

- homepage
- insights list/detail
- white papers list/detail
- webinars list/detail
- category landing pages

### Phase 4: Editorial and Lead Flows

- download-gated white paper flow
- webinar registration flow
- related content and sidebar rankings
- search and static pages

### Phase 5: Hardening

- SEO and metadata
- schema markup
- pagination or load more strategy
- responsive behavior
- content QA
- admin editorial workflow QA

## Final Information Architecture

Primary navigation:

- Home
- Insights
- White Papers
- Webinars
- Search

Secondary/support links in footer:

- Insights
- White Papers
- Webinars
- Contact
- Support
- Legal

Content taxonomies:

- categories
- tags
- authors

## Required Frontend Deliverables

- responsive shell matching the design language
- hero banners by category and content type
- reusable card patterns for:
  - insight cards
  - white paper cards
  - webinar cards
  - trending/featured cards
  - sidebar list items
- gated forms with validation
- active nav states and dropdowns
- homepage editorial sections:
  - hero
  - trending or just-in block
  - top picks
  - latest insights
  - latest white papers
  - upcoming webinars
  - category discovery

## Required Backend Deliverables

- Payload collection structure for all content types
- admin-editable site settings, homepage config, navigation, and footer
- stored lead submissions for white papers
- stored webinar registrations
- media management
- frontend-ready queries for featured, latest, trending, and ranked content

## Key Decisions

### Keep vs split content model

Recommended direction:

- keep `posts` only for insights or remove it after migration
- create first-class collections for `whitepapers` and `webinars`

Reason:

- design and behavior differ materially
- gated white paper forms and webinar event metadata do not fit well in a single generic post type long-term
- admin editing will be clearer

### Homepage control

Recommended direction:

- make homepage section order and featured content partially CMS-driven
- keep structural blocks fixed in code
- allow editors to override content items manually

Reason:

- avoids overcomplicated page-builder behavior
- still supports editorial control

## Recommended Build Order

1. extend Payload schema
2. add frontend API methods
3. rebuild header/footer/layout
4. build shared cards and sidebar modules
5. implement homepage
6. implement insights list/detail
7. implement white papers list/detail and download form
8. implement webinars list/detail and registration form
9. implement category pages
10. implement search and support pages

## Definition of Done

The redesign is complete when:

- editors can create and manage all content types in Payload
- the frontend renders all major page types from CMS data
- navigation/footer/hero/sidebar content is manageable
- white paper download and webinar registration flows persist submissions
- the pages are responsive and align with the provided design direction
- the current placeholder homepage and generic listing experience are replaced
