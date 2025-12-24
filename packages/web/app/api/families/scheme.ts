import { z } from "zod"
import { FamilyEntityScheme } from "./entity"
import { FamilyRegisterFormSchema } from "@/app/(app)/families/new/form"

/** クエスト挿入リクエストスキーマ */
export const PostFamilyRequestScheme = z.object({
  form: FamilyRegisterFormSchema
})
export type PostFamilyRequest = z.infer<typeof PostFamilyRequestScheme>

/** クエスト挿入レスポンススキーマ */
export const PostFamilyResponseScheme = z.object({
  familyId: FamilyEntityScheme.shape.id
})
export type PostFamilyResponse = z.infer<typeof PostFamilyResponseScheme>
