import { QuestEntitySchema } from "@/app/api/quests/entity";
import { FamilyQuestEntitySchema } from "@/app/api/quests/family/entity";
import { z } from "zod";

/** クエストフォームスキーマ */
export const FamilyQuestFormSchema = z.object({
  name: QuestEntitySchema.shape.name.nonempty({error: "クエスト名は必須です。"}).min(3, { error: "クエスト名は3文字以上で入力してください。"}).max(20, { error: "クエスト名は20文字以下で入力してください。"}),
  iconId: QuestEntitySchema.shape.icon_id,
  iconColor: QuestEntitySchema.shape.icon_color,
  tags: z.array(z.string()),
  isPublic: FamilyQuestEntitySchema.shape.is_public,
  categoryId: QuestEntitySchema.shape.category_id,
})

/** クエストフォームスキーマの型 */
export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormSchema>;
