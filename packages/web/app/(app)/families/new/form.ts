import { DisplayId, LocalName, OnlineName } from "@/app/api/families/entity"
import { z } from "zod"
import { IconId, IconColor } from "../../../api/icons/entity"
import { Birthday, UserName } from "@/app/api/users/entity"

/** 家族フォームスキーマ */
export const FamilyRegisterFormSchema = z.object({
  displayId: DisplayId,
  localName: LocalName,
  onlineName: OnlineName,
  familyIconId: IconId,
  familyIconColor: IconColor,
  parentName: UserName,
  parentIconId: IconId,
  parentIconColor: IconColor,
  parentBirthday: Birthday,
})

/** 家族フォームスキーマの型 */
export type FamilyRegisterFormType = z.infer<typeof FamilyRegisterFormSchema>
