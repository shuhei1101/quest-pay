import { QuestEntityScheme } from "@/app/api/quests/entity";
import { FamilyQuestEntityScheme } from "@/app/api/quests/family/entity";
import { z } from "zod";

/** クエストフォームスキーマ */
export const FamilyQuestFormScheme = z.object({
  name: QuestEntityScheme.shape.name.nonempty({error: "クエスト名は必須です。"}).min(3, { error: "クエスト名は3文字以上で入力してください。"}).max(20, { error: "クエスト名は20文字以下で入力してください。"}),
  iconId: QuestEntityScheme.shape.icon_id,
  iconColor: QuestEntityScheme.shape.icon_color,
  tags: z.array(z.string()),
  isPublic: FamilyQuestEntityScheme.shape.is_public,
  categoryId: QuestEntityScheme.shape.category_id,
})

/** クエストフォームスキーマの型 */
export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormScheme>;
