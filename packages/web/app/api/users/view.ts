import { z } from "zod"
import { ProfileEntitySchema } from "./entity"
import { ParentEntitySchema } from "../parents/entity"
import { ChildEntitySchema } from "../children/entity"
import { FamilyEntitySchema } from "../families/entity"

/** DBのユーザスキーマ */
export const UserInfoViewSchema = z.object({
  user_id: z.string().nullable(),
  profile_id: ProfileEntitySchema.shape.id,
  profile_name: ProfileEntitySchema.shape.name,
  profile_icon_id: ProfileEntitySchema.shape.icon_id,
  profile_icon_color: ProfileEntitySchema.shape.icon_color,
  profile_birthday: ProfileEntitySchema.shape.birthday,
  parent_id: ParentEntitySchema.shape.id.nullable(),
  parent_invite_code: ParentEntitySchema.shape.invite_code.nullable(),
  child_id: ChildEntitySchema.shape.id.nullable(),
  child_invite_code: ChildEntitySchema.shape.invite_code.nullable(),
  family_id: FamilyEntitySchema.shape.id.nullable(),
  family_local_name: FamilyEntitySchema.shape.local_name.nullable(),
  family_online_name: FamilyEntitySchema.shape.online_name.nullable(),
  family_introduction: FamilyEntitySchema.shape.introduction.nullable(),
  family_icon_id: FamilyEntitySchema.shape.icon_id.nullable(),
  family_icon_color: FamilyEntitySchema.shape.icon_color.nullable(),
  family_display_id: FamilyEntitySchema.shape.display_id.nullable(),
})
export type UserInfoView = z.infer<typeof UserInfoViewSchema>
