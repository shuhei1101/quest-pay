"use client"
import { Tabs } from "@mantine/core"
import { ReactNode, useRef, useEffect } from "react"
import { useSystemTheme } from "../useSystemTheme"
import { useSwipeable } from "react-swipeable"

/** スクロール可能なタブアイテムの型 */
export type ScrollableTabItem = {
  /** タブの値（一意な識別子） */
  value: string
  /** タブに表示するラベル */
  label: ReactNode
  /** タブの左側に表示するコンテンツ */
  leftSection?: ReactNode
  /** タブの右側に表示するコンテンツ */
  rightSection?: ReactNode
}

/** 横スクロール可能なタブコンポーネント */
export const ScrollableTabs = ({ activeTab, onChange, tabs, children }: {
  /** 現在選択されているタブの値 */
  activeTab: string | null
  /** タブ変更時のハンドラ */
  onChange: (value: string | null) => void
  /** タブアイテムのリスト */
  tabs: ScrollableTabItem[]
  /** タブパネルの内容 */
  children: ReactNode
}) => {
  /** タブリストコンテナの参照 */
  const tabListRef = useRef<HTMLDivElement>(null)

  /** システムカラースキーム */
  const { isDark } = useSystemTheme()

  /** スクロール時の余白（ピクセル） */
  const SCROLL_MARGIN = 16

  /** スワイプで次のタブに移動 */
  const handleSwipeLeft = () => {
    if (!activeTab) return

    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab)
    if (currentIndex < tabs.length - 1) {
      onChange(tabs[currentIndex + 1].value)
    }
  }

  /** スワイプで前のタブに移動 */
  const handleSwipeRight = () => {
    if (!activeTab) return

    const currentIndex = tabs.findIndex((tab) => tab.value === activeTab)
    if (currentIndex > 0) {
      onChange(tabs[currentIndex - 1].value)
    }
  }

  /** スワイプハンドラを設定 */
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: false, // マウスでのスワイプは無効化
    preventScrollOnSwipe: false, // 縦スクロールとの共存を許可
    delta: 30 // スワイプと判定する最小距離（ピクセル）- より反応良く調整
  })

  /** タブ変更時に選択されたタブを画面内にスクロールする */
  useEffect(() => {
    if (!tabListRef.current || !activeTab) return

    const container = tabListRef.current
    const selectedTabElement = container.querySelector(`[data-value="${activeTab}"]`) as HTMLElement

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
  }, [activeTab])

  /** マウスホイールでの横スクロールを有効化する */
  useEffect(() => {
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
  }, [])

  return (
    <Tabs 
      value={activeTab} 
      onChange={onChange}
    >
      {/* タブリスト（スティッキー対応） */}
      <Tabs.List
        style={{
          position: "sticky",
          top: 16,
          zIndex: 100,
          backgroundColor: "var(--mantine-color-body)",
          border: isDark ? "1px solid #373A40" : "1px solid #dee2e6",
          borderRadius: "8px",
          padding: "2px",
          marginBottom: "12px",
        }}
      >
        <div
          ref={tabListRef}
          className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2"
        >
          {tabs.map((item) => (
            <Tabs.Tab
              key={item.value}
              value={item.value}
              data-value={item.value}
              leftSection={item.leftSection}
              rightSection={item.rightSection}
            >
              {item.label}
            </Tabs.Tab>
          ))}
        </div>
      </Tabs.List>
      
      {/* タブパネルコンテンツ（スワイプ対応） */}
      <div 
        {...swipeHandlers}
        style={{
          touchAction: "pan-y", // 縦スクロールは許可、横スクロールでスワイプ検出
          WebkitUserSelect: "none", // iOS Safari対応
          userSelect: "none", // テキスト選択を防止してスワイプを優先
        }}
      >
        {children}
      </div>
    </Tabs>
  )
}
