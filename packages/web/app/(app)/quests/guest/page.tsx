import { Suspense } from "react"
import { GuestQuestsScreen } from "./GuestQuestsScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"

export default async function Page() {
  // ゲストのみアクセス可能、親・子供は不可
  const { isGuest } = await authGuard({})
  if (!isGuest) {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies()
    cookieStore.set('accessError', 'このページにアクセスする権限がありません', { 
      path: '/',
      maxAge: 10
    })
    const { redirect } = await import("next/navigation")
    redirect(QUESTS_URL)
  }
  
  return (
    <Suspense fallback={<div></div>}>
      <GuestQuestsScreen />
    </Suspense>
  )
}
