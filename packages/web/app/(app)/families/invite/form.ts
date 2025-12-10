import { z } from "zod";

/** 家族招待メールフォームスキーマ */
export const FamilyInviteSchema = z.object({
  /** メールアドレス */
  email: z.string().nonempty({error: "メールアドレスは必須です。"}),
})

/** 家族招待メールフォームスキーマの型 */
export type FamilyInviteType = z.infer<typeof FamilyInviteSchema>;
