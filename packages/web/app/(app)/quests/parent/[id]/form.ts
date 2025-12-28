import { z } from "zod";

/** クエストフォームスキーマ */
export const FamilyQuestFormScheme = z.object({
  name: z.string().nonempty({error: "クエスト名は必須です。"}).min(3, { error: "クエスト名は3文字以上で入力してください。"}).max(20, { error: "クエスト名は20文字以下で入力してください。"}),
  iconId: z.number(),
  iconColor: z.string(),
  tags: z.array(z.string()),
  isPublic: z.boolean(),
  isClientPublic: z.boolean(),
  isRequestDetailPublic: z.boolean(),
  categoryId: z.number().nullable(),
  ageFrom: z.number().nullable(),
  ageTo: z.number().nullable(),
  monthFrom: z.number().nullable(),
  monthTo: z.number().nullable(),
  client: z.string(),
  requestDetail: z.string(),
  details: z.array(z.object({
    level: z.number().min(1, { error: "レベルは1以上で入力してください。" }),
    successCondition: z.string().nonempty({ error: "成功条件は必須です。" }).max(200, { error: "成功条件は200文字以下で入力してください。" }),
    requiredCompletionCount: z.number().min(1, { error: "目標回数は1以上で入力してください。" }),
    reward: z.number().min(0, { error: "報酬額は0以上で入力してください。" }),
    childExp: z.number().min(0, { error: "獲得経験値は0以上で入力してください。" }),
    requiredClearCount: z.number().min(0, { error: "必要クリア回数は0以上で入力してください。" }),
  })).min(1, { error: "最低でも1つのレベル詳細を追加してください。" }),
  childIds: z.array(z.string())
})

/** クエストフォームスキーマの型 */
export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormScheme>;
