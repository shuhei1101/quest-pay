"use client"
import { useState, ReactNode, useEffect } from "react"
import { Tabs, Loader, Center } from "@mantine/core"
import { useDisclosure, useIntersection } from "@mantine/hooks"
import { QuestCategoryTabs } from "./QuestCategoryTabs"
import { QuestSearchBar } from "./QuestSearchBar"
import { QuestGrid } from "./QuestGrid"
import { QuestCategorySelect, QuestSelect } from "@/drizzle/schema"
import { QuestCategoryById } from "@/app/api/quests/category/service"
import { devLog } from "@/app/(core)/util"

type QuestItem = {
  quest: QuestSelect
}

/** クエストリストレイアウトコンポーネント */
export const QuestListLayout = <T extends QuestItem, TFilter, TSort>({
  quests,
  page,
  maxPage,
  totalRecords,
  isLoading,
  onPageChange,
  onSearchTextChange,
  onSearch,
  renderQuestCard,
  questCategories,
  questCategoryById,
  filterPopup,
  sortPopup,
  onFilterOpen,
  onSortOpen,
}: {
  /** 表示するクエスト一覧 */
  quests: T[]
  /** 現在のページ */
  page: number
  /** 最大ページ */
  maxPage: number
  /** 総レコード数 */
  totalRecords: number
  /** ローディング状態 */
  isLoading: boolean
  /** ページ変更時のハンドル */
  onPageChange: (page: number) => void
  /** 検索テキスト変更時のハンドル */
  onSearchTextChange: (searchText: string) => void
  /** 検索実行時のハンドル */
  onSearch: () => void
  /** クエストカード描画関数 */
  renderQuestCard: (quest: T, index: number) => ReactNode
  /** クエストカテゴリ一覧 */
  questCategories: QuestCategorySelect[]
  /** クエストカテゴリ辞書 */
  questCategoryById?: QuestCategoryById
  /** フィルターポップアップコンポーネント */
  filterPopup: ReactNode
  /** ソートポップアップコンポーネント */
  sortPopup: ReactNode
  /** フィルターポップアップ開くハンドル */
  onFilterOpen: () => void
  /** ソートポップアップ開くハンドル */
  onSortOpen: () => void
}) => {
  /** タブ状態 */
  const [tabValue, setTabValue] = useState<string | null>('すべて')

  /** 現在のクエスト一覧状態 */
  const [displayQuests, setDisplayQuests] = useState<T[]>([])

  /** 無限スクロール用 Intersection Observer */
  const { ref: sentinelRef, entry } = useIntersection({
    threshold: 1,
  })

  /** 下まで来たら次ページを取得する */
  useEffect(() => {
    if (entry?.isIntersecting) {
      devLog("ページ最下層検知。現在のページ: ", { page, maxPage, totalRecords })
      // 次のページが存在するときだけセットする
      if (page < maxPage && !isLoading) {
        onPageChange(page + 1)
      }
    }
  }, [entry, totalRecords, page, maxPage, isLoading, onPageChange])

  /** データ取得時に表示クエスト一覧を更新する */
  useEffect(() => {
    if (page === 1) {
      // 検索切り替え時などはリセットする
      setDisplayQuests(quests)
    } else {
      setDisplayQuests(prev => [...prev, ...quests])
    }
  }, [quests, page])

  /** 検索テキスト変更＋検索実行のハンドル */
  const handleSearchWithText = (searchText: string) => {
    onSearchTextChange(searchText)
    onSearch()
  }

  /** 検索実行前のリセット処理 */
  const resetForSearch = () => {
    onPageChange(1)
    setDisplayQuests([])
  }

  return (
    <div className="w-full">
      {/* クエストカテゴリタブ */}
      <QuestCategoryTabs
        tabValue={tabValue}
        onTabChange={setTabValue}
        categories={questCategories}
      >
        <div className="m-3" />

        {/* 検索バー */}
        <QuestSearchBar
          onSearch={handleSearchWithText}
          onFilterClick={onFilterOpen}
          onSortClick={onSortOpen}
        />

        <div className="m-3" />

        {/* すべてタブのパネル */}
        <Tabs.Panel value={"すべて"} key={0}>
          <QuestGrid<T>
            quests={displayQuests}
            renderQuest={renderQuestCard}
            sentinelRef={sentinelRef}
            tabValue={tabValue}
            questCategoryById={questCategoryById}
          />
          {/* ローディング表示 */}
          {isLoading && (
            <Center className="my-4">
              <Loader size="md" />
            </Center>
          )}
        </Tabs.Panel>

        {/* カテゴリごとのパネル */}
        {questCategories.map((category) => (
          <Tabs.Panel value={category.name} key={category.id}>
            <QuestGrid<T>
              quests={displayQuests}
              renderQuest={renderQuestCard}
              sentinelRef={sentinelRef}
              tabValue={tabValue}
              questCategoryById={questCategoryById}
            />
            {/* ローディング表示 */}
            {isLoading && (
              <Center className="my-4">
                <Loader size="md" />
              </Center>
            )}
          </Tabs.Panel>
        ))}

        {/* その他タブのパネル */}
        <Tabs.Panel value={"その他"} key={-1}>
          <QuestGrid<T>
            quests={displayQuests}
            renderQuest={renderQuestCard}
            sentinelRef={sentinelRef}
            tabValue={tabValue}
            questCategoryById={questCategoryById}
          />
          {/* ローディング表示 */}
          {isLoading && (
            <Center className="my-4">
              <Loader size="md" />
            </Center>
          )}
        </Tabs.Panel>

        <div className="m-5" />
      </QuestCategoryTabs>

      {/* フィルターポップアップ */}
      {filterPopup}

      {/* ソートポップアップ */}
      {sortPopup}
    </div>
  )
}
