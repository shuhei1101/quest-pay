import { Suspense } from "react";
import { ParentQuests } from "./ParentQuests";
import { authGuard } from "@/app/(core)/_auth/authGuard";

export default async function Page() {
  const _ = await authGuard({ childNG: true })
  return (
    <Suspense fallback={<div></div>}>
      <ParentQuests />
    </Suspense>
  )
}
