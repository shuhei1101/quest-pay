"use client"
import { Tabs } from "@mantine/core"
import { ReactNode, useRef, useEffect, useMemo } from "react"
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
export const ScrollableTabs = ({ value, onChange, items, children, enableSwipe = false, getSwipeHandlers }: {
  /** 現在選択されているタブの値 */
  value: string | null
  /** タブ変更時のハンドラ */
  onChange: (value: string | null) => void
  /** タブアイテムのリスト */
  items: ScrollableTabItem[]
  /** タブパネルの内容 */
  children: ReactNode
  /** スワイプ操作を有効にするか */
  enableSwipe?: boolean
  /** スワイプハンドラを取得するコールバック（子コンポーネントでスワイプ範囲を指定する場合に使用） */
  getSwipeHandlers?: (handlers: ReturnType<typeof useSwipeable>) => void
}) => {
  /** タブリストコンテナの参照 */
  const tabListRef = useRef<HTMLDivElement>(null)

  /** スクロール時の余白（ピクセル） */
  const SCROLL_MARGIN = 16

  /** タブリスト（スワイプ用） */
  const tabList = useMemo(() => items.map((item) => item.value), [items])

  /** 左右スワイプ時のハンドル */
  const swipeHandlers = useSwipeable({
    onSwiped: (event) => {
      if (!enableSwipe || !value) return
      
      const idx = tabList.indexOf(value)
      
      // インデックスが見つからない場合は何もしない
      if (idx === -1) return

      if (event.dir === "Left") {
        // 次のタブへ
        const next = tabList[idx + 1]
        if (next) onChange(next)
      } else if (event.dir === "Right") {
        // 前のタブへ
        const prev = tabList[idx - 1]
        if (prev) onChange(prev)
      }
    },
    trackMouse: true
  })

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

  /** スワイプハンドラを親コンポーネントに提供する（初回のみ） */
  useEffect(() => {
    if (getSwipeHandlers && enableSwipe) {
      getSwipeHandlers(swipeHandlers)
    }
    // swipeHandlersを依存配列に含めると毎回実行されるため、意図的に除外
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSwipeHandlers, enableSwipe])

  return (
    <div style={{ height: "100%" }}>
      <Tabs 
        value={value} 
        onChange={onChange}
        className="flex-1 min-h-0"
        styles={{
          root: { display: "flex", flexDirection: "column", height: "100%" },
          panel: { flex: 1, minHeight: 0, overflow: "auto", paddingRight: 16 },
        }}
      >
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
