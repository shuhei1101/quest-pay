import { z } from "zod"

/** クエスト詳細スキーマ（共通） */
export const QuestDetailScheme = z.object({
  level: z.number().min(1, { error: "レベルは1以上で入力してください。" }),
  successCondition: z.string().nonempty({ error: "成功条件は必須です。" }).max(200, { error: "成功条件は200文字以下で入力してください。" }),
  requiredCompletionCount: z.number().min(1, { error: "目標回数は1以上で入力してください。" }),
  reward: z.number().min(0, { error: "報酬額は0以上で入力してください。" }),
  childExp: z.number().min(0, { error: "獲得経験値は0以上で入力してください。" }),
  requiredClearCount: z.number().min(0, { error: "必要クリア回数は0以上で入力してください。" }).nullable(),
})

/** クエストフォームベーススキーマ（共通部分） */
export const BaseQuestFormScheme = z.object({
  name: z.string().nonempty({ error: "クエスト名は必須です。" }).min(3, { error: "クエスト名は3文字以上で入力してください。" }).max(20, { error: "クエスト名は20文字以下で入力してください。" }),
  iconId: z.number(),
  iconColor: z.string(),
  tags: z.array(z.string()),
  categoryId: z.number().nullable(),
  ageFrom: z.number().nullable(),
  ageTo: z.number().nullable(),
  monthFrom: z.number().nullable(),
  monthTo: z.number().nullable(),
  client: z.string(),
  requestDetail: z.string(),
  details: z.array(QuestDetailScheme).min(1, { error: "最低でも1つのレベル詳細を追加してください。" }),
})

/** クエストフォームベース型 */
export type BaseQuestFormType = z.infer<typeof BaseQuestFormScheme>

/** 年齢・月のバリデーションを追加する共通refine */
export const addAgeMonthRefinements = <T extends z.ZodObject<z.ZodRawShape>>(schema: T) => {
  return schema
    .refine((data) => {
      const formData = data as BaseQuestFormType
      if (formData.ageFrom !== null && formData.ageTo !== null) {
        return formData.ageFrom < formData.ageTo
      }
      return true
    }, {
      message: "対象年齢(開始)は対象年齢(終了)以下である必要があります",
      path: ["ageFrom"]
    })
    .refine((data) => {
      const formData = data as BaseQuestFormType
      if (formData.monthFrom !== null && formData.monthTo === null) {
        return false
      }
      return true
    }, {
      message: "公開終了月は必須です。",
      path: ["monthTo"]
    })
    .refine((data) => {
      const formData = data as BaseQuestFormType
      if (formData.monthTo !== null && formData.monthFrom === null) {
        return false
      }
      return true
    }, {
      message: "公開開始月は必須です。",
      path: ["monthFrom"]
    })
    .refine((data) => {
      const formData = data as BaseQuestFormType
      if (formData.monthFrom !== null && formData.monthTo !== null) {
        return formData.monthFrom < formData.monthTo
      }
      return true
    }, {
      message: "公開開始月は公開終了月以下である必要があります",
      path: ["monthFrom"]
    })
}

/** レベル詳細がデフォルト値かどうかを判定する */
export const isDefaultDetail = (detail: BaseQuestFormType["details"][number]): boolean => {
  return (
    detail.successCondition === "" &&
    (detail.requiredClearCount === 1 || detail.requiredClearCount === null) &&
    detail.reward === 0 &&
    detail.childExp === 0 &&
    detail.requiredCompletionCount === 1
  )
}
