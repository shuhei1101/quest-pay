"use client"
import { Tabs } from "@mantine/core"
import { ReactNode, useRef, useEffect } from "react"

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

  /** スクロール時の余白（ピクセル） */
  const SCROLL_MARGIN = 16

  /** スティッキータブリストのスタイル */
  const stickyTabListStyle = {
    position: "sticky" as const,
    top: 0,
    zIndex: 100,
    backgroundColor: "var(--mantine-color-body)",
    paddingBottom: 8
  }

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
    <div style={{ height: "100%", flex: 1, minHeight: 0, overflow: "hidden" }}>
      <Tabs 
        value={activeTab} 
        onChange={onChange}
        className="flex-1 min-h-0"
        styles={{
          root: { display: "flex", flexDirection: "column", height: "100%" },
          panel: { flex: 1, minHeight: 0, overflow: "auto", paddingRight: 16, paddingBottom: 16 },
        }}
      >
        {/* タブリスト（スティッキー対応） */}
        <div style={stickyTabListStyle}>
          <Tabs.List>
            <div ref={tabListRef} className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
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
        </div>
        
        {/* タブパネルコンテンツ */}
        {children}
      </Tabs>
    </div>
  )
}
