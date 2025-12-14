import { z } from "zod"
import { ProfileEntitySchema } from "../users/entity"
import { ParentEntitySchema } from "./entity"
import { IconEntitySchema } from "../icons/entity"

/** 子供ビュースキーマ */
export const ParentViewSchema = z.object({
  user_id: z.string().nullable(),
  name: ProfileEntitySchema.shape.name,
  icon_id: ProfileEntitySchema.shape.icon_id,
  icon_name: IconEntitySchema.shape.name,
  icon_color: ProfileEntitySchema.shape.icon_color,
  birthday: ProfileEntitySchema.shape.birthday,
  family_id: ProfileEntitySchema.shape.family_id,
  id: ParentEntitySchema.shape.id,
})
export type ParentView = z.infer<typeof ParentViewSchema>
