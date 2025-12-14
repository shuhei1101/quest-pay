"use client"

import { useConstants } from "@/app/(core)/useConstants"
import { FamilyMemberList } from "./_components/FamilyMemberList"
import { useEffect, useState } from "react"
import { RadialActionButton, FloatingActionItem } from "@/app/(core)/_components/RadialActionButton"
import { IconAdjustments } from "@tabler/icons-react"
import { useRouter, usePathname } from "next/navigation"
import { FAMILIES_MEMBERS_CHILD_NEW_URL } from "@/app/(core)/constants"

export default function FamilyMembersLayout({ children }: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobile } = useConstants()

  /** URLから選択中のIDを取得する */
  const getSelectedIdFromPath = (): string | null => {
    // /families/members/parent/{id}/view または /families/members/child/{id}/view のパターンにマッチ
    const parentMatch = pathname.match(/\/families\/members\/parent\/([^\/]+)(\/|$)/)
    const childMatch = pathname.match(/\/families\/members\/child\/([^\/]+)(\/|$)/)
    return parentMatch?.[1] || childMatch?.[1] || null
  }

  /** 現在選択中のID */
  const selectedId = getSelectedIdFromPath()

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
    
  // スマホの場合
  if (isMobile) {
    // 通常の画面遷移を行う
    return <>{children}</>
  }
  
  // スマホ以外の場合、2ペインで表示する
  return (
    <>
      <div className="flex h-full">
        {/* 一覧画面 */}
        <aside className="w-1/3 border-r">
          <FamilyMemberList selectedId={selectedId} />
        </aside>
        {/* メインコンテンツ */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      <RadialActionButton
        items={actionItems}
        open={open}
        onToggle={setOpen}
        mainButtonColor="pink"
        subButtonColor="pink"
      />
    </>
  )

}
