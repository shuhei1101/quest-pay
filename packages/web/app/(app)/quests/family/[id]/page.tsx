import { FamilyQuestEdit } from "./FamilyQuestEdit"
import { hasFamilyQuestPermission } from "@/app/api/quests/family/service"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // // 編集権限を確認する
  const hasPermission = await hasFamilyQuestPermission({ familyQuestId: id })
  if (!hasPermission) throw new Error("このクエストを編集する権限がありません。")

  return (
    <>
      <FamilyQuestEdit id={id} />
    </>
  )
}
