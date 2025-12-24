import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client)
export type Db = ReturnType<typeof drizzle>
export type Tx = Parameters<
  Parameters<typeof db.transaction>[0]
>[0]
