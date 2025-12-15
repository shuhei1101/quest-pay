import { z } from "zod";

/** 家族招待メールフォームスキーマ */
export const FamilyInviteScheme = z.object({
  /** メールアドレス */
  email: z.string().nonempty({error: "メールアドレスは必須です。"}),
})

/** 家族招待メールフォームスキーマの型 */
export type FamilyInviteType = z.infer<typeof FamilyInviteScheme>;
