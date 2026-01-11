import { Suspense } from "react";
import { ChildQuestsScreen } from "./ChildQuestsScreen";
import { authGuard } from "@/app/(core)/_auth/authGuard";

export default async function Page() {
  // 権限を確認する
  const _ = await authGuard({ parentNG: true, guestNG: true })
  return (
    <Suspense fallback={<div></div>}>
      <ChildQuestsScreen />
    </Suspense>
  )
}
