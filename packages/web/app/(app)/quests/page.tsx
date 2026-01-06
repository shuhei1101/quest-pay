import { authGuard } from "@/app/(core)/_auth/authGuard";
import { CHILD_QUESTS_URL, FAMILY_QUESTS_URL, GUEST_QUESTS_URL } from "@/app/(core)/endpoints";
import { redirect } from "next/navigation"

export default async function Page() {
  /** 現在のログインユーザ情報 */
  const { isChild, isParent } = await authGuard({})
  
  // 子供ユーザの場合、子供クエスト画面に遷移する
  if (isChild) {
    redirect(CHILD_QUESTS_URL)
  } else if (isParent) {
    // 親ユーザの場合、家族クエスト画面に遷移する
    redirect(FAMILY_QUESTS_URL)
  } else {
    // ゲストユーザの場合、ゲストクエスト画面に遷移する
    redirect(GUEST_QUESTS_URL)
  }
}
