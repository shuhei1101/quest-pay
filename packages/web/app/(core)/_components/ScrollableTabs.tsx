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
export const ScrollableTabs = ({ value, onChange, items, children }: {
  /** 現在選択されているタブの値 */
  value: string | null
  /** タブ変更時のハンドラ */
  onChange: (value: string | null) => void
  /** タブアイテムのリスト */
  items: ScrollableTabItem[]
  /** タブパネルの内容 */
  children: ReactNode
}) => {
  /** タブリストコンテナの参照 */
  const tabListRef = useRef<HTMLDivElement>(null)

  /** スクロール時の余白（ピクセル） */
  const SCROLL_MARGIN = 16

  /** タブ変更時に選択されたタブを画面内にスクロールする */
  useEffect(() => {
    if (!tabListRef.current || !value) return

    const container = tabListRef.current
    const selectedTabElement = container.querySelector(`[data-value="${value}"]`) as HTMLElement

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
  }, [value])

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
    <div className="w-full">
      <Tabs value={value} onChange={onChange}>
        {/* タブリスト */}
        <Tabs.List>
          <div ref={tabListRef} className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
            {items.map((item) => (
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
        
        {/* タブパネルコンテンツ */}
        {children}
      </Tabs>
    </div>
  )
}
