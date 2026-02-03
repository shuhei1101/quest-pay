"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { useTemplateQuests } from "../_hooks/useTemplateQuests"
import { useQuestCategories } from "@/app/(app)/quests/category/_hook/useQuestCategories"
import { useDisclosure } from "@mantine/hooks"
import { TemplateQuestCardLayout } from "./TemplateQuestCardLayout"
import { TemplateQuestFilterPopup } from "./TemplateQuestFilterPopup"
import { TemplateQuestSortPopup } from "./TemplateQuestSortPopup"
import { QuestListLayout } from "../../_components/QuestListLayout"
import { TemplateQuestFilterScheme, type TemplateQuest, type TemplateQuestFilterType } from "@/app/api/quests/template/query"
import type { QuestSort } from "@/drizzle/schema"
import { FAMILY_QUESTS_URL, TEMPLATE_QUEST_URL, TEMPLATE_QUESTS_URL } from "@/app/(core)/endpoints"
import { useLoginUserInfo } from "@/app/(auth)/login/_hooks/useLoginUserInfo"

/** テンプレートクエストリストコンポーネント */
export const TemplateQuestList = () => {
  const router = useRouter()

  // ログインユーザ情報を取得する
  const { userInfo } = useLoginUserInfo()

  /** フィルターポップアップ制御状態 */
  const [filterOpened, { open: openFilter, close: closeFilter }] = useDisclosure(false)
  /** ソートポップアップ制御状態 */
  const [sortOpened, { open: openSort, close: closeSort }] = useDisclosure(false)
  /** クエストフィルター状態 */
  const [questFilter, setQuestFilter] = useState<TemplateQuestFilterType>({ tags: [] })
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<TemplateQuestFilterType>({ tags: [] })
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
    setQuestFilter(TemplateQuestFilterScheme.parse(parsedQuery))
  }, [searchParamsString])

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 100

  /** クエストカテゴリ */
  const { questCategories, questCategoryById, isLoading: categoryLoading } = useQuestCategories()

  /** クエスト一覧 */
  const { fetchedQuests, isLoading, totalRecords, maxPage } = useTemplateQuests({
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

  /** クエストカードの関数 */
  const renderTemplateQuestCard = useCallback((quest: TemplateQuest, index: number) => (
    <TemplateQuestCardLayout
      key={index}
      templateQuest={quest}
      onClick={(id) => router.push(TEMPLATE_QUEST_URL(id))}
    />
  ), [router])

  /** フィルター検索時のハンドル */
  const handleFilterSearch = useCallback((filter: TemplateQuestFilterType) => {
    setQuestFilter(filter)
    // 新しいフィルター値を使って検索を実行する
    const paramsObj = Object.fromEntries(
      Object.entries(filter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    )
    const params = new URLSearchParams({
      tab: 'template',
      ...paramsObj
    })
    router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
    setSearchFilter(filter)
  }, [router])

  /** ソート検索時のハンドル */
  const handleSortSearch = useCallback((newSort: QuestSort) => {
    setSort(newSort)
    // 新しいソート値を使って検索を実行する
    const filterParams = Object.fromEntries(
      Object.entries(questFilter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    )
    const params = new URLSearchParams({
      tab: 'template',
      ...filterParams,
      sortColumn: newSort.column,
      sortOrder: newSort.order
    })
    router.push(`${FAMILY_QUESTS_URL}?${params.toString()}`)
    setSearchFilter(questFilter)
  }, [questFilter, router])

  return (
    <QuestListLayout<TemplateQuest, TemplateQuestFilterType, QuestSort>
      quests={fetchedQuests}
      page={page}
      maxPage={maxPage}
      totalRecords={totalRecords}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onSearchTextChange={handleSearchTextChange}
      onSearch={handleSearch}
      renderQuestCard={renderTemplateQuestCard}
      questCategories={questCategories}
      questCategoryById={questCategoryById}
      onFilterOpen={openFilter}
      onSortOpen={openSort}
      filterPopup={
        <TemplateQuestFilterPopup
          close={closeFilter}
          handleSearch={handleFilterSearch}
          currentFilter={questFilter}
          opened={filterOpened}
        />
      }
      sortPopup={
        <TemplateQuestSortPopup
          close={closeSort}
          handleSearch={handleSortSearch}
          opened={sortOpened}
          currentSort={sort}
        />
      }
    />
  )
}
