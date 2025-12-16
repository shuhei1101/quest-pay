import { z } from "zod"
import { ProfileEntityScheme } from "./entity"
import { FamilyEntityScheme } from "../families/entity"

/** DBのユーザスキーマ */
export const UserInfoViewScheme = z.object({
  user_id: z.string().nullable(),
  profile_id: ProfileEntityScheme.shape.id,
  user_type: ProfileEntityScheme.shape.type,
  profile_name: ProfileEntityScheme.shape.name,
  profile_icon_id: ProfileEntityScheme.shape.icon_id,
  profile_icon_color: ProfileEntityScheme.shape.icon_color,
  profile_birthday: ProfileEntityScheme.shape.birthday,
  family_id: FamilyEntityScheme.shape.id,
  family_local_name: FamilyEntityScheme.shape.local_name,
  family_online_name: FamilyEntityScheme.shape.online_name,
  family_icon_id: FamilyEntityScheme.shape.icon_id,
  family_icon_color: FamilyEntityScheme.shape.icon_color,
  family_display_id: FamilyEntityScheme.shape.display_id,
})
export type UserInfoView = z.infer<typeof UserInfoViewScheme>
