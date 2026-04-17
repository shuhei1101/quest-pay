"use client"
import { SimpleGrid, Tabs } from "@mantine/core"
import { useWindow } from "@/app/(core)/useConstants"
import { ReactNode } from "react"
import { QuestSelect } from "@/drizzle/schema"
import { QuestCategoryById } from "@/app/api/quests/category/service"
import { TAB_ALL, TAB_OTHERS } from "./questTabConstants"

type QuestItem = {
  quest: QuestSelect
}

type QuestGridProps<T extends QuestItem> = {
  /** 表示するクエスト一覧 */
  quests: T[]
  /** クエストをレンダリングする関数 */
  renderQuest: (quest: T, index: number) => ReactNode
  /** スクロール最下部検知時のコールバック */
  onScrollBottom?: () => void
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
  onScrollBottom,
  panelHeight = "calc(100vh - 200px)",
  tabValue,
  questCategoryById,
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

  return (
    <div>
      {/* クエストグリッド */}
      <SimpleGrid cols={getGridCols()} spacing="md">
        {quests.map((quest, index) => renderQuest(quest, index))}
      </SimpleGrid>
    </div>
  )
}
