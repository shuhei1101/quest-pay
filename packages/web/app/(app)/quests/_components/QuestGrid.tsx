"use client"
import { SimpleGrid, Tabs } from "@mantine/core"
import { useWindow } from "@/app/(core)/useConstants"
import { ReactNode } from "react"
import { QuestSelect } from "@/drizzle/schema"
import { QuestCategoryById } from "@/app/api/quests/category/service"
import { useSwipeable } from "react-swipeable"
import { TAB_ALL, TAB_OTHERS } from "./questTabConstants"

type QuestItem = {
  quest: QuestSelect
}

type QuestGridProps<T extends QuestItem> = {
  /** 表示するクエスト一覧 */
  quests: T[]
  /** クエストをレンダリングする関数 */
  renderQuest: (quest: T, index: number) => ReactNode
  /** 無限スクロール用のsentinelRef */
  sentinelRef?: (node?: Element | null) => void
  /** パネルの高さ */
  panelHeight?: string
  /** 現在のタブ値（フィルタリング用） */
  tabValue?: string | null
  /** クエストカテゴリ辞書 */
  questCategoryById?: QuestCategoryById
  /** タブ変更時のハンドル（スワイプ用） */
  onTabChange?: (value: string | null) => void
  /** 全タブリスト（スワイプ用） */
  tabList?: string[]
  /** スワイプ操作を有効にするか */
  enableSwipe?: boolean
}

/** クエストグリッドコンポーネント */
export const QuestGrid = <T extends QuestItem>({
  quests,
  renderQuest,
  sentinelRef,
  panelHeight = "calc(100vh - 200px)",
  tabValue,
  questCategoryById,
  onTabChange,
  tabList,
  enableSwipe = true
}: QuestGridProps<T>) => {
  /** 画面定数 */
  const { isMobile, isTablet, isDesktop } = useWindow()

  /** グリッドのカラム数を取得する */
  const getGridCols = () => {
    if (isMobile) return 1
    if (isTablet) return 2
    if (isDesktop) return 3
    return 4
  }

  /** タブによってフィルタリングされたクエストを取得する */
  const getFilteredQuests = () => {
    if (!tabValue || tabValue === TAB_ALL) {
      return quests
    }
    
    if (tabValue === TAB_OTHERS) {
      return quests.filter((quest) => quest.quest.categoryId === null)
    }
    
    // カテゴリ名からIDを逆引き
    const categoryId = Object.entries(questCategoryById ?? {})
      .find(([_, category]) => category.name === tabValue)?.[0]
    
    return quests.filter((quest) => String(quest.quest.categoryId) === categoryId)
  }

  const filteredQuests = getFilteredQuests()

  /** 左右スワイプ時のハンドル */
  const handlers = useSwipeable({
    onSwiped: (event) => {
      if (!enableSwipe || !onTabChange || !tabList || !tabValue) return
      
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
    <div
      {...handlers}
      style={{
        height: panelHeight,
        overflowY: "auto",
        paddingRight: "4px"
      }}
    >
      {/* クエストグリッド */}
      <SimpleGrid cols={getGridCols()} spacing="md">
        {filteredQuests.map((quest, index) => renderQuest(quest, index))}
      </SimpleGrid>
      
      {/* 無限スクロール用のセンチネル（カードが見切れないよう余白を確保する） */}
      {sentinelRef && <div ref={sentinelRef} style={{ height: 200 }} />}
    </div>
  )
}
