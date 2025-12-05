import { z } from "zod"

/** DBのユーザスキーマ */
export const UserInfoViewSchema = z.object({
  user_id: z.string(),
  profile_id: z.number(),
  profile_name: z.string(),
  profile_icon: z.string(),
  profile_birthday: z.string(),
  parent_id: z.number().nullish(),
  child_id: z.number().nullish(),
  child_min_savings: z.number().nullish(),
  child_current_savings: z.number().nullish(),
  child_current_level: z.number().nullish(),
  child_total_exp: z.number().nullish(),
  family_id: z.number().nullish(),
  family_local_name: z.string().nullish(),
  family_online_name: z.string().nullish(),
  family_introduction: z.string().nullish(),
  family_icon: z.string().nullish(),
  family_display_id: z.string().nullish(),
})
export type UserInfoView = z.infer<typeof UserInfoViewSchema>
