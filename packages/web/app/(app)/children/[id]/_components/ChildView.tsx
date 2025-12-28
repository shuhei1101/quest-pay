'use client'
import { ActionIcon, Box, Text, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core"
import { useState, useEffect } from "react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useChild } from "../_hook/useChild"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { useWindow } from "@/app/(core)/useConstants"
import { useRouter } from "next/navigation"
import { FAMILIES_MEMBERS_CHILD_EDIT_URL } from "@/app/(core)/endpoints"
import { useDisclosure } from "@mantine/hooks"
import { InviteCodePopup } from "@/app/(core)/_components/InviteCodePopup"
// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 子供閲覧画面 */
export const ChildView = ( params: {
  id: string
}) => {
  const router = useRouter()
  /** 定数 */
  const { isDark } = useWindow()

  /** 子供ID */
  const [id, setId] = useState<string>(params.id)

  /** 子供情報 */
  const { child, isLoading } = useChild({childId: id})

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
      <div className="flex flex-col">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
        {/* トップバー */}
        <div className="flex items-center gap-3 justify-end">
          {/* 招待コードボタン（user_idが存在しない場合のみ表示） */}
          {child?.profiles?.userId ?? (
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
        {/* プロフィールカード */}
        <div className={"flex flex-col gap-3"}>
          {/* アイコン、子供名 */}
          <div className="flex">
            {/* アイコン */}
            <RenderIcon iconName={child?.icons?.name} />
            {/* 子供名 */}
            <Text>{child?.profiles?.name}</Text>
          </div>
          {/* 誕生日 */}
          <Text>{child?.profiles?.birthday}</Text>
          {/* 年齢 */}
          
          
        </div>
      </div>

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
