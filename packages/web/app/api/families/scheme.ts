import { z } from "zod"
import { FamilyRegisterFormSchema } from "@/app/(app)/families/new/form"
import { FamilySelectSchema } from "@/drizzle/schema"

/** クエスト挿入リクエストスキーマ */
export const PostFamilyRequestScheme = z.object({
  form: FamilyRegisterFormSchema
})
export type PostFamilyRequest = z.infer<typeof PostFamilyRequestScheme>

/** クエスト挿入レスポンススキーマ */
export const PostFamilyResponseScheme = z.object({
  familyId: FamilySelectSchema.shape.id
})
export type PostFamilyResponse = z.infer<typeof PostFamilyResponseScheme>
