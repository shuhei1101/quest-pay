import { z } from "zod"
import { BirthdaySchema, IconColorSchema, IconIdSchema } from "@/app/(core)/schema"

/** 子供フォームスキーマ */
export const ChildFormSchema = z.object({
  name: z.string({error: "氏名は必須です。"}),
  iconId: IconIdSchema,
  iconColor: IconColorSchema,
  birthday: BirthdaySchema,
})
/** 子供フォームスキーマの型 */
export type ChildFormType = z.infer<typeof ChildFormSchema>
