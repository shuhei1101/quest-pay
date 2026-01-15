"use client"
import { Tabs } from "@mantine/core"
import { RenderIcon } from "../../icons/_components/RenderIcon"
import { useSwipeable } from "react-swipeable"
import { ReactNode, useRef, useEffect } from "react"
import { QuestCategorySelect } from "@/drizzle/schema"

const TAB_ALL = "すべて"
const TAB_OTHERS = "その他"

/** クエストカテゴリタブコンポーネント */
export const QuestCategoryTabs = ({ tabValue, onTabChange, categories, children, enableSwipe = true }: {
  /** 現在のタブ値 */
  tabValue: string | null
  /** タブ変更時のハンドル */
  onTabChange: (value: string | null) => void
  /** クエストカテゴリ一覧 */
  categories: QuestCategorySelect[]
  /** タブパネルの内容 */
  children: ReactNode
  /** スワイプ操作を有効にするか */
  enableSwipe?: boolean
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

  /** 左右スワイプ時のハンドル */
  const handlers = useSwipeable({
    onSwiped: (event) => {
      if (!enableSwipe) return
      
      const idx = tabList.indexOf(tabValue ?? TAB_ALL)

      if (event.dir === "Left") {
        // 次のタブへ
        const next = tabList[idx + 1]
        if (next) onTabChange(next)
      }

      if (event.dir === "Right") {
        // 前のタブへ
        const prev = tabList[idx - 1]
        if (prev) onTabChange(prev)
      }
    },
    trackMouse: true
  })

  return (
    <div {...handlers} className="w-full">
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
