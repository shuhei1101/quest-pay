import { z } from "zod";

/** DBのお知らせスキーマ */
export const rawInformation = z.object({
  id: z.number(),
  body: z.string(),
  created_at: z.string(),
})
export type RawInformation = z.infer<typeof rawInformation>
