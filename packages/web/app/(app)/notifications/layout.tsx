"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { NotificationList } from "./_components/NotificationList"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

/** 通知レイアウト */
export default function NotificationLayout({ children }: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isMobile } = useWindow()

  /** URLから選択中のIDを取得する */
  const getSelectedIdFromPath = (): string | null => {
    // /notifications/{id} のパターンにマッチ
    const match = pathname.match(/\/notifications\/([^\/]+)(\/|$)/)
    return match?.[1] || null
  }

  /** 現在選択中のID */
  const selectedId = getSelectedIdFromPath()

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
      return <NotificationList selectedId={null} />
    }
    // 選択されている場合、子コンテンツを表示する
    return <>{children}</>
  }
  
  // スマホ以外の場合、2ペインで表示する
  return (
    <div className="flex h-full">
      {/* 一覧画面 */}
      <aside className="w-1/3 border-r">
        <NotificationList selectedId={selectedId} />
      </aside>
      {/* メインコンテンツ */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
