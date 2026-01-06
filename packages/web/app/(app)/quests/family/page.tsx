import { Suspense } from "react";
import { FamilyQuestsScreen } from "./FamilyQuestsScreen";
import { authGuard } from "@/app/(core)/_auth/authGuard";

export default async function Page() {
  const _ = await authGuard({ childNG: true, guestNG: true })
  return (
    <Suspense fallback={<div></div>}>
      <FamilyQuestsScreen />
    </Suspense>
  )
}
