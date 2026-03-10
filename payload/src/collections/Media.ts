import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'textarea',
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
  upload: {
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
