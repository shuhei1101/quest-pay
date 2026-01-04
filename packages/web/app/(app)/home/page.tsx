import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"
import { redirect } from "next/navigation"

export default async function Page() {
  /** 現在のログインユーザ情報 */
  const { isChild } = await authGuard({})
  
  // 子供ユーザの場合、子供クエスト画面に遷移する
  if (isChild) {
    redirect(QUESTS_URL)
  } else {
    // 親ユーザの場合、家族クエスト画面に遷移する
    redirect(QUESTS_URL)
  }

}
