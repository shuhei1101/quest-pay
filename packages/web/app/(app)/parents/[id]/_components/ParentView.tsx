'use client'
import { Box, Button, LoadingOverlay } from "@mantine/core"
import { useEffect } from "react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useParent } from "../_hook/useParent"
import { useDisclosure } from "@mantine/hooks"
import { InviteCodePopup } from "@/app/(core)/_components/InviteCodePopup"
import { ParentViewLayout } from "./ParentViewLayout"
import { PageHeader } from "@/app/(core)/_components/PageHeader"
import { useWindow } from "@/app/(core)/useConstants"
import { useRouter } from "next/navigation"
import { FAMILIES_MEMBERS_PARENT_EDIT_URL } from "@/app/(core)/endpoints"

// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 親閲覧画面 */
export const ParentView = ( params: {
  id: string
}) => {
  const router = useRouter()
  const { isMobile } = useWindow()

  /** 親ID */
  const id = params.id

  /** 親情報 */
  const { parent, stats, isLoading } = useParent({parentId: id})

  /** 招待コードポップアップの状態 */
  const [inviteCodeOpened, { open: openInviteCode, close: closeInviteCode }] = useDisclosure(false)

  /** 親情報が取得できて、user_idが存在しない場合 */
  useEffect(() => {
    if (!parent) return
    if (!parent.profiles?.userId) {
      // 通知ポップアップを表示する
      openInviteCode()
    }
  }, [parent, openInviteCode])

  return (
    <>
      {/* ページタイトル（モバイル時のみ表示） */}
      {isMobile && <PageHeader title="親情報" />}
      
      <Box pos="relative">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
        
        {/* トップバー */}
        {!parent?.profiles?.userId && (
          <div className="flex items-center gap-3 justify-end mb-4">
            {/* 招待コードボタン（user_idが存在しない場合のみ表示） */}
            <Button 
              variant="outline"
              onClick={openInviteCode}
            >
              招待コード表示
            </Button>
          </div>
        )}
        
        {/* 親閲覧レイアウト */}
        <ParentViewLayout
          parent={parent}
          stats={stats}
          onEdit={() => router.push(FAMILIES_MEMBERS_PARENT_EDIT_URL(id))}
        />
      </Box>

      {/* 招待コードポップアップ */}
      {parent?.parents.inviteCode && (
        <InviteCodePopup 
          opened={inviteCodeOpened}
          close={closeInviteCode}
          inviteCode={parent.parents.inviteCode}
          message="親の端末でこの招待コードを入力して、アカウントと紐づけてください"
        />
      )}
    </>
  )
}
