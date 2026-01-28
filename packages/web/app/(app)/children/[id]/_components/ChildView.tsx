'use client'
import { Box, Button, LoadingOverlay } from "@mantine/core"
import { useEffect } from "react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useChild } from "../_hook/useChild"
import { useRouter } from "next/navigation"
import { FAMILIES_MEMBERS_CHILD_EDIT_URL } from "@/app/(core)/endpoints"
import { useDisclosure } from "@mantine/hooks"
import { InviteCodePopup } from "@/app/(core)/_components/InviteCodePopup"
import { ChildViewLayout } from "./ChildViewLayout"
// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 子供閲覧画面 */
export const ChildView = ( params: {
  id: string
}) => {
  const router = useRouter()

  /** 子供ID */
  const id = params.id

  /** 子供情報 */
  const { child, questStats, isLoading } = useChild({childId: id})

  /** 招待コードポップアップの状態 */
  const [inviteCodeOpened, { open: openInviteCode, close: closeInviteCode }] = useDisclosure(false)

  /** 子供情報が取得できて、user_idが存在しない場合 */
  useEffect(() => {
    if (!child) return
    if (!child.profiles?.userId) {
      // 通知ポップアップを表示する
      openInviteCode()
    }
  }, [child, openInviteCode])

  return (
    <>
      <Box pos="relative">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
        
        {/* トップバー */}
        <div className="flex items-center gap-3 justify-end mb-4">
          {/* 招待コードボタン（user_idが存在しない場合のみ表示） */}
          {!child?.profiles?.userId && (
            <Button 
              variant="outline"
              onClick={openInviteCode}
            >
              招待コード表示
            </Button>
          )}
          {/* 編集ボタン */}
          <Button 
            variant="gradient"
            onClick={() => router.push(FAMILIES_MEMBERS_CHILD_EDIT_URL(id))}
          >
            編集
          </Button>
        </div>
        
        {/* 子供閲覧レイアウト */}
        <ChildViewLayout
          child={child}
          questStats={questStats}
          onRankClick={() => console.log("ランククリック")}
          onCompletedQuestClick={() => console.log("達成クエストクリック")}
          onTotalRewardClick={() => console.log("合計報酬額クリック")}
          onFixedRewardClick={() => console.log("定額報酬クリック")}
          onSavingsClick={() => console.log("貯金クリック")}
          onMonthlyRewardClick={() => console.log("今月の報酬クリック")}
        />
      </Box>

      {/* 招待コードポップアップ */}
      {child?.children.inviteCode && (
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
