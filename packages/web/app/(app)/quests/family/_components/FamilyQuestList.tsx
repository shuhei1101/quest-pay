"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useFamilyQuests } from "../_hooks/useFamilyQuests"
import { useQuestCategories } from "@/app/(app)/quests/category/_hook/useQuestCategories"
import { useDisclosure } from "@mantine/hooks"
import { FamilyQuestCardLayout } from "./FamilyQuestCardLayout"
import { FamilyQuestFilterPopup } from "./FamilyQuestFilterPopup"
import { FamilyQuestSortPopup } from "./FamilyQuestSortPopup"
import { QuestListLayout } from "../../_components/QuestListLayout"
import { FamilyQuestFilterScheme, type FamilyQuest, type FamilyQuestFilterType } from "@/app/api/quests/family/query"
import type { QuestSort } from "@/drizzle/schema"
import { FAMILY_QUEST_VIEW_URL, FAMILY_QUESTS_URL } from "@/app/(core)/endpoints"

/** 家族クエストリストコンポーネント */
export const FamilyQuestList = () => {
  const router = useRouter()

  /** フィルターポップアップ制御状態 */
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)
  /** ソートポップアップ制御状態 */
  const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)
  /** クエストフィルター状態 */
  const [questFilter, setQuestFilter] = useState<FamilyQuestFilterType>({ tags: [] })
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<FamilyQuestFilterType>({ tags: [] })
  /** ソート状態 */
  const [sort, setSort] = useState<QuestSort>({ column: "id", order: "asc" })

  /** クエリストリングの状態 */
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()

  /** クエリストリング変更時にフィルターをセットする */
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
  const pageSize = 100

  /** クエストカテゴリ */
  const { questCategories, questCategoryById, isLoading: categoryLoading } = useQuestCategories()

  /** クエスト一覧 */
  const { fetchedQuests, isLoading, totalRecords, maxPage } = useFamilyQuests({
    filter: searchFilter,
    sortColumn: sort.column,
    sortOrder: sort.order,
    page,
    pageSize
  })

  /** 検索ボタン押下時のハンドル */
  const handleSearch = useCallback(() => {
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
  }, [questFilter, router])

  /** ページ変更時のハンドル */
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
  }, [])

  /** 検索テキスト変更時のハンドル */
  const handleSearchTextChange = useCallback((searchText: string) => {
    setQuestFilter((prev) => ({
      ...prev,
      name: searchText
    }))
  }, [])

  /** クエストカードレンダリング用の関数 */
  const renderFamilyQuestCard = useCallback((quest: FamilyQuest, index: number) => (
    <FamilyQuestCardLayout
      key={index}
      familyQuest={quest}
      onClick={(id) => router.push(FAMILY_QUEST_VIEW_URL(id))}
    />
  ), [router])

  /** フィルター検索時のハンドル */
  const handleFilterSearch = useCallback((filter: FamilyQuestFilterType) => {
    setQuestFilter(filter)
    handleSearch()
  }, [handleSearch])

  /** ソート検索時のハンドル */
  const handleSortSearch = useCallback((newSort: QuestSort) => {
    setSort(newSort)
    handleSearch()
  }, [handleSearch])

  /** カテゴリ変更時のハンドル */
  const handleCategoryChange = useCallback((categoryId: string | undefined) => {
    // カテゴリIDをフィルターに設定する
    setSearchFilter((prev) => ({
      ...prev,
      categoryId
    }))
    // ページをリセットする
    setPage(1)
  }, [])

  return (
    <QuestListLayout<FamilyQuest, FamilyQuestFilterType, QuestSort>
      quests={fetchedQuests}
      page={page}
      maxPage={maxPage}
      totalRecords={totalRecords}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onSearchTextChange={handleSearchTextChange}
      onSearch={handleSearch}
      renderQuestCard={renderFamilyQuestCard}
      questCategories={questCategories}
      questCategoryById={questCategoryById}
      onFilterOpen={openFilter}
      onSortOpen={openSort}
      onCategoryChange={handleCategoryChange}
      filterPopup={
        <FamilyQuestFilterPopup
          close={closeFilter}
          handleSearch={handleFilterSearch}
          currentFilter={questFilter}
          opened={filterOpened}
        />
      }
      sortPopup={
        <FamilyQuestSortPopup
          close={closeSort}
          handleSearch={handleSortSearch}
          opened={sortOpened}
          currentSort={sort}
        />
      }
    />
  )
}
