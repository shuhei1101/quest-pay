"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { FamilyMemberList } from "./_components/FamilyMemberList"
import { useEffect, useState } from "react"
import { SubMenuFAB } from "@/app/(core)/_components/SubMenuFAB"
import { FloatingActionItem } from "@/app/(core)/_components/FloatingActionButton"
import { IconPlus, IconEdit } from "@tabler/icons-react"
import { useRouter, usePathname } from "next/navigation"
import { FAMILIES_MEMBERS_CHILD_NEW_URL, FAMILIES_MEMBERS_CHILD_EDIT_URL } from "@/app/(core)/endpoints"

export default function FamilyMembersLayout({ children }: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobile } = useWindow()

  /** URLから選択中のIDを取得する */
  const getSelectedIdFromPath = (): string | null => {
    // /families/members/parent/{id}/view または /families/members/child/{id}/view のパターンにマッチ
    const parentMatch = pathname.match(/\/families\/members\/parent\/([^\/]+)(\/|$)/)
    const childMatch = pathname.match(/\/families\/members\/child\/([^\/]+)(\/|$)/)
    return parentMatch?.[1] || childMatch?.[1] || null
  }

  /** 現在選択中のID */
  const selectedId = getSelectedIdFromPath()

  /** 子供編集画面かどうか */
  const isChildViewPage = pathname.match(/\/families\/members\/child\/([^\/]+)\/view/)
  const childIdForEdit = isChildViewPage?.[1]

  /** フローティングアクションアイテム */
  const actionItems: FloatingActionItem[] = [
    { 
      icon: <IconPlus size={20} />,
      onClick: () => router.push(FAMILIES_MEMBERS_CHILD_NEW_URL)
    },
  ]

  // 子供閲覧画面の場合、編集ボタンを追加
  if (childIdForEdit) {
    actionItems.unshift({
      icon: <IconEdit size={20} />,
      onClick: () => router.push(FAMILIES_MEMBERS_CHILD_EDIT_URL(childIdForEdit))
    })
  }

  // SSRレンダリング時の処理
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return (<></>)
    
  // スマホの場合
  if (isMobile) {
    // 選択されていない場合、一覧画面を表示する
    if (!selectedId) {
      return <FamilyMemberList selectedId={null} />
    }
    // 選択されている場合、子コンテンツを表示する
    return (
      <>
        {children}
        <SubMenuFAB
          items={actionItems}
          addBackButton={false}
        />
      </>
    )
  }
  
  // スマホ以外の場合、2ペインで表示する
  return (
    <>
      <div className="flex h-full" style={{ gap: "1rem" }}>
        {/* 一覧画面 */}
        <aside className="w-1/3" style={{ borderRight: "1px solid #e0e0e0", paddingRight: "1rem", overflowY: "auto" }}>
          <FamilyMemberList selectedId={selectedId} />
        </aside>
        {/* メインコンテンツ */}
        <main className="flex-1" style={{ paddingLeft: "1rem", overflowY: "auto" }}>
          {children}
        </main>
      </div>
      <SubMenuFAB
        items={actionItems}
        addBackButton={false}
      />
    </>
  )

}
