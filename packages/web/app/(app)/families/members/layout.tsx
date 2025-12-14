"use client"

import { useConstants } from "@/app/(core)/useConstants"
import { FamilyMemberList } from "./_components/FamilyMemberList"
import { useEffect, useState } from "react"

export default function FamilyMembersLayout({ children }: {
  children: React.ReactNode
}) {
  const { isMobile } = useConstants()

  // スマホの場合
  if (isMobile) {
    // 通常の画面遷移を行う
    return <>{children}</>
  }

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
    </>
  )

}
