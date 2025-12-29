import { BirthdaySchema, DisplayIdSchema, IconColorSchema, IconIdSchema, LocalNameSchema, OnlineNameSchema, UserNameSchema } from "@/app/(core)/schema"
import { z } from "zod"

/** 家族フォームスキーマ */
export const FamilyRegisterFormSchema = z.object({
  displayId: DisplayIdSchema,
  localName: LocalNameSchema,
  onlineName: OnlineNameSchema,
  familyIconId: IconIdSchema,
  familyIconColor: IconColorSchema,
  parentName: UserNameSchema,
  parentIconId: IconIdSchema,
  parentIconColor: IconColorSchema,
  parentBirthday: BirthdaySchema,
})

/** 家族フォームスキーマの型 */
export type FamilyRegisterFormType = z.infer<typeof FamilyRegisterFormSchema>
