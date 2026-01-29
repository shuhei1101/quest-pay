"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { usePublicQuests } from "./_hooks/usePublicQuests"
import { useQuestCategories } from "@/app/(app)/quests/category/_hook/useQuestCategories"
import { useDisclosure } from "@mantine/hooks"
import { PublicQuestCardLayout } from "./_components/PublicQuestCardLayout"
import { PublicQuestFilterPopup } from "./_components/PublicQuestFilterPopup"
import { PublicQuestSortPopup } from "./_components/PublicQuestSortPopup"
import { QuestListLayout } from "../_components/QuestListLayout"
import { PublicQuestFilterScheme, type PublicQuest, type PublicQuestFilterType } from "@/app/api/quests/public/query"
import type { QuestSort } from "@/drizzle/schema"
import { FAMILY_QUESTS_URL, PUBLIC_QUEST_EDIT_URL, PUBLIC_QUEST_URL } from "@/app/(core)/endpoints"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"

/** 公開クエストリストコンポーネント */
export const PublicQuestList = () => {
  const router = useRouter()

  // ログインユーザ情報を取得する
  const { userInfo } = useLoginUserInfo()

  /** フィルターポップアップ制御状態 */
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)
  /** ソートポップアップ制御状態 */
  const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)
  /** クエストフィルター状態 */
  const [questFilter, setQuestFilter] = useState<PublicQuestFilterType>({ tags: [] })
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<PublicQuestFilterType>({ tags: [] })
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
    setQuestFilter(PublicQuestFilterScheme.parse(parsedQuery))
  }, [searchParamsString])

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 30

  /** クエストカテゴリ */
  const { questCategories, questCategoryById, isLoading: categoryLoading } = useQuestCategories()

  /** クエスト一覧 */
  const { fetchedQuests, isLoading, totalRecords, maxPage } = usePublicQuests({
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
    router.push(`${PUBLIC_QUEST_URL}?${params.toString()}`)

    // ページをリセットする
    setPage(1)
    
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

  /** クエストカードの関数 */
  const renderPublicQuestCard = useCallback((quest: PublicQuest, index: number) => (
    <PublicQuestCardLayout
      key={index}
      publicQuest={quest}
      onClick={(id) => router.push(PUBLIC_QUEST_URL(id))}
    />
  ), [router])

  /** フィルター検索時のハンドル */
  const handleFilterSearch = useCallback((filter: PublicQuestFilterType) => {
    setQuestFilter(filter)
    handleSearch()
  }, [handleSearch])

  /** ソート検索時のハンドル */
  const handleSortSearch = useCallback((newSort: QuestSort) => {
    setSort(newSort)
    handleSearch()
  }, [handleSearch])

  return (
    <QuestListLayout<PublicQuest, PublicQuestFilterType, QuestSort>
      quests={fetchedQuests}
      page={page}
      maxPage={maxPage}
      totalRecords={totalRecords}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onSearchTextChange={handleSearchTextChange}
      onSearch={handleSearch}
      renderQuestCard={renderPublicQuestCard}
      questCategories={questCategories}
      questCategoryById={questCategoryById}
      onFilterOpen={openFilter}
      onSortOpen={openSort}
      filterPopup={
        <PublicQuestFilterPopup
          close={closeFilter}
          handleSearch={handleFilterSearch}
          currentFilter={questFilter}
          opened={filterOpened}
        />
      }
      sortPopup={
        <PublicQuestSortPopup
          close={closeSort}
          handleSearch={handleSortSearch}
          opened={sortOpened}
          currentSort={sort}
        />
      }
    />
  )
}
