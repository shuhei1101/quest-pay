import { Suspense } from "react"
import { TimelinesScreen } from "./TimelinesScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"

export default async function Page() {
  // 認証チェック（ゲストNG）
  const _ = await authGuard({ guestNG: true })
  return (
    <TimelinesScreen />
  )
}
