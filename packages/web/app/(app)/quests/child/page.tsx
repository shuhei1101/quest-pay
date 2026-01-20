import { Suspense } from "react"
import { ChildQuestsScreen } from "./ChildQuestsScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

export default async function Page() {
  // 子供のみアクセス可能、親・ゲストは不可
  const _ = await authGuard({ parentNG: true, guestNG: true, redirectUrl: QUESTS_URL })
  return (
    <Suspense fallback={<div></div>}>
      <ChildQuestsScreen />
    </Suspense>
  )
}
