"use client"

import { useWindow } from "@/app/(core)/useConstants"
import { SettingsList } from "./_components/SettingsList"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function SettingsLayout({ children }: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { isTablet } = useWindow()

  /** URLから選択中の設定項目を取得する */
  const getSelectedSettingFromPath = (): string | null => {
    // /settings/{setting-name} のパターンにマッチ
    const match = pathname.match(/\/settings\/([^\/]+)/)
    return match?.[1] || null
  }

  /** 現在選択中の設定項目 */
  const selectedSetting = getSelectedSettingFromPath()

  // SSRレンダリング時の処理
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return (<></>)
    
  // タブレット以下（モバイル+タブレット）の場合、シングルペイン
  if (isTablet) {
    // 選択されていない場合、一覧画面を表示する
    if (!selectedSetting) {
      return <SettingsList selectedSetting={null} />
    }
    // 選択されている場合、子コンテンツを表示する
    return children
  }
  
  // PC（タブレットより大きい）の場合、2ペインで表示する
  return (
    <div className="flex h-full" style={{ gap: "1rem" }}>
      {/* 左ペイン: 設定一覧 (幅1/3) */}
      <aside className="w-1/3" style={{ borderRight: "1px solid #e0e0e0", paddingRight: "1rem", overflowY: "auto" }}>
        <SettingsList selectedSetting={selectedSetting} />
      </aside>
      {/* 右ペイン: 設定詳細 (残りの幅) */}
      <main className="flex-1" style={{ paddingLeft: "1rem", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  )
}
