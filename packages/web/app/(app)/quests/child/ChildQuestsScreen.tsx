"use client"

import { useState } from "react"
import { Text, Button } from "@mantine/core"
import { IconAdjustments, IconEdit, IconLogout, IconTrash } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FAMILY_QUEST_NEW_URL, LOGIN_URL } from "@/app/(core)/endpoints"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"
import { ChildQuestList } from "./_components/ChildQuestList"

export function ChildQuestsScreen() {
  const router = useRouter()

  /** フローティングアクションボタンの開閉状態 */
  const [open, setOpen] = useState(false)
  
  return (
    <>
      {/* 子供クエストリスト */}
      <ChildQuestList />
    </>
  )
}
