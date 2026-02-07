"use client"
import { ReactNode, useState, useCallback } from "react"
import { QuestCategorySelect } from "@/drizzle/schema"
import { TAB_ALL, TAB_OTHERS } from "./questTabConstants"
import { ScrollableTabs, ScrollableTabItem } from "@/app/(core)/_components/ScrollableTabs"
import { RenderIcon } from "../../icons/_components/RenderIcon"
import { useSwipeable } from "react-swipeable"

/** クエストカテゴリタブコンポーネント */
export const QuestCategoryTabs = ({ tabValue, onTabChange, categories, children, enableSwipe = false, getSwipeHandlers }: {
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
  /** スワイプハンドラを取得するコールバック */
  getSwipeHandlers?: (handlers: ReturnType<typeof useSwipeable>) => void
}) => {
  /** タブアイテムを生成する */
  const tabItems: ScrollableTabItem[] = [
    // すべてタブ
    {
      value: TAB_ALL,
      label: "すべて"
    },
    // カテゴリタブ
    ...categories.map((category) => ({
      value: category.name,
      label: category.name,
      leftSection: (
        <RenderIcon 
          iconName={category.iconName} 
          size={category.iconSize ?? undefined} 
          iconColor={category.iconColor} 
        />
      )
    })),
    // その他タブ
    {
      value: TAB_OTHERS,
      label: "その他"
    }
  ]

  return (
    <ScrollableTabs
      value={tabValue}
      onChange={onTabChange}
      items={tabItems}
      enableSwipe={enableSwipe}
      getSwipeHandlers={getSwipeHandlers}
    >
      {children}
    </ScrollableTabs>
  )
}
