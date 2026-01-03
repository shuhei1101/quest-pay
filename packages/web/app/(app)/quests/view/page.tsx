import { Suspense } from "react";
import { authGuard } from "@/app/(core)/_auth/authGuard";
import { MockQuestViewA, MockQuestViewB } from "./mock";

export default function Page() {
  return (
    <>
      <MockQuestViewA />
      <MockQuestViewB />
    </>
  )
}
