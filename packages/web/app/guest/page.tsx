import { Suspense } from "react"
import { GuestQuestsScreen } from "./GuestQuestsScreen"

export default async function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <GuestQuestsScreen />
    </Suspense>
  )
}
