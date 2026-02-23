import { ChildRewardEdit } from "./_components/ChildRewardEdit"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  // 親のみアクセス可能、子供・ゲストは不可
  const _ = await authGuard({ childNG: true, guestNG: true, redirectUrl: QUESTS_URL })
  
  const { id: childId } = await params

  return (
    <>
      <ChildRewardEdit childId={childId} />
    </>
  )
}
