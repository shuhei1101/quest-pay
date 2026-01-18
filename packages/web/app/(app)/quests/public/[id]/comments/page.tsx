import { PublicQuestComments } from "./PublicQuestComments"
import { authGuard } from "@/app/(core)/_auth/authGuard"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  // 親ユーザのみアクセス可能
  const _ = await authGuard({ childNG: true, guestNG: true })

  return <PublicQuestComments id={id} />
}
