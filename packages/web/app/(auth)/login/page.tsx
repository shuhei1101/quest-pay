import { LoginScreen } from "./LoginScreen"
import { checkIsLoggedIn } from "@/app/(core)/_auth/checkIsLoggedIn"
import { QUESTS_URL } from "@/app/(core)/endpoints"
import { redirect } from "next/navigation"

export default async function Page() {
  // 既にログイン済みの場合、クエスト画面に遷移する
  const isLoggedIn = await checkIsLoggedIn()
  if (isLoggedIn) {
    redirect(QUESTS_URL)
  }
  
  return (
    <>
      <LoginScreen />
    </>
)
}
