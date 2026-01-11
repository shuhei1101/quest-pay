import { hasTemplateQuestPermission } from "@/app/api/quests/template/service"
import { TemplateQuestViewScreen } from "./view/TemplateQuestViewScreen"


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 編集権限を確認する
  const hasPermission = await hasTemplateQuestPermission({ templateQuestId: id })
  if (!hasPermission) throw new Error("閲覧権限がありません。")

  return (
    <>
      <TemplateQuestViewScreen id={id} />
    </>
  )
}
