import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { isAdmin } from '../access/cmsAccess'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Accessible image description. This is used anywhere the media appears on the site.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: {
        description: 'Optional supporting text for galleries and rich media layouts.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Optional source or photographer credit.',
      },
    },
  ],
  upload: {
    adminThumbnail: 'card',
    staticDir: path.resolve(dirname, '../../../media'),
    imageSizes: [
      {
        name: 'card',
        width: 720,
        height: 480,
        position: 'center',
      },
      {
        name: 'hero',
        width: 1440,
        height: 900,
        position: 'center',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf', 'video/mp4'],
  },
}
