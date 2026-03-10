import type { Field } from 'payload'

export const linkField = (name = 'link', label = 'Link'): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'custom',
      options: [
        { label: 'Custom URL', value: 'custom' },
        { label: 'Page', value: 'page' },
        { label: 'Post', value: 'post' },
        { label: 'Category', value: 'category' },
      ],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
        description: 'Examples: /contact, https://example.com',
      },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'page',
      },
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'post',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'category',
      },
    },
    {
      name: 'newTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
})
