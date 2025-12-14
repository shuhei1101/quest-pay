import { z } from "zod"
import { IconId, IconColor } from "../../../api/icons/entity"
import { Birthday, UserName } from "@/app/api/users/entity"

/** 子供フォームスキーマ */
export const ChildFormSchema = z.object({
  name: UserName,
  iconId: IconId,
  iconColor: IconColor,
  birthday: Birthday,
})

/** 子供フォームスキーマの型 */
export type ChildFormType = z.infer<typeof ChildFormSchema>
