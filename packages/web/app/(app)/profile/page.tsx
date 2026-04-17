import { ChildView } from "@/app/(app)/children/[id]/_components/ChildView"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"
import { redirect } from "next/navigation"
import { addQueryParam } from "@/app/(core)/util"

export default async function Page() {
  // 子供のみアクセス可能、親・ゲストは不可
  const { userInfo, isChild } = await authGuard({ parentNG: true, guestNG: true, redirectUrl: QUESTS_URL })
  
  // 子供ユーザでない場合（念のため）
  if (!isChild || !userInfo?.children?.id) {
    redirect(addQueryParam(QUESTS_URL, 'error', 'プロフィールにアクセスできません'))
  }

  // 自分自身の子供IDを使ってChildViewを表示
  return (
    <>
      <ChildView id={userInfo.children.id} />
    </>
  )
}
