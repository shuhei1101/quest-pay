import { hasFamilyQuestPermission } from "@/app/api/quests/family/service"
import { ChildQuestViewScreen } from "./ChildQuestViewScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 権限を確認する
  const _ = await authGuard({ parentNG: true, guestNG: true })

  // 編集権限を確認する
  const hasPermission = await hasFamilyQuestPermission({ familyQuestId: id })
  if (!hasPermission) throw new Error("このクエストを編集する権限がありません。")
  
  return (
    <>
      <ChildQuestViewScreen id={id} />
    </>
  )
}
