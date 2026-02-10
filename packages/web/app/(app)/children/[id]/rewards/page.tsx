import { RewardHistoryScreen } from "./_components/RewardHistoryScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL } from "@/app/(core)/endpoints"
import { db } from "@/index"
import { fetchChild } from "@/app/api/children/query"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params
  
  // 親または子供がアクセス可能、ゲストは不可
  const userInfo = await authGuard({ guestNG: true, redirectUrl: QUESTS_URL })

  // 子供情報を取得する
  const child = await fetchChild({ db, childId: id })

  // 子供が存在しない場合はエラー
  if (!child) {
    throw new Error("子供情報の取得に失敗しました。")
  }

  // 同じ家族でない場合はエラー
  if (userInfo.profiles.familyId !== child.profiles?.familyId) {
    throw new Error("同じ家族に所属していないデータにアクセスしました。")
  }

  // 子供ユーザの場合、自分自身のみアクセス可能
  if (userInfo.profiles.userType === 'child') {
    if (child.profiles?.id !== userInfo.profiles.id) {
      throw new Error("自分自身の報酬履歴のみ閲覧できます。")
    }
  }

  const isParent = userInfo.profiles.userType === 'parent'
  const childName = child.children.nickname

  return (
    <RewardHistoryScreen 
      childId={id} 
      childName={childName}
      isParent={isParent}
    />
  )
}
