import { SSOStrategy } from '@/authStrategy/ssoStrategy'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    disableLocalStrategy: {
      enableFields: true,
    },
    strategies: [SSOStrategy],
    loginWithUsername: {
      allowEmailLogin: true,
      requireUsername: true,
      requireEmail: false
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
