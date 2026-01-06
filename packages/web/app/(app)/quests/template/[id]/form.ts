import { z } from "zod"
import { addAgeMonthRefinements, BaseQuestFormScheme, isDefaultDetail as baseIsDefaultDetail } from "../../form"

/** テンプレートクエストフォームスキーマ */
export const TemplateQuestFormScheme = addAgeMonthRefinements(BaseQuestFormScheme)

/** テンプレートクエストフォームスキーマの型 */
export type TemplateQuestFormType = z.infer<typeof TemplateQuestFormScheme>

/** レベル詳細がデフォルト値かどうかを判定する */
export const isDefaultDetail = baseIsDefaultDetail
