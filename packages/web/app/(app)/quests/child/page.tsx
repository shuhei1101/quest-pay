"use client"
import { useEffect, useState, Suspense, useRef } from "react"
import { Tabs, Input, ActionIcon, Box, Paper, Text, Button } from "@mantine/core"
import { ChildQuestList } from "./_components/ChildQuestList"
import { useWindow } from "@/app/(core)/useConstants"
import { useRouter } from "next/navigation"
import { useLoginUserInfo } from "@/app/(auth)/login/_hook/useLoginUserInfo"

function QuestsContent() {
  const router = useRouter()

  /** ログインユーザ情報 */
  const { isGuest } = useLoginUserInfo()

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  /** ブレークポイント */
  const { isMobile } = useWindow()
  // 外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current) return

      // 展開中 ＋ コンテナの外をクリックした場合
      if (open && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])
  
  return (
    <>
      <ChildQuestList />
    </>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <QuestsContent />
    </Suspense>
  )
}
