import { ChildEntityScheme } from "@/app/api/children/entity";
import { QuestDetailsColumnsScheme, QuestDetailsEntityScheme, QuestEntityScheme } from "@/app/api/quests/entity";
import { FamilyQuestEntityScheme } from "@/app/api/quests/family/entity";
import { z } from "zod";

/** クエストフォームスキーマ */
export const FamilyQuestFormScheme = z.object({
  name: QuestEntityScheme.shape.name.nonempty({error: "クエスト名は必須です。"}).min(3, { error: "クエスト名は3文字以上で入力してください。"}).max(20, { error: "クエスト名は20文字以下で入力してください。"}),
  iconId: QuestEntityScheme.shape.icon_id,
  iconColor: QuestEntityScheme.shape.icon_color,
  tags: z.array(z.string()),
  isPublic: FamilyQuestEntityScheme.shape.is_public,
  isClientPublic: FamilyQuestEntityScheme.shape.is_client_public,
  isRequestDetailPublic: FamilyQuestEntityScheme.shape.is_request_detail_public,
  categoryId: QuestEntityScheme.shape.category_id,
  ageFrom: QuestEntityScheme.shape.age_from,
  ageTo: QuestEntityScheme.shape.age_to,
  monthFrom: QuestEntityScheme.shape.month_from,
  monthTo: QuestEntityScheme.shape.month_to,
  client: QuestEntityScheme.shape.client,
  requestDetail: QuestEntityScheme.shape.request_detail,
  details: z.array(z.object({
    level: QuestDetailsEntityScheme.shape.level.min(1, { error: "レベルは1以上で入力してください。" }),
    successCondition: QuestDetailsEntityScheme.shape.success_condition.nonempty({ error: "成功条件は必須です。" }).max(200, { error: "成功条件は200文字以下で入力してください。" }),
    requiredCompletionCount: QuestDetailsEntityScheme.shape.required_completion_count.min(1, { error: "目標回数は1以上で入力してください。" }),
    reward: QuestDetailsEntityScheme.shape.reward.min(0, { error: "報酬額は0以上で入力してください。" }),
    childExp: QuestDetailsEntityScheme.shape.child_exp.min(0, { error: "獲得経験値は0以上で入力してください。" }),
    requiredClearCount: QuestDetailsEntityScheme.shape.required_clear_count.min(0, { error: "必要クリア回数は0以上で入力してください。" }),
  })).min(1, { error: "最低でも1つのレベル詳細を追加してください。" }),
  childIds: z.array(ChildEntityScheme.shape.id)
})

/** クエストフォームスキーマの型 */
export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormScheme>;
