"use client"
import { Tabs } from "@mantine/core"
import { ReactNode, useRef, useEffect } from "react"

/** フォーカス制御付きタブコンポーネント */
export const TabsWithFocusControl = ({ tabValue, onTabChange, children, enableWheel = true }: {
  /** 現在のタブ値 */
  tabValue: string | null
  /** タブ変更時のハンドル */
  onTabChange: (value: string | null) => void
  /** タブリストとパネルの内容 */
  children: ReactNode
  /** マウスホイールでの横スクロールを有効にするか */
  enableWheel?: boolean
}) => {
  /** タブリストコンテナの参照 */
  const tabListRef = useRef<HTMLDivElement>(null)

  /** スクロール時の余白（ピクセル） */
  const SCROLL_MARGIN = 16

  /** タブ変更時に選択されたタブを画面内にスクロールする */
  useEffect(() => {
    if (!tabListRef.current || !tabValue) return

    const container = tabListRef.current
    const selectedTabElement = container.querySelector(`[data-value="${tabValue}"]`) as HTMLElement

    if (selectedTabElement) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = selectedTabElement.getBoundingClientRect()

      // タブが画面外にある場合、スクロールして表示する
      if (tabRect.left < containerRect.left) {
        // タブが左側に隠れている場合
        container.scrollLeft += tabRect.left - containerRect.left - SCROLL_MARGIN
      } else if (tabRect.right > containerRect.right) {
        // タブが右側に隠れている場合
        container.scrollLeft += tabRect.right - containerRect.right + SCROLL_MARGIN
      }
    }
  }, [tabValue])

  /** マウスホイールでの横スクロールを有効化する */
  useEffect(() => {
    if (!enableWheel) return
    
    const container = tabListRef.current
    if (!container) return

    /** ホイールイベントハンドラ */
    const handleWheel = (e: WheelEvent) => {
      // 縦スクロールを横スクロールに変換する
      if (e.deltaY !== 0) {
        e.preventDefault()
        container.scrollLeft += e.deltaY
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [enableWheel])

  return (
    <Tabs value={tabValue} onChange={onTabChange}>
      {/* タブリストのラッパーコンテナ */}
      <Tabs.List>
        <div ref={tabListRef} className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
          {children}
        </div>
      </Tabs.List>
    </Tabs>
  )
}
