# Backend and CMS Specification

## App Location

Backend app root:

- `payload/`

Main config:

- `payload/src/payload.config.ts`

## Current Backend Baseline

Existing collections:

- `Users`
- `Media`
- `Categories`
- `Tags`
- `Authors`
- `Posts`
- `Pages`
- `Subscribers`

Existing globals:

- `SiteSettings`

## Recommended CMS Model

### Keep Existing

- `Users`
- `Media`
- `Categories`
- `Tags`
- `Authors`
- `Pages`
- `Subscribers`
- `SiteSettings`

### Add New Collections

- `WhitePapers`
- `Webinars`
- `Leads`
- `Registrations`
- `HomepageSections` or `HomepageConfig`

### Optional

- `Navigation` as its own global if `SiteSettings` becomes too large
- `Footer` as its own global if needed
- `SearchIndex` only if later required

## Recommended Collection Definitions

### Categories

Purpose:

- editorial taxonomy
- visual grouping for category landing pages

Fields:

- `name`
- `slug`
- `description`
- `color`
- `heroImage`
- `sortOrder`
- `featured`

### Authors

Fields:

- `name`
- `slug`
- `title`
- `bio`
- `avatar`
- `socialLinks`

### Posts

Recommended purpose:

- insights only

Fields:

- `title`
- `slug`
- `excerpt`
- `content`
- `featuredImage`
- `category`
- `tags`
- `author`
- `publishedAt`
- `featured`
- `trending`
- `seo`

### WhitePapers

Fields:

- `title`
- `slug`
- `summary`
- `content`
- `coverImage`
- `downloadFile`
- `category`
- `tags`
- `author`
- `sponsor`
- `publishedAt`
- `featured`
- `trending`
- `gated`
- `formVariant`
- `seo`

### Webinars

Fields:

- `title`
- `slug`
- `summary`
- `content`
- `heroImage`
- `category`
- `tags`
- `sponsor`
- `scheduledAt`
- `timezone`
- `status`
- `registrationMode`
- `externalRegistrationUrl`
- `featured`
- `seo`

Speaker subfields:

- `name`
- `role`
- `company`
- `photo`

Moderator subfields:

- `name`
- `role`
- `company`
- `photo`

### Leads

Purpose:

- store white paper download requests

Fields:

- `resourceType`
- `resourceId`
- `name`
- `email`
- `jobTitle`
- `company`
- `country`
- `newsletterOptIn`
- `consentAccepted`
- `submittedAt`

### Registrations

Purpose:

- store webinar registrations

Fields:

- `webinar`
- `name`
- `email`
- `jobTitle`
- `company`
- `country`
- `newsletterOptIn`
- `consentAccepted`
- `submittedAt`

## Global Configurations

### SiteSettings

Current file:

- `payload/src/globals/SiteSettings.ts`

Extend with:

- navigation logo
- search enablement
- social links
- footer columns
- legal links
- newsletter copy
- default sidebar titles

### HomepageConfig

Recommended new global:

- `payload/src/globals/Homepage.ts`

Fields:

- hero configuration
- trending section title
- selected featured items
- selected category blocks
- selected webinar highlights
- section visibility toggles

## Access Rules

Public read:

- site settings
- categories
- authors
- published posts
- published white papers
- published webinars
- pages

Authenticated admin only:

- user management
- submissions review
- unpublished drafts

## API and Query Requirements

Backend must support queries for:

- featured homepage data
- latest insights
- latest white papers
- upcoming webinars
- category-specific feeds
- author pages
- tag pages
- ranked items like most downloaded
- related content for detail pages

## Submission Flows

### White Paper Download Flow

1. user opens detail page
2. user fills gated form
3. backend validates required fields
4. lead is stored in `Leads`
5. file access or success state is returned

### Webinar Registration Flow

1. user opens webinar detail page
2. user fills form or clicks external registration
3. if internal:
   - validate
   - store in `Registrations`
   - return success state

## Migration Strategy

Current repo uses `Posts` with content types in the frontend query layer.

Recommended migration:

1. keep current `Posts` content functioning
2. introduce `WhitePapers` and `Webinars`
3. update frontend fetchers
4. migrate existing content if needed
5. retire generic `type` branching later

## Validation Rules

Required examples:

- `slug` unique per collection
- `scheduledAt` required for webinars
- `downloadFile` required if white paper is gated/downloadable
- `email` valid for leads and registrations
- `category` required for all editorial content

## Backend Acceptance Criteria

- editors can manage all content through Payload admin
- frontend can fetch all required page data cleanly
- white paper and webinar forms store submissions
- site navigation/footer and homepage sections are editable
- schema is clear enough to avoid overloading one generic content type
