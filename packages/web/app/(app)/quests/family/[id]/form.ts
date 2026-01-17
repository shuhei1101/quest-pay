import { z } from "zod"
import { addAgeMonthRefinements, BaseQuestFormScheme, isDefaultDetail as baseIsDefaultDetail } from "../../form"

/** 子供設定スキーマ */
export const ChildSettingScheme = z.object({
  childId: z.string(),
  isActivate: z.boolean(),
})

/** 家族クエストフォームスキーマ */
export const FamilyQuestFormScheme = addAgeMonthRefinements(
  BaseQuestFormScheme.extend({
    childSettings: z.array(ChildSettingScheme),
  })
)

/** 家族クエストフォームスキーマの型 */
export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormScheme>

/** 子供設定の型 */
export type ChildSettingType = z.infer<typeof ChildSettingScheme>
