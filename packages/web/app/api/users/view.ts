import { z } from "zod"
import { ProfileEntityScheme } from "./entity"
import { ParentEntityScheme } from "../parents/entity"
import { ChildEntityScheme } from "../children/entity"
import { FamilyEntityScheme } from "../families/entity"

/** DBのユーザスキーマ */
export const UserInfoViewScheme = z.object({
  user_id: z.string().nullable(),
  profile_id: ProfileEntityScheme.shape.id,
  profile_name: ProfileEntityScheme.shape.name,
  profile_icon_id: ProfileEntityScheme.shape.icon_id,
  profile_icon_color: ProfileEntityScheme.shape.icon_color,
  profile_birthday: ProfileEntityScheme.shape.birthday,
  parent_id: ParentEntityScheme.shape.id.nullable(),
  child_id: ChildEntityScheme.shape.id.nullable(),
  family_id: FamilyEntityScheme.shape.id.nullable(),
  family_local_name: FamilyEntityScheme.shape.local_name.nullable(),
  family_online_name: FamilyEntityScheme.shape.online_name.nullable(),
  family_introduction: FamilyEntityScheme.shape.introduction.nullable(),
  family_icon_id: FamilyEntityScheme.shape.icon_id.nullable(),
  family_icon_color: FamilyEntityScheme.shape.icon_color.nullable(),
  family_display_id: FamilyEntityScheme.shape.display_id.nullable(),
})
export type UserInfoView = z.infer<typeof UserInfoViewScheme>
