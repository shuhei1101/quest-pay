"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useFamilyQuests } from "../_hook/useFamilyQuests"
import { Tabs } from "@mantine/core"
import { useQuestCategories } from "@/app/(app)/quests/category/_hook/useQuestCategories"
import { useDisclosure, useIntersection } from "@mantine/hooks"
import { FamilyQuestCardLayout } from "./FamilyQuestCardLayout"
import { devLog } from "@/app/(core)/util"
import { FamilyQuestFilterPopup } from "./FamilyQuestFilterPopup"
import { FamilyQuestSortPopup } from "./FamilyQuestSortPopup"
import { QuestCategoryTabs } from "../../_components/QuestCategoryTabs"
import { QuestSearchBar } from "../../_components/QuestSearchBar"
import { QuestGrid } from "../../_components/QuestGrid"
import type { FamilyQuest } from "@/app/api/quests/family/query"
import type { FamilyQuestSort } from "@/drizzle/schema"
import { FAMILY_QUEST_URL, FAMILY_QUESTS_URL } from "@/app/(core)/endpoints"
import { FamilyQuestFilterScheme, type FamilyQuestFilterType } from "@/app/api/quests/family/schema"

export const FamilyQuestList = () => {
  const router = useRouter() 

  /** タブ状態 */
  const [tabValue, setTabValue] = useState<string | null>('すべて')

  /**  フィルターポップアップ制御状態 */
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)
  /**  ソートポップアップ制御状態 */
  const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)

  /** 現在のクエスト一覧状態 */
  const [displayQuests, setDisplayQuests] = useState<FamilyQuest[]>([])

  /** クエストフィルター状態 */
  const [questFilter, setQuestFilter] = useState<FamilyQuestFilterType>({tags: []})
  
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<FamilyQuestFilterType>({tags: []})
  
  /** ソート状態 */
  const [sort, setSort] = useState<FamilyQuestSort>({column: "id", order: "asc"})

  /** クエリストリングの状態 */
  const searchParams = useSearchParams()
  
  // パラメータをクエストフィルターにセットする
  const searchParamsString = searchParams.toString()

  // クエリストリング変更時のハンドル
  useEffect(() => {
    const queryObj = Object.fromEntries(searchParams.entries())
    const parsedQuery = {
      ...queryObj,
      tags: queryObj.tags ? queryObj.tags.split(",") : []
    }
    setQuestFilter(FamilyQuestFilterScheme.parse(parsedQuery))
  }, [searchParamsString])

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 10
  
  /** クエストカテゴリ */
  const { questCategories, questCategoryById, isLoading: categoryLoading } = useQuestCategories()

  /** クエスト一覧 */
  const { fetchedQuests, isLoading, totalRecords ,maxPage } = useFamilyQuests({
    filter: searchFilter,
    sortColumn: sort.column,
    sortOrder: sort.order,
    page,
    pageSize
  })

  /** 無限スクロール用 Intersection Observer */
  const { ref: sentinelRef, entry } = useIntersection({
    threshold: 1,
  })
  
  /** 下まで来たら次ページを取得 */
  useEffect(() => {
    if (entry?.isIntersecting) {
      devLog("ページ最下層検知。現在のページ: ", {page, maxPage, totalRecords})
      // 次のページが存在するときだけセット
      if (page < maxPage && !isLoading) {
        setPage((prev) => prev + 1)
      }
    }
  }, [entry, totalRecords, page, maxPage, isLoading])
  
  /** 検索ボタン押下時のハンドル */
  const handleSearch = () => {
    // ページを初期化する
    setPage(1)
    setDisplayQuests([])

    // クエストフィルターをクエリストリングに変換する
    const paramsObj = Object.fromEntries(
      Object.entries(questFilter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    )
    const params = new URLSearchParams(paramsObj)

    // フィルターをURLに反映する
    router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)

    // 検索フィルターを更新し、一覧を更新する
    setSearchFilter(questFilter)
  }

  // データ取得時のハンドル
  useEffect(() => {
    if (page === 1) {
      // 検索切り替え時などはリセット
      setDisplayQuests(fetchedQuests)
    } else {
      setDisplayQuests(prev => [...prev, ...fetchedQuests])
    }
  }, [fetchedQuests, page])

  /** クエスト選択時のハンドル */
  const handleQuestId = (questId: string) => router.push(FAMILY_QUEST_URL(questId))

  /** 検索テキスト変更時のハンドル */
  const handleSearchTextChange = (searchText: string) => {
    setQuestFilter((prev) => ({
      ...prev,
      name: searchText
    }))
  }

  return (
    <div className="w-full h-[80vh]">
      {/* クエストカテゴリタブ */}
      <QuestCategoryTabs
        tabValue={tabValue}
        onTabChange={setTabValue}
        categories={questCategories}
      >
        <div className="m-3" />

        {/* 検索バー */}
        <QuestSearchBar
          onSearch={(searchText) => {
            handleSearchTextChange(searchText)
            handleSearch()
          }}
          onFilterClick={openFilter}
          onSortClick={openSort}
        />
        
        <div className="m-3" />

        {/* すべてタブのパネル */}
        <Tabs.Panel value={"すべて"} key={0}>
          <QuestGrid<FamilyQuest>
            quests={displayQuests}
            renderQuest={(quest, index) => (
              <FamilyQuestCardLayout 
                key={index} 
                familyQuest={quest} 
                onClick={handleQuestId} 
              />
            )}
            sentinelRef={sentinelRef}
            tabValue={tabValue}
            questCategoryById={questCategoryById}
          />
        </Tabs.Panel>

        {/* カテゴリごとのパネル */}
        {questCategories.map((category) => (
          <Tabs.Panel value={category.name} key={category.id}>
            <QuestGrid
              quests={displayQuests}
              renderQuest={(quest, index) => (
                <FamilyQuestCardLayout 
                  key={index} 
                  familyQuest={quest} 
                  onClick={handleQuestId} 
                />
              )}
              sentinelRef={sentinelRef}
              tabValue={tabValue}
              questCategoryById={questCategoryById}
            />
          </Tabs.Panel>
        ))}

        {/* その他タブのパネル */}
        <Tabs.Panel value={"その他"} key={-1}>
          <QuestGrid
            quests={displayQuests}
            renderQuest={(quest, index) => (
              <FamilyQuestCardLayout 
                key={index} 
                familyQuest={quest} 
                onClick={handleQuestId} 
              />
            )}
            sentinelRef={sentinelRef}
            tabValue={tabValue}
            questCategoryById={questCategoryById}
          />
        </Tabs.Panel>
        
        <div className="m-5" />
      </QuestCategoryTabs>

      {/* フィルターポップアップ */}
      <FamilyQuestFilterPopup 
        close={closeFilter}
        handleSearch={(filter) => {
          setQuestFilter(filter)
          handleSearch()
        }}
        currentFilter={questFilter}
        opened={filterOpened}
      />
      {/* ソートポップアップ */}
      <FamilyQuestSortPopup 
        close={closeSort}
        handleSearch={(sort) => {
          setSort(sort)
          handleSearch()
        }}
        opened={sortOpened}
        currentSort={sort}
      />
    </div>
  )
}
