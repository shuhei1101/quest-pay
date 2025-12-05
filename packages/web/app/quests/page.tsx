"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { QuestEntity, QuestColumns } from "../api/quests/entity"
import { DataTable, DataTableSortStatus } from "mantine-datatable"
import { useEffect, useState, Suspense } from "react"
import { useQuests } from "./_hooks/useQuests"
import { QUESTS_URL } from "../(core)/constants"
import { AuthorizedPageLayout } from "../login/_components/AuthorizedPageLayout"
import { Button } from "@mantine/core"
import Link from "next/link"
import { FamilyQuestFilter } from "./family/_components/FamilyQuestFilter"
import { QuestFilterSchema, QuestFilterType } from "../api/quests/schema"

function QuestsContent() {
  const router = useRouter(); 

  /** クエストフィルター状態 */
  const [questFilter, setQuestFilter] = useState<QuestFilterType>({tags: []})
  
  /** 検索実行用フィルター状態 */
  const [searchFilter, setSearchFilter] = useState<QuestFilterType>({tags: []})
  
  /** クエリストリングの状態 */
  const searchParams = useSearchParams()
  
  // パラメータをクエストフィルターにセットする
  useEffect(() => {
    if (!searchParams) return
    const queryObj = searchParams ? Object.fromEntries(searchParams.entries()): {}
    // tags を配列に変換
    const parsedQuery = {
      ...queryObj,
      tags: queryObj.tags ? queryObj.tags.split(",") : []
    }
    setQuestFilter(QuestFilterSchema.parse(parsedQuery))
  }, [searchParams])

  /** ソート状態 */
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<QuestEntity>>({
    columnAccessor: 'id' as QuestColumns,
    direction: 'asc',
  })

  /** ページャ状態 */
  const [page, setPage] = useState<number>(1)
  const pageSize = 10

  /** ページ変更時のイベント */
  const handleChangedPage = (page: number) => {
    setPage(page)
  }
  
  // クエスト一覧を取得する
  const { fetchedQuests, isLoading: questLoading, totalRecords } = useQuests({
    filter: searchFilter,
    sortColumn: sortStatus.columnAccessor as QuestColumns,
    sortOrder: sortStatus.direction,
    page,
    pageSize
  })

  /** 全体のロード状態 */
  const loading = questLoading;

  /** 検索ボタン押下時のハンドル */
  const handleSerch = () => {
    // クエストフィルターをクエリストリングに変換する
    const paramsObj = Object.fromEntries(
      Object.entries(questFilter)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => [k, String(v)])
    );
    const params = new URLSearchParams(paramsObj)

    // フィルターをURLに反映する
    router.push(`${QUESTS_URL}?${params.toString()}`)

    // 検索フィルターを更新し、一覧を更新する
    setSearchFilter(questFilter)
  }

  return (
    <AuthorizedPageLayout title="クエスト一覧" actionButtons={(
      <Button hidden={false} onClick={() => {
        router.push("/quests/new")
      }}>新規作成</Button>
    )}>
      {/* 検索条件欄 */}
      <FamilyQuestFilter filter={questFilter} handleSearch={handleSerch} setFilter={setQuestFilter} 
       />
      <div className="m-5" />
      {/* クエスト一覧テーブル */}
      <DataTable<QuestEntity> 
        withTableBorder 
        highlightOnHover
        noRecordsText=""
        noRecordsIcon={<></>}
        records={fetchedQuests}
        columns={[
          { accessor: 'id', title: 'ID', sortable: true, resizable: true,
            render: (quest) => {
            const url = `${QUESTS_URL}/${quest.id}`
            return (<Link href={url} className="text-blue-400">{quest.id}</Link>)}
          },
          { accessor: 'name', title: 'クエスト名', sortable: true, resizable: true },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        totalRecords={totalRecords}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={handleChangedPage}
      />
    </AuthorizedPageLayout>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <QuestsContent />
    </Suspense>
  )
}
