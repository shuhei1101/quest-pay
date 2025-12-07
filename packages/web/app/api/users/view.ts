import { z } from "zod"
import { ProfileEntitySchema } from "./entity"
import { ParentEntitySchema } from "../parents/entity"
import { ChildEntitySchema } from "../children/entity"
import { FamilyEntitySchema } from "../families/entity"

/** DBのユーザスキーマ */
export const UserInfoViewSchema = z.object({
  user_id: z.string(),
  profile_id: ProfileEntitySchema.shape.id,
  profile_name: ProfileEntitySchema.shape.name,
  profile_icon: ProfileEntitySchema.shape.icon,
  profile_birthday: ProfileEntitySchema.shape.birthday,
  parent_id: ParentEntitySchema.shape.id.nullable(),
  child_id: ChildEntitySchema.shape.id.nullable(),
  child_min_savings: ChildEntitySchema.shape.min_savings.nullable(),
  child_current_savings: ChildEntitySchema.shape.current_savings.nullable(),
  child_current_level: ChildEntitySchema.shape.current_level.nullable(),
  child_total_exp: ChildEntitySchema.shape.total_exp.nullable(),
  family_id: FamilyEntitySchema.shape.id.nullable(),
  family_local_name: FamilyEntitySchema.shape.local_name.nullable(),
  family_online_name: FamilyEntitySchema.shape.online_name.nullable(),
  family_introduction: FamilyEntitySchema.shape.introduction.nullable(),
  family_icon: FamilyEntitySchema.shape.icon.nullable(),
  family_display_id: FamilyEntitySchema.shape.display_id.nullable(),
})
export type UserInfoView = z.infer<typeof UserInfoViewSchema>
