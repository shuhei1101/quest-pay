import { z } from "zod"
import { addAgeMonthRefinements, BaseQuestFormScheme, isDefaultDetail as baseIsDefaultDetail } from "../../form"

/** 家族クエストフォームスキーマ */
export const FamilyQuestFormScheme = addAgeMonthRefinements(
  BaseQuestFormScheme.extend({
    childIds: z.array(z.string()),
  })
)

/** 家族クエストフォームスキーマの型 */
export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormScheme>
