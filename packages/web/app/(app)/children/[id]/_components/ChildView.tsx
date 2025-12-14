'use client'
import { ActionIcon, Box, Text, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core"
import { useState } from "react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useChild } from "../_hook/useChild"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { useConstants } from "@/app/(core)/useConstants"
import { useRouter } from "next/navigation"
import { FAMILIES_MEMBERS_CHILD_EDIT_URL } from "@/app/(core)/constants"
// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 子供閲覧画面 */
export const ChildView = ( params: {
  id: string
}) => {
  const router = useRouter()
  /** 定数 */
  const { isDark } = useConstants()

  /** 子供ID */
  const [id, setId] = useState<string>(params.id)

  /** 子供情報 */
  const { child, isLoading } = useChild({childId: id})

  return (
    <>
      <div className="flex flex-col">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
        {/* トップバー */}
        <div className="flex items-center gap-3 justify-end">
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
            <RenderIcon iconName={child?.icon_name} />
            {/* 子供名 */}
            <Text>{child?.name}</Text>
          </div>
          {/* 年齢 */}
          <Text>{child?.birthday}</Text>
        </div>
      </div>
    </>
  )
}
