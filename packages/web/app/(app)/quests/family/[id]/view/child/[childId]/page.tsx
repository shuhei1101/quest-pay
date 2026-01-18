import { hasChildQuestPermission } from "@/app/api/quests/family/service"
import { ChildQuestViewScreen } from "./ChildQuestViewScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

export default async function Page({ params }: { params: { 
  id: string, 
  childId: string 
} }) {
  const { id, childId } = await params

  // 子供のみアクセス可能、親・ゲストは不可
  const _ = await authGuard({ parentNG: true, guestNG: true, redirectUrl: QUESTS_URL })

  // 編集権限を確認する
  const hasPermission = await hasChildQuestPermission({ familyQuestId: id, childId })
  if (!hasPermission) throw new Error("このクエストを編集する権限がありません。")
  
  return (
    <>
      <ChildQuestViewScreen id={id} childId={childId} />
    </>
  )
}
