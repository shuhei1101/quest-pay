"use client"
import { Tabs } from "@mantine/core"
import { RenderIcon } from "../../icons/_components/RenderIcon"
import { ReactNode, useRef, useEffect } from "react"
import { QuestCategorySelect } from "@/drizzle/schema"
import { TAB_ALL, TAB_OTHERS } from "./questTabConstants"

/** クエストカテゴリタブコンポーネント */
export const QuestCategoryTabs = ({ tabValue, onTabChange, categories, children }: {
  /** 現在のタブ値 */
  tabValue: string | null
  /** タブ変更時のハンドル */
  onTabChange: (value: string | null) => void
  /** クエストカテゴリ一覧 */
  categories: QuestCategorySelect[]
  /** タブパネルの内容 */
  children: ReactNode
}) => {
  /** タブリストコンテナの参照 */
  const tabListRef = useRef<HTMLDivElement>(null)

  /** タブリスト */
  const tabList = [
    TAB_ALL,
    ...categories.map(c => c.name),
    TAB_OTHERS
  ]

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
      <Tabs value={tabValue} onChange={onTabChange}>
        {/* タブリスト */}
        <Tabs.List>
          <div ref={tabListRef} className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
            {/* すべてタブ */}
            <Tabs.Tab key={0} value={TAB_ALL} data-value={TAB_ALL}>
              すべて
            </Tabs.Tab>
            
            {/* カテゴリタブ */}
            {categories.map((category) => (
              <Tabs.Tab
                key={category.id}
                value={category.name}
                data-value={category.name}
                leftSection={
                  <RenderIcon 
                    iconName={category.iconName} 
                    size={category.iconSize ?? undefined} 
                    iconColor={category.iconColor} 
                  />
                }
              >
                {category.name}
              </Tabs.Tab>
            ))}
            
            {/* その他タブ */}
            <Tabs.Tab key={-1} value={TAB_OTHERS} data-value={TAB_OTHERS}>
              その他
            </Tabs.Tab>
          </div>
        </Tabs.List>
        
        {/* タブパネルコンテンツ */}
        {children}
      </Tabs>
    </div>
  )
}
