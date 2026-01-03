import { useLoginUserInfo } from "@/app/(auth)/login/_hook/useLoginUserInfo";
import { CHILD_QUESTS_URL, FAMILY_QUESTS_URL } from "@/app/(core)/endpoints";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter()

  /** 現在のログインユーザ情報 */
  const {isChild} = useLoginUserInfo()
  
  useEffect(() => {
    // 子供ユーザの場合、子供クエスト画面に遷移する
    if (isChild) {
      router.replace(CHILD_QUESTS_URL)
    } else {
      // 親ユーザの場合、家族クエスト画面に遷移する
      router.replace(FAMILY_QUESTS_URL)
    }
  }, [isChild, router])


}
