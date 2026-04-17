import { RewardHistoryScreen } from "./_components/RewardHistoryScreen"
import { authGuard } from "@/app/(core)/_auth/authGuard"
import { QUESTS_URL, AUTH_ERROR_URL } from "@/app/(core)/endpoints"
import { db } from "@/index"
import { fetchChild } from "@/app/api/children/query"
import { redirect } from "next/navigation"
import { addQueryParam } from "@/app/(core)/util"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // ゲストのみ不可、親と子供はアクセス可能
  const { userInfo, isGuest } = await authGuard({ guestNG: true, redirectUrl: QUESTS_URL })

  // ゲストの場合は既にリダイレクトされているが、念のためチェック
  if (isGuest || !userInfo) {
    redirect(addQueryParam(AUTH_ERROR_URL, 'error', 'アクセス権限がありません'))
  }

  // 子供情報を取得する
  const child = await fetchChild({ db, childId: id })

  // 子供が存在しない場合
  if (!child) {
    redirect(addQueryParam(QUESTS_URL, 'error', '子供が見つかりません'))
  }

  // 同じ家族でない場合
  if (userInfo.profiles?.familyId !== child.profiles?.familyId) {
    redirect(addQueryParam(AUTH_ERROR_URL, 'error', 'この子供の情報にアクセスする権限がありません'))
  }

  // 子供ユーザの場合、自分自身のみアクセス可能
  if (userInfo.profiles?.type === 'child') {
    if (child.profiles?.id !== userInfo.profiles.id) {
      redirect(addQueryParam(AUTH_ERROR_URL, 'error', '自分自身の報酬履歴のみ閲覧できます'))
    }
  }

  const isParent = userInfo.profiles?.type === 'parent'
  const childName = child.profiles?.name || ""

  return (
    <RewardHistoryScreen 
      childId={id} 
      childName={childName}
      isParent={isParent}
    />
  )
}
