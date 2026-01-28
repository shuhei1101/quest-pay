import { Suspense } from "react"
import { FamilyQuestsScreen } from "./FamilyQuestsScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

export default async function Page() {
  // 親のみアクセス可能、子供・ゲストは不可
  const _ = await authGuard({ childNG: true, guestNG: true, redirectUrl: QUESTS_URL })
  return (
    <FamilyQuestsScreen />
  )
}
