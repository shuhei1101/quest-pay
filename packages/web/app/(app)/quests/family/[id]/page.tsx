import { FamilyQuestEdit } from "./FamilyQuestEdit"
import { hasFamilyQuestPermission } from "@/app/api/quests/family/service"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

export default async function Page({ params, searchParams }: { params: { id: string }, searchParams: { tab?: string } }) {
  const { id } = await params
  const { tab } = await searchParams

  // 親のみアクセス可能、子供・ゲストは不可
  const _ = await authGuard({ childNG: true, guestNG: true, redirectUrl: QUESTS_URL })

  // 編集権限を確認する
  const hasPermission = await hasFamilyQuestPermission({ familyQuestId: id })
  if (!hasPermission) throw new Error("このクエストを編集する権限がありません。")

  return (
    <>
      <FamilyQuestEdit id={id} defaultTab={tab} />
    </>
  )
}
