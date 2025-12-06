import { Icon } from "@/app/(app)/icons/entity";
import { z } from "zod";

/** クエストフォームスキーマ */
export const FamilyQuestFormSchema = z.object({
  name: z.string().nonempty({error: "クエスト名は必須です。"}).min(3, { error: "クエスト名は3文字以上で入力してください。"}).max(20, { error: "クエスト名は20文字以下で入力してください。"}),
  icon: Icon,
  tags: z.array(z.string()),
  isPublic: z.boolean()
})

/** クエストフォームスキーマの型 */
export type FamilyQuestFormType = z.infer<typeof FamilyQuestFormSchema>;
