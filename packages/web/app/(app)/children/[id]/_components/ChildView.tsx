'use client'
import { Box, Button, LoadingOverlay } from "@mantine/core"
import { useEffect } from "react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useChild } from "../_hook/useChild"
import { useRouter } from "next/navigation"
import { CHILD_REWARDS_HISTORIES_URL, CHILD_REWARD_VIEW_URL, CHILD_REWARD_URL, FAMILIES_MEMBERS_CHILD_EDIT_URL } from "@/app/(core)/endpoints"
import { useDisclosure } from "@mantine/hooks"
import { InviteCodePopup } from "@/app/(core)/_components/InviteCodePopup"
import { ChildViewLayout } from "./ChildViewLayout"
import { PageHeader } from "@/app/(core)/_components/PageHeader"
import { useWindow } from "@/app/(core)/useConstants"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 子供閲覧画面 */
export const ChildView = ( params: {
  id: string
}) => {
  const router = useRouter()
  const { isMobile } = useWindow()
  const { isParent } = useLoginUserInfo()

  /** 子供ID */
  const id = params.id

  /** 子供情報 */
  const { child, questStats, rewardStats, fixedReward, isLoading } = useChild({childId: id})

  /** 招待コードポップアップの状態 */
  const [inviteCodeOpened, { open: openInviteCode, close: closeInviteCode }] = useDisclosure(false)

  /** 子供情報が取得できて、user_idが存在しない場合（親のみ自動表示） */
  useEffect(() => {
    if (!isParent) return
    if (!child) return
    if (!child.profiles?.userId) {
      // 通知ポップアップを表示する
      openInviteCode()
    }
  }, [child, openInviteCode, isParent])

  return (
    <>
      {/* ページタイトル（モバイル時のみ表示） */}
      {isMobile && <PageHeader title="子供情報" />}
      
      <Box pos="relative">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
        
        {/* トップバー */}
        {isParent && !child?.profiles?.userId && (
          <div className="flex items-center gap-3 justify-end mb-4">
            {/* 招待コードボタン（親のみ表示、user_idが存在しない場合のみ） */}
            <Button 
              variant="outline"
              onClick={openInviteCode}
            >
              招待コード表示
            </Button>
          </div>
        )}
        
        {/* 子供閲覧レイアウト */}
        <ChildViewLayout
          child={child}
          questStats={questStats}
          rewardStats={rewardStats}
          fixedReward={fixedReward}
          onSavingsClick={() => router.push(CHILD_REWARDS_HISTORIES_URL(id))}
          onFixedRewardClick={() => router.push(CHILD_REWARD_VIEW_URL(id))}
          // 親のみ編集機能を有効化
          onFixedRewardEditClick={isParent ? () => router.push(CHILD_REWARD_URL(id)) : undefined}
        />
      </Box>

      {/* 招待コードポップアップ（親のみ表示） */}
      {isParent && child?.children.inviteCode && (
        <InviteCodePopup 
          opened={inviteCodeOpened}
          close={closeInviteCode}
          inviteCode={child.children.inviteCode}
          message="子供の端末でこの招待コードを入力して、アカウントと紐づけてください"
        />
      )}
    </>
  )
}
