import { z } from "zod"
import { ProfileEntityScheme } from "../users/entity"
import { ChildEntityScheme } from "./entity"
import { IconEntityScheme } from "../icons/entity"

/** 子供ビュースキーマ */
export const ChildViewScheme = z.object({
  user_id: z.string().nullable(),
  name: ProfileEntityScheme.shape.name,
  icon_id: ProfileEntityScheme.shape.icon_id,
  icon_name: IconEntityScheme.shape.name,
  icon_color: ProfileEntityScheme.shape.icon_color,
  birthday: ProfileEntityScheme.shape.birthday,
  family_id: ProfileEntityScheme.shape.family_id,
  id: ChildEntityScheme.shape.id,
  invite_code: ChildEntityScheme.shape.invite_code,
  min_savings: ChildEntityScheme.shape.min_savings.nullable(),
  current_savings: ChildEntityScheme.shape.current_savings.nullable(),
  current_level: ChildEntityScheme.shape.current_level.nullable(),
  total_exp: ChildEntityScheme.shape.total_exp.nullable(),
})
export type ChildView = z.infer<typeof ChildViewScheme>
