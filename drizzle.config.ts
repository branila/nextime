import { defineConfig } from 'drizzle-kit'
if (!Deno.env.get('DATABASE_URL')) throw new Error('DATABASE_URL is not set')

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',

  dbCredentials: {
    url: Deno.env.get('DATABASE_URL') || ''
  },

  verbose: true,
  strict: true,
  dialect: 'postgresql'
})
