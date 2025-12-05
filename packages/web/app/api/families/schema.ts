import { z } from "zod"
import { FamilyCreateFormSchema } from "../../families/new/_schema/familyCreateFormSchema"

/** 家族作成リクエストスキーマ */
export const FamilyCreateRequestSchema = z.object({
  userId: z.string(),
  form: FamilyCreateFormSchema,
})
export type FamilyCreateRequest = z.infer<typeof FamilyCreateRequestSchema>
