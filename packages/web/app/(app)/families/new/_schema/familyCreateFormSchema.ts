import { DisplayId, LocalName, OnlineName } from "@/app/(family)/_schema/familyEntity"
import { Icon } from "@/app/(app)/icons/entity"
import { Birthday, UserName } from "@/app/api/users/entity"
import { z } from "zod"

/** 家族フォームスキーマ */
export const FamilyCreateFormSchema = z.object({
  /** 表示ID */
  displayId: DisplayId,
  /** 家族名（ローカル） */
  localName: LocalName,
  /** 家族名（オンライン） */
  onlineName: OnlineName,
  /** 家族アイコン */
  familyIcon: Icon,
  /** 親名 */
  parentName: UserName,
  /** 親アイコン */
  parentIcon: Icon,
  /** 親の誕生日 */
  parentBirthday: Birthday,
})

/** 家族フォームスキーマの型 */
export type FamilyCreateForm = z.infer<typeof FamilyCreateFormSchema>
