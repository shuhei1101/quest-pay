import { hasPublicQuestPermission } from "@/app/api/quests/public/service"
import { PublicQuestEdit } from "./PublicQuestEdit"
import { PublicQuestView } from "./view/PublicQuestView"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 親・ゲストのみアクセス可能、子供は不可
  const _ = await authGuard({ childNG: true, redirectUrl: QUESTS_URL })

  // 編集権限を確認する
  const hasPermission = await hasPublicQuestPermission({ publicQuestId: id })

  return (
    <>
      {hasPermission ? (
        <PublicQuestEdit id={id} />
      ) : (
        <PublicQuestView id={id} />
      )}
    </>
  )
}
