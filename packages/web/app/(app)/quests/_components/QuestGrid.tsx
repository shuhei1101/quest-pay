"use client"
import { SimpleGrid, Tabs } from "@mantine/core"
import { useWindow } from "@/app/(core)/useConstants"
import { ReactNode } from "react"
import { QuestCategoryById } from "@/app/api/quests/category/entity"
import { QuestEntity } from "@/app/api/quests/entity"

type QuestItem = {
  id: QuestEntity["id"]
  category_id?: QuestEntity["category_id"]
  [key: string]: any
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
}

/** クエストグリッドコンポーネント */
export const QuestGrid = <T extends QuestItem>({
  quests,
  renderQuest,
  sentinelRef,
  panelHeight = "calc(100vh - 200px)",
  tabValue,
  questCategoryById
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
    if (!tabValue || tabValue === "すべて") {
      return quests
    }
    
    if (tabValue === "その他") {
      return quests.filter((quest) => quest.category_id === undefined)
    }
    
    // カテゴリ名からIDを逆引き
    const categoryId = Object.entries(questCategoryById ?? {})
      .find(([_, category]) => category.name === tabValue)?.[0]
    
    return quests.filter((quest) => quest.category_id === categoryId)
  }

  const filteredQuests = getFilteredQuests()

  return (
    <div
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
      
      {/* 無限スクロール用のセンチネル */}
      {sentinelRef && <div ref={sentinelRef} style={{ height: 1 }} />}
    </div>
  )
}
