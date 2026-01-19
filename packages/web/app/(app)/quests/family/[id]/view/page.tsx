import { hasFamilyQuestPermission } from "@/app/api/quests/family/service"
import { FamilyQuestViewScreen } from "./FamilyQuestViewScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 親のみアクセス可能、子供・ゲストは不可
  const _ = await authGuard({ childNG: true, guestNG: true, redirectUrl: QUESTS_URL })

  // 閲覧権限を確認する
  const hasPermission = await hasFamilyQuestPermission({ familyQuestId: id })
  if (!hasPermission) throw new Error("閲覧権限がありません。")

  return (
    <>
      <FamilyQuestViewScreen id={id} />
    </>
  )
}
