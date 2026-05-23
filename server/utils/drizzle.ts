import { neon } from '@neondatabase/serverless'

import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../db/schema'

export const tables = schema

// Create a Neon Client
const sql = neon(process.env.DATABASE_URL!)

// Create the drizzle instance
export function useDrizzle() {
  return drizzle(sql, { schema })
}
