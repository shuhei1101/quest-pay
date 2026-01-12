"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useChildQuests } from "../_hooks/useChildQuests"
import { useQuestCategories } from "@/app/(app)/quests/category/_hook/useQuestCategories"
import { useDisclosure } from "@mantine/hooks"
import { ChildQuestCardLayout } from "./ChildQuestCardLayout"
import { ChildQuestFilterPopup } from "./ChildQuestFilterPopup"
import { ChildQuestSortPopup } from "./ChildQuestSortPopup"
import { QuestListLayout } from "../../_components/QuestListLayout"
import { ChildQuestFilterScheme, type ChildQuest, type ChildQuestFilterType } from "@/app/api/quests/family/[id]/child/query"
import type { QuestSort } from "@/drizzle/schema"
import { CHILD_QUEST_VIEW_URL, FAMILY_QUESTS_URL } from "@/app/(core)/endpoints"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"

/** 子供クエストリストコンポーネント */
export const ChildQuestList = () => {
  const router = useRouter()

  /** ログインユーザ情報 */
  const { userInfo } = useLoginUserInfo()
  /** フィルターポップアップ制御状態 */
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)
  /** ソートポップアップ制御状態 */
  const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)
  /** クエストフィルター状態 */
  const [questFilter, setQuestFilter] = useState<ChildQuestFilterType>({ tags: [] })
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<ChildQuestFilterType>({ tags: [] })
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
    setQuestFilter(ChildQuestFilterScheme.parse(parsedQuery))
  }, [searchParamsString])

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  /** クエストカテゴリ */
  const { questCategories, questCategoryById, isLoading: categoryLoading } = useQuestCategories()

  /** クエスト一覧 */
  const { fetchedQuests, isLoading, totalRecords, maxPage } = useChildQuests({
    childId: userInfo?.children?.id,
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
  const renderChildQuestCard = useCallback((quest: ChildQuest, index: number) => (
    <ChildQuestCardLayout
      key={index}
      childQuest={quest}
      onClick={(id) => router.push(CHILD_QUEST_VIEW_URL(id, userInfo?.children?.id || ""))}
    />
  ), [router])

  /** フィルター検索時のハンドル */
  const handleFilterSearch = useCallback((filter: ChildQuestFilterType) => {
    setQuestFilter(filter)
    handleSearch()
  }, [handleSearch])

  /** ソート検索時のハンドル */
  const handleSortSearch = useCallback((newSort: QuestSort) => {
    setSort(newSort)
    handleSearch()
  }, [handleSearch])

  return (
    <QuestListLayout<ChildQuest, ChildQuestFilterType, QuestSort>
      quests={fetchedQuests}
      page={page}
      maxPage={maxPage}
      totalRecords={totalRecords}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onSearchTextChange={handleSearchTextChange}
      onSearch={handleSearch}
      renderQuestCard={renderChildQuestCard}
      questCategories={questCategories}
      questCategoryById={questCategoryById}
      onFilterOpen={openFilter}
      onSortOpen={openSort}
      filterPopup={
        <ChildQuestFilterPopup
          close={closeFilter}
          handleSearch={handleFilterSearch}
          currentFilter={questFilter}
          opened={filterOpened}
        />
      }
      sortPopup={
        <ChildQuestSortPopup
          close={closeSort}
          handleSearch={handleSortSearch}
          opened={sortOpened}
          currentSort={sort}
        />
      }
    />
  )
}
