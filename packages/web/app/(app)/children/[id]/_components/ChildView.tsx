'use client'
import { ActionIcon, Box, Text, Button, Checkbox, Group, Input, LoadingOverlay, Space, Textarea} from "@mantine/core"
import { useState } from "react"
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { useIcons } from "@/app/(app)/icons/_hooks/useIcons"
import { devLog } from "@/app/(core)/util"
import { useChild } from "../_hook/useChild"
import { RenderIcon } from "@/app/(app)/icons/_components/RenderIcon"
import { useConstants } from "@/app/(core)/useConstants"
// dayjs のロケールを日本語に設定
dayjs.locale('ja')

/** 子供閲覧画面 */
export const ChildView = ( params: {
  id: string
}) => {
  /** 定数 */
  const { isDark } = useConstants()

  /** 子供ID */
  const [id, setId] = useState<string>(params.id)

  /** アイコン情報 */
  const { iconById } = useIcons()

  /** 子供情報 */
  const { child, isLoading } = useChild({childId: id})

  return (
    <>
      <div>
      <Box pos="relative" className="max-w-120">
        {/* ロード中のオーバーレイ */}
        <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2, }} />
        {/* プロフィールカード */}
        <div className={"flex flex-col gap-3" + isDark ? "bg-white" : "bg-black"}>
          {/* アイコン、子供名 */}
          <div className="flex">
            {/* アイコン */}
            <RenderIcon iconName={(iconById && child) && iconById[child.profile_icon_id].name} />
            {/* 子供名 */}
            <Text>{child?.profile_name}</Text>
          </div>
        </div>
      </Box>
      </div>
    </>
  )
}
