import { hasPublicQuestPermission } from "@/app/api/quests/public/service"
import { PublicQuestEdit } from "./PublicQuestEdit"
import { PublicQuestView } from "./view/PublicQuestView"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // // 編集権限を確認する
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
