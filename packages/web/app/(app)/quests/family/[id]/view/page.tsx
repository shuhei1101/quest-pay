import { hasChildQuestPermission } from "@/app/api/quests/child/service"
import { ChildQuestViewScreen } from "./child/ChildQuestViewScreen"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 編集権限を確認する
  const hasPermission = await hasChildQuestPermission({ familyQuestId: id })
  if (!hasPermission) throw new Error("閲覧権限がありません。")

  return (
    <>
      <ChildQuestViewScreen id={id} />
    </>
  )
}
