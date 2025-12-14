"use client"

import { useConstants } from "@/app/(core)/useConstants"
import { FamilyMemberList } from "./_components/FamilyMemberList"
import { useEffect, useState } from "react"
import { FloatingActionButton, FloatingActionItem } from "@/app/(core)/_components/FloatingActionButton"
import { IconAdjustments } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { FAMILIES_MEMBERS_CHILD_NEW_URL } from "@/app/(core)/constants"

export default function FamilyMembersLayout({ children }: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isMobile } = useConstants()

  // スマホの場合
  if (isMobile) {
    // 通常の画面遷移を行う
    return <>{children}</>
  }

  /** フローティングアクションボタンの開閉状態 */
  const [open, setOpen] = useState(false)

  /** フローティングアクションアイテム */
  const actionItems: FloatingActionItem[] = [
    { 
      icon: <IconAdjustments />, // 上
      x: 10, y: -75,
      onClick: () => router.push(FAMILIES_MEMBERS_CHILD_NEW_URL)
    },
  ]

  // SSRレンダリング時の処理
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return (<></>)
    
  // スマホ以外の場合、2ペインで表示する
  return (
    <>
      <div className="flex h-full">
        {/* 一覧画面 */}
        <aside className="w-1/3 border-r">
          <FamilyMemberList />
        </aside>
        {/* メインコンテンツ */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      <FloatingActionButton
        items={actionItems}
        open={open}
        onToggle={setOpen}
        mainButtonColor="pink"
        subButtonColor="pink"
      />
    </>
  )

}
