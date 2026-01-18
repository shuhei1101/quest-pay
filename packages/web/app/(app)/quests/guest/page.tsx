import { Suspense } from "react"
import { GuestQuestsScreen } from "./GuestQuestsScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page() {
  // ゲストのみアクセス可能、親・子供は不可
  const { isGuest } = await authGuard({})
  
  // 親・子供の場合はクエスト画面にリダイレクト
  if (!isGuest) {
    const cookieStore = await cookies()
    cookieStore.set('accessError', 'このページにアクセスする権限がありません', { 
      path: '/',
      maxAge: 10,
      sameSite: 'lax'
    })
    redirect(QUESTS_URL)
  }
  
  return (
    <Suspense fallback={<div></div>}>
      <GuestQuestsScreen />
    </Suspense>
  )
}
