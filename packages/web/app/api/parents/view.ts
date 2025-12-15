import { z } from "zod"
import { ProfileEntityScheme } from "../users/entity"
import { ParentEntityScheme } from "./entity"
import { IconEntityScheme } from "../icons/entity"

/** 子供ビュースキーマ */
export const ParentViewScheme = z.object({
  user_id: z.string().nullable(),
  name: ProfileEntityScheme.shape.name,
  icon_id: ProfileEntityScheme.shape.icon_id,
  icon_name: IconEntityScheme.shape.name,
  icon_color: ProfileEntityScheme.shape.icon_color,
  birthday: ProfileEntityScheme.shape.birthday,
  family_id: ProfileEntityScheme.shape.family_id,
  id: ParentEntityScheme.shape.id,
  invite_code: ParentEntityScheme.shape.invite_code,
})
export type ParentView = z.infer<typeof ParentViewScheme>
