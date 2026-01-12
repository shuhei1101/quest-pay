import { hasChildQuestPermission } from "@/app/api/quests/family/[id]/child/service"
import { ChildQuestViewScreen } from "./child/[childId]/ChildQuestViewScreen"

export default async function Page({ params }: { params: { id: string, childId: string } }) {
  const { id, childId } = await params

  // 編集権限を確認する
  const hasPermission = await hasChildQuestPermission({ familyQuestId: id })
  if (!hasPermission) throw new Error("閲覧権限がありません。")

  return (
    <>
      <ChildQuestViewScreen id={id} childId={childId} />
    </>
  )
}
