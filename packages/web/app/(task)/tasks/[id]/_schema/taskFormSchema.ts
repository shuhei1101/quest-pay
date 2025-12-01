import { Icon } from "@/app/(shared)/_icon/_schema/iconSchema";
import { z } from "zod";

/** タスクフォームスキーマ */
export const TaskFormSchema = z.object({
  name: z.string().nonempty({error: "タスク名は必須です。"}).min(3, { error: "タスク名は3文字以上で入力してください。"}).max(20, { error: "タスク名は20文字以下で入力してください。"}),
  icon: Icon,
  tags: z.array(z.string())
})

/** タスクフォームスキーマの型 */
export type TaskFormType = z.infer<typeof TaskFormSchema>;
