import { z } from "zod"
import { addAgeMonthRefinements, BaseQuestFormScheme, isDefaultDetail as baseIsDefaultDetail } from "../../form"

/** 公開クエストフォームスキーマ */
export const PublicQuestFormScheme = addAgeMonthRefinements(BaseQuestFormScheme)

/** 公開クエストフォームスキーマの型 */
export type PublicQuestFormType = z.infer<typeof PublicQuestFormScheme>

/** レベル詳細がデフォルト値かどうかを判定する */
export const isDefaultDetail = baseIsDefaultDetail
