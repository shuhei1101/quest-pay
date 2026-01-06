import { Suspense } from "react";
import { GuestQuestsScreen } from "./GuestQuestsScreen";
import { authGuard } from "@/app/(core)/_auth/authGuard";

export default async function Page() {
  const _ = await authGuard({})
  return (
    <Suspense fallback={<div></div>}>
      <GuestQuestsScreen />
    </Suspense>
  )
}
