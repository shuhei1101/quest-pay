import { z } from "zod"
import { ProfileEntitySchema } from "../users/entity"
import { ChildEntitySchema } from "./entity"
import { IconEntitySchema } from "../icons/entity"

/** 子供ビュースキーマ */
export const ChildViewSchema = z.object({
  user_id: z.string().nullable(),
  name: ProfileEntitySchema.shape.name,
  icon_id: ProfileEntitySchema.shape.icon_id,
  icon_name: IconEntitySchema.shape.name,
  icon_color: ProfileEntitySchema.shape.icon_color,
  birthday: ProfileEntitySchema.shape.birthday,
  family_id: ProfileEntitySchema.shape.family_id,
  id: ChildEntitySchema.shape.id,
  invite_code: ChildEntitySchema.shape.invite_code,
  min_savings: ChildEntitySchema.shape.min_savings.nullable(),
  current_savings: ChildEntitySchema.shape.current_savings.nullable(),
  current_level: ChildEntitySchema.shape.current_level.nullable(),
  total_exp: ChildEntitySchema.shape.total_exp.nullable(),
})
export type ChildView = z.infer<typeof ChildViewSchema>
