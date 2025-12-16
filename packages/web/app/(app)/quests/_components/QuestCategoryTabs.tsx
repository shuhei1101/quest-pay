"use client"
import { Tabs } from "@mantine/core"
import { RenderIcon } from "../../icons/_components/RenderIcon"
import { useSwipeable } from "react-swipeable"
import { ReactNode } from "react"
import { QuestCategoryEntity } from "@/app/api/quests/category/entity"

const TAB_ALL = "すべて"
const TAB_OTHERS = "その他"

/** クエストカテゴリタブコンポーネント */
export const QuestCategoryTabs = ({ tabValue, onTabChange, categories, children, enableSwipe = true }: {
  /** 現在のタブ値 */
  tabValue: string | null
  /** タブ変更時のハンドル */
  onTabChange: (value: string | null) => void
  /** クエストカテゴリ一覧 */
  categories: QuestCategoryEntity[]
  /** タブパネルの内容 */
  children: ReactNode
  /** スワイプ操作を有効にするか */
  enableSwipe?: boolean
}) => {
  /** タブリスト */
  const tabList = [
    TAB_ALL,
    ...categories.map(c => c.name),
    TAB_OTHERS
  ]

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
          <div className="flex overflow-x-auto hidden-scrollbar whitespace-nowrap gap-2">
            {/* すべてタブ */}
            <Tabs.Tab key={0} value={TAB_ALL}>
              すべて
            </Tabs.Tab>
            
            {/* カテゴリタブ */}
            {categories.map((category) => (
              <Tabs.Tab
                key={category.id}
                value={category.name}
                leftSection={
                  <RenderIcon 
                    iconName={category.icon_name} 
                    size={category.icon_size ?? undefined} 
                    iconColor={category.icon_color} 
                  />
                }
              >
                {category.name}
              </Tabs.Tab>
            ))}
            
            {/* その他タブ */}
            <Tabs.Tab key={-1} value={TAB_OTHERS}>
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
